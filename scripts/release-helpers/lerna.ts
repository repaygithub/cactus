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

import { getCached } from './cache'
import execPromise from './exec-promise'

export interface LernaPackage {
  /** Path to package */
  path: string
  /** Name of package */
  name: string
  /** Version of package */
  version: string
}

export const getLernaPackages = async (): Promise<LernaPackage[]> => {
  return execPromise('yarn', ['lerna', 'ls', '-pla']).then((res) =>
    res.split('\n').map((packageInfo) => {
      const [packagePath, name, version] = packageInfo.split(':')
      return { path: packagePath, name, version }
    })
  )
}

export const getChangedPackages = async (isPrerelease: boolean): Promise<string[]> => {
  console.log('Getting changed packages from Lerna')
  console.log('')
  const cmd = ['lerna', 'changed']

  if (!isPrerelease) {
    cmd.push('--conventional-graduate')
  }

  return getCached(`changedPackages - ${isPrerelease}`, async () => {
    const [, changedPackagesResult = ''] = await on(execPromise('yarn', cmd))
    return changedPackagesResult.split('\n').filter(Boolean)
  })
}

export const release = async (isPrerelease: boolean): Promise<void> => {
  let cmd = ['lerna', 'publish', '--no-private']

  if (isPrerelease) {
    cmd = [...cmd, '--include-merged-tags', '--preid', 'beta', '--pre-dist-tag', 'next']
  }

  await execPromise('yarn', cmd, { stdio: 'inherit' })
}
