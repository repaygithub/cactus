import cactusTheme, { CactusColor, TextStyleCollection } from '@repay/cactus-theme'
import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { FontWeightProperty, TextAlignProperty } from 'csstype'
import React from 'react'

import { Span, Text } from './Text'

const COLOR_STYLES = Object.keys(cactusTheme.colorStyles) as CactusColor[]
const TEXT_STYLES = Object.keys(cactusTheme.textStyles)

let sampleText = `Stinking bishop pepper jack cheese on toast. St. agur
blue cheese cheese triangles smelly cheese danish fontina pepper
jack melted cheese pecorino mozzarella. Squirty cheese feta pecorino
bocconcini everyone loves when the cheese comes out everybody's happy
the big cheese cheddar. Cut the cheese camembert de normandie cheesecake
cheesy grin cow monterey jack.`

storiesOf('Text', module)
  .add(
    'Basic Usage of Text',
    () => (
      <Text
        colors={select('colors', COLOR_STYLES, 'base')}
        margin={text('margin', '0 50px')}
        padding={text('padding', '3')}
        fontWeight={text('fontWeight', '400') as FontWeightProperty}
        fontStyle={text('fontStyle', 'italic')}
        textAlign={text('textAlign', 'left') as TextAlignProperty}
        textStyle={select('textStyle', TEXT_STYLES, 'small') as keyof TextStyleCollection}
      >
        {text('children', sampleText)}
      </Text>
    ),
    { knobs: { escapeHTML: false } }
  )
  .add(
    'Basic Usage of Span',
    () => (
      <Span
        colors={select('colors', COLOR_STYLES, 'base')}
        margin={text('margin', '0 50px')}
        padding={text('padding', '3')}
        fontWeight={text('fontWeight', '400') as FontWeightProperty}
        fontStyle={text('fontStyle', 'italic')}
        textAlign={text('textAlign', 'left') as TextAlignProperty}
        textStyle={select('textStyle', TEXT_STYLES, 'small') as keyof TextStyleCollection}
      >
        {text('children', sampleText)}
      </Span>
    ),
    { knobs: { escapeHTML: false } }
  )
