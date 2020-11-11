import { gitlogPromise as gitlog } from 'gitlog'
import path from 'path'

import execPromise from './exec-promise'
import LogParse, { ICommit } from './log-parse'

const getFirstCommit = async (): Promise<string> => {
  const list = await execPromise('git', ['rev-list', '--max-parents=0', 'HEAD'])
  return list.split('\n').pop() as string
}

const shaExists = async (sha?: string): Promise<boolean> => {
  try {
    await execPromise('git', ['rev-parse', '--verify', sha])
    return true
  } catch (error) {
    return false
  }
}

const getGitLog = async (start: string, end = 'HEAD'): Promise<ICommit[]> => {
  try {
    const first = await getFirstCommit()
    // This "shaExists" is just so we don't have to refactor all the tests
    // in auto.test.ts. If the SHA doesn't really exist then the call to
    // gitlog will fail too.
    const startSha = (await shaExists(start)) ? await execPromise('git', ['rev-parse', start]) : ''

    const log = await gitlog({
      repo: process.cwd(),
      number: Number.MAX_SAFE_INTEGER,
      fields: ['hash', 'authorName', 'authorEmail', 'rawBody'],
      // If start === firstCommit then we want to include that commit in the changelog
      // Otherwise it was that last release and should not be included in the release.
      branch: first === startSha ? end : `${start.trim()}..${end.trim()}`,
      execOptions: { maxBuffer: Infinity },
      includeMergeCommitFiles: true,
    })

    return log
      .map((commit) => ({
        hash: commit.hash,
        authorName: commit.authorName,
        authorEmail: commit.authorEmail,
        subject: commit.rawBody,
        files: (commit.files || []).map((file) => path.resolve(file)),
      }))
      .reduce<ICommit[]>((all, commit) => {
        // The -m option will list a commit for each merge parent. This
        // means two items will have the same hash. We are using -m to get all the changed files
        // in a merge commit. The following code combines these repeated hashes into
        // one commit
        const current = all.find((c) => c.hash === commit.hash)

        if (current) {
          current.files = [...current.files, ...commit.files]
        } else {
          all.push(commit)
        }

        return all
      }, [])
  } catch (error) {
    console.log(error)
    const tag = error.match(/ambiguous argument '(\S+)\.\.\S+'/)

    if (tag) {
      console.error(
        'Missing tag "${tag[1]}" so the command could not run.  To fix this run the following command: git fetch --tags\n'
      )
      process.exit(1)
    }

    throw new Error(error)
  }
}

const getCommits = async (from: string, to = 'HEAD'): Promise<IExtendedCommit[]> => {
  const gitlog = await getGitLog(from, to)

  const logParse = await this.createLogParse()
  const commits = (await logParse.normalizeCommits(gitlog)).filter((commit) => {
    let released: boolean

    try {
      // This determines:         Is this commit an ancestor of this commit?
      //                                       ↓                ↓
      execSync(`git merge-base --is-ancestor ${from} ${commit.hash}`, {
        encoding: 'utf8',
      })
      released = false
    } catch (error) {
      try {
        // --is-ancestor returned false so the commit might be **before** "from"
        // so test if it is and do not release this commit again
        // This determines:         Is this commit an ancestor of this commit?
        //                                       ↓                ↓
        execSync(`git merge-base --is-ancestor ${commit.hash} ${from}`, {
          encoding: 'utf8',
        })
        released = true
      } catch (error) {
        // neither commit is a parent of the other so include it
        released = false
      }
    }

    if (released) {
      const shortHash = commit.hash.slice(0, 8)
      this.logger.verbose.warn(
        `Commit already released, omitting: ${shortHash}: "${commit.subject}"`
      )
    }

    return !released
  })

  this.logger.veryVerbose.info('Added labels to commits:\n', commits)

  return commits
}

const getCommitsInRelease = async (from: string, to = 'HEAD') => {
  const allCommits = await this.getCommits(from, to)
  const allPrCommits = await Promise.all(
    allCommits
      .filter((commit) => commit.pullRequest)
      .map(async (commit) => {
        const [err, commits = []] = await on(
          this.git.getCommitsForPR(Number(commit.pullRequest!.number))
        )
        return err ? [] : commits
      })
  )
  const allPrCommitHashes = allPrCommits
    .filter(Boolean)
    .reduce<string[]>((all, pr) => [...all, ...pr.map((subCommit) => subCommit.sha)], [])
  const uniqueCommits = allCommits.filter(
    (commit) =>
      (commit.pullRequest || !allPrCommitHashes.includes(commit.hash)) &&
      !commit.subject.includes('[skip ci]')
  )

  const commitsWithoutPR = uniqueCommits.filter((commit) => !commit.pullRequest)
  const batches = chunk(commitsWithoutPR, 10)

  const queries = await Promise.all(
    batches
      .map((batch) =>
        buildSearchQuery(
          this.git.options.owner,
          this.git.options.repo,
          batch.map((c) => c.hash)
        )
      )
      .filter((q): q is string => Boolean(q))
      .map((q) => this.git.graphql<ISearchQuery>(q))
  )
  const data = queries.filter((q): q is ISearchQuery => Boolean(q))

  if (!data.length) {
    return uniqueCommits
  }

  const commitsInRelease: Array<IExtendedCommit | undefined> = [...uniqueCommits]
  const logParse = await this.createLogParse()

  type QueryEntry = [string, ISearchResult]

  const entries = data.reduce<QueryEntry[]>(
    (acc, result) => [...acc, ...Object.entries(result)],
    []
  )

  await Promise.all(
    entries
      .filter((result): result is QueryEntry => Boolean(result[1]))
      .map(([key, result]) =>
        processQueryResult({
          sha: key,
          result,
          commitsWithoutPR,
          owner: this.git.options.owner,
          prereleaseBranches: this.config.prereleaseBranches,
        })
      )
      .filter((commit): commit is IExtendedCommit => Boolean(commit))
      .map(async (commit) => {
        const index = commitsInRelease.findIndex((c) => c && c.hash === commit.hash)

        commitsInRelease[index] = await logParse.normalizeCommit(commit)
      })
  )

  return commitsInRelease.filter((commit): commit is IExtendedCommit => Boolean(commit))
}
