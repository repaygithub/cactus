import prompts from 'prompts'
import { inc, ReleaseType } from 'semver'

import { createChangelog } from './changelog'
import { getCommitsInRelease } from './commits'
import inFolder from './in-folder'
import { getChangedPackages, getLernaPackages, LernaPackage } from './lerna'
import SEMVER from './semver'

const getBump = async (lernaPackage: LernaPackage) => {
  const message = `What kind of version bump should apply to ${lernaPackage.name}? (current version: ${lernaPackage.version})`
  const answers = await prompts({
    type: 'select',
    name: 'bump',
    message,
    choices: Object.keys(SEMVER).map((bumpType) => ({
      title: `${bumpType} - ${inc(lernaPackage.version, bumpType as ReleaseType)}`,
      value: bumpType,
    })),
  })
  return answers.bump as ReleaseType
}

export type ReleaseInfo = {
  name: string
  newVersion: string | null
  notes: string
  packagePath: string
}[]

export default async (from: string, to = 'HEAD'): Promise<ReleaseInfo> => {
  const commits = await getCommitsInRelease(from, to)
  const changelog = createChangelog()

  const changedPackages = await getChangedPackages()
  const lernaPackages = await getLernaPackages()

  const releaseInfo: ReleaseInfo = []

  await lernaPackages.reduce(async (last, lernaPackage) => {
    await last

    // If lerna doesn't think a package has changed then do not create sub-package changelog
    // Since we use "git log -m", merge commits can have lots of files in them. Lerna does not
    // use this option. This means that this hooks will only create a sub-package changelog if
    // lerna will publish an update for it
    if (!changedPackages.some((name) => lernaPackage.name === name)) {
      return
    }

    const includedCommits = commits.filter((commit) =>
      commit.files.some((file) => inFolder(lernaPackage.path, file))
    )
    console.log('')
    console.log(`Generating changelog for ${lernaPackage.name}`)
    console.log('----------------------------------------------')
    console.log('')
    const releaseNotes = await changelog.generateReleaseNotes(includedCommits)
    const bump = await getBump(lernaPackage)
    releaseInfo.push({
      name: lernaPackage.name,
      newVersion: inc(lernaPackage.version, bump),
      notes: releaseNotes,
      packagePath: lernaPackage.path,
    })
  }, Promise.resolve())

  return releaseInfo
}
