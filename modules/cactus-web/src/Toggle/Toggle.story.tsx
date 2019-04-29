import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, select } from '@storybook/addon-knobs'
import Toggle from './Toggle'

const toggleStories = storiesOf('Toggle', module)

const initialState = { value: false }
type State = Readonly<typeof initialState>

class ToggleManager extends React.Component {
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
  return <ToggleManager />
})
