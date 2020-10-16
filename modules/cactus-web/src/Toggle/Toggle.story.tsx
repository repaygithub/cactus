import { boolean } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Toggle from './Toggle'

const toggleStories = storiesOf('Toggle', module)

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

toggleStories.add(
  'Basic Usage',
  (): React.ReactElement => {
    return <ToggleManager disabled={boolean('Disabled', false)} />
  }
)
