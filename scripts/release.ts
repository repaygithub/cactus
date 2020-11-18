/// <reference types="./custom" />

import { getCommitsInRelease, getLatestRelease } from './release-helpers/commits'
import execPromise from './release-helpers/exec-promise'
import SEMVER from './release-helpers/semver'

const generateReleaseNotes = async (
  from: string,
  to = 'HEAD',
  version?: SEMVER
): Promise<string> => {
  const commits = await getCommitsInRelease(from, to)
  const changelog = await createChangelog(version)

  return changelog.generateReleaseNotes(commits)
}

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

const makeChangelog = async (releaseName: string, from: string, to = 'HEAD') => {
  const dryRun = false
  const message = 'Update CHANGELOG.md [skip ci]'

  await getGitUser()

  const lastRelease = from || (await getLatestRelease())
  const releaseNotes = await this.release.generateReleaseNotes(lastRelease, to, this.versionBump)

  if (dryRun) {
    this.logger.log.info('Potential Changelog Addition:\n', releaseNotes)
    this.logger.verbose.info('`changelog` dry run complete.')
    return
  }

  if (args.quiet) {
    console.log(releaseNotes)
  } else {
    this.logger.log.info('New Release Notes\n', releaseNotes)
  }

  const currentVersion = await this.getCurrentVersion(lastRelease)
  const context = {
    bump,
    commits: await this.release.getCommits(lastRelease, to || undefined),
    releaseNotes,
    lastRelease,
    currentVersion,
  }

  if (!noCommit) {
    await this.release.addToChangelog(releaseNotes, lastRelease, currentVersion)

    await this.hooks.beforeCommitChangelog.promise(context)
    await execPromise('git', ['commit', '-m', `"${message}"`, '--no-verify'])
    this.logger.verbose.info('Committed new changelog.')
  }

  await this.hooks.afterChangelog.promise(context)
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
  const commits = await getCommitsInRelease(lastReleaseTag)
  console.log(commits)
}

main()
