export interface ICommitAuthor {
  /** Author's name */
  name?: string;
  /** Author's email */
  email?: string;
  /** Author's username */
  username?: string;
  /** The commit this author created */
  hash?: string;
  /** The type of user */
  type?: "Bot" | "User" | string;
}

export interface IPullRequest {
  /** The issue number for the pull request */
  number: number;
  /** The base branch the pull request is on */
  base?: string;
  /** The body of the PR (opening comment) */
  body?: string;
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
  authors: ICommitAuthor[];
  /** The pull request information */
  pullRequest?: IPullRequest;
  /** Labels associated with the commit */
  labels: string[];
};

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

export default class LogParse {
  constructor() {
    this.hooks.parseCommit.tap('Merge Commit', parsePR)
    this.hooks.parseCommit.tap('Squash Merge Commit', parseSquashPR)
    this.hooks.parseCommit.tap('Strip consecutive white-space in Titles', (commit) => {
      const [firstLine, ...lines] = commit.subject.split('\n')

      commit.subject = [firstLine.replace(/[^\S\r\n]{2,}/g, ' '), ...lines].join('\n')

      return commit
    })
  }

  parseCommit(commit: IExtendedCommit) {
    let parsedCommit = commit
    parsedCommit = parsePR(parsedCommit)
    parsedCommit = parseSquashPR(parsedCommit)
    parsedCommit = stripWhitespace(parsedCommit)
    parsedCommit = async attachAuthor(parsedCommit)
    parsedCommit = async addPRInfo(parsedCommit)
  }

  /** Run the log parser over a set of commits */
  async normalizeCommits(commits: ICommit[]): Promise<IExtendedCommit[]> {
    const eCommits = await Promise.all(commits.map(async (commit) => this.normalizeCommit(commit)))

    return eCommits.filter(Boolean) as IExtendedCommit[]
  }

  /** Process a commit to find it's labels and PR information */
  async normalizeCommit(commit: ICommit): Promise<IExtendedCommit | undefined> {
    const extended = await this.hooks.parseCommit.promise({
      labels: [],
      ...commit,
      authors: [{ name: commit.authorName, email: commit.authorEmail }],
    })
    const shouldOmit = await this.hooks.omitCommit.promise(extended)

    if (shouldOmit) {
      return
    }

    return extended
  }
}
