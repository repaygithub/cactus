import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import RadioGroup from './RadioGroup'

describe('component: RadioGroup', (): void => {
  test('should render a radio group', (): void => {
    const { container, getByText } = render(
      <StyleProvider>
        <RadioGroup
          id="rg"
          name="places"
          label="Realm"
          required
          disabled={false}
          value="persephone"
          tooltip="Select your preferred realm"
          onChange={() => undefined}
        >
          <RadioGroup.Button id="earth" label="Glebe" value="james" />
          <RadioGroup.Button id="life" label="Elysium" value="persephone" />
          <RadioGroup.Button id="air" label="Empyrea" value="stratos" />
          <RadioGroup.Button id="fire" label="Pyroborea" value="pyro" />
          <RadioGroup.Button id="death" label="Stygia" value="charnel" disabled />
        </RadioGroup>
      </StyleProvider>
    )

    const radios = container.querySelectorAll('input')
    for (let i = 0; i < 5; i++) {
      const radio = radios[i]
      expect(radio.name).toBe('places')
      expect(radio.type).toBe('radio')
      expect(radio.required).toBe(true)
      expect(radio.disabled).toBe(i === 4)
      expect(radio.checked).toBe(i === 1)
    }

    const tooltip = getByText('Select your preferred realm')
    expect(tooltip).toHaveAttribute('id', 'rg-tip')
    expect(tooltip).toHaveAttribute('role', 'tooltip')
  })

  test('should render a disabled radio group', (): void => {
    const { container, getByText } = render(
      <StyleProvider>
        <RadioGroup
          id="rg"
          name="cities"
          label="Captitol"
          disabled
          defaultValue="stratos"
          warning="Cannot travel right now"
        >
          <RadioGroup.Button id="earth" label="Agothera" value="james" />
          <RadioGroup.Button id="life" label="Idylliac" value="persephone" />
          <RadioGroup.Button id="air" label="Thryhring" value="stratos" />
          <RadioGroup.Button id="fire" label="Helios" value="pyro" disabled={false} />
          <RadioGroup.Button id="death" label="Dys" value="charnel" />
        </RadioGroup>
      </StyleProvider>
    )

    const radios = container.querySelectorAll('input')
    for (let i = 0; i < 5; i++) {
      const radio = radios[i]
      expect(radio.name).toBe('cities')
      expect(radio.required).toBe(false)
      expect(radio.disabled).toBe(radio.value !== 'pyro')
      expect(radio.checked).toBe(i === 2)
    }

    const warning = getByText('Cannot travel right now').closest('div')
    expect(warning).toHaveAttribute('id', 'rg-status')
    expect(warning).toHaveAttribute('role', 'alert')
  })

  test('should trigger events', (): void => {
    const changes: [string, string][] = []
    const onChange = jest.fn((e) => changes.push([e.target.name, e.target.value]))
    const changeOne: [string, string][] = []
    const onChangeOne = jest.fn((e) => changeOne.push([e.target.name, e.target.value]))
    const focusNames: string[] = []
    const onFocus = jest.fn((e) => focusNames.push(e.target.id))
    const focusOne: string[] = []
    const onFocusOne = jest.fn((e) => focusOne.push(e.target.id))
    const blurNames: string[] = []
    const onBlur = jest.fn((e) => blurNames.push(e.target.id))
    const { getByLabelText } = render(
      <StyleProvider>
        <RadioGroup
          id="rg"
          name="wizards"
          label="Allies"
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <RadioGroup.Button id="earth" label="Grakkus" value="james" onFocus={onFocusOne} />
          <RadioGroup.Button id="life" label="Yogo" value="persephone" />
          <RadioGroup.Button id="air" label="Jadugarr" value="stratos" disabled />
          <RadioGroup.Button id="fire" label="Sorcha" value="pyro" onChange={onChangeOne} />
          <RadioGroup.Button id="death" label="Acheron" value="charnel" />
        </RadioGroup>
      </StyleProvider>
    )

    userEvent.tab()
    expect(onChange).not.toHaveBeenCalled()
    expect(onChangeOne).not.toHaveBeenCalled()
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onFocusOne).toHaveBeenCalledTimes(1)
    expect(onBlur).not.toHaveBeenCalled()

    userEvent.click(getByLabelText('Jadugarr'))
    expect(onChange).not.toHaveBeenCalled()
    expect(onChangeOne).not.toHaveBeenCalled()
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onFocusOne).toHaveBeenCalledTimes(1)
    expect(onBlur).not.toHaveBeenCalled()

    userEvent.click(getByLabelText('Sorcha'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChangeOne).toHaveBeenCalledTimes(1)
    expect(onFocus).toHaveBeenCalledTimes(2)
    expect(onFocusOne).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)

    userEvent.click(getByLabelText('Yogo'))
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChangeOne).toHaveBeenCalledTimes(1)
    expect(onFocus).toHaveBeenCalledTimes(3)
    expect(onFocusOne).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(2)

    userEvent.tab()
    expect(changes).toEqual([
      ['wizards', 'pyro'],
      ['wizards', 'persephone'],
    ])
    expect(changeOne).toEqual([['wizards', 'pyro']])
    expect(focusNames).toEqual(['earth', 'fire', 'life'])
    expect(focusOne).toEqual(['earth'])
    expect(blurNames).toEqual(['earth', 'fire', 'life'])
  })
})
