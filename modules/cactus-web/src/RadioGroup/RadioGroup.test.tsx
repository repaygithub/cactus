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
          readOnly
          required
          disabled={false}
          value="persephone"
          tooltip="Select your preferred realm"
        >
          <RadioGroup.Button id="earth" label="Glebe" value="james" />
          <RadioGroup.Button id="life" label="Elysium" value="persephone" />
          <RadioGroup.Button id="air" label="Empyrea" value="stratos" />
          <RadioGroup.Button id="fire" label="Pyroborea" value="pyro" />
          <RadioGroup.Button id="death" label="Stygia" value="charnel" disabled />
        </RadioGroup>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
    const radios = container.querySelectorAll('input')
    for (let i = 0; i < 5; i++) {
      const radio = radios[i]
      expect(radio.name).toBe('places')
      expect(radio.type).toBe('radio')
      expect(radio.readOnly).toBe(true)
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

    expect(container).toMatchSnapshot()
    expect(container.querySelector('fieldset')?.disabled).toBe(true)
    const radios = container.querySelectorAll('input')
    for (let i = 0; i < 5; i++) {
      const radio = radios[i]
      expect(radio.name).toBe('cities')
      expect(radio.readOnly).toBe(false)
      expect(radio.required).toBe(false)
      expect(radio.disabled).toBe(true)
      expect(radio.checked).toBe(i === 2)
    }

    const warning = getByText('Cannot travel right now').closest('div')
    expect(warning).toHaveAttribute('id', 'rg-status')
    expect(warning).toHaveAttribute('role', 'alert')
  })

  test('should trigger events', (): void => {
    const onChange = jest.fn()
    const onChangeOne = jest.fn()
    const onFocus = jest.fn()
    const onFocusOne = jest.fn()
    const onBlur = jest.fn()
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
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onFocusOne).toHaveBeenCalledTimes(1)
    expect(onBlur).not.toHaveBeenCalled()

    userEvent.click(getByLabelText('Yogo'))
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChangeOne).toHaveBeenCalledTimes(1)
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onFocusOne).toHaveBeenCalledTimes(1)
    expect(onBlur).not.toHaveBeenCalled()

    userEvent.tab()
    expect(onChange.mock.calls).toEqual([
      ['wizards', 'pyro'],
      ['wizards', 'persephone'],
    ])
    expect(onChangeOne.mock.calls).toEqual([['wizards', 'pyro']])
    expect(onFocus.mock.calls).toEqual([['wizards']])
    expect(onFocusOne.mock.calls).toEqual([['wizards']])
    expect(onBlur.mock.calls).toEqual([['wizards']])
  })
})
