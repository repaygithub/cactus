import { actions } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import RadioButton from './RadioButton'

const radioButtonStories = storiesOf('RadioButton', module)
const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

radioButtonStories.add('Basic Usage', () => (
  <RadioButton id="some-id" name="test" disabled={boolean('disabled', false)} {...eventLoggers} />
))

radioButtonStories.add('Multiple Radio Buttons', () => (
  <div>
    <div>
      <RadioButton
        id="some-id"
        name="test"
        disabled={boolean('disabled', false)}
        {...eventLoggers}
      />
    </div>
    <div>
      <RadioButton
        id="some-other-id"
        name="test"
        disabled={boolean('disabled', false)}
        {...eventLoggers}
      />
    </div>
  </div>
))
