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
  WithCustomParserAndHook,
  WithCustomParserAndTheme,
  WithDefaultParserAndHook,
  WithDefaultParserAndTheme,
} from '../style-testing'

//<WithCustomParserAndTheme marginLeft={2} marginRight={[1, 2, 3]} marginTop={{tiny: 3, medium: 2, extraLarge: 1 }} />
//<WithDefaultParserAndTheme marginLeft={2} marginRight={[1, 2, 3]} marginTop={{tiny: 3, medium: 2, extraLarge: 1 }} />
//<WithCustomParserAndHook marginLeft={2} marginRight={[1, 2, 3]} marginTop={{tiny: 3, medium: 2, extraLarge: 1 }} />
//<WithDefaultParserAndHook marginLeft={2} marginRight={[1, 2, 3]} marginTop={{tiny: 3, medium: 2, extraLarge: 1 }} />
export const StyleTesting = () => (
  <>
    <Box backgroundColor="black" width="50px" height="50px" />
    <TestBed Component={Control} marginLeft={2} marginRight={[1, 2, 3]} marginTop={{tiny: 3, medium: 2, extraLarge: 1 }} />
  </>
)
