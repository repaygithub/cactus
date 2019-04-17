import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs'
import RadioButton from './RadioButton'

const radioButtonStories = storiesOf('RadioButton', module)

radioButtonStories.add('Basic Usage', () => (
  <RadioButton id="some-id" disabled={boolean('disabled', false)} />
))
