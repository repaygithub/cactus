import prompts from 'prompts'
import join from 'url-join'

import { ICommitAuthor, IExtendedCommit } from './types'

const OWNER = 'repaygithub'
const REPO = 'cactus'

const SECTIONS = [
  { name: 'breakingChange', changelogTitle: '💥 Breaking Change' },
  { name: 'enhancement', changelogTitle: '🚀 Enhancement' },
  { name: 'bugFix', changelogTitle: '🐛 Bug Fix' },
  { name: 'internal', changelogTitle: '🏠 Internal' },
  { name: 'dependencyUpdates', changelogTitle: '🔩 Dependency Updates' },
]

export interface IGenerateReleaseNotesOptions {
  /** Github repo owner (user) */
  owner: string
  /** GitHub project to operate on */
  repo: string
  /** The URL to the GitHub (public or enterprise) the project is using */
  baseUrl: string
  /** The branch that is used as the base. defaults to master */
  baseBranch: string
  /** The branches that is used as prerelease branches. defaults to next */
  prereleaseBranches?: string[]
}

interface ICommitSplit {
  [key: string]: IExtendedCommit[]
}

const getSection = async (commit: IExtendedCommit) => {
  const prefix = 'Which type of change applies to the following commit?'
  const text = `${prefix} ${commit.subject}`

  const formattedSections = SECTIONS.map(({ name, changelogTitle }) => ({
    title: changelogTitle,
    value: name,
  }))
  const answers = await prompts({
    type: 'select',
    name: 'section',
    message: text,
    choices: [...formattedSections, { title: 'IGNORE THIS COMMIT', value: 'ignore' }],
  })
  return answers.section
}

class Changelog {
  /** The options the changelog was initialized with */
  readonly options: IGenerateReleaseNotesOptions

  /** The authors in the current changelog */
  private authors?: Array<[IExtendedCommit, ICommitAuthor]>

  /** Initialize the changelog generator with default hooks and labels */
  constructor(options: IGenerateReleaseNotesOptions) {
    this.options = options
  }

  /** Generate the release notes for a group of commits */
  async generateReleaseNotes(commits: IExtendedCommit[]): Promise<string> {
    if (commits.length === 0) {
      return ''
    }
    const split = await this.splitCommits(commits)

    const sections: string[] = []

    this.authors = this.getAllAuthors(split)
    await this.createChangelogSection(split, sections)

    await this.createAuthorSection(sections)

    const result = sections.join('\n\n')

    return result
  }

  /** Create a link to a user for use in the changelog */
  createUserLink(author: ICommitAuthor, commit: IExtendedCommit) {
    const githubUrl = new URL(this.options.baseUrl).origin

    if (author.username === 'invalid-email-address') {
      return
    }

    return author.username
      ? `[@${author.username}](${join(githubUrl, author.username)})`
      : author.email || commit.authorEmail
  }

  /** Split commits into changelogTitle sections. */
  private async splitCommits(commits: IExtendedCommit[]): Promise<ICommitSplit> {
    const splitCommits: ICommitSplit = SECTIONS.reduce(
      (fullObject, section) => ({ ...fullObject, [section.name]: [] }),
      {}
    )
    for (let i = 0; i < commits.length; i++) {
      const section = await getSection(commits[i])
      if (section !== 'ignore') {
        splitCommits[section].push(commits[i])
      }
    }

    return splitCommits
  }

  /** Create a list of users */
  private async createUserLinkList(commit: IExtendedCommit) {
    const result = new Set<string>()

    if (!this.authors) {
      throw new Error('Changelog authors is undefined')
    }

    const authors = this.authors as [IExtendedCommit, ICommitAuthor][]

    await Promise.all(
      commit.authors.map(async (rawAuthor) => {
        const data = (authors.find(
          ([, commitAuthor]) =>
            (commitAuthor.name && rawAuthor.name && commitAuthor.name === rawAuthor.name) ||
            (commitAuthor.email && rawAuthor.email && commitAuthor.email === rawAuthor.email) ||
            (commitAuthor.username &&
              rawAuthor.username &&
              commitAuthor.username === rawAuthor.username)
        ) as [IExtendedCommit, ICommitAuthor]) || [{}, rawAuthor]

        const link = this.createUserLink(data[1], commit)

        if (link) {
          result.add(link)
        }
      })
    )

    return [...result].join(' ')
  }

