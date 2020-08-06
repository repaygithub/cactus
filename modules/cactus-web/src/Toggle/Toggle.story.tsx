import { boolean } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Toggle from './Toggle'

const toggleStories = storiesOf('Toggle', module)

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

toggleStories.add(
  'Basic Usage',
  (): React.ReactElement => {
    return <ToggleManager />
  }
)
