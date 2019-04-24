import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, select } from '@storybook/addon-knobs'
import Toggle, { ShadowVariants } from './Toggle'

const toggleStories = storiesOf('Toggle', module)
const shadowVariants: ShadowVariants[] = ['s0', 's1', 's2', 's3', 's4', 's5']

interface ManagerProps {
  shadows: boolean
  shadowVariant: ShadowVariants
}

const initialState = { value: false }
type State = Readonly<typeof initialState>

class ToggleManager extends React.Component<ManagerProps, State> {
  readonly state: State = initialState
  handleToggle = () => {
    this.setState({
      value: !this.state.value,
    })
  }
  render() {
    return (
      <Toggle
        value={this.state.value}
        onClick={this.handleToggle}
        disabled={boolean('disabled', false)}
        {...this.props}
      />
    )
  }
}

toggleStories.add('Basic Usage', () => {
  const shadows = boolean('use shadows', false)
  const shadowVariant = select('shadowVariant', shadowVariants, 's0')
  return <ToggleManager shadows={shadows} shadowVariant={shadowVariant} />
})
