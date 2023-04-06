// must be js or jsx because we can't modify the browser webpack config
import addons from '@storybook/addons'
import { Form } from '@storybook/components'
import { styled } from '@storybook/theming'
import * as React from 'react'

import {
  BACKGROUND_CHANGE,
  BORDER_BOX_CHANGE,
  CONTAINER_CHANGE,
  DECORATOR_LISTENING,
  NAME,
  THEME_CHANGE,
} from './constants'

const ScrollArea = styled('div')({ height: '100%', width: '100%', overflowY: 'auto' })

const SectionTitle = styled('h2')({ padding: '8px 0', margin: '0 16px' })

const THEME_TYPES = {
  use_hue: 'use_hue',
  use_colors: 'use_colors',
}

class Panel extends React.Component {
  state = {
    values: {
      primaryHue: 200,
      type: THEME_TYPES.use_hue,
      primary: '#96D35F',
      secondary: '#FFFFFF',
      border: 'thin',
      shape: 'intermediate',
      font: 'Helvetica',
      boxShadows: true,
      saturationMultiplier: 1,
    },
    backgroundInverse: false,
    borderBox: false,
    flexContainer: false,
  }

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

  emitBorderBoxChange = () => {
    this.props.channel.emit(BORDER_BOX_CHANGE, {
      borderBox: this.state.borderBox,
    })
  }

  emitContainerChange = () => {
    this.props.channel.emit(CONTAINER_CHANGE, {
      isFlexContainer: this.state.flexContainer,
    })
  }

  emitThemeChange = () => {
    const { values } = this.state
    const colors =
      values.type === THEME_TYPES.use_hue
        ? { primaryHue: values.primaryHue }
        : { primary: values.primary, secondary: values.secondary }
    this.props.channel.emit(THEME_CHANGE, {
      border: values.border,
      shape: values.shape,
      font: values.font,
      boxShadows: values.boxShadows,
      grayscaleContrast: values.grayscaleContrast,
      saturationMultiplier: values.saturationMultiplier,
      ...colors,
    })
  }

  handleDecoratorListening = () => {
    this.emitThemeChange()
    this.emitBackgroundChange()
    this.emitBorderBoxChange()
    this.emitContainerChange()
  }

  handleBackgroundChange = (name, value) => {
    this.setState(() => ({ [name]: value }), this.emitBackgroundChange)
  }

  handleBorderBoxChange = (name, value) => {
    this.setState(() => ({ [name]: value }), this.emitBorderBoxChange)
  }

  handleContainerChange = (name, value) => {
    this.setState(() => ({ [name]: value }), this.emitContainerChange)
  }

  handleThemeChange = (name, value) => {
    this.setState((s) => ({ values: { ...s.values, [name]: value } }), this.emitThemeChange)
  }

  handleSimpleThemeChange = ({ currentTarget }) =>
    this.handleThemeChange(currentTarget.name, currentTarget.value)

