import * as path from 'path'
import { DIR } from '../constants'
import fs from 'fs'
import mkdirp from 'mkdirp'
import puppeteer from 'puppeteer'

export default async function(): Promise<void> {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
  })
  // store the browser instance so we can teardown it later
  // this global is only available in the teardown but not in TestEnvironments
  global.__BROWSER__ = browser

  // use the file system to expose the wsEndpoint for TestEnvironments
  mkdirp.sync(DIR)
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}
