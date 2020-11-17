import { RestEndpointMethodTypes } from '@octokit/rest'
import on from 'await-to-js'
import { execSync } from 'child_process'
import endent from 'endent'
import { gitlogPromise as gitlog } from 'gitlog'
import { chunk } from 'lodash'
import path from 'path'

import execPromise from './exec-promise'
import github from './github'
import { normalizeCommit, normalizeCommits } from './log-parse'
import { buildSearchQuery, ISearchQuery, ISearchResult, processQueryResult } from './match-pr'

const OWNER = 'repaygithub'
const REPO = 'cactus'

class GitAPIError extends Error {
  /** Extend the base error */
  constructor(api: string, args: Record<string, unknown> | unknown[], origError: Error) {
    super(`Error calling github: ${api}\n\twith: ${JSON.stringify(args)}.\n\t${origError.message}`)
  }
}
interface ICommitAuthor {
  /** Author's name */
  name?: string
  /** Author's email */
  email?: string
  /** Author's username */
  username?: string
  /** The commit this author created */
  hash?: string
  /** The type of user */
  type?: 'Bot' | 'User' | string
}

interface IPullRequest {
  /** The issue number for the pull request */
  number: number
  /** The base branch the pull request is on */
  base?: string
  /** The body of the PR (opening comment) */
  body?: string
}

interface ICommit {
  hash: string
  authorName?: string
  authorEmail?: string
  subject: string
  rawBody?: string
  labels?: string[]
  files: string[]
}

type IExtendedCommit = ICommit & {
  /** The authors that contributed to the pull request */
  authors: ICommitAuthor[]
  /** The pull request information */
  pullRequest?: IPullRequest
  /** Labels associated with the commit */
  labels: string[]
}

type PromiseValue<PromiseType, Otherwise = PromiseType> = PromiseType extends Promise<infer Value>
  ? { 0: PromiseValue<Value>; 1: Value }[PromiseType extends Promise<unknown> ? 0 : 1]
  : Otherwise
type AsyncFunction = (...args: any[]) => Promise<unknown>
type AsyncReturnType<Target extends AsyncFunction> = PromiseValue<ReturnType<Target>>

const shaExists = async (sha?: string): Promise<boolean> => {
  try {
    await execPromise('git', ['rev-parse', '--verify', sha])
    return true
  } catch (error) {
    return false
  }
}

const getFirstCommit = async (): Promise<string> => {
  const list = await execPromise('git', ['rev-list', '--max-parents=0', 'HEAD'])
  return list.split('\n').pop() as string
}

const getPullRequest = async (pr: number) => {
  const args: RestEndpointMethodTypes['pulls']['get']['parameters'] = {
    owner: OWNER,
    repo: REPO,
    pull_number: pr,
  }

  return github.pulls.get(args)
}

const getLatestReleaseInfo = async () => {
  const latestRelease = await github.repos.getLatestRelease({
    owner: OWNER,
    repo: REPO,
  })

  return latestRelease.data
}

const getCommitDate = async (sha: string): Promise<string> => {
  const date = await execPromise('git', ['show', '-s', '--format=%ci', sha])
  const [day, time, timezone] = date.split(' ')

  return `${day}T${time}${timezone}`
}

const searchRepo = async (
  options: RestEndpointMethodTypes['search']['issuesAndPullRequests']['parameters']
) => {
  const repo = 'repo:repaygithub/cactus'
  options.q = `${repo} ${options.q}`

  const result = await github.search.issuesAndPullRequests(options)

  return result.data
}

const getPr = async (prNumber: number) => {
  const args: RestEndpointMethodTypes['issues']['get']['parameters'] = {
    owner: OWNER,
    repo: REPO,
    issue_number: prNumber,
  }

  try {
    const info = await github.issues.get(args)
    return info
  } catch (e) {
    throw new GitAPIError('getPr', args, e)
  }
}

const getCommit = async (sha: string) => {
  try {
    return github.repos.getCommit({
      owner: OWNER,
      repo: REPO,
      ref: sha,
    })
  } catch (e) {
    throw new GitAPIError('getCommit', [], e)
  }
}

const getCommitsForPR = async (pr: number) =>
  github.paginate(github.pulls.listCommits, {
    owner: OWNER,
    repo: REPO,
    pull_number: pr,
  })

const getUserByUsername = async (username: string) => {
  try {
    const user = await github.users.getByUsername({
      username,
    })

    return user.data
  } catch (error) {}
}

const attachAuthor = async (commit: IExtendedCommit) => {
  const modifiedCommit = { ...commit }
  let resolvedAuthors: Array<
    | (ICommitAuthor & {
        /** The GitHub user name of the git committer */
        login?: string
      })
    | Partial<AsyncReturnType<typeof getUserByUsername>>
  > = []

  // If there is a pull request we will attempt to get the authors
  // from any commit in the PR
  if (modifiedCommit.pullRequest) {
    const [prCommitsErr, prCommits] = await on(
      getCommitsForPR(Number(modifiedCommit.pullRequest.number))
    )

    if (prCommitsErr || !prCommits) {
      return commit
    }

    resolvedAuthors = await Promise.all(
      prCommits.map(async (prCommit) => {
        if (!prCommit.author) {
          return prCommit.commit.author
        }

        return {
          ...prCommit.author,
          ...(await getUserByUsername(prCommit.author.login)),
          hash: prCommit.sha,
        }
      })
    )
  } else {
    const [, response] = await on(getCommit(commit.hash))

    if (response?.data?.author?.login) {
      const username = response.data.author.login
      const author = await getUserByUsername(username)

      resolvedAuthors.push({
        name: commit.authorName,
        email: commit.authorEmail,
        ...author,
        hash: commit.hash,
      })
    } else if (commit.authorEmail) {
      resolvedAuthors.push({
        email: commit.authorEmail,
        name: commit.authorName,
        hash: commit.hash,
      })
    }
  }

  modifiedCommit.authors = resolvedAuthors.map((author) => ({
    ...author,
    ...(author && 'login' in author ? { username: author.login } : {}),
  }))

  return modifiedCommit
}

