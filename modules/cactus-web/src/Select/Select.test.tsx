import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import pick from 'lodash/pick'
import * as React from 'react'

import animationRender from '../../tests/helpers/animationRender'
import renderWithTheme from '../../tests/helpers/renderWithTheme'
import KeyCodes from '../helpers/keyCodes'
import Select from './Select'

function getActiveValue() {
  // @ts-ignore
  return document.getElementById(document.activeElement.getAttribute('aria-activedescendant'))
    .textContent
}

describe('component: Select', () => {
  test('can receive options as objects', () => {
    const options = [
      { value: 'yum', label: 'Yum' },
      { value: 'who?', label: 'Who?' },
      { value: 'boss', label: 'Who is the boss?' },
    ]
    const { getByText } = renderWithTheme(
      <Select id="options-objects" name="test-options" options={options} />
    )

    expect(getByText('Who?')).not.toBeNull()
  })

  test('can receive options as children, with altText', () => {
    const { queryByText } = renderWithTheme(
      <Select id="options-children" name="test-options" value="second">
        <Select.Option value="first" altText="Locke">
          Peter
        </Select.Option>
        <Select.Option value="second" altText="Demosthenes">
          Valentine
        </Select.Option>
        <Select.Option value="third">Ender</Select.Option>
      </Select>
    )

    expect(queryByText('Peter')).not.toBeNull()
    expect(queryByText('Valentine')).not.toBeNull()
    expect(queryByText('Ender')).not.toBeNull()
    expect(queryByText('Locke')).toBeNull()
    expect(document.querySelector('#options-children')).toHaveTextContent('Demosthenes')
  })

  test('can receive options as children, with disabled', () => {
    const onChange = jest.fn()
    const { getByRole, getByText } = renderWithTheme(
      <Select id="disabled-children" name="disabled-options" onChange={onChange}>
        <Select.Option value="first" disabled>
          Disabled 1
        </Select.Option>
        <Select.Option value="second">Enabled 1</Select.Option>
        <Select.Option value="third">Enabled 2</Select.Option>
        <Select.Option value="fourth" disabled>
          Disabled 2
        </Select.Option>
      </Select>
    )

    userEvent.click(getByRole('button'))

    const enabled1 = getByText('Enabled 1')

    expect(getByText('Disabled 1')).toHaveAttribute('aria-disabled', 'true')
    expect(enabled1).toHaveAttribute('aria-disabled', 'false')
    expect(getByText('Enabled 2')).toHaveAttribute('aria-disabled', 'false')
    expect(getByText('Disabled 2')).toHaveAttribute('aria-disabled', 'true')
  })

  test('should set placeholder when options are empty', () => {
    const { getByRole } = renderWithTheme(
      <Select id="empty-options" name="test-empty-options" options={[]} />
    )

    const trigger = getByRole('button')
    expect(trigger).toHaveTextContent('No options available')
  })

  test('can receive options with number values', () => {
    const options = [
      { label: '1', value: 1 },
      { label: 'two', value: 2 },
      { label: '3', value: 3 },
    ]
    const { getByText } = renderWithTheme(
      <Select id="test-numbers" name="test-number-options" options={options} />
    )
    expect(getByText('two')).not.toBeNull()
  })

  test('sets active descendant to the top option when value does not exist in options', async () => {
    const { getByText, getByRole } = renderWithTheme(
      <Select id="test-id" name="city" options={['yum', 'who?', 'boss']} value="superman" />
    )

    const trigger = getByText('Select an option')
    userEvent.click(trigger)
    const topOption = getByText('yum')
    expect(getByRole('listbox').getAttribute('aria-activedescendant')).toEqual(topOption.id)
  })

  test('does not set active descendant to the top option when it is disabled', () => {
    const options = [
      { label: 'The #1 disabled option', value: 0, disabled: true },
      { label: 'First the worst, second the best', value: 1 },
    ]
    const { getByText, getByRole } = renderWithTheme(
      <Select id="test-id" name="no-active-disabled" options={options} value={-1} />
    )

    userEvent.click(getByRole('button'))
    const activeDescendant = getByRole('listbox').getAttribute('aria-activedescendant')
    const topOption = getByText('The #1 disabled option')
    const bottomOption = getByText('First the worst, second the best')

    expect(activeDescendant).not.toEqual(topOption.id)
    expect(activeDescendant).toEqual(bottomOption.id)
  })

  test('can update value through props', () => {
    const { getByText, getByTestId, rerender } = renderWithTheme(
      <Select id="test-id" data-testid="my-select" name="city" options={['one', 'two', 'three']} />
    )

    let trigger = getByTestId('my-select')
    userEvent.click(trigger)
    userEvent.click(getByText('one'))
    trigger = getByTestId('my-select')
    expect(trigger).toHaveTextContent('one')

    rerender(
      <Select
        id="test-id"
        data-testid="my-select"
        name="city"
        options={['one', 'two', 'three']}
        value="two"
      />
    )
    trigger = getByTestId('my-select')
    expect(trigger).toHaveTextContent('two')
  })

  describe('clears value on empty string', () => {
    test('single select', () => {
      const { getByRole, rerender } = renderWithTheme(
        <Select id="x" name="x" value="y" options={['x', 'y', 'z']} />
      )
      const trigger = getByRole('button')
      expect(trigger).toHaveTextContent('y')
      rerender(<Select id="x" name="x" value="" options={['x', 'y', 'z']} />)
      expect(trigger).toHaveTextContent('Select an option')
    })

    test('...unless there is an option with a blank value', () => {
      const { getByRole, rerender } = renderWithTheme(
        <Select
          id="x"
          name="x"
          value="y"
          options={[
            { value: '', label: 'this page is intentionally blank' },
            { value: 'y', label: 'this statement is false' },
            { value: 'z', label: 'this land is my land' },
          ]}
        />
      )
      const trigger = getByRole('button')
      expect(trigger).toHaveTextContent('this statement is false')
      rerender(
        <Select
          id="x"
          name="x"
          value=""
          options={[
            { value: '', label: 'this page is intentionally blank' },
            { value: 'y', label: 'this statement is false' },
            { value: 'z', label: 'this land is my land' },
          ]}
        />
      )
      expect(trigger).toHaveTextContent('this page is intentionally blank')
    })

    test('multi select', () => {
      const { getByRole, rerender } = renderWithTheme(
        <Select id="x" name="x" multiple value={['z', 'y']}>
          <option value="x" />
          <option value="y" />
          <option value="z" />
        </Select>
      )
      const trigger = getByRole('button')
      expect(trigger).toHaveTextContent('zy')
      rerender(
        <Select id="x" name="x" multiple value="">
          <option value="x" />
          <option value="y" />
          <option value="z" />
        </Select>
      )
      expect(trigger).toHaveTextContent('Select an option')
    })

    test('multi select with empty string as value', () => {
      const { getByRole, rerender } = renderWithTheme(
        <Select id="x" name="x" multiple value={['z', 'y', '']}>
          <option value="">Blank</option>
          <option value="x" />
          <option value="y" />
          <option value="z" />
        </Select>
      )
      const trigger = getByRole('button')
      expect(trigger).toHaveTextContent('zyBlank')
      rerender(
        <Select id="x" name="x" multiple value="">
          <option value="">Blank</option>
          <option value="x" />
          <option value="y" />
          <option value="z" />
        </Select>
      )
      expect(trigger).toHaveTextContent('Blank')
    })
  })

  describe('keyboard interactions', () => {
    test('listbox gets focus on SPACE and first option selected', async () => {
      const { getByText, getByRole } = renderWithTheme(
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
      )
      const trigger = getByText('Select an option') // default placeholder
      userEvent.click(trigger) // space is actually a click on buttons
      await animationRender()
      const list = getByRole('listbox')
      expect(document.activeElement).toBe(list)
      expect(getActiveValue()).toEqual('phoenix')
    })

    test('listbox gets focus on UP and first option selected', async () => {
      const { getByText, getByRole } = renderWithTheme(
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
      )
      const trigger = getByText('Select an option') // default placeholder
      fireEvent.keyUp(trigger, { key: KeyCodes.UP })
      await animationRender()
      const list = getByRole('listbox')
      expect(document.activeElement).toBe(list)
      expect(getActiveValue()).toEqual('phoenix')
    })

    test('listbox gets focus on DOWN first option selected', async () => {
      const { getByText, getByRole } = renderWithTheme(
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
      )
      const trigger = getByText('Select an option') // default placeholder
      fireEvent.keyUp(trigger, { key: KeyCodes.DOWN })
      await animationRender()
      const list = getByRole('listbox')
      expect(document.activeElement).toBe(list)
      expect(getActiveValue()).toEqual('phoenix')
    })

    test('returns focus to button on RETURN', async () => {
      const { getByText, getByRole } = renderWithTheme(
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
      )
      // @ts-ignore
      const trigger: HTMLElement = getByText('Select an option').parentElement // default placeholder
      fireEvent.keyUp(trigger, { key: KeyCodes.DOWN })
      fireEvent.keyDown(getByRole('listbox'), { key: KeyCodes.DOWN })
      fireEvent.keyDown(getByRole('listbox'), {
        key: KeyCodes.RETURN,
      })
      await animationRender()
      expect(document.activeElement).toEqual(trigger)
    })

    test('returns focus to button on ESC', async () => {
      const { getByText, getByRole } = renderWithTheme(
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
      )
      // @ts-ignore
      const trigger: HTMLElement = getByText('Select an option').parentElement // default placeholder
      fireEvent.keyUp(trigger, { key: KeyCodes.DOWN })
      fireEvent.keyDown(getByRole('listbox'), {
        key: KeyCodes.ESC,
      })
      await animationRender()
      expect(document.activeElement).toEqual(trigger)
    })

    test('after open, DOWN on listbox selects second option', async () => {
      const { getByText, getByRole } = renderWithTheme(
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
      )
      const trigger = getByText('Select an option') // default placeholder
      fireEvent.keyUp(trigger, { key: KeyCodes.DOWN })
      await animationRender()
      const list = getByRole('listbox')
      fireEvent.keyDown(list, { key: KeyCodes.DOWN })
      // @ts-ignore
      expect(getActiveValue()).toEqual('tucson')
    })

    test('raises onChange event on RETURN keydown', async () => {
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByText, getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={['phoenix', 'tucson', 'flagstaff']}
          onChange={onChange}
        />
      )
      const trigger = getByText('Select an option')
      fireEvent.keyUp(trigger, { key: KeyCodes.DOWN })
      expect(box).toEqual({})
      const list = getByRole('listbox')
      fireEvent.keyDown(list, { key: KeyCodes.DOWN })
      fireEvent.keyDown(list, { key: KeyCodes.DOWN })
      fireEvent.keyDown(list, {
        key: KeyCodes.RETURN,
      })
      await animationRender()
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: 'flagstaff' })

      const newTrigger = getByRole('button', { name: 'flagstaff' })
      fireEvent.keyUp(newTrigger, { key: KeyCodes.DOWN })
      fireEvent.keyDown(list, { key: KeyCodes.UP })
      fireEvent.keyDown(list, {
        key: KeyCodes.RETURN,
      })
      await animationRender()
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(box).toEqual({ name: 'city', value: 'tucson' })
    })

    test('does not raise duplicate onChange event on RETURN keydown', async () => {
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByText, getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={['phoenix', 'tucson', 'flagstaff']}
          onChange={onChange}
        />
      )
      const trigger = getByText('Select an option')
      fireEvent.keyUp(trigger, { key: KeyCodes.DOWN })
      expect(box).toEqual({})
      const list = getByRole('listbox')
      fireEvent.keyDown(list, { key: KeyCodes.DOWN })
      fireEvent.keyDown(list, { key: KeyCodes.DOWN })
      fireEvent.keyDown(list, {
        key: KeyCodes.RETURN,
      })
      await animationRender()
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: 'flagstaff' })

      const newTrigger = getByRole('button', { name: 'flagstaff' })
      fireEvent.keyUp(newTrigger, { key: KeyCodes.DOWN })
      fireEvent.keyDown(list, {
        key: KeyCodes.RETURN,
      })
      await animationRender()
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: 'flagstaff' })
    })

    test('skips disabled options when navigating the list with the UP/DOWN keys', () => {
      const { getByRole, getByText } = renderWithTheme(
        <Select id="test-id" name="skip-disabled">
          <option value="0" disabled>
            Skip me
          </option>
          <option value="1">First active</option>
          <option value="2" disabled>
            Skipped
          </option>
          <option value="3">Second active</option>
          <option value="4" disabled>
            Skippidy-doo-da
          </option>
          <option value="5" disabled>
            Double skip
          </option>
          <option value="6">Third active</option>
        </Select>
      )

      userEvent.click(getByRole('button'))
      const listbox = getByRole('listbox')
      const firstActive = getByText('First active')
      const secondActive = getByText('Second active')
      const thirdActive = getByText('Third active')

      expect(listbox.getAttribute('aria-activedescendant')).toBe(firstActive.id)
      fireEvent.keyDown(listbox, { key: KeyCodes.DOWN })
      expect(listbox.getAttribute('aria-activedescendant')).toBe(secondActive.id)
      fireEvent.keyDown(listbox, { key: KeyCodes.DOWN })
      expect(listbox.getAttribute('aria-activedescendant')).toBe(thirdActive.id)

      fireEvent.keyDown(listbox, { key: KeyCodes.UP })
      expect(listbox.getAttribute('aria-activedescendant')).toBe(secondActive.id)
      fireEvent.keyDown(listbox, { key: KeyCodes.UP })
      expect(listbox.getAttribute('aria-activedescendant')).toBe(firstActive.id)
    })

    test('sets the active descendant to the first/last option on HOME/END keydown, respectively', () => {
      const { getByRole, getByText } = renderWithTheme(
        <Select id="test-id" name="home-end" options={['first', 'middle', 'last']} />
      )

      userEvent.click(getByRole('button'))
      const listbox = getByRole('listbox')
      const firstOption = getByText('first')
      const lastOption = getByText('last')

      fireEvent.keyDown(listbox, { key: KeyCodes.END })
      expect(listbox.getAttribute('aria-activedescendant')).toBe(lastOption.id)

      fireEvent.keyDown(listbox, { key: KeyCodes.HOME })
      expect(listbox.getAttribute('aria-activedescendant')).toBe(firstOption.id)
    })

    test('sets the active descendant to the first/last non-disabled option on HOME/END keydown, respectively', () => {
      const options = [
        { label: 'first disabled', value: 0, disabled: true },
        { label: 'first enabled', value: 1 },
        { label: 'middle', value: 2 },
        { label: 'last enabled', value: 3 },
        { label: 'last disabled', value: 4, disabled: true },
      ]
      const { getByRole, getByText } = renderWithTheme(
        <Select id="test-id" name="home-end" options={options} />
      )

      userEvent.click(getByRole('button'))
      const listbox = getByRole('listbox')
      const firstEnabled = getByText('first enabled')
      const lastEnabled = getByText('last enabled')

      fireEvent.keyDown(listbox, { key: KeyCodes.END })
      expect(listbox.getAttribute('aria-activedescendant')).toBe(lastEnabled.id)

      fireEvent.keyDown(listbox, { key: KeyCodes.HOME })
      expect(listbox.getAttribute('aria-activedescendant')).toBe(firstEnabled.id)
    })

    describe('typing with open list', () => {
      test('will select matching first letter', async () => {
        const { getByText, getByRole } = renderWithTheme(
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        )
        const trigger = getByText('Select an option') // default placeholder
        fireEvent.keyUp(trigger, { key: KeyCodes.DOWN })
        await animationRender()
        const list = getByRole('listbox')
        fireEvent.keyDown(list, { key: 't' })
        expect(getActiveValue()).toEqual('tucson')
      })

      test('will match multiple letters', async () => {
        const { getByText, getByRole } = renderWithTheme(
          <Select id="test-id" name="city" options={['phoenix', 'toledo', 'tucson', 'flagstaff']} />
        )
        const trigger = getByText('Select an option') // default placeholder
        fireEvent.keyUp(trigger, { key: KeyCodes.DOWN })
        await animationRender()
        const list = getByRole('listbox')
        fireEvent.keyDown(list, { key: 't' })
        fireEvent.keyDown(list, { key: 'u' })
        expect(getActiveValue()).toEqual('tucson')
      })
    })
  })

  describe('mouse interactions', () => {
    test('closes on option click', async () => {
      const { getByText } = renderWithTheme(
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
      )
      // @ts-ignore
      const trigger: HTMLElement = getByText('Select an option').parentElement
      userEvent.click(trigger)
      userEvent.click(getByText('flagstaff'))
      await animationRender()
      expect(document.activeElement).toEqual(trigger)
    })

    test('raises onChange event on click', () => {
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByRole, getByText } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          placeholder="Click me!"
          options={['phoenix', 'tucson', 'flagstaff']}
          onChange={onChange}
        />
      )
      const trigger = getByText('Click me!')
      userEvent.click(trigger)
      userEvent.click(getByText('flagstaff'))
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: 'flagstaff' })

      const newTrigger = getByRole('button', { name: 'flagstaff' })
      userEvent.click(newTrigger)
      userEvent.click(getByText('tucson'))
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(box).toEqual({ name: 'city', value: 'tucson' })
    })

    test('does not raise onChange event on click when the option is disabled', () => {
      const onChange = jest.fn()
      const { getByRole, getByText } = renderWithTheme(
        <Select id="test-id" name="no-onchange" onChange={onChange}>
          <Select.Option value="0" disabled>
            I never got an onChange handler!
          </Select.Option>
        </Select>
      )

      userEvent.click(getByRole('button'))
      userEvent.click(getByText('I never got an onChange handler!'))
      expect(onChange).not.toHaveBeenCalled()
    })

    test('does not raise duplicate onChange event on click', () => {
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByRole, getByText } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          placeholder="Click me!"
          options={['phoenix', 'tucson', 'flagstaff']}
          onChange={onChange}
        />
      )
      const trigger = getByText('Click me!')
      userEvent.click(trigger)
      userEvent.click(getByText('flagstaff'))
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: 'flagstaff' })

      const newTrigger = getByRole('button', { name: 'flagstaff' })
      userEvent.click(newTrigger)
      userEvent.click(getByRole('option', { name: 'flagstaff' }))
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: 'flagstaff' })
    })

    test('mouseEnter sets activedescendant', () => {
      const cities = ['Apache Junction', 'Avondale', 'Benson', 'Bisbee', 'Buckeye', 'Bullhead City']
      const { getByText, getByRole } = renderWithTheme(
        <Select id="test-id" name="city" placeholder="Click me!" options={cities} />
      )
      const trigger = getByText('Click me!')
      userEvent.click(trigger)
      const bensonOption = getByText('Benson')
      fireEvent.mouseEnter(bensonOption)
      expect(getByRole('listbox').getAttribute('aria-activedescendant')).toEqual(bensonOption.id)
    })

    test('mouseEnter does not set activedescendant when the option is disabled', () => {
      const { getByText, getByRole } = renderWithTheme(
        <Select id="test-id" name="no-set-active">
          <Select.Option value="0" disabled>
            not the active descendant
          </Select.Option>
        </Select>
      )

      userEvent.click(getByRole('button'))
      const notActive = getByText('not the active descendant')

      fireEvent.mouseEnter(notActive)
      expect(getByRole('listbox').getAttribute('aria-activedescendant')).not.toEqual(notActive.id)
    })
  })

  describe('nonstandard values', () => {
    test('can select anything as a value', () => {
      const values = jest.fn()
      const options = [
        { label: 'object', value: { one: 'object' } },
        { label: 'array', value: ['two'] },
        { label: 'undefined', value: undefined },
        { label: 'date', value: new Date() },
      ]
      const { getByRole, getByText } = renderWithTheme(
        <Select
          id="test-id"
          name="complex"
          placeholder="Click me!"
          options={options}
          onChange={({ target }) => values(target.value)}
        />
      )
      userEvent.click(getByText('Click me!'))
      userEvent.click(getByText('object'))
      expect(values).toHaveBeenLastCalledWith(options[0].value)

      userEvent.click(getByRole('button', { name: 'object' }))
      userEvent.click(getByText('array'))
      expect(values).toHaveBeenLastCalledWith(options[1].value)

      userEvent.click(getByRole('button', { name: 'array' }))
      userEvent.click(getByText('undefined'))
      expect(values).toHaveBeenLastCalledWith(options[2].value)

      userEvent.click(getByRole('button', { name: 'undefined' }))
      userEvent.click(getByText('date'))
      expect(values).toHaveBeenLastCalledWith(options[3].value)

      expect(values).toHaveBeenCalledTimes(4)
    })
  })

  describe('onBlur()', () => {
    test('is called when user blurs the closed Select', () => {
      const box: any = {}
      const onBlur = jest.fn((e) => {
        box.name = e.target.name
      })
      const { getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          placeholder="Click me!"
          options={['phoenix', 'tucson', 'flagstaff']}
          onBlur={onBlur}
          value="phoenix"
        />
      )
      const trigger = getByRole('button')
      fireEvent.focus(trigger)
      fireEvent.blur(trigger)
      expect(onBlur).toHaveBeenCalledTimes(1)
      expect(box.name).toEqual('city')
    })

    test('is NOT called when list opens', async () => {
      const box: any = {}
      const onBlur = jest.fn((e) => {
        box.name = e.target.name
      })
      const { getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          placeholder="Click me!"
          options={['phoenix', 'tucson', 'flagstaff']}
          onBlur={onBlur}
          value="phoenix"
        />
      )
      const trigger = getByRole('button')
      trigger.focus()
      userEvent.click(trigger)
      await animationRender()
      expect(document.activeElement).toBe(getByRole('listbox'))
      expect(onBlur).not.toHaveBeenCalled()
      expect(box).toEqual({})
    })

    test('is called when list blurs by outside action', () => {
      const box: any = {}
      const onBlur = jest.fn((e) => {
        box.name = e.target.name
      })
      const { getByText, getByRole } = renderWithTheme(
        <React.Fragment>
          <div tabIndex={-1}>lose focus</div>
          <Select
            id="test-id"
            name="city"
            placeholder="Click me!"
            options={['phoenix', 'tucson', 'flagstaff']}
            onBlur={onBlur}
            value="phoenix"
          />
        </React.Fragment>
      )
      const trigger = getByRole('button')
      trigger.focus()
      userEvent.click(trigger)
      getByText('lose focus').focus()
      expect(onBlur).toHaveBeenCalledTimes(1)
      expect(box.name).toEqual('city')
    })
  })

  describe('onFocus()', () => {
    test('is called when user focuses on Select', () => {
      const box: any = {}
      const onFocus = jest.fn((e) => {
        box.name = e.target.name
      })
      const { getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          placeholder="Click me!"
          options={['phoenix', 'tucson', 'flagstaff']}
          onFocus={onFocus}
          value="phoenix"
        />
      )
      const trigger = getByRole('button')
      fireEvent.focus(trigger)
      expect(onFocus).toHaveBeenCalledTimes(1)
      expect(box.name).toEqual('city')
    })

    test('is NOT called when list closes via keyboard', () => {
      const box: any = {}
      const onFocus = jest.fn((e) => {
        box.name = e.target.name
      })
      const { getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          placeholder="Click me!"
          options={['phoenix', 'tucson', 'flagstaff']}
          onFocus={onFocus}
          value="phoenix"
        />
      )
      const trigger = getByRole('button')
      userEvent.click(trigger)
      expect(onFocus).toHaveBeenCalledTimes(1)
      expect(box.name).toEqual('city')
      onFocus.mockReset()
      fireEvent.keyDown(getByRole('listbox'), {
        key: KeyCodes.ESC,
      })
      expect(onFocus).not.toHaveBeenCalled()
    })
  })

  describe('with multiple=true', () => {
    test('trigger is rendered with aria-multiselectable=true', () => {
      const startingValue = ['tucson']
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={['phoenix', 'tucson', 'flagstaff']}
          value={startingValue}
          onChange={onChange}
          multiple
        />
      )
      expect(document.querySelector('[aria-multiselectable=true]')).not.toBe(null)
    })

    test('all options are rendered with aria-selected attribute as true or false', () => {
      const startingValue = ['tucson']
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByRole, getAllByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={['phoenix', 'tucson', 'flagstaff']}
          value={startingValue}
          onChange={onChange}
          multiple
        />
      )
      userEvent.click(getByRole('button'))
      const options = getAllByRole('option')
      options.forEach((o): void => {
        expect(o.getAttribute('aria-selected')).toBe(
          String(o.getAttribute('data-value') === 'tucson')
        )
      })
    })

    test('can click checkboxes to add values', () => {
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByText } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={['phoenix', 'tucson', 'flagstaff']}
          onChange={onChange}
          multiple
        />
      )
      const selectTrigger = getByText('Select an option')
      userEvent.click(selectTrigger)
      const phoenixCheckbox = document.querySelector('input[type=checkbox]') as Element
      // We still need fireEvent for these elements because it's a weird setup with a
      // readonly checkbox, and userEvent doesn't handle that well
      fireEvent.click(phoenixCheckbox)
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: ['phoenix'] })
    })

    test('checkboxes are disabled for disabled options', () => {
      const onChange = jest.fn()
      const { getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="disabled-checkboxes"
          options={[{ label: 'disable my checkbox', value: 0, disabled: true }]}
          onChange={onChange}
          multiple
        />
      )

      userEvent.click(getByRole('button'))
      const disabledCheckbox = document.querySelector('input[type=checkbox]') as Element
      expect(disabledCheckbox).toBeDisabled()
      fireEvent.click(disabledCheckbox)
      expect(onChange).not.toHaveBeenCalled()
    })

    test('can select multiple options', async () => {
      const startingValue = ['tucson']
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByText, getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={['flagstaff', 'tucson', 'phoenix']}
          value={startingValue}
          onChange={onChange}
          multiple
        />
      )
      const trigger = getByRole('button')
      userEvent.click(trigger)
      await animationRender()
      const list = getByRole('listbox')
      expect(document.activeElement).toBe(list)
      expect(getActiveValue()).toBe('tucson')
      // We still need fireEvent for these elements because it's a weird setup with a
      // readonly checkbox, and userEvent doesn't handle that well
      fireEvent.click(getByText('flagstaff', { selector: '[role="option"]' }))
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: ['tucson', 'flagstaff'] })
    })

    test('removed value when selected again', async () => {
      const startingValue = ['tucson']
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByText, getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={['phoenix', 'tucson', 'flagstaff']}
          value={startingValue}
          onChange={onChange}
          multiple
        />
      )
      const trigger = getByRole('button')
      userEvent.click(trigger)
      await animationRender()
      const list = getByRole('listbox')
      expect(document.activeElement).toBe(list)
      expect(getActiveValue()).toBe('tucson')
      // We still need fireEvent for these elements because it's a weird setup with a
      // readonly checkbox, and userEvent doesn't handle that well
      fireEvent.click(getByText('tucson', { selector: '[role="option"]' }))
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: [] })
    })

    test('SPACE key will toggle option', async () => {
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={['phoenix', 'tucson', 'flagstaff']}
          onChange={onChange}
          multiple
        />
      )
      const trigger = getByRole('button')
      userEvent.click(trigger)
      await animationRender()
      const listbox = getByRole('listbox')
      expect(getActiveValue()).toBe('phoenix')
      fireEvent.keyDown(listbox, {
        key: KeyCodes.DOWN,
      })
      fireEvent.keyDown(listbox, {
        key: KeyCodes.SPACE,
      })
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: ['tucson'] })
      expect(document.activeElement).toBe(listbox)

      userEvent.click(trigger)
      userEvent.click(trigger)
      await animationRender()
      expect(getActiveValue()).toBe('tucson')
      fireEvent.keyDown(listbox, {
        key: KeyCodes.SPACE,
      })
      await animationRender()
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(box).toEqual({ name: 'city', value: [] })
      expect(document.activeElement).toBe(listbox)
    })

    test('RETURN key will select, NOT toggle, the option and close', async () => {
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          onChange={onChange}
          options={['phoenix', 'tucson', 'flagstaff']}
          multiple
        />
      )
      const trigger = getByRole('button')
      userEvent.click(trigger)
      const listbox = getByRole('listbox')
      fireEvent.keyDown(listbox, { key: KeyCodes.DOWN })
      fireEvent.keyDown(listbox, {
        key: KeyCodes.RETURN,
        metaKey: true,
      })
      await animationRender()
      expect(document.activeElement).toBe(trigger)
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: ['tucson'] })

      userEvent.click(trigger)
      await animationRender()
      expect(getActiveValue()).toBe('tucson')
      fireEvent.keyDown(listbox, {
        key: KeyCodes.RETURN,
        metaKey: true,
      })
      await animationRender()
      expect(document.activeElement).toBe(trigger)
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: ['tucson'] })
    })

    test('CLICK will toggle option but not close', async () => {
      const startingValue = ['tucson']
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByText, getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={['phoenix', 'tucson', 'flagstaff']}
          value={startingValue}
          onChange={onChange}
          multiple
        />
      )
      const trigger = getByRole('button')
      userEvent.click(trigger)
      await animationRender()
      expect(getActiveValue()).toBe('tucson')
      // We still need fireEvent for these elements because it's a weird setup with a
      // readonly checkbox, and userEvent doesn't handle that well
      fireEvent.click(getByText('phoenix'))
      await animationRender()
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: ['tucson', 'phoenix'] })
      expect(document.activeElement).toBe(getByRole('listbox'))
    })
  })

  describe('with comboBox=true', () => {
    test('CLICK should open the list and set focus on the input', async () => {
      const { getByRole } = renderWithTheme(
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
      )
      const trigger = getByRole('button')
      userEvent.click(trigger)
      await animationRender()
      expect(getByRole('listbox')).toBeInTheDocument()
      expect(document.activeElement).toBe(getByRole('textbox'))
    })

    test('typing should filter options', () => {
      const { getByRole } = renderWithTheme(
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
      )
      const trigger = getByRole('button')
      userEvent.click(trigger)
      const searchBox = getByRole('textbox')
      userEvent.type(searchBox, 'phoe')
      const list = getByRole('listbox')
      expect(list).toHaveTextContent('phoenix')
      expect(list).not.toHaveTextContent('tucson')
      expect(list).not.toHaveTextContent('flagstaff')
    })

    test('should be able to add options', async () => {
      const { getByText, getByRole } = renderWithTheme(
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
      )
      let trigger = getByRole('button')
      userEvent.click(trigger)
      await animationRender()
      const searchBox: HTMLElement = document.activeElement as HTMLElement
      userEvent.type(searchBox, 'camp verde')
      userEvent.click(getByText('Create "camp verde"'))
      trigger = getByRole('button')
      expect(trigger).toHaveTextContent('camp verde')
    })

    test('should show when no match is found', async () => {
      const { getByText, getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={['phoenix', 'tucson', 'flagstaff']}
          comboBox
          canCreateOption={false}
        />
      )
      const trigger = getByRole('button')
      userEvent.click(trigger)
      await animationRender()
      const searchBox: HTMLElement = document.activeElement as HTMLElement
      userEvent.type(searchBox, 'abc')
      expect(getByText('No match found')).toBeInTheDocument()
    })

    test('UP/DOWN should set the active descendant', async () => {
      const { getByRole } = renderWithTheme(
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
      )
      const trigger = getByRole('button')
      userEvent.click(trigger)
      await animationRender()
      const searchBox: HTMLElement = document.activeElement as HTMLElement
      fireEvent.keyDown(searchBox, { key: KeyCodes.DOWN })
      expect(searchBox.getAttribute('aria-activedescendant')).toBe('test-id-phoenix')
      fireEvent.keyDown(searchBox, { key: KeyCodes.DOWN })
      fireEvent.keyDown(searchBox, { key: KeyCodes.DOWN })
      expect(searchBox.getAttribute('aria-activedescendant')).toBe('test-id-flagstaff')
      fireEvent.keyDown(searchBox, { key: KeyCodes.UP })
      expect(searchBox.getAttribute('aria-activedescendant')).toBe('test-id-tucson')
    })

    test('UP/DOWN should not set the active descendant for disabled options', async () => {
      const { getByRole, getByText } = renderWithTheme(
        <Select id="test-id" name="skip-disabled" comboBox>
          <option value="0">No skip</option>
          <option value="1" disabled>
            Skip
          </option>
          <option value="2" disabled>
            Double skip
          </option>
          <option value="3">Don't skip me</option>
          <option value="4" disabled>
            Skip me
          </option>
        </Select>
      )

      userEvent.click(getByRole('button'))
      await animationRender()
      const searchBox = document.activeElement as HTMLElement
      const firstActive = getByText('No skip')
      const secondActive = getByText("Don't skip me")

      fireEvent.keyDown(searchBox, { key: KeyCodes.DOWN })
      expect(searchBox.getAttribute('aria-activedescendant')).toBe(firstActive.id)
      fireEvent.keyDown(searchBox, { key: KeyCodes.DOWN })
      expect(searchBox.getAttribute('aria-activedescendant')).toBe(secondActive.id)

      fireEvent.keyDown(searchBox, { key: KeyCodes.UP })
      expect(searchBox.getAttribute('aria-activedescendant')).toBe(firstActive.id)
      fireEvent.keyDown(searchBox, { key: KeyCodes.UP })
      expect(searchBox.getAttribute('aria-activedescendant')).toBe(firstActive.id)
    })

    test('RETURN should select an option and focus on the trigger', async () => {
      const { getByRole } = renderWithTheme(
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
      )
      let trigger = getByRole('button')
      userEvent.click(trigger)
      await animationRender()
      const searchBox: HTMLElement = document.activeElement as HTMLElement
      fireEvent.keyDown(searchBox, { key: KeyCodes.DOWN })
      fireEvent.keyDown(searchBox, { key: KeyCodes.RETURN })
      await animationRender()
      trigger = getByRole('button')
      expect(trigger).toHaveTextContent('phoenix')
      expect(document.activeElement).toBe(trigger)
    })

    test('ESC should return focus to the trigger', async () => {
      const { getByRole } = renderWithTheme(
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
      )
      let trigger = getByRole('button')
      userEvent.click(trigger)
      await animationRender()
      const searchBox: HTMLElement = document.activeElement as HTMLElement
      fireEvent.keyDown(searchBox, { key: KeyCodes.ESC })
      await animationRender()
      trigger = getByRole('button')
      expect(document.activeElement).toBe(trigger)
    })

    test('values that are not in options should be added', () => {
      const { getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={['phoenix', 'tucson', 'flagstaff']}
          value="superior"
          comboBox
        />
      )
      const trigger = getByRole('button')
      expect(trigger).toHaveTextContent('superior')
      userEvent.click(trigger)
      expect(getByRole('listbox')).toHaveTextContent('superior')
    })

    test('values should stay in options even after they are removed from the value', () => {
      const { getByRole, rerender } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={['phoenix', 'tucson', 'flagstaff']}
          value="superior"
          comboBox
        />
      )
      rerender(
        <Select
          id="test-id"
          name="city"
          options={['phoenix', 'tucson', 'flagstaff']}
          value="globe"
          comboBox
        />
      )
      rerender(
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
      )
      const trigger = getByRole('button')
      userEvent.click(trigger)
      const listbox = getByRole('listbox')
      expect(listbox).toHaveTextContent('superior')
      expect(listbox).toHaveTextContent('globe')
    })

    test('values added should not be duplicated', () => {
      const DelayedOptions = () => {
        const [options, setOptions] = React.useState<string[]>([])
        React.useEffect(() => setOptions(['phoenix', 'tucson', 'flagstaff']), [])
        return <Select id="test-id" name="city" options={options} value="phoenix" comboBox />
      }
      const { getByRole, getAllByRole } = renderWithTheme(<DelayedOptions />)
      const trigger = getByRole('button')
      expect(trigger).toHaveTextContent('phoenix')
      userEvent.click(trigger)
      const options = getAllByRole('option')
      expect(options).toHaveLength(3)
    })
  })

  describe('with multiple=true && comboBox=true', () => {
    test('CLICK on option should select it and keep the list open', () => {
      const { getByText, getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={['phoenix', 'tucson', 'flagstaff']}
          comboBox
          multiple
        />
      )
      const trigger = getByRole('button')
      userEvent.click(trigger)
      const flagstaff = getByText('flagstaff')
      const phoenix = getByText('phoenix')
      // We still need fireEvent for these elements because it's a weird setup with a
      // readonly checkbox, and userEvent doesn't handle that well
      fireEvent.click(flagstaff)
      fireEvent.click(phoenix)
      expect(flagstaff.getAttribute('aria-selected')).toBe('true')
      expect(phoenix.getAttribute('aria-selected')).toBe('true')
      expect(getByRole('listbox')).not.toBeNull()
    })

    test('RETURN on option should toggle it and keep the list open', async () => {
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByText, getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          onChange={onChange}
          options={['phoenix', 'tucson', 'flagstaff']}
          comboBox
          multiple
        />
      )
      const trigger = getByRole('button')
      userEvent.click(trigger)
      await animationRender()
      const searchBox: HTMLElement = document.activeElement as HTMLElement
      fireEvent.keyDown(searchBox, { key: KeyCodes.DOWN })
      fireEvent.keyDown(searchBox, { key: KeyCodes.RETURN })
      fireEvent.keyDown(searchBox, { key: KeyCodes.DOWN })
      fireEvent.keyDown(searchBox, { key: KeyCodes.RETURN })
      const phoenix = getByText('phoenix')
      const tucson = getByText('tucson')
      expect(phoenix.getAttribute('aria-selected')).toBe('true')
      expect(tucson.getAttribute('aria-selected')).toBe('true')
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(box).toEqual({ name: 'city', value: ['phoenix', 'tucson'] })
      expect(getByRole('listbox')).not.toBeNull()

      fireEvent.keyDown(searchBox, { key: KeyCodes.UP })
      fireEvent.keyDown(searchBox, { key: KeyCodes.RETURN })
      expect(phoenix.getAttribute('aria-selected')).toBe('false')
      expect(tucson.getAttribute('aria-selected')).toBe('true')
      expect(onChange).toHaveBeenCalledTimes(3)
      expect(box).toEqual({ name: 'city', value: ['tucson'] })
      expect(getByRole('listbox')).not.toBeNull()
    })

    test('RETURN w/ metaKey should select, NOT toggle, the option and close', async () => {
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          onChange={onChange}
          options={['phoenix', 'tucson', 'flagstaff']}
          comboBox
          multiple
        />
      )
      let trigger = getByRole('button')
      userEvent.click(trigger)
      await animationRender()
      let searchBox: HTMLElement = document.activeElement as HTMLElement
      fireEvent.keyDown(searchBox, { key: KeyCodes.DOWN })
      fireEvent.keyDown(searchBox, {
        key: KeyCodes.RETURN,
        metaKey: true,
      })
      await animationRender()
      trigger = getByRole('button')
      expect(document.activeElement).toBe(trigger)
      expect(document.activeElement).toHaveTextContent('phoenix')
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: ['phoenix'] })

      userEvent.click(trigger)
      await animationRender()
      searchBox = document.activeElement as HTMLElement
      fireEvent.keyDown(searchBox, { key: KeyCodes.DOWN })
      fireEvent.keyDown(searchBox, {
        key: KeyCodes.RETURN,
        metaKey: true,
      })
      await animationRender()
      trigger = getByRole('button')
      expect(document.activeElement).toBe(trigger)
      expect(document.activeElement).toHaveTextContent('phoenix')
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'city', value: ['phoenix'] })
    })

    test('blurring the list box to focus on the input should not close the list', () => {
      const { getByRole, getByText } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={['phoenix', 'tucson', 'flagstaff']}
          comboBox
          multiple
        />
      )
      const trigger = getByRole('button')
      userEvent.click(trigger)
      // We still need fireEvent for these elements because it's a weird setup with a
      // readonly checkbox, and userEvent doesn't handle that well
      fireEvent.click(getByText('flagstaff'))
      fireEvent.click(getByRole('textbox'))
      expect(getByRole('listbox')).not.toBeNull()
    })

    test('values that are not in options should be added', () => {
      const { getByRole } = renderWithTheme(
        <Select
          id="test-id"
          name="city"
          options={[]}
          value={['boolest', 'coolest']}
          comboBox
          multiple
        />
      )
      const trigger = getByRole('button')
      expect(trigger).toHaveTextContent('boolestcoolest')
      userEvent.click(trigger)
      const listbox = getByRole('listbox')
      expect(listbox.childNodes[0]).toHaveTextContent('boolest')
      expect(listbox.childNodes[1]).toHaveTextContent('coolest')
    })
  })

  describe('with theme customization', () => {
    test('should have 2px border', () => {
      const { container } = renderWithTheme(
        <Select id="test-id" name="customize" options={['thin', 'thick']} />,
        { border: 'thick' }
      )

      const selectComponent = container.querySelector('[id="test-id"]')
      const styles = window.getComputedStyle(selectComponent as Element)
      expect(styles.borderWidth).toBe('2px')
    })

    test('should match intermediate shape styles', () => {
      const { container } = renderWithTheme(
        <Select id="test-id" name="customize" options={['shape', 'border']} />,
        { shape: 'intermediate' }
      )

      const selectComponent = container.querySelector('[id="test-id"]')
      const styles = window.getComputedStyle(selectComponent as Element)
      expect(styles.borderWidth).toBe('1px')
      expect(styles.borderRadius).toBe('8px')
    })

    test('should match square shape styles', () => {
      const { container } = renderWithTheme(
        <Select id="test-id" name="customize" options={['shape', 'border']} />,
        { shape: 'square' }
      )

      const selectComponent = container.querySelector('[id="test-id"]')
      const styles = window.getComputedStyle(selectComponent as Element)
      expect(styles.borderWidth).toBe('1px')
      expect(styles.borderRadius).toBe('1px')
    })

    test('should not have box shadows set', () => {
      const { container } = renderWithTheme(
        <Select id="test-id" name="customize" options={['shape', 'border']} />,
        { boxShadows: false }
      )

      const selectComponent = container.querySelector('[id="test-id"]')
      const styles = window.getComputedStyle(selectComponent as Element)
      expect(styles.boxShadow).toBe('')
    })
  })
})
