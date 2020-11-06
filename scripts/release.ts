/// <reference types="./custom" />
import describe from '@lerna/describe-ref'
import prompts from 'prompts'

const main = async () => {
  const { lastTagName: lastReleaseTag } = await describe()
  console.log(lastReleaseTag)
}

main()
