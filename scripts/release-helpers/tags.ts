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

import { gt } from 'semver'

import execPromise from './exec-promise'

const taggedPackageRegex = /(\S+)@(\S+)/

/** Get all the tags for a given branch. */
const getTags = async (branch: string) => {
  const tags = await execPromise('git', ['tag', "--sort='creatordate'", '--merged', branch])

  return tags
    .split('\n')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

/**
 * Extract a version from a tag.
 *
 * Supports tags like:
 *
 * - 1.2.3
 * - 1.2.3-beta.0
 * - package@1.2.3-beta.0
 * - @scope/package@1.2.3-beta.0
 */
const getVersionFromTag = (tag: string) => {
  if (taggedPackageRegex.test(tag)) {
    const match = tag.match(taggedPackageRegex)

    if (!match) {
      throw new Error(`Could not get version from tag ${tag}`)
    }

    const [, , version] = match
    return version
  }

  return tag
}

/** Get the last tag that isn't in the base branch */
export const getLastTagNotInBaseBranch = async (branch: string): Promise<string | undefined> => {
  const baseTags = (await getTags('origin/master')).reverse()
  const branchTags = (await getTags(`heads/${branch}`)).reverse()
  const comparator = gt
  let firstGreatestUnique: string | undefined

  branchTags.forEach((tag) => {
    const tagVersion = getVersionFromTag(tag)
    const greatestVersion = firstGreatestUnique ? getVersionFromTag(firstGreatestUnique) : undefined

    if (!baseTags.includes(tag) && (!greatestVersion || comparator(tagVersion, greatestVersion))) {
      firstGreatestUnique = tag
    }
  })

  return firstGreatestUnique
}

/** Get the latest tag in the git tree */
export const getLatestTagInBranch = async (since?: string): Promise<string> => {
  return execPromise('git', ['describe', '--tags', '--abbrev=0', since])
}
