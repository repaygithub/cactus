import { text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import ToggleField from './ToggleField'

const eventLoggers = {
  onClick: (e: any) => console.log(`onClick '${e.target.name}': ${e.target.checked}`),
  onFocus: (e: any) => console.log('onFocus:', e.target.name),
  onBlur: (e: any) => console.log('onBlur:', e.target.name),
}

export default {
  title: 'ToggleField',
  component: ToggleField,
} as Meta

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

export const BasicUsage = (): React.ReactElement => (
  <div>
    <ToggleHandler
      name={text('name', 'boolean_field')}
      label={text('label', 'Boolean Field')}
      {...eventLoggers}
    />
    <ToggleHandler name="boolean_field_disabled" label="Disabled" disabled />
  </div>
)
