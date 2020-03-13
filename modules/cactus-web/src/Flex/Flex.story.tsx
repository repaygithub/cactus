import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import Flex from './Flex'

import React from 'react'

const justifyOptions = [
  'normal',
  'unset',
  'start',
  'end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
  'stretch',
]

const alignOptions = [
  'normal',
  'unset',
  'start',
  'end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
  'stretch',
]

const directionOptions = ['unset', 'row', 'row-reverse', 'column', 'column-reverse']

const flexWrapOptions = [
  'unset',
  'initial',
  'wrap',
  'nowrap',
  'wrap-reverse',
] as React.CSSProperties['flexWrap'][]

storiesOf('Flex', module).add(
  'Basic Usage',
  () => (
    <Flex
      justifyContent={select('justifyContent', justifyOptions, 'end')}
      alignItems={select('alignItems', alignOptions, 'center')}
      // @ts-ignore
      flexWrap={select('flexWrap', flexWrapOptions, 'wrap')}
      // @ts-ignore
      flexDirection={select('flexDirection', directionOptions, 'row')}
      height={text('height', '100%')}
    >
      <Flex alignSelf={select('alignSelf', alignOptions, 'unset')} p={5} colors="base" />
      <Flex
        justifySelf={select('justifySelf', justifyOptions, 'unset')}
        p={5}
        colors="darkestContrast"
      />
    </Flex>
  ),
  { cactus: { overrides: { width: '100%', height: '100vh', display: 'block' } } }
)
