import { DIR } from './constants'
import rimraf from 'rimraf'

export default async function(): Promise<void> {
  // close the browser instance
  await global.__BROWSER__.close()

  // clean-up the wsEndpoint file
  rimraf.sync(DIR)
}
