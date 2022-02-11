import { Page } from 'puppeteer'
import React from 'react'

import { Flex, Range } from '../'
import { actions, HIDE_STYLED, SPACE, Story, STRING } from '../helpers/storybook'

export default {
  title: 'Range',
  component: Range,
  argTypes: {
    ...HIDE_STYLED,
    ...actions('onFocus', 'onBlur'),
    status: { options: ['success', 'warning', 'error'] },
    showValue: {
      options: ['hover', 'focus', 'both', 'neither'],
      mapping: { both: true, neither: false },
    },
    disabled: { control: 'boolean' },
    margin: SPACE,
    height: STRING,
    width: STRING,
    min: STRING,
    max: STRING,
    step: STRING,
    defaultValue: STRING,
  },
} as const

export const BasicUsage: Story<typeof Range> = (args) => (
  <form>
    <div>
      <Range {...args} />
    </div>
    <button type="reset">Reset</button>
  </form>
)
BasicUsage.args = { showValue: 'focus', height: '100px' }
BasicUsage.parameters = {
  beforeScreenshot: async (page: Page) => {
    await page.focus('input[type="range"]')
  },
}

export const RangeStatus: Story<typeof Range> = () => (
  <Flex justifyContent="center">
    <Range status="success" m={2} />
    <Range status="warning" m={2} />
    <Range status="error" m={2} />
    <Range disabled m={2} />
  </Flex>
)
RangeStatus.parameters = { controls: { disable: true } }
RangeStatus.storyName = 'Range Input with status'
