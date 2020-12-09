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
// OR OTHER DEALINGS IN THE SOFTWARE.import prompts from 'prompts'

import { ICommit, IExtendedCommit } from './types'

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

const parseSquashPR = (commit: IExtendedCommit): IExtendedCommit => {
  const firstLine = commit.subject.split('\n')[0]
  const squashMerge = /\(#(\d+)\)$/

  const squashMergeMatch = firstLine.match(squashMerge)

  if (!squashMergeMatch) {
    return commit
  }

  return {
    ...commit,
    pullRequest: {
      number: Number(squashMergeMatch[1]),
    },
    subject: firstLine.substr(0, firstLine.length - squashMergeMatch[0].length).trim(),
  }
}

const stripWhitespace = (commit: IExtendedCommit) => {
  const [firstLine, ...lines] = commit.subject.split('\n')

  commit.subject = [firstLine.replace(/[^\S\r\n]{2,}/g, ' '), ...lines].join('\n')

  return commit
}

const parseCommit = (commit: IExtendedCommit) => {
  let parsedCommit = commit
  parsedCommit = parsePR(parsedCommit)
  parsedCommit = parseSquashPR(parsedCommit)
  parsedCommit = stripWhitespace(parsedCommit)

  return parsedCommit
}

/** Process a commit to find it's labels and PR information */
export const normalizeCommit = async (
  commit: ICommit,
  postParseCommit?: (commit: IExtendedCommit) => Promise<IExtendedCommit>
): Promise<IExtendedCommit | undefined> => {
  const parsedCommit = parseCommit({
    labels: [],
    ...commit,
    authors: [{ name: commit.authorName, email: commit.authorEmail }],
  })

  if (postParseCommit) {
    return postParseCommit(parsedCommit)
  }
  return parsedCommit
}

/** Run the log parser over a set of commits */
export const normalizeCommits = async (
  commits: ICommit[],
  postParseCommit?: (commit: IExtendedCommit) => Promise<IExtendedCommit>
): Promise<IExtendedCommit[]> => {
  const eCommits = await Promise.all(
    commits.map(async (commit) => normalizeCommit(commit, postParseCommit))
  )

  return eCommits.filter(Boolean) as IExtendedCommit[]
}
