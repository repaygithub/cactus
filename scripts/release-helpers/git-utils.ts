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
