import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import CheckBoxGroup from './CheckBoxGroup'

describe('component: CheckBoxGroup', (): void => {
  test('should render a checkbox group', (): void => {
    const { container, getByText } = render(
      <StyleProvider>
        <CheckBoxGroup
          id="cbg"
          name="checkboxes"
          label="Checkboxes"
          required
          checked={{ cb1: true }}
          tooltip="Check some boxes"
          onChange={() => undefined}
        >
          <CheckBoxGroup.Item id="cb1" name="cb1" label="CB 1" />
          <CheckBoxGroup.Item id="cb2" name="cb2" label="CB 2" />
          <CheckBoxGroup.Item id="cb3" name="cb3" label="CB 3" disabled={true} />
        </CheckBoxGroup>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
    const cbs = container.querySelectorAll('input')
    cbs.forEach((cb, ix) => {
      expect(cb.required).toBe(true)
      expect(cb.disabled).toBe(ix === 2)
      expect(cb.checked).toBe(ix === 0)
    })

    const tooltip = getByText('Check some boxes')
    expect(tooltip).toHaveAttribute('id', 'cbg-tip')
    expect(tooltip).toHaveAttribute('role', 'tooltip')
  })

  test('should render a disabled checkbox group', (): void => {
    const { container, getByText } = render(
      <StyleProvider>
        <CheckBoxGroup
          id="cbg"
          name="checkboxes"
          label="Checkboxes"
          disabled
          checked={{ cb1: true }}
          error="No box checking for you"
        >
          <CheckBoxGroup.Item id="cb1" name="cb1" label="CB 1" />
          <CheckBoxGroup.Item id="cb2" name="cb2" label="CB 2" />
          <CheckBoxGroup.Item id="cb3" name="cb3" label="CB 3" disabled={true} />
        </CheckBoxGroup>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
    expect(container.querySelector('fieldset')?.disabled).toBe(true)
    const cbs = container.querySelectorAll('input')
    cbs.forEach((cb, ix) => {
      expect(cb.required).toBe(false)
      expect(cb.disabled).toBe(true)
      expect(cb.checked).toBe(ix === 0)
    })

    const err = getByText('No box checking for you').closest('div')
    expect(err).toHaveAttribute('id', 'cbg-status')
    expect(err).toHaveAttribute('role', 'alert')
  })

  test('should trigger events', () => {
    const changes: [string, boolean][] = []
    const onChange = jest.fn((e) => changes.push([e.target.name, e.target.checked]))
    const changeOne: [string, boolean][] = []
    const onChangeOne = jest.fn((e) => changeOne.push([e.target.name, e.target.checked]))
    const focusNames: string[] = []
    const onFocus = jest.fn((e) => focusNames.push(e.target.name))
    const focusOne: string[] = []
    const onFocusOne = jest.fn((e) => focusOne.push(e.target.name))
    const blurNames: string[] = []
    const onBlur = jest.fn((e) => blurNames.push(e.target.name))
    const { getByLabelText } = render(
      <StyleProvider>
        <CheckBoxGroup
          id="cbg"
          name="checkboxes"
          label="Checkboxes"
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <CheckBoxGroup.Item name="cb1" label="CB 1" onFocus={onFocusOne} />
          <CheckBoxGroup.Item name="cb2" label="CB 2" onChange={onChangeOne} />
          <CheckBoxGroup.Item name="cb3" label="CB 3" disabled />
        </CheckBoxGroup>
      </StyleProvider>
    )

    userEvent.tab()
    expect(onChange).not.toHaveBeenCalled()
    expect(onChangeOne).not.toHaveBeenCalled()
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onFocusOne).toHaveBeenCalledTimes(1)
    expect(onBlur).not.toHaveBeenCalled()

    userEvent.click(getByLabelText('CB 3'))
    expect(onChange).not.toHaveBeenCalled()
    expect(onChangeOne).not.toHaveBeenCalled()
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onFocusOne).toHaveBeenCalledTimes(1)
    expect(onBlur).not.toHaveBeenCalled()

    userEvent.click(getByLabelText('CB 2'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChangeOne).toHaveBeenCalledTimes(1)
    expect(onFocus).toHaveBeenCalledTimes(2)
    expect(onFocusOne).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)

    userEvent.click(getByLabelText('CB 1'))
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChangeOne).toHaveBeenCalledTimes(1)
    expect(onFocus).toHaveBeenCalledTimes(3)
    expect(onFocusOne).toHaveBeenCalledTimes(2)
    expect(onBlur).toHaveBeenCalledTimes(2)

    userEvent.tab()
    expect(changes).toEqual([
      ['cb2', true],
      ['cb1', true],
    ])
    expect(changeOne).toEqual([['cb2', true]])
    expect(focusNames).toEqual(['cb1', 'cb2', 'cb1', 'cb2'])
    expect(focusOne).toEqual(['cb1', 'cb1'])
    expect(blurNames).toEqual(['cb1', 'cb2', 'cb1'])
  })
})