const addPRInfoToCommit = async (commit: IExtendedCommit) => {
  const modifiedCommit = { ...commit }

  if (!modifiedCommit.labels) {
    modifiedCommit.labels = []
  }

  if (modifiedCommit.pullRequest) {
    const [err, info] = await on(getPr(modifiedCommit.pullRequest.number))

    if (err || !info || !info.data) {
      return modifiedCommit
    }

    const labels = info ? info.data.labels.map((l) => l.name) : []
    modifiedCommit.labels = [...new Set([...labels, ...modifiedCommit.labels])]
    modifiedCommit.pullRequest.body = info.data.body
    modifiedCommit.subject = info.data.title || modifiedCommit.subject
    const hasPrOpener = modifiedCommit.authors.some(
      (author) => author.username === info.data.user.login
    )

    // If we can't find the use who opened the PR in authors attempt
    // to add that user.
    if (!hasPrOpener) {
      const user = await getUserByUsername(info.data.user.login)

      if (user) {
        modifiedCommit.authors.push({ ...user, username: user.login })
      }
    }
  }

  return modifiedCommit
}

const getPRsSinceLastRelease = async () => {
  let lastRelease: {
    /** Date the last release was published */
    published_at: string
  }

  try {
    lastRelease = await getLatestReleaseInfo()
  } catch (error) {
    const firstCommit = await getFirstCommit()

    lastRelease = {
      published_at: await getCommitDate(firstCommit),
    }
  }

  if (!lastRelease) {
    return []
  }

  const prsSinceLastRelease = await searchRepo({
    q: `is:pr is:merged merged:>=${lastRelease.published_at}`,
  })

  if (!prsSinceLastRelease || !prsSinceLastRelease.items) {
    return []
  }

  const data = await Promise.all(
    prsSinceLastRelease.items.map(
      async (pr: { /** The issue number of the pull request */ number: number }) =>
        getPullRequest(Number(pr.number))
    )
  )

  return data.map((item) => item.data)
}

const getPRForRebasedCommits = (
  commit: IExtendedCommit,
  pullRequests: Array<AsyncReturnType<typeof getPullRequest>['data']>
) => {
  const matchPr = pullRequests.find((pr) => pr.merge_commit_sha === commit.hash)

  if (!commit.pullRequest && matchPr) {
    const labels = matchPr.labels.map((label) => label.name) || []
    commit.labels = [...new Set([...labels, ...commit.labels])]
    commit.pullRequest = {
      number: matchPr.number,
    }
  }

  return commit
}

const parseRebasePRs = async (commit: IExtendedCommit) => {
  const prsSinceLastRelease = await getPRsSinceLastRelease()
  return getPRForRebasedCommits(commit, prsSinceLastRelease)
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
        endent`
            Missing tag "${tag[1]}" so the command could not run.
            To fix this run the following command:
            git fetch --tags\n
          `
      )
      process.exit(1)
    }

    throw new Error(error)
  }
}

const postParseCommit = async (commit: IExtendedCommit) => {
  let parsedCommit = commit
  parsedCommit = await attachAuthor(parsedCommit)
  parsedCommit = await addPRInfoToCommit(parsedCommit)
  parsedCommit = await parseRebasePRs(parsedCommit)
  return parsedCommit
}

const getCommits = async (from: string, to = 'HEAD'): Promise<IExtendedCommit[]> => {
  const gitlog = await getGitLog(from, to)

  const commits = (await normalizeCommits(gitlog, postParseCommit)).filter((commit) => {
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

    return !released
  })

  return commits
}

const graphql = async <T>(query: string) =>
  github.graphql<T>(query, {
    baseUrl: 'https://api.github.com',
    headers: {
      authorization: `token ${process.env.GITHUB_AUTH}`,
    },
  })

export const getCommitsInRelease = async (
  from: string,
  to = 'HEAD',
  prereleaseBranches: string[] = []
): Promise<IExtendedCommit[]> => {
  const allCommits = await getCommits(from, to)
  const allPrCommits = await Promise.all(
    allCommits
      .filter((commit) => commit.pullRequest)
      .map(async (commit) => {
        const [err, commits = []] = await on(getCommitsForPR(Number(commit.pullRequest?.number)))
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
          OWNER,
          REPO,
          batch.map((c) => c.hash)
        )
      )
      .filter((q): q is string => Boolean(q))
      .map((q) => graphql<ISearchQuery>(q))
  )
  const data = queries.filter((q): q is ISearchQuery => Boolean(q))

  if (!data.length) {
    return uniqueCommits
  }

  const commitsInRelease: Array<IExtendedCommit | undefined> = [...uniqueCommits]

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
          owner: OWNER,
          prereleaseBranches: prereleaseBranches,
        })
      )
      .filter((commit): commit is IExtendedCommit => Boolean(commit))
      .map(async (commit) => {
        const index = commitsInRelease.findIndex((c) => c && c.hash === commit.hash)

        commitsInRelease[index] = await normalizeCommit(commit, postParseCommit)
      })
  )

  return commitsInRelease.filter((commit): commit is IExtendedCommit => Boolean(commit))
}
