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

const parseSquashPR = (commit: IExtendedCommit): IExtendedCommit => {
  const firstLine = commit.subject.split('\n')[0]
  const squashMerge = /\(#(\d+)\)$/

  const squashMergeMatch = firstLine.match(squashMerge)

  if (!squashMergeMatch) {
    return commit
  }

  return {
    ...commit,
    pullRequest: {
      number: Number(squashMergeMatch[1]),
    },
    subject: firstLine.substr(0, firstLine.length - squashMergeMatch[0].length).trim(),
  }
}

const stripWhitespace = (commit: IExtendedCommit) => {
  const [firstLine, ...lines] = commit.subject.split('\n')

  commit.subject = [firstLine.replace(/[^\S\r\n]{2,}/g, ' '), ...lines].join('\n')

  return commit
}

const parseCommit = (commit: IExtendedCommit) => {
  let parsedCommit = commit
  parsedCommit = parsePR(parsedCommit)
  parsedCommit = parseSquashPR(parsedCommit)
  parsedCommit = stripWhitespace(parsedCommit)

  return parsedCommit
}

/** Process a commit to find it's labels and PR information */
export const normalizeCommit = async (
  commit: ICommit,
  postParseCommit?: (commit: IExtendedCommit) => Promise<IExtendedCommit>
): Promise<IExtendedCommit | undefined> => {
  const parsedCommit = parseCommit({
    labels: [],
    ...commit,
    authors: [{ name: commit.authorName, email: commit.authorEmail }],
  })

  if (postParseCommit) {
    return postParseCommit(parsedCommit)
  }
  return parsedCommit
}

/** Run the log parser over a set of commits */
export const normalizeCommits = async (
  commits: ICommit[],
  postParseCommit?: (commit: IExtendedCommit) => Promise<IExtendedCommit>
): Promise<IExtendedCommit[]> => {
  const eCommits = await Promise.all(
    commits.map(async (commit) => normalizeCommit(commit, postParseCommit))
  )

  return eCommits.filter(Boolean) as IExtendedCommit[]
}
