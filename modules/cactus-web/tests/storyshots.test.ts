import initStoryshots from '@storybook/addon-storyshots'
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer'
import path from 'path'
import puppeteer, { devices, Page } from 'puppeteer'

const supportedDevices = ['iPhone 5', 'iPad']

interface MatchOptions {
  customSnapshotsDir?: string
  failureThreshold?: number
  failureThresholdType?: 'pixel' | 'percent'
}

const createCustomizePage = (device: devices.Device) => (page: Page) => page.emulate(device)
const createGetMatchOptions = (name: string) => (): MatchOptions => ({
  customSnapshotsDir: path.resolve('__image_snapshots__', name),
  failureThreshold: 0.02, // 2% threshold
  failureThresholdType: 'percent',
})
const storyKindRegex = /^((?!.*?(Spinner)).)*$/

const beforeScreenshot = () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve()
    }, 500)
  )
}

initStoryshots({
  suite: 'Default viewport tests',
  test: imageSnapshot({
    storybookUrl: 'http://localhost:9001',
    getMatchOptions: createGetMatchOptions('default'),
    beforeScreenshot,
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
    }),
    storyKindRegex,
  })
})
