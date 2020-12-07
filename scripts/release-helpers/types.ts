export interface ICommitAuthor {
  /** Author's name */
  name?: string | null
  /** Author's email */
  email?: string | null
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
