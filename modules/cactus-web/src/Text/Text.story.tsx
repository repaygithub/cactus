import cactusTheme from '@repay/cactus-theme'
import React from 'react'

import { Text } from '../'
import { HIDE_STYLED, SPACE, Story, STRING } from '../helpers/storybook'

const COLOR_STYLES = Object.keys(cactusTheme.colorStyles)

const sampleText = `Stinking bishop pepper jack cheese on toast. St. agur
blue cheese cheese triangles smelly cheese danish fontina pepper
jack melted cheese pecorino mozzarella. Squirty cheese feta pecorino
bocconcini everyone loves when the cheese comes out everybody's happy
the big cheese cheddar. Cut the cheese camembert de normandie cheesecake
cheesy grin cow monterey jack.`

export default {
  title: 'Text',
  component: Text,
  argTypes: {
    colors: { options: COLOR_STYLES },
    margin: SPACE,
    padding: SPACE,
    textDecoration: STRING,
    fontVariant: STRING,
    textIndent: SPACE,
    textTransform: STRING,
    ...HIDE_STYLED,
  },
  args: {
    colors: 'base',
    margin: '0 50px',
    padding: '3',
    fontWeight: '400',
    fontStyle: 'italic',
    textAlign: 'left',
    textStyle: 'small',
    children: sampleText,
  },
} as const

export const BasicUsageOfText: Story<typeof Text> = (args) => <Text {...args} />
BasicUsageOfText.storyName = 'Basic Usage of Text'
