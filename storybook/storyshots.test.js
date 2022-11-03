import initStoryshots from '@storybook/addon-storyshots'
import { puppeteerTest } from '@storybook/addon-storyshots-puppeteer'
import path from 'path'

const imagesHaveLoaded = () => Array.from(document.images).every((i) => i.complete)

const beforeScreenshot = async (page, options) => {
  await page.waitForFunction(imagesHaveLoaded)
  const callback = options.context.parameters?.beforeScreenshot
  if (callback) {
    await callback(page, options)
  }
}

initStoryshots({
  suite: 'Puppeteer storyshots',
  test: puppeteerTest({
    storybookURL: 'file:///code/storybook/dist',
    setupTimeout: 60000,
    testTimeout: 60000,
    beforeScreenshot,
    getMatchOptions: (name) => ({
      customSnapshotsDir: path.resolve('__image_snapshots__', name),
      comparisonMethod: 'ssim',
      failureThreshold: 0.01,
      failureThresholdType: 'percent',
    }),
  }),
})
