/// <reference types="./custom" />
import describe from '@lerna/describe-ref'
import prompts from 'prompts'

import execPromise from './release-helpers/exec-promise'

const main = async () => {
  const { lastTagName: lastReleaseTag } = await describe()
  console.log(lastReleaseTag)

  try {
    await execPromise('yarn', ['lerna', 'updated'])
  } catch (error) {
    console.warn(
      'Lerna detected no changes in project. Aborting release since nothing would be published.'
    )
    process.exit(0)
  }
}

main()