  /** Transform a commit into a line in the changelog */
  private async generateCommitNote(commit: IExtendedCommit) {
    const defaultSubject = commit.subject
      ? commit.subject.split('\n')[0].trim().replace('[skip ci]', '\\[skip ci\\]')
      : ''

    const { subject } = await prompts({
      type: 'text',
      name: 'subject',
      message: `Please provide a short description for this commit/PR (${defaultSubject})`,
      initial: defaultSubject,
    })

    let pr = ''

    if (commit.pullRequest?.number) {
      const prLink = join(this.options.baseUrl, 'pull', commit.pullRequest.number.toString())
      pr = `[#${commit.pullRequest.number}](${prLink})`
    }

    const user = await this.createUserLinkList(commit)
    return `- ${subject}${pr ? ` ${pr}` : ''}${user ? ` (${user})` : ''}`
  }

  /** Get all the authors in the provided commits */
  private getAllAuthors(split: ICommitSplit) {
    const commits = Object.values(split).reduce(
      (labeledCommits: IExtendedCommit[], sectionCommits: IExtendedCommit[]) => [
        ...labeledCommits,
        ...sectionCommits,
      ],
      []
    )

    return commits
      .map((commit) =>
        commit.authors
          .filter(
            (author) =>
              author.username !== 'invalid-email-address' &&
              (author.name || author.email || author.username)
          )
          .map((author) => [commit, author] as [IExtendedCommit, ICommitAuthor])
      )
      .reduce((all, more) => [...all, ...more], [])
      .sort((a) => ('id' in a[1] ? 0 : 1))
  }

  private renderChangelogAuthorLine(author: ICommitAuthor, user?: string) {
    const authorString = author.name && user ? `${author.name} (${user})` : user
    return authorString ? `- ${authorString}` : undefined
  }

  /** Create a section in the changelog to showcase contributing authors */
  private async createAuthorSection(sections: string[]) {
    if (!this.authors) {
      throw new Error('Changelog authors is undefined')
    }

    const authors = new Set<string>()
    const authorsWithFullData = this.authors
      .map(([, author]) => author)
      .filter((author) => 'id' in author)

    await Promise.all(
      this.authors.map(async ([commit, author]) => {
        const info =
          authorsWithFullData.find(
            (u) =>
              (author.name && u.name === author.name) || (author.email && u.email === author.email)
          ) || author
        const user = this.createUserLink(info, commit)
        const authorEntry = this.renderChangelogAuthorLine(info, user)

        if (authorEntry && !authors.has(authorEntry)) {
          authors.add(authorEntry)
        }
      })
    )

    if (authors.size === 0) {
      return
    }

    let authorSection = `#### Authors: ${authors.size}\n\n`
    authorSection += [...authors].sort((a, b) => a.localeCompare(b)).join('\n')
    sections.push(authorSection)
  }

  /** Create a section in the changelog to with all of the changelog notes organized by change type */
  private async createChangelogSection(split: ICommitSplit, sections: string[]) {
    const changelogTitles = SECTIONS.reduce<Record<string, string>>(
      (titles, section) => ({ ...titles, [section.name]: section.changelogTitle }),
      {}
    )

    const changelogSections = []

    for (const [label, labelCommits] of Object.entries(split)) {
      const title = `#### ${changelogTitles[label]}\n`

      const lines = new Set<string>()

      for (const commit of labelCommits) {
        const line = await this.generateCommitNote(commit)
        lines.add(line)
      }

      changelogSections.push([title || '', lines] as const)
    }

    const mergedSections = changelogSections.reduce<Record<string, string[]>>(
      (acc, [title, commits]) =>
        commits.size
          ? {
              ...acc,
              [title]: [...(acc[title] || []), ...commits],
            }
          : acc,
      {}
    )

    Object.entries(mergedSections)
      .map(([title, lines]) => [title, ...lines].join('\n'))
      .map((section) => sections.push(section))
  }
}

export const createChangelog = (): Changelog => {
  return new Changelog({
    owner: OWNER,
    repo: REPO,
    baseUrl: 'https://github.com/repaygithub/cactus',
    baseBranch: 'master',
  })
}
