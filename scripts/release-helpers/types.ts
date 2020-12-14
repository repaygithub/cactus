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

export interface ICommitAuthor {
  /** Author's name */
  name?: string | null
  /** Author's email */
  email?: string | null
  /** Author's username */
  username?: string
  /** The commit this author created */
  hash?: string
  /** The type of user */
  type?: 'Bot' | 'User' | string
}

interface IPullRequest {
  /** The issue number for the pull request */
  number: number
  /** The base branch the pull request is on */
  base?: string
  /** The body of the PR (opening comment) */
  body?: string
}

export interface ICommit {
  hash: string
  authorName?: string
  authorEmail?: string
  subject: string
  rawBody?: string
  labels?: string[]
  files: string[]
}

export type IExtendedCommit = ICommit & {
  /** The authors that contributed to the pull request */
  authors: ICommitAuthor[]
  /** The pull request information */
  pullRequest?: IPullRequest
  /** Labels associated with the commit */
  labels: string[]
}
