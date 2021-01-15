// Code modified from Inuit's "auto" library.  License below:

// Copyright (c) 2018 Intuit

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
// OR OTHER DEALINGS IN THE SOFTWARE.

import on from 'await-to-js'
import prompts from 'prompts'
import { inc, ReleaseType } from 'semver'

import { createChangelog } from './changelog'
import { getCommitsInRelease, getFirstCommit, getLatestRelease } from './commits'
import { getCurrentBranch } from './git-utils'
import inFolder from './in-folder'
import { getChangedPackages, getLernaPackages, LernaPackage } from './lerna'
import SEMVER from './semver'
import { getLastTagNotInBaseBranch, getLatestTagInBranch } from './tags'

const getBump = async (lernaPackage: LernaPackage) => {
  const message = `What kind of version bump should apply to ${lernaPackage.name}? (current version: ${lernaPackage.version})`
  const answers = await prompts({
    type: 'select',
    name: 'bump',
    message,
    choices: Object.keys(SEMVER).map((bumpType) => ({
      title: `${bumpType} - ${inc(lernaPackage.version, bumpType as ReleaseType, 'beta')}`,
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

const getFrom = async (isPrerelease: boolean) => {
  const currentBranch = getCurrentBranch()
  if (isPrerelease) {
    const [, lastTagNotInBaseBranch] = await on(getLastTagNotInBaseBranch(currentBranch))
    const [, latestTagInBranch] = await on(getLatestTagInBranch(currentBranch))
    const lastTag = lastTagNotInBaseBranch || latestTagInBranch || (await getFirstCommit())

    return lastTag
  }

  return getLatestRelease()
}

export default async (isPrerelease: boolean): Promise<ReleaseInfo> => {
  const from = await getFrom(isPrerelease)
  const commits = await getCommitsInRelease(from, 'HEAD')
  const changelog = createChangelog()

  const changedPackages = await getChangedPackages(isPrerelease)
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
