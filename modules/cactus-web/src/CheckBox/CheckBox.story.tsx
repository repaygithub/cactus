import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean } from '@storybook/addon-knobs/react'
import { actions } from '@storybook/addon-actions'
import CheckBox from './CheckBox'

const checkBoxStories = storiesOf('CheckBox', module)
const eventLoggers = actions('onChange', 'onFocus', 'onBlur')

checkBoxStories.add('Basic Usage', () => (
  <CheckBox id="test" name="kaneki" disabled={boolean('disabled', false)} {...eventLoggers} />
))

checkBoxStories.add('Controlling Value Through Props', () => (
  <CheckBox
    id="test"
    name="touka"
    disabled={boolean('disabled', false)}
    checked={boolean('checked', false)}
    {...eventLoggers}
  />
))
