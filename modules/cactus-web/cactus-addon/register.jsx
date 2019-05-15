// must be js or jsx because we can't modify the browser webpack config
import * as React from 'react'

import { BACKGROUND_CHANGE, DECORATOR_LISTENING, NAME, THEME_CHANGE } from './constants'
import { Form } from '@storybook/components'
import { styled } from '@storybook/theming'
import addons from '@storybook/addons'

const ScrollArea = styled('div')({ height: '100%', width: '100%', overflowY: 'auto' })

const SectionTitle = styled('h2')({ padding: '8px 0', margin: '0 16px' })

class Panel extends React.Component {
  state = { values: { primaryHue: 210 }, backgroundInverse: false }

  componentDidMount() {
    this.props.channel.on(DECORATOR_LISTENING, this.handleDecoratorListening)
  }

  componentWillUnmount() {
    this.props.channel.removeListener(DECORATOR_LISTENING, this.handleDecoratorListening)
  }

  emitBackgroundChange = () => {
    this.props.channel.emit(BACKGROUND_CHANGE, {
      inverse: this.state.backgroundInverse,
    })
  }

  emitThemeChange = () => {
    this.props.channel.emit(THEME_CHANGE, this.state.values)
  }

  handleDecoratorListening = () => {
    this.emitThemeChange()
    this.emitBackgroundChange()
  }

  handleBackgroundChange = (name, value) => {
    this.setState(() => ({ [name]: value }), this.emitBackgroundChange)
  }

  handleThemeChange = (name, value) => {
    this.setState(s => ({ values: { ...s.values, [name]: value } }), this.emitThemeChange)
  }

  render() {
    const { active } = this.props

    return active ? (
      <ScrollArea>
        <Form>
          <SectionTitle>Theme</SectionTitle>
          <Form.Field>
            <label htmlFor="primaryHue">primary hue</label>
            <input
              type="range"
              id="primaryHue"
              name="primaryHue"
              min="0"
              max="360"
              value={this.state.values.primaryHue}
              onChange={({ currentTarget }) =>
                this.handleThemeChange(currentTarget.name, currentTarget.value)
              }
            />
            <input
              type="text"
              id="primaryHue-text"
              name="primaryHue"
              value={this.state.values.primaryHue}
              onChange={({ currentTarget }) =>
                this.handleThemeChange('primaryHue', parseInt(currentTarget.value))
              }
              style={{ width: '32px', marginLeft: '8px' }}
            />
          </Form.Field>
          <SectionTitle>Background</SectionTitle>
          <Form.Field>
            <input
              id="background-inverse"
              type="checkbox"
              name="backgroundInverse"
              onChange={({ currentTarget }) =>
                this.handleBackgroundChange(currentTarget.name, currentTarget.checked)
              }
              checked={this.state.backgroundInverse}
            />
            <label htmlFor="background-inverse">Inverse</label>
          </Form.Field>
        </Form>
      </ScrollArea>
    ) : null
  }
}

// Register the addon with a unique name.
addons.register(NAME, api => {
  const channel = addons.getChannel()
  addons.addPanel(`${NAME}/panel`, {
    title: 'Cactus Theme',
    render: ({ active, key }) => <Panel key={key} channel={channel} api={api} active={active} />,
  })
})
