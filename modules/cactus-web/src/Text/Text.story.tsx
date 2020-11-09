import cactusTheme, { CactusColor, TextStyleCollection } from '@repay/cactus-theme'
import { select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import { Property } from 'csstype'
import React from 'react'

import { Span, Text } from './Text'

const COLOR_STYLES = Object.keys(cactusTheme.colorStyles) as CactusColor[]
const TEXT_STYLES = Object.keys(cactusTheme.textStyles)

const sampleText = `Stinking bishop pepper jack cheese on toast. St. agur
blue cheese cheese triangles smelly cheese danish fontina pepper
jack melted cheese pecorino mozzarella. Squirty cheese feta pecorino
bocconcini everyone loves when the cheese comes out everybody's happy
the big cheese cheddar. Cut the cheese camembert de normandie cheesecake
cheesy grin cow monterey jack.`

export default {
  title: 'Text',
  component: Text,
} as Meta

export const BasicUsageOfText = (): React.ReactElement => (
  <Text
    colors={select('colors', COLOR_STYLES, 'base')}
    margin={text('margin', '0 50px')}
    padding={text('padding', '3')}
    fontWeight={text('fontWeight', '400') as Property.FontWeight}
    fontStyle={text('fontStyle', 'italic')}
    textAlign={text('textAlign', 'left') as Property.TextAlign}
    textStyle={select('textStyle', TEXT_STYLES, 'small') as keyof TextStyleCollection}
  >
    {text('children', sampleText)}
  </Text>
)
BasicUsageOfText.storyName = 'Basic Usage of Text'
BasicUsageOfText.parameters = { knobs: { escapeHTML: false } }

export const BasicUsageOfSpan = (): React.ReactElement => (
  <Span
    colors={select('colors', COLOR_STYLES, 'base')}
    margin={text('margin', '0 50px')}
    padding={text('padding', '3')}
    fontWeight={text('fontWeight', '400') as Property.FontWeight}
    fontStyle={text('fontStyle', 'italic')}
    textAlign={text('textAlign', 'left') as Property.TextAlign}
    textStyle={select('textStyle', TEXT_STYLES, 'small') as keyof TextStyleCollection}
  >
    {text('children', sampleText)}
  </Span>
)

BasicUsageOfSpan.storyName = 'Basic Usage of Span'
BasicUsageOfSpan.parameters = { knobs: { escapeHTML: false } }
