export interface ICommitAuthor {
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

export interface IPullRequest {
  /** The issue number for the pull request */
  number: number
  /** The base branch the pull request is on */
  base?: string
  /** The body of the PR (opening comment) */
  body?: string
}

export interface ICommit {
  hash: string
  authorName?: string
  authorEmail?: string
  subject: string
  rawBody?: string
  labels?: string[]
  files: string[]
}

export type IExtendedCommit = ICommit & {
  /** The authors that contributed to the pull request */
  authors: ICommitAuthor[]
  /** The pull request information */
  pullRequest?: IPullRequest
  /** Labels associated with the commit */
  labels: string[]
}

export type PromiseValue<PromiseType, Otherwise = PromiseType> = PromiseType extends Promise<
  infer Value
>
  ? { 0: PromiseValue<Value>; 1: Value }[PromiseType extends Promise<unknown> ? 0 : 1]
  : Otherwise
type AsyncFunction = (...args: any[]) => Promise<unknown>
type AsyncReturnType<Target extends AsyncFunction> = PromiseValue<ReturnType<Target>>

const parsePR = (commit: IExtendedCommit): IExtendedCommit => {
  const merge = /Merge pull request #(\d+) from (.+)\n([\S\s]+)/
  const prMatch = commit.subject.match(merge)

  if (!prMatch) {
    return commit
  }

  return {
    ...commit,
    pullRequest: {
      number: Number(prMatch[1]),
      base: prMatch[2],
    },
    subject: prMatch[3].trim(),
  }
}

const stripWhitespace = (commit: IExtendedCommit) => {
  const [firstLine, ...lines] = commit.subject.split('\n')

  commit.subject = [firstLine.replace(/[^\S\r\n]{2,}/g, ' '), ...lines].join('\n')

  return commit
}

const attachAuthor = async (commit: IExtendedCommit) => {
  const modifiedCommit = { ...commit }
  let resolvedAuthors: Array<
    | (ICommitAuthor & {
        /** The GitHub user name of the git committer */
        login?: string
      })
    | Partial<AsyncReturnType<Git['getUserByUsername']>>
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

const parseCommit = async (commit: IExtendedCommit) => {
  let parsedCommit = commit
  parsedCommit = parsePR(parsedCommit)
  parsedCommit = parseSquashPR(parsedCommit)
  parsedCommit = stripWhitespace(parsedCommit)
  parsedCommit = await attachAuthor(parsedCommit)
  parsedCommit = await addPRInfo(parsedCommit)
  return parsedCommit
}

/** Run the log parser over a set of commits */
const normalizeCommits = async (commits: ICommit[]): Promise<IExtendedCommit[]> => {
  const eCommits = await Promise.all(commits.map(async (commit) => normalizeCommit(commit)))

  return eCommits.filter(Boolean) as IExtendedCommit[]
}

/** Process a commit to find it's labels and PR information */
const normalizeCommit = (commit: ICommit): Promise<IExtendedCommit | undefined> =>
  parseCommit({
    labels: [],
    ...commit,
    authors: [{ name: commit.authorName, email: commit.authorEmail }],
  })
