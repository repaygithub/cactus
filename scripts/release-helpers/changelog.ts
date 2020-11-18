import { execSync } from 'child_process'
import prompts from 'prompts'

import { ICommitAuthor, IExtendedCommit } from './commits'
import SEMVER from './semver'

const OWNER = 'repaygithub'
const REPO = 'cactus'

const SECTIONS = [
  { name: 'breakingChange', displayName: '💥 Breaking Change' },
  { name: 'enhancement', displayName: '🚀 Enhancement' },
  { name: 'bugFix', displayName: '🐛 Bug Fix' },
  { name: 'internal', displayName: '🏠 Internal' },
  { name: 'dependencyUpdates', displayName: '🔩 Dependency Updates' },
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

const getCurrentBranch = () => {
  try {
    return execSync('git symbolic-ref --short HEAD', {
      encoding: 'utf8',
      stdio: 'ignore',
    })
  } catch (error) {}
}

const getSection = async (commit: IExtendedCommit) => {
  const prefix = 'Which type of change applies to the following commit?'
  const commitName = commit.pullRequest ? `PR #${commit.pullRequest.number}` : commit.subject
  const text = `${prefix} ${commitName}`
  return prompts<string>({
    type: 'select',
    name: 'section',
    message: text,
    choices: SECTIONS.map(({ name, displayName }) => ({ title: displayName, value: name })),
  })['section']
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

    const extraNotes = (await this.hooks.addToBody.promise([], commits)) || []
    extraNotes.filter(Boolean).forEach((note) => sections.push(note))

    await this.createReleaseNotesSection(commits, sections)
    this.logger.verbose.info('Added release notes to changelog')

    this.authors = this.getAllAuthors(split)
    await this.createLabelSection(split, sections)
    this.logger.verbose.info('Added groups to changelog')

    await this.createAuthorSection(sections)
    this.logger.verbose.info('Added authors to changelog')

    const result = sections.join('\n\n')
    this.logger.verbose.info('Successfully generated release notes.')

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
  private async splitCommits(commits: IExtendedCommit[]): ICommitSplit {
    let currentCommits = [...commits]

    const splitCommits: ICommitSplit = Object.keys(SECTIONS).reduce(
      (fullObject, section) => ({ ...fullObject, [section]: [] }),
      {}
    )
    for (let i = 0; i < commits.length; i++) {
      const section = await getSection(commits[i])
      splitCommits[section].push(commits[i])
    }

    return Object.assign(
      {},
      ...sections.map((label) => {
        const matchedCommits = filterLabel(currentCommits, label.name)
        currentCommits = currentCommits.filter((commit) => !matchedCommits.includes(commit))

        return matchedCommits.length === 0 ? {} : { [label.name]: matchedCommits }
      })
    )
  }

  /** Create a list of users */
  private async createUserLinkList(commit: IExtendedCommit) {
    const result = new Set<string>()

    await Promise.all(
      commit.authors.map(async (rawAuthor) => {
        const data = (this.authors!.find(
          ([, commitAuthor]) =>
            (commitAuthor.name && rawAuthor.name && commitAuthor.name === rawAuthor.name) ||
            (commitAuthor.email && rawAuthor.email && commitAuthor.email === rawAuthor.email) ||
            (commitAuthor.username &&
              rawAuthor.username &&
              commitAuthor.username === rawAuthor.username)
        ) as [IExtendedCommit, ICommitAuthor]) || [{}, rawAuthor]

        const link = await this.hooks.renderChangelogAuthor.promise(data[1], commit, this.options)

        if (link) {
          result.add(link)
        }
      })
    )

    return [...result].join(' ')
  }

  /** Transform a commit into a line in the changelog */
  private async generateCommitNote(commit: IExtendedCommit) {
    const subject = commit.subject
      ? commit.subject.split('\n')[0].trim().replace('[skip ci]', '\\[skip ci\\]')
      : ''

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

  /** Create a section in the changelog to showcase contributing authors */
  private async createAuthorSection(sections: string[]) {
    const authors = new Set<string>()
    const authorsWithFullData = this.authors!.map(([, author]) => author).filter(
      (author) => 'id' in author
    )

    await Promise.all(
      this.authors!.map(async ([commit, author]) => {
        const info =
          authorsWithFullData.find(
            (u) =>
              (author.name && u.name === author.name) || (author.email && u.email === author.email)
          ) || author
        const user = await this.hooks.renderChangelogAuthor.promise(info, commit, this.options)
        const authorEntry = await this.hooks.renderChangelogAuthorLine.promise(info, user as string)

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
  private async createLabelSection(split: ICommitSplit, sections: string[]) {
    const changelogTitles = this.options.labels.reduce<Record<string, string>>((titles, label) => {
      if (label.changelogTitle) {
        titles[label.name] = label.changelogTitle
      }

      return titles
    }, {})

    const labelSections = await Promise.all(
      Object.entries(split).map(async ([label, labelCommits]) => {
        const title = await this.hooks.renderChangelogTitle.promise(label, changelogTitles)

        const lines = new Set<string>()

        await Promise.all(
          labelCommits.map(async (commit) => {
            const base = commit.pullRequest?.base || ''
            const branch = base.includes('/') ? base.split('/')[1] : base

            // We want to keep the release notes for a prerelease branch but
            // omit the changelog item
            if (branch && this.options.prereleaseBranches.includes(branch)) {
              return true
            }

            const line = await this.hooks.renderChangelogLine.promise(
              await this.generateCommitNote(commit),
              commit
            )

            lines.add(line)
          })
        )

        const sortedLines = await this.hooks.sortChangelogLines.promise(
          [...lines].sort((a, b) => a.split('\n').length - b.split('\n').length)
        )

        return [title || '', sortedLines] as const
      })
    )

    const mergedSections = labelSections.reduce<Record<string, string[]>>(
      (acc, [title, commits]) => ({
        ...acc,
        [title]: [...(acc[title] || []), ...commits],
      }),
      {}
    )

    Object.entries(mergedSections)
      .map(([title, lines]) => [title, ...lines].join('\n'))
      .map((section) => sections.push(section))
  }

  /** Gather extra release notes to display at the top of the changelog */
  private async createReleaseNotesSection(commits: IExtendedCommit[], sections: string[]) {
    if (!commits.length) {
      return
    }

    let section = ''
    const visited = new Set<number>()
    const included = await Promise.all(
      commits.map(async (commit) => {
        const omit = await this.hooks.omitReleaseNotes.promise(commit)

        if (!omit) {
          return commit
        }
      })
    )

    included.forEach((commit) => {
      if (!commit) {
        return
      }

      const pr = commit.pullRequest

      if (!pr || !pr.body) {
        return
      }

      const title = /^[#]{0,5}[ ]*[R|r]elease [N|n]otes$/
      const lines = pr.body.split('\n').map((line) => line.replace(/\r$/, ''))
      const notesStart = lines.findIndex((line) => Boolean(line.match(title)))

      if (notesStart === -1 || visited.has(pr.number)) {
        return
      }

      const depth = getHeaderDepth(lines[notesStart])
      visited.add(pr.number)
      let notes = ''

      for (let index = notesStart; index < lines.length; index++) {
        const line = lines[index]
        const isTitle = line.match(title)

        if (
          (line.startsWith('#') && getHeaderDepth(line) <= depth && !isTitle) ||
          line.startsWith(automatedCommentIdentifier)
        ) {
          break
        }

        if (!isTitle) {
          notes += `${line}\n`
        }
      }

      section += `_From #${pr.number}_\n\n${notes.trim()}\n\n`
    })

    if (!section) {
      return
    }

    sections.push(`### Release Notes\n\n${section}---`)
  }
}

export const createChangelog = async (version?: SEMVER) => {
  const changelog = new Changelog({
    owner: OWNER,
    repo: REPO,
    baseUrl: project.html_url,
    baseBranch: 'master',
  })

  this.hooks.onCreateChangelog.call(changelog, version)
  changelog.loadDefaultHooks()

  return changelog
}
