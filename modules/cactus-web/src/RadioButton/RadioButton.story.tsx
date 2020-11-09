import { boolean } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import actions from '../helpers/storybookActionsWorkaround'
import RadioButton from './RadioButton'

const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

export default {
  title: 'RadioButton',
  component: RadioButton,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <RadioButton id="some-id" name="test" disabled={boolean('disabled', false)} {...eventLoggers} />
)

export const MultipleRadioButtons = (): React.ReactElement => (
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
