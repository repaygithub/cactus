import initStoryshots from '@storybook/addon-storyshots'
import { Context, imageSnapshot } from '@storybook/addon-storyshots-puppeteer'
import path from 'path'
import puppeteer, { devices, Page } from 'puppeteer'

const TIMEOUT = 60000

const supportedDevices = ['iPhone 5', 'iPad']

// Window 10/Microsoft Edge user agent.
const defaultDevice = {
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19041',
  viewport: { width: 1200, height: 750, isLandscape: true },
}

interface MatchOptions {
  customSnapshotsDir?: string
  comparisonMethod?: 'pixelmatch' | 'ssim'
  failureThreshold?: number
  failureThresholdType?: 'pixel' | 'percent'
}

const createCustomizePage = (device?: devices.Device) => async (page: Page) => {
  page.setDefaultNavigationTimeout(0)
  if (device) {
    await page.emulate(device)
  } else {
    await page.emulate(defaultDevice)
  }
}

const createGetMatchOptions = (name: string) => (): MatchOptions => ({
  customSnapshotsDir: path.resolve('__image_snapshots__', name),
  comparisonMethod: 'ssim',
  failureThreshold: 0.01,
  failureThresholdType: 'percent',
})
const storyKindRegex = /^((?!.*?(Spinner)).)*$/

const imagesHaveLoaded = () => Array.from(document.images).every((i) => i.complete)

const beforeScreenshot = async (page: Page, options: { context: Context }) => {
  await page.waitForFunction(imagesHaveLoaded)
  const callback = options.context.parameters?.beforeScreenshot
  if (callback) {
    await callback(page, options)
  }
}

initStoryshots({
  suite: 'Default viewport tests',
  test: imageSnapshot({
    storybookUrl: 'http://localhost:9001',
    getMatchOptions: createGetMatchOptions('default'),
    customizePage: createCustomizePage(),
    beforeScreenshot,
    setupTimeout: TIMEOUT,
    testTimeout: TIMEOUT,
  }),
  storyKindRegex,
})

supportedDevices.forEach((device: string) => {
  const puppeteerDevice = puppeteer.devices[device]

  if (!puppeteerDevice) {
    return
  }

  const customizePage = createCustomizePage(puppeteerDevice)
  const getMatchOptions = createGetMatchOptions(device)

  initStoryshots({
    suite: `${device} tests`,
    test: imageSnapshot({
      storybookUrl: 'http://localhost:9001',
      customizePage,
      getMatchOptions,
      beforeScreenshot,
      setupTimeout: TIMEOUT,
      testTimeout: TIMEOUT,
    }),
    storyKindRegex,
  })
})
