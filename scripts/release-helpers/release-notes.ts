import { createChangelog } from './changelog'
import { getCommitsInRelease } from './commits'
import inFolder from './in-folder'
import { getChangedPackages, getLernaPackages } from './lerna'

// const getBump = async (lernaPackage: LernaPackage) => {
//   const message = `What kind of version bump should apply to ${lernaPackage.name}? (curren version: ${lernaPackage.version})`
//   const answers = await prompts({
//     type: 'select',
//     name: 'bump',
//     message,
//     choices: Object.keys(SEMVER).map((bumpType) => ({
//       title: `${bumpType} - ${inc(lernaPackage.version, bumpType as ReleaseType)}`,
//       value: bumpType,
//     })),
//   })
//   return answers.bump
// }

export default async (from: string, to = 'HEAD'): Promise<Record<string, string>> => {
  const commits = await getCommitsInRelease(from, to)
  const changelog = createChangelog()

  const changedPackages = await getChangedPackages()
  const lernaPackages = await getLernaPackages()

  const allReleaseNotes: Record<string, string> = {}

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
    const releaseNotes = await changelog.generateReleaseNotes(includedCommits)
    allReleaseNotes[lernaPackage.name] = releaseNotes
  }, Promise.resolve())

  return allReleaseNotes
}
