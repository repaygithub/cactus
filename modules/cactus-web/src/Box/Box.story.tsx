import cactusTheme from '@repay/cactus-theme'
import React from 'react'

import { Box } from '../'
import { HIDE_CONTROL, HIDE_STYLED, SPACE, Story, STRING } from '../helpers/storybook'

const positionOptions = ['initial', 'static', 'relative', 'absolute', 'fixed', 'sticky']

const displayOptions = [
  'initial',
  'none',
  'inline',
  'inline-block',
  'block',
  'flex',
  'inline-flex',
  'table',
  'content',
]

const colorStyles = Object.keys(cactusTheme.colorStyles)
const themeColors = Object.keys(cactusTheme.colors)
const textStyles = Object.keys(cactusTheme.textStyles)

export default {
  title: 'Box',
  component: Box,
  argTypes: {
    ...HIDE_STYLED,
    margin: SPACE,
    padding: SPACE,
    maxWidth: STRING,
    minWidth: STRING,
    backgroundColor: { options: themeColors },
    color: { options: themeColors },
    borderColor: { options: themeColors },
    borderWidth: STRING,
    borderRadius: STRING,
    borderTopLeftRadius: HIDE_CONTROL,
    borderTopRightRadius: HIDE_CONTROL,
    borderBottomLeftRadius: HIDE_CONTROL,
    borderBottomRightRadius: HIDE_CONTROL,
    textStyle: { options: textStyles },
    textDecoration: STRING,
    fontVariant: STRING,
    textIndent: SPACE,
    textTransform: STRING,
  },
  args: {
    padding: '4',
    width: '120px',
    maxWidth: '100vw',
    height: '120px',
    maxHeight: '100vh',
    borderColor: 'darkestContrast',
    borderStyle: 'solid',
    borderWidth: '2px',
    children: 'Example Content',
    textStyle: 'body',
  },
} as const

export const BasicUsageWithThemeBuildInValues: Story<typeof Box> = (args) => <Box {...args} />
BasicUsageWithThemeBuildInValues.argTypes = {
  position: { options: positionOptions },
  display: { options: displayOptions },
  top: STRING,
  right: STRING,
  bottom: STRING,
  left: STRING,
}
BasicUsageWithThemeBuildInValues.args = {
  minHeight: '10px',
  backgroundColor: 'lightContrast',
  color: 'darkestContrast',
}

BasicUsageWithThemeBuildInValues.storyName = 'Basic Usage with theme build-in values'

export const UsingColorStylesForColorAndBackground: Story<typeof Box> = (args) => <Box {...args} />
UsingColorStylesForColorAndBackground.argTypes = {
  color: HIDE_CONTROL,
  backgroundColor: HIDE_CONTROL,
  colors: { options: colorStyles },
}
UsingColorStylesForColorAndBackground.args = {
  colors: 'callToAction',
  width: '100px',
  height: '100px',
  borderStyle: 'none',
}
UsingColorStylesForColorAndBackground.storyName = 'Using colorStyles for color and background'

export const CustomBorderRadiusDefinitions: Story<typeof Box> = (args) => <Box {...args} />
const OBJECT = { control: 'object' }
CustomBorderRadiusDefinitions.argTypes = {
  borderRadius: OBJECT,
  borderTopLeftRadius: OBJECT,
  borderTopRightRadius: OBJECT,
  borderBottomLeftRadius: OBJECT,
  borderBottomRightRadius: OBJECT,
}
CustomBorderRadiusDefinitions.args = {
  backgroundColor: 'lightContrast',
  color: 'darkestContrast',
  borderRadius: {
    square: '4px',
    intermediate: '10px',
    round: '20px',
  },
}

import TestBed, {
  Control,
  TestBed2,
  WithCustomParserAndHook,
  WithCustomParserAndTheme,
  WithDefaultParserAndHook,
  WithDefaultParserAndTheme,
} from '../style-testing'

const STYLES = {
  marginLeft: 2,
  marginRight: [1, 2, 3],
  marginTop: { tiny: 1, small: 2, medium: 3 },
  marginBottom: 5,
}
export const TestControl = () => <TestBed2 Component={Control} {...STYLES} />
export const TestCustomParserAndHook = () => (
  <TestBed2 Component={WithCustomParserAndHook} {...STYLES} />
)
export const TestCustomParserAndTheme = () => (
  <TestBed2 Component={WithCustomParserAndTheme} {...STYLES} />
)
export const TestDefaultParserAndHook = () => (
  <TestBed2 Component={WithDefaultParserAndHook} {...STYLES} />
)
export const TestDefaultParserAndTheme = () => (
  <TestBed2 Component={WithDefaultParserAndTheme} {...STYLES} />
)
