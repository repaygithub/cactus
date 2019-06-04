import { select, text } from '@storybook/addon-knobs/react'
import { Span, Text } from './Text'
import { storiesOf } from '@storybook/react'
import cactusTheme, { CactusColor } from '@repay/cactus-theme'
import React from 'react'

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
        // @ts-ignore
        fontWeight={text('fontWeight', '400')}
        fontStyle={text('fontStyle', 'italic')}
        // @ts-ignore
        textAlign={text('textAlign', 'left')}
        textStyle={select('textStyle', TEXT_STYLES, 'small')}
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
        // @ts-ignore
        fontWeight={text('fontWeight', '400')}
        fontStyle={text('fontStyle', 'italic')}
        // @ts-ignore
        textAlign={text('textAlign', 'left')}
        textStyle={select('textStyle', TEXT_STYLES, 'small')}
      >
        {text('children', sampleText)}
      </Span>
    ),
    { knobs: { escapeHTML: false } }
  )
