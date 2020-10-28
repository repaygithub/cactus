import { boolean } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import actions from '../helpers/storybookActionsWorkaround'
import CheckBox from './CheckBox'

const checkBoxStories = storiesOf('CheckBox', module)
const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

checkBoxStories.add(
  'Basic Usage',
  (): React.ReactElement => (
    <CheckBox id="test" name="kaneki" disabled={boolean('disabled', false)} {...eventLoggers} />
  )
)

checkBoxStories.add(
  'Controlling Value Through Props',
  (): React.ReactElement => (
    <CheckBox
      id="test"
      name="touka"
      disabled={boolean('disabled', false)}
      checked={boolean('checked', false)}
      {...eventLoggers}
    />
  )
)
