import { boolean } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Toggle from './Toggle'

export default {
  title: 'Toggle',
  component: Toggle,
} as Meta

const ToggleManager = (props: any) => {
  const [checked, setChecked] = React.useState<boolean>(false)
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`onChange '${e.target.name}': ${e.target.checked}`)
      setChecked(e.target.checked)
    },
    [setChecked]
  )
  return <Toggle {...props} checked={checked} onChange={onChange} />
}

export const BasicUsage = (): React.ReactElement => {
  return <ToggleManager disabled={boolean('Disabled', false)} />
}
