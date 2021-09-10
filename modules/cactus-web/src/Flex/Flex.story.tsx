import React from 'react'

import { Flex } from '../'
import { Story } from '../helpers/storybook'

const justifyOptions = [
  'unset',
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
]

const alignOptions = ['unset', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch']

const directionOptions = ['unset', 'row', 'row-reverse', 'column', 'column-reverse']

const flexWrapOptions = ['unset', 'initial', 'wrap', 'nowrap', 'wrap-reverse']

export default {
  title: 'Flex',
  component: Flex,
  argTypes: {
    justifyContent: { options: justifyOptions },
    alignItems: { options: alignOptions },
    flexWrap: { options: flexWrapOptions },
    flexDirection: { options: directionOptions },
    height: { control: 'text' },
    alignSelf: { options: alignOptions },
  },
  args: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    height: '100%',
  },
} as const

export const BasicUsage: Story<typeof Flex> = ({ alignSelf, ...args }) => (
  <Flex {...args}>
    <Flex alignSelf={alignSelf} p={5} colors="base" />
    <Flex p={5} colors="darkestContrast" />
  </Flex>
)

BasicUsage.parameters = {
  cactus: { overrides: { width: '100%', height: '100vh', display: 'block' } },
}
