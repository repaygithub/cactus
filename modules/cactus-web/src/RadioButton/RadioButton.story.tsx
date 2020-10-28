import { boolean } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import actions from '../helpers/storybookActionsWorkaround'
import RadioButton from './RadioButton'

const radioButtonStories = storiesOf('RadioButton', module)
const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

radioButtonStories.add(
  'Basic Usage',
  (): React.ReactElement => (
    <RadioButton id="some-id" name="test" disabled={boolean('disabled', false)} {...eventLoggers} />
  )
)

radioButtonStories.add(
  'Multiple Radio Buttons',
  (): React.ReactElement => (
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
  )
)
