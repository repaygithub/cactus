import React from 'react'

import { Flex } from '../'
import { HIDE_CONTROL, SPACE, Story } from '../helpers/storybook'

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
    gap: SPACE,
    as: HIDE_CONTROL,
    ref: HIDE_CONTROL,
    theme: HIDE_CONTROL,
    forwardedAs: HIDE_CONTROL,
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
