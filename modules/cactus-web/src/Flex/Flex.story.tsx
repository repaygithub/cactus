import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
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

storiesOf('Flex', module).add(
  'Basic Usage',
  () => (
    <Flex
      justifyContent={select('justifyContent', justifyOptions, 'flex-end')}
      alignItems={select('alignItems', alignOptions, 'center')}
      // @ts-ignore
      flexWrap={select('flexWrap', flexWrapOptions, 'wrap')}
      // @ts-ignore
      flexDirection={select('flexDirection', directionOptions, 'row')}
      height={text('height', '100%')}
    >
      <Flex alignSelf={select('alignSelf', alignOptions, 'unset')} p={5} colors="base" />
      <Flex p={5} colors="darkestContrast" />
    </Flex>
  ),
  { cactus: { overrides: { width: '100%', height: '100vh', display: 'block' } } }
)
