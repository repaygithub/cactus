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

import { RestEndpointMethodTypes } from '@octokit/rest'
import * as fs from 'fs'
import path from 'path'

import { getLatestRelease } from './release-helpers/commits'
import execPromise from './release-helpers/exec-promise'
import github from './release-helpers/github'
import generateReleaseInfo, { ReleaseInfo } from './release-helpers/release-info'

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

const createChangelogs = async (releaseInfo: ReleaseInfo) => {
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

  return releaseInfo
}

const makeGithubRelease = async (releaseInfo: ReleaseInfo) => {
  const newTags = (await execPromise('git', ['tag', '--points-at', 'HEAD'])).split('\n')

  const releases = await Promise.all(
    newTags.map(async (tag) => {
      const releasedPackage = releaseInfo.find((p) => tag.includes(p.name))

      if (!releasedPackage) {
        return
      }

      console.log(`Creating GitHub release for ${tag}...`)
      return github.repos.createRelease({
        owner: 'repaygithub',
        repo: 'cactus',
        tag_name: tag,
        name: tag,
        body: releasedPackage.notes,
        prerelease: false,
      })
    })
  )

  return releases.filter(
    (release): release is RestEndpointMethodTypes['repos']['createRelease']['response'] =>
      Boolean(release)
  )
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

  await getGitUser()

  const lastReleaseTag = await getLatestRelease()
  const releaseInfo = await generateReleaseInfo(lastReleaseTag, 'HEAD')
  await createChangelogs(releaseInfo)
  console.log('')
  console.log('Logging into npm')
  console.log('')
  await execPromise('npm', ['login'], { stdio: 'inherit' })
  console.log('')
  console.log('Install, cleanup, and build...')
  await execPromise('yarn', ['install'])
  await execPromise('yarn', ['cleanup'])
  await execPromise('yarn', ['build'])
  await execPromise('yarn', ['lerna', 'publish', '--no-private'], { stdio: 'inherit' })

  await makeGithubRelease(releaseInfo)
}

main()
