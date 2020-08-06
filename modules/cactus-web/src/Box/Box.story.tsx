import cactusTheme, { TextStyleCollection } from '@repay/cactus-theme'
import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { PositionProperty, ZIndexProperty } from 'csstype'
import React from 'react'

import Box from './Box'

const positionOptions = {
  initial: 'initial',
  static: 'static',
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  sticky: 'sticky',
}

const displayOptions = {
  initial: 'initial',
  none: 'none',
  inline: 'inline',
  'inline-block': 'inline-block',
  block: 'block',
  flex: 'flex',
  'inline-flex': 'inline-flex',
  table: 'table',
  content: 'content',
}

const sizes = [0, 1, 2, 3, 4, 5, 6]

const colorStyles = Object.keys(cactusTheme.colorStyles)
const themeColors = Object.keys(cactusTheme.colors)
const textStyles = Object.keys(cactusTheme.textStyles)

storiesOf('Box', module)
  .add(
    'Basic Usage with theme build-in values',
    (): React.ReactElement => (
      <Box
        position={select('position', positionOptions, 'initial') as PositionProperty}
        display={select('display', displayOptions, 'initial')}
        top={text('top', '')}
        right={text('right', '')}
        bottom={text('bottom', '')}
        left={text('left', '')}
        margin={select('margin', sizes, 0)}
        padding={select('padding', sizes, 4)}
        width={text('width', '120px')}
        maxWidth={text('maxWidth', '')}
        minWidth={text('minWidth', '')}
        height={text('height', '120px')}
        maxHeight={text('maxHeight', '100vh')}
        minHeight={text('minHeight', '10px')}
        backgroundColor={select('backgroundColor (bg)', themeColors, 'lightContrast')}
        color={select('color', themeColors, 'darkestContrast')}
        borderColor={select('borderColor', themeColors, 'darkestContrast')}
        borderWidth={text('borderWidth', '2px')}
        borderRadius={text('borderRadius', '')}
        borderStyle={text('borderStyle', 'solid')}
        textStyle={select('textStyle', textStyles, 'body') as keyof TextStyleCollection}
        zIndex={text('zIndex', '') as ZIndexProperty}
      >
        {text('children', 'Example Content')}
      </Box>
    )
  )
  .add(
    'Using colorStyles for color and background',
    (): React.ReactElement => (
      <Box
        colors={select('colors', colorStyles, 'callToAction')}
        margin={select('margin', sizes, 0)}
        padding={select('padding', sizes, 4)}
        width={text('width', '100px')}
        height={text('height', '100px')}
        borderColor={select('borderColor', themeColors, 'darkestContrast')}
        borderWidth={text('borderWidth', '')}
        borderRadius={text('borderRadius', '')}
        borderStyle={text('borderStyle', '')}
        textStyle={select('textStyle', textStyles, 'body') as keyof TextStyleCollection}
      >
        {text('children', 'Example Content')}
      </Box>
    )
  )