  render() {
    const { active } = this.props
    const { values } = this.state

    return (
      active && (
        <ScrollArea>
          <Form>
            <SectionTitle>Theme</SectionTitle>
            <Form.Field>
              <div>
                <label id="selectionTypeLabel" style={{ display: 'block' }}>
                  Selection Type
                </label>
                <div role="section" aria-labelledby="selectionTypeLabel">
                  <label style={{ display: 'block' }}>
                    <input
                      type="radio"
                      name="type"
                      value={THEME_TYPES.use_hue}
                      checked={values.type === THEME_TYPES.use_hue}
                      onChange={this.handleSimpleThemeChange}
                    />
                    Select Primary Hue
                  </label>
                  <label style={{ display: 'block' }}>
                    <input
                      type="radio"
                      name="type"
                      value={THEME_TYPES.use_colors}
                      checked={values.type === THEME_TYPES.use_colors}
                      onChange={this.handleSimpleThemeChange}
                    />
                    Choose Colors
                  </label>
                </div>
              </div>
            </Form.Field>
            <Form.Field>
              <label htmlFor="saturationMultiplier">Saturation Multiplier</label>
              <input
                type="range"
                id="saturationMultiplier"
                name="saturationMultiplier"
                min="0"
                max="1"
                step="0.01"
                value={values.saturationMultiplier}
                onChange={this.handleSimpleThemeChange}
              />
              <input
                type="text"
                id="saturationMultiplier-text"
                name="saturationMultiplier"
                value={values.saturationMultiplier}
                onChange={({ currentTarget }) =>
                  this.handleThemeChange('saturationMultiplier', parseInt(currentTarget.value))
                }
                style={{ width: '32px', marginLeft: '8px' }}
              />
            </Form.Field>
            {values.type === THEME_TYPES.use_hue ? (
              <Form.Field>
                <label htmlFor="primaryHue">primary hue</label>
                <input
                  type="range"
                  id="primaryHue"
                  name="primaryHue"
                  min="0"
                  max="360"
                  value={values.primaryHue}
                  onChange={this.handleSimpleThemeChange}
                />
                <input
                  type="text"
                  id="primaryHue-text"
                  name="primaryHue"
                  value={values.primaryHue}
                  onChange={({ currentTarget }) =>
                    this.handleThemeChange('primaryHue', parseInt(currentTarget.value))
                  }
                  style={{ width: '32px', marginLeft: '8px' }}
                />
              </Form.Field>
            ) : (
              <React.Fragment>
                <Form.Field>
                  <label htmlFor="primary-color">primary color</label>
                  <input
                    type="color"
                    id="primary-color"
                    name="primary"
                    value={values.primary}
                    onChange={this.handleSimpleThemeChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="secondary-color">secondary color</label>
                  <input
                    type="color"
                    id="secondary-color"
                    name="secondary"
                    value={values.secondary}
                    onChange={this.handleSimpleThemeChange}
                  />
                </Form.Field>
              </React.Fragment>
            )}
            <Form.Field>
              <label htmlFor="border" style={{ display: 'block' }}>
                Border Width
              </label>
              <select
                id="border"
                name="border"
                onChange={({ currentTarget }) => {
                  this.handleThemeChange('border', currentTarget.value)
                }}
                value={values.border}
                style={{ marginLeft: '8px' }}
              >
                <option value="thin">Thin</option>
                <option value="thick">Thick</option>
              </select>
            </Form.Field>
            <Form.Field>
              <label htmlFor="shape" style={{ display: 'block' }}>
                Component Shape
              </label>
              <select
                id="shape"
                name="shape"
                onChange={({ currentTarget }) => {
                  this.handleThemeChange('shape', currentTarget.value)
                }}
                value={values.shape}
                style={{ marginLeft: '8px' }}
              >
                <option value="square">Square</option>
                <option value="intermediate">Intermediate</option>
                <option value="round">Round</option>
              </select>
            </Form.Field>
            <Form.Field>
              <label htmlFor="shape" style={{ display: 'block' }}>
                Font
              </label>
              <select
                id="font"
                name="font"
                onChange={({ currentTarget }) => {
                  this.handleThemeChange('font', currentTarget.value)
                }}
                value={values.font}
                style={{ marginLeft: '8px' }}
              >
                <option value="Helvetica Neue">Helvetica Neue</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Arial">Arial</option>
              </select>
            </Form.Field>
            <Form.Field>
              <input
                id="boxShadows"
                name="boxShadows"
                type="checkbox"
                onChange={({ currentTarget }) => {
                  this.handleThemeChange('boxShadows', currentTarget.checked)
                }}
                checked={values.boxShadows}
              />
              <label htmlFor="shape" style={{ display: 'block' }}>
                Box Shadows
              </label>
            </Form.Field>
            <Form.Field>
              <input
                id="grayscaleContrast"
                name="grayscaleContrast"
                type="checkbox"
                onChange={({ currentTarget }) => {
                  this.handleThemeChange('grayscaleContrast', currentTarget.checked)
                }}
                checked={values.grayscaleContrast}
              />
              <label htmlFor="shape" style={{ display: 'block' }}>
                Grayscale Contrast
              </label>
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

            <SectionTitle>Border-Box Everything</SectionTitle>
            <Form.Field>
              <input
                id="border-box"
                type="checkbox"
                name="borderBox"
                onChange={({ currentTarget }) =>
                  this.handleBorderBoxChange(currentTarget.name, currentTarget.checked)
                }
                checked={this.state.borderBox}
              />
              <label htmlFor="border-box">
                Force Storybook to render everything with box-sixing: border-box
              </label>
            </Form.Field>

            <SectionTitle>Flex Container</SectionTitle>
            <Form.Field>
              <input
                id="flex-container"
                type="checkbox"
                name="flexContainer"
                onChange={({ currentTarget }) =>
                  this.handleContainerChange(currentTarget.name, currentTarget.checked)
                }
                checked={this.state.flexContainer}
              />
              <label htmlFor="flex-container">
                Render story content inside a display: flex container
              </label>
            </Form.Field>
          </Form>
        </ScrollArea>
      )
    )
  }
}

// Register the addon with a unique name.
addons.register(NAME, (api) => {
  const channel = addons.getChannel()
  addons.addPanel(`${NAME}/panel`, {
    title: 'Cactus Theme',
    render: ({ active, key }) => <Panel key={key} channel={channel} api={api} active={active} />,
  })
})
