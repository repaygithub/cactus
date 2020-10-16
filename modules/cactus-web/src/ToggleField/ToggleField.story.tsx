import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import ToggleField from './ToggleField'

const eventLoggers = {
  onClick: (e: any) => console.log(`onClick '${e.target.name}': ${e.target.checked}`),
  onFocus: (e: any) => console.log('onFocus:', e.target.name),
  onBlur: (e: any) => console.log('onBlur:', e.target.name),
}

const ToggleHandler = (props: any) => {
  const [checked, setChecked] = React.useState<boolean>(false)
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`onChange '${e.target.name}': ${e.target.checked}`)
      setChecked(e.target.checked)
    },
    [setChecked]
  )
  return <ToggleField {...props} checked={checked} onChange={onChange} />
}

storiesOf('ToggleField', module).add('Basic Usage', () => (
  <ToggleHandler
    name={text('name', 'boolean_field')}
    label={text('label', 'Boolean Field')}
    disabled={boolean('disabled', false)}
    {...eventLoggers}
  />
))
