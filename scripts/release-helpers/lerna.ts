import on from 'await-to-js'
import { execSync } from 'child_process'
import path from 'path'
import { inc, ReleaseType } from 'semver'

import execPromise from './exec-promise'
import { IExtendedCommit } from './log-parse'
import SEMVER from './semver'

// interface IMonorepoPackage {
//   /** Path to the monorepo package */
//   path: string
//   /** Name to the monorepo package */
//   name: string
//   /** Version to the monorepo package */
//   version: string
// }

// interface GetChangedPackagesArgs {
//   /** Commit hash to find changes for */
//   sha: string
//   /** All of the packages in the monorepo */
//   packages: IMonorepoPackage[]
//   /** The semver bump being applied */
//   version?: SEMVER
// }

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

// const getChangedPackages = ({ sha, packages, version }: GetChangedPackagesArgs) => {
//   const changed = new Set<string>()
//   const changedFiles = execSync(`git --no-pager show --first-parent ${sha} --name-only --pretty=`, {
//     encoding: 'utf8',
//   })

//   changedFiles.split('\n').forEach((filePath) => {
//     const monorepoPackage = packages.find((subPackage) => inFolder(subPackage.path, filePath))

//     if (!monorepoPackage) {
//       return
//     }

//     changed.add(`${monorepoPackage.name}@${inc(monorepoPackage.version, version as ReleaseType)}`)
//   })

//   return [...changed]
// }

// export const getChangedPackagesForCommit = async (
//   commit: IExtendedCommit,
//   bump: SEMVER
// ): Promise<string[]> => {
//   const lernaPackages = await getLernaPackages()
//   return getChangedPackages({
//     sha: commit.hash,
//     packages: lernaPackages,
//     version: bump,
//   })
// }

export const getChangedPackages = async (): Promise<string[]> => {
  console.log('Getting changed packages from Lerna')
  console.log('')
  const [, changedPackagesResult = ''] = await on(execPromise('yarn', ['lerna', 'changed']))
  return changedPackagesResult.split('\n')
}
