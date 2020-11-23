import { select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import { Property } from 'csstype'
import React from 'react'

import Flex from './Flex'

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
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <Flex
    justifyContent={select('justifyContent', justifyOptions, 'space-between')}
    alignItems={select('alignItems', alignOptions, 'center')}
    flexWrap={select('flexWrap', flexWrapOptions, 'wrap') as Property.FlexWrap}
    flexDirection={select('flexDirection', directionOptions, 'row') as Property.FlexDirection}
    height={text('height', '100%')}
  >
    <Flex alignSelf={select('alignSelf', alignOptions, 'unset')} p={5} colors="base" />
    <Flex p={5} colors="darkestContrast" />
  </Flex>
)

BasicUsage.parameters = {
  cactus: { overrides: { width: '100%', height: '100vh', display: 'block' } },
}
