import { boolean } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Toggle from './Toggle'

export default {
  title: 'Toggle',
  component: Toggle,
} as Meta

const initialState = { value: false }
type State = Readonly<typeof initialState>

class ToggleManager extends React.Component {
  public readonly state: State = initialState
  private handleToggle = (): void => {
    this.setState({
      value: !this.state.value,
    })
  }
  public render(): React.ReactElement {
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

export const BasicUsage = (): React.ReactElement => {
  return <ToggleManager />
}
