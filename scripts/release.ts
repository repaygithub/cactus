/// <reference types="./custom" />

import * as fs from 'fs'
import path from 'path'

import { getLatestRelease } from './release-helpers/commits'
import execPromise from './release-helpers/exec-promise'
import generateReleaseInfo from './release-helpers/release-info'

const getGitUser = async () => {
  try {
    return {
      /** The git user is already set in the current env */
      system: true,
      email: await execPromise('git', ['config', 'user.email']),
      name: await execPromise('git', ['config', 'user.name']),
    }
  } catch (error) {
    console.error('Could not find git user or email configured in git config')
    process.exit(1)
  }
}

const updateChangelogFile = async (title: string, releaseNotes: string, changelogPath: string) => {
  const date = new Date().toDateString()
  let newChangelog = '#'

  if (title) {
    newChangelog += ` ${title}`
  }

  newChangelog += ` (${date})\n\n${releaseNotes}`

  if (fs.existsSync(changelogPath)) {
    const oldChangelog = fs.readFileSync(changelogPath, 'utf8')
    newChangelog = `${newChangelog}\n\n---\n\n${oldChangelog}`
  } else {
    newChangelog += '\n'
  }

  fs.writeFileSync(changelogPath, newChangelog)
  await execPromise('git', ['add', changelogPath])
}

const createCommitMessage = (scope: string) => `chore(${scope}): update changelog [skip ci]`

const createChangelogs = async (from: string, to = 'HEAD') => {
  await getGitUser()

  const lastRelease = from || (await getLatestRelease())
  const releaseInfo = await generateReleaseInfo(lastRelease, to)

  for (const packageInfo of releaseInfo) {
    const title = `v${packageInfo.newVersion}`
    if (packageInfo.notes.trim()) {
      await updateChangelogFile(
        title,
        packageInfo.notes,
        path.join(packageInfo.packagePath, 'CHANGELOG.md')
      )
      const scope = path.basename(packageInfo.packagePath)
      await execPromise('git', ['commit', '-m', `"${createCommitMessage(scope)}"`, '--no-verify'])
    }
  }
}

const main = async () => {
  try {
    await execPromise('yarn', ['lerna', 'updated'])
  } catch (error) {
    console.warn(
      'Lerna detected no changes in project. Aborting release since nothing would be published.'
    )
    process.exit(0)
  }

  const lastReleaseTag = await getLatestRelease()

  // console.log(lastReleaseTag)
  // const commits = await getCommitsInRelease(lastReleaseTag)
  // console.log(commits)

  await createChangelogs(lastReleaseTag)
}

main()
