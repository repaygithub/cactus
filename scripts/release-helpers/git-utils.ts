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

import { execSync } from 'child_process'

import execPromise from './exec-promise'

export const getCurrentBranch = (): string => {
  return execSync('git symbolic-ref --short HEAD', {
    encoding: 'utf8',
    stdio: 'ignore',
  })
}

export const getGitUser = async (): Promise<{ system: boolean; email: string; name: string }> => {
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
