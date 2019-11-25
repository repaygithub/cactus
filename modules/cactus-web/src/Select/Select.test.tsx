import * as React from 'react'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import animationRender from '../../tests/helpers/animationRender'
import KeyCodes from '../helpers/keyCodes'
import Select from './Select'
import StyleProvider from '../StyleProvider/StyleProvider'
import userEvent from '@testing-library/user-event'

afterEach(cleanup)

function getActiveValue(): string {
  // @ts-ignore
  return document.getElementById(document.activeElement.getAttribute('aria-activedescendant'))
    .textContent
}

describe('component: Select', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <StyleProvider>
        <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
      </StyleProvider>
    )

    expect(asFragment()).toMatchSnapshot()
  })

  test('can receive options as objects', () => {
    let options = [
      { value: 'yum', label: 'Yum' },
      { value: 'who?', label: 'Who?' },
      { value: 'boss', label: 'Who is the boss?' },
    ]
    const { getByText } = render(
      <StyleProvider>
        <Select id="options-objects" name="test-options" options={options} />
      </StyleProvider>
    )

    expect(getByText('Who?')).not.toBeNull()
  })

  test('should set placeholder when options are empty', async () => {
    const { getByRole } = render(
      <StyleProvider>
        <Select id="empty-options" name="test-empty-options" options={[]} />
      </StyleProvider>
    )

    const trigger = getByRole('button')
    expect(trigger).toHaveTextContent('No options available.')
  })

  test('can receive options with number values', async () => {
    const options = [{ label: '1', value: 1 }, { label: 'two', value: 2 }, { label: '3', value: 3 }]
    const { getByText } = render(
      <StyleProvider>
        <Select id="test-numbers" name="test-number-options" options={options} />
      </StyleProvider>
    )
    expect(getByText('two')).not.toBeNull()
  })

  test('sets active descendant to the top option when value does not exist in options', async () => {
    const { getByText, getByRole } = render(
      <StyleProvider>
        <Select id="test-id" name="city" options={['yum', 'who?', 'boss']} value="superman" />
      </StyleProvider>
    )

    // @ts-ignore
    const trigger: HTMLElement = getByText('Select an option')
    fireEvent.click(trigger)
    await animationRender()
    let topOption = getByText('yum')
    expect(getByRole('listbox').getAttribute('aria-activedescendant')).toEqual(topOption.id)
  })

  test('can update value through props', async () => {
    const { getByText, rerender, getByTestId } = render(
      <StyleProvider>
        <Select
          id="test-id"
          data-testid="my-select"
          name="city"
          options={['one', 'two', 'three']}
        />
      </StyleProvider>
    )

    // @ts-ignore
    let trigger: HTMLElement = getByTestId('my-select')
    fireEvent.click(trigger)
    rerender(
      <StyleProvider>
        <Select
          id="test-id"
          data-testid="my-select"
          name="city"
          options={['one', 'two', 'three']}
        />
      </StyleProvider>
    )
    await animationRender()
    fireEvent.click(getByText('one'))
    await animationRender()
    rerender(
      <StyleProvider>
        <Select
          id="test-id"
          data-testid="my-select"
          name="city"
          options={['one', 'two', 'three']}
        />
      </StyleProvider>
    )
    trigger = getByTestId('my-select')
    expect(trigger).toHaveTextContent('one')

    rerender(
      <StyleProvider>
        <Select
          id="test-id"
          data-testid="my-select"
          name="city"
          options={['one', 'two', 'three']}
          value="two"
        />
      </StyleProvider>
    )
    await animationRender()
    trigger = getByTestId('my-select')
    expect(trigger).toHaveTextContent('two')
  })

  describe('keyboard interactions', () => {
    test('listbox gets focus on SPACE and first option selected', async () => {
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByText('Select an option') // default placeholder
      fireEvent.click(trigger) // space is actually a click on buttons
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      await animationRender()
      let list = getByRole('listbox')
      expect(document.activeElement).toBe(list)
      expect(getActiveValue()).toEqual('phoenix')
    })

    test('listbox gets focus on UP and first option selected', async () => {
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByText('Select an option') // default placeholder
      fireEvent.keyUp(trigger, { keyCode: KeyCodes.UP, charCode: KeyCodes.UP })
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      await animationRender()
      let list = getByRole('listbox')
      expect(document.activeElement).toBe(list)
      expect(getActiveValue()).toEqual('phoenix')
    })

    test('listbox gets focus on DOWN first option selected', async () => {
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByText('Select an option') // default placeholder
      fireEvent.keyUp(trigger, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      await animationRender()
      let list = getByRole('listbox')
      expect(document.activeElement).toBe(list)
      expect(getActiveValue()).toEqual('phoenix')
    })

    test('returns focus to button on RETURN', async () => {
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByText('Select an option').parentElement // default placeholder
      fireEvent.keyUp(trigger, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      await animationRender()
      fireEvent.keyDown(getByRole('listbox'), { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      fireEvent.keyDown(getByRole('listbox'), {
        keyCode: KeyCodes.RETURN,
        charCode: KeyCodes.RETURN,
      })
      await animationRender()
      await animationRender()
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      expect(document.activeElement).toEqual(trigger)
    })

    test('returns focus to button on ESC', async () => {
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByText('Select an option').parentElement // default placeholder
      fireEvent.keyUp(trigger, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      await animationRender()
      fireEvent.keyDown(getByRole('listbox'), {
        keyCode: KeyCodes.ESC,
        charCode: KeyCodes.ESC,
      })
      await animationRender()
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      expect(document.activeElement).toEqual(trigger)
    })

    test('after open, DOWN on listbox selects second option', async () => {
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByText('Select an option') // default placeholder
      fireEvent.keyUp(trigger, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      await animationRender()
      let list = getByRole('listbox')
      fireEvent.keyDown(list, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      // @ts-ignore
      expect(getActiveValue()).toEqual('tucson')
    })

    test('raises onChange event on RETURN keydown', async () => {
      const onChange = jest.fn()
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            onChange={onChange}
          />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByText('Select an option')
      fireEvent.keyUp(trigger, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            onChange={onChange}
          />
        </StyleProvider>
      )
      await animationRender()
      let list = getByRole('listbox')
      fireEvent.keyDown(list, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      fireEvent.keyDown(list, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      fireEvent.keyDown(list, {
        keyCode: KeyCodes.RETURN,
        charCode: KeyCodes.RETURN,
      })
      await animationRender()
      expect(onChange).toHaveBeenCalledWith('city', 'flagstaff')
    })

    describe('typing with open list', () => {
      test('will select matching first letter', async () => {
        const { getByText, getByRole, rerender } = render(
          <StyleProvider>
            <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
          </StyleProvider>
        )
        // @ts-ignore
        let trigger: HTMLElement = getByText('Select an option') // default placeholder
        fireEvent.keyUp(trigger, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
        rerender(
          <StyleProvider>
            <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
          </StyleProvider>
        )
        await animationRender()
        let list = getByRole('listbox')
        // keycode 84 = t
        fireEvent.keyDown(list, { keyCode: 84, charCode: 84 })
        expect(getActiveValue()).toEqual('tucson')
      })

      test('will match multiple letters', async () => {
        const { getByText, getByRole, rerender } = render(
          <StyleProvider>
            <Select
              id="test-id"
              name="city"
              options={['phoenix', 'toledo', 'tucson', 'flagstaff']}
            />
          </StyleProvider>
        )
        // @ts-ignore
        let trigger: HTMLElement = getByText('Select an option') // default placeholder
        fireEvent.keyUp(trigger, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
        rerender(
          <StyleProvider>
            <Select
              id="test-id"
              name="city"
              options={['phoenix', 'toledo', 'tucson', 'flagstaff']}
            />
          </StyleProvider>
        )
        await animationRender()
        let list = getByRole('listbox')
        // keycode 84 = t
        fireEvent.keyDown(list, { keyCode: 84, charCode: 84 })
        // keycode 85 = u
        fireEvent.keyDown(list, { keyCode: 85, charCode: 85 })
        expect(getActiveValue()).toEqual('tucson')
      })
    })
  })

  describe('mouse interactions', () => {
    test('closes on option click', async () => {
      const { getByText, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByText('Select an option').parentElement
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      await animationRender()
      fireEvent.click(getByText('flagstaff'))
      await animationRender()
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      expect(document.activeElement).toEqual(trigger)
    })

    test('raises onChange event on click', async () => {
      const onChange = jest.fn()
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            placeholder="Click me!"
            options={['phoenix', 'tucson', 'flagstaff']}
            onChange={onChange}
          />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByText('Click me!')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            placeholder="Click me!"
            options={['phoenix', 'tucson', 'flagstaff']}
            onChange={onChange}
          />
        </StyleProvider>
      )
      await animationRender()
      fireEvent.click(getByText('flagstaff'))
      await animationRender()
      expect(onChange).toHaveBeenCalledWith('city', 'flagstaff')
    })

    test('mouseEnter sets activedescendant', async () => {
      let cities = ['Apache Junction', 'Avondale', 'Benson', 'Bisbee', 'Buckeye', 'Bullhead City']
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" placeholder="Click me!" options={cities} />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByText('Click me!')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" placeholder="Click me!" options={cities} />
        </StyleProvider>
      )
      await animationRender()
      let bensonOption = getByText('Benson')
      fireEvent.mouseEnter(bensonOption)
      await animationRender()
      expect(getByRole('listbox').getAttribute('aria-activedescendant')).toEqual(bensonOption.id)
    })
  })

  describe('onBlur()', () => {
    test('is called when user blurs the closed Select', () => {
      const onBlur = jest.fn()
      const { getByRole } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            placeholder="Click me!"
            options={['phoenix', 'tucson', 'flagstaff']}
            onBlur={onBlur}
            value="phoenix"
          />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByRole('button')
      fireEvent.focus(trigger)
      fireEvent.blur(trigger)
      expect(onBlur).toHaveBeenCalledWith('city')
    })

    test('is NOT called when list opens', async () => {
      const onBlur = jest.fn()
      const { getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            placeholder="Click me!"
            options={['phoenix', 'tucson', 'flagstaff']}
            onBlur={onBlur}
            value="phoenix"
          />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByRole('button')
      trigger.focus()
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            placeholder="Click me!"
            options={['phoenix', 'tucson', 'flagstaff']}
            onBlur={onBlur}
            value="phoenix"
          />
        </StyleProvider>
      )
      await animationRender()
      expect(document.activeElement).toBe(getByRole('listbox'))
      expect(onBlur).not.toHaveBeenCalled()
    })

    test('is called when list blurs by outside action', async () => {
      const onBlur = jest.fn()
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <React.Fragment>
            <div>lose focus</div>
            <Select
              id="test-id"
              name="city"
              placeholder="Click me!"
              options={['phoenix', 'tucson', 'flagstaff']}
              onBlur={onBlur}
              value="phoenix"
            />
          </React.Fragment>
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByRole('button')
      trigger.focus()
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
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
        </StyleProvider>
      )
      await animationRender()
      getByText('lose focus').focus()
      expect(onBlur).toHaveBeenCalledWith('city')
    })
  })

  describe('onFocus()', () => {
    test('is called when user focuses on Select', () => {
      const onFocus = jest.fn()
      const { getByRole } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            placeholder="Click me!"
            options={['phoenix', 'tucson', 'flagstaff']}
            onFocus={onFocus}
            value="phoenix"
          />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByRole('button')
      fireEvent.focus(trigger)
      expect(onFocus).toHaveBeenCalledWith('city')
    })

    test('is NOT called when list closes via keyboard', async () => {
      const onFocus = jest.fn()
      const { getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            placeholder="Click me!"
            options={['phoenix', 'tucson', 'flagstaff']}
            onFocus={onFocus}
            value="phoenix"
          />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            placeholder="Click me!"
            options={['phoenix', 'tucson', 'flagstaff']}
            onFocus={onFocus}
            value="phoenix"
          />
        </StyleProvider>
      )
      await animationRender()
      expect(onFocus).toHaveBeenCalledWith('city')
      onFocus.mockReset()
      act(() => {
        fireEvent.keyDown(getByRole('listbox'), {
          keyCode: KeyCodes.ESC,
          charCode: KeyCodes.ESC,
        })
      })
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            placeholder="Click me!"
            options={['phoenix', 'tucson', 'flagstaff']}
            onFocus={onFocus}
            value="phoenix"
          />
        </StyleProvider>
      )
      await animationRender()
      expect(onFocus).not.toHaveBeenCalled()
    })
  })

  describe('with multiple=true', () => {
    test('trigger is rendered with aria-multiselectable=true', async () => {
      const startingValue = ['tucson']
      const onChange = jest.fn()
      const { getByRole } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value={startingValue}
            onChange={onChange}
            multiple
          />
        </StyleProvider>
      )
      expect(document.querySelector('[aria-multiselectable=true]')).not.toBe(null)
    })

    test('all options are rendered with aria-selected attribute as true or false', async () => {
      const startingValue = ['tucson']
      const onChange = jest.fn()
      const { getByRole, getAllByRole } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value={startingValue}
            onChange={onChange}
            multiple
          />
        </StyleProvider>
      )
      act(() => {
        fireEvent.click(getByRole('button'))
      })
      await animationRender()
      let options = getAllByRole('option')
      options.forEach(o => {
        expect(o.getAttribute('aria-selected')).toBe(
          String(o.getAttribute('data-value') === 'tucson')
        )
      })
    })

    test('can click checkboxes to add values', async () => {
      const onChange = jest.fn()
      const { getByText, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            onChange={onChange}
            multiple
          />
        </StyleProvider>
      )
      const selectTrigger = getByText('Select an option')
      fireEvent.click(selectTrigger)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            onChange={onChange}
            multiple
          />
        </StyleProvider>
      )
      await animationRender()
      const phoenixCheckbox = document.querySelector('input[type=checkbox]') as Element
      fireEvent.click(phoenixCheckbox)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            onChange={onChange}
            multiple
          />
        </StyleProvider>
      )
      await animationRender()
      expect(onChange).toHaveBeenCalledWith('city', ['phoenix'])
    })

    test('can select multiple options', async () => {
      const startingValue = ['tucson']
      const onChange = jest.fn()
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value={startingValue}
            onChange={onChange}
            multiple
          />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value={startingValue}
            onChange={onChange}
            multiple
          />
        </StyleProvider>
      )
      await animationRender()
      let list = getByRole('listbox')
      expect(document.activeElement).toBe(list)
      expect(getActiveValue()).toBe('tucson')
      fireEvent.click(getByText('flagstaff', { selector: '[role="option"]' }))
      await animationRender()
      expect(onChange).toHaveBeenCalledWith('city', ['tucson', 'flagstaff'])
    })

    test('removed value when selected again', async () => {
      const startingValue = ['tucson']
      const onChange = jest.fn()
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value={startingValue}
            onChange={onChange}
            multiple
          />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value={startingValue}
            onChange={onChange}
            multiple
          />
        </StyleProvider>
      )
      await animationRender()
      let list = getByRole('listbox')
      expect(document.activeElement).toBe(list)
      expect(getActiveValue()).toBe('tucson')
      fireEvent.click(getByText('tucson', { selector: '[role="option"]' }))
      await animationRender()
      expect(onChange).toHaveBeenCalledWith('city', [])
    })

    test('SPACE key will toggle option', async () => {
      const startingValue = ['tucson']
      const onChange = jest.fn()
      const { getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value={startingValue}
            onChange={onChange}
            multiple
          />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value={startingValue}
            onChange={onChange}
            multiple
          />
        </StyleProvider>
      )
      await animationRender()
      expect(getActiveValue()).toBe('tucson')
      fireEvent.keyDown(getByRole('listbox'), {
        keyCode: KeyCodes.SPACE,
        charCode: KeyCodes.SPACE,
      })
      await animationRender()
      expect(onChange).toHaveBeenCalledWith('city', [])
      expect(document.activeElement).toBe(getByRole('listbox'))
    })

    test('CLICK will toggle option but not close', async () => {
      const startingValue = ['tucson']
      const onChange = jest.fn()
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value={startingValue}
            onChange={onChange}
            multiple
          />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value={startingValue}
            onChange={onChange}
            multiple
          />
        </StyleProvider>
      )
      await animationRender()
      expect(getActiveValue()).toBe('tucson')
      fireEvent.click(getByText('phoenix'))
      await animationRender()
      expect(onChange).toHaveBeenCalledWith('city', ['tucson', 'phoenix'])
      expect(document.activeElement).toBe(getByRole('listbox'))
    })
  })

  describe('with comboBox=true', () => {
    test('CLICK should open the list and set focus on the input', async () => {
      const { getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      const trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      await animationRender()
      expect(getByRole('listbox')).toBeInTheDocument()
      expect(document.activeElement).toBe(getByRole('search'))
    })

    test('typing should filter options', async () => {
      const { getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      const trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      await animationRender()
      const searchBox = getByRole('search')
      userEvent.type(searchBox, 'phoe')
      const list = getByRole('listbox')
      expect(list).toHaveTextContent('phoenix')
      expect(list).not.toHaveTextContent('tucson')
      expect(list).not.toHaveTextContent('flagstaff')
    })

    test('should be able to add options', async () => {
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      let trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      await animationRender()
      const searchBox: HTMLElement = document.activeElement as HTMLElement
      userEvent.type(searchBox, 'camp verde')
      fireEvent.click(getByText('Create "camp verde"'))
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      await animationRender()
      trigger = getByRole('button')
      expect(trigger).toHaveTextContent('camp verde')
    })

    test('UP/DOWN should set the active descendant', async () => {
      const { getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      let trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      await animationRender()
      const searchBox: HTMLElement = document.activeElement as HTMLElement
      fireEvent.keyDown(searchBox, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      expect(searchBox.getAttribute('aria-activedescendant')).toBe('test-id-phoenix-phoenix')
      fireEvent.keyDown(searchBox, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      fireEvent.keyDown(searchBox, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      expect(searchBox.getAttribute('aria-activedescendant')).toBe('test-id-flagstaff-flagstaff')
      fireEvent.keyDown(searchBox, { keyCode: KeyCodes.UP, charCode: KeyCodes.UP })
      expect(searchBox.getAttribute('aria-activedescendant')).toBe('test-id-tucson-tucson')
    })

    test('RETURN should select an option and focus on the trigger', async () => {
      const { getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      let trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      await animationRender()
      const searchBox: HTMLElement = document.activeElement as HTMLElement
      fireEvent.keyDown(searchBox, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      fireEvent.keyDown(searchBox, { keyCode: KeyCodes.RETURN, charCode: KeyCodes.RETURN })
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      await animationRender()
      trigger = getByRole('button')
      expect(trigger).toHaveTextContent('phoenix')
      expect(document.activeElement).toBe(trigger)
    })

    test('ESC should return focus to the trigger', async () => {
      const { getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      let trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      await animationRender()
      const searchBox: HTMLElement = document.activeElement as HTMLElement
      fireEvent.keyDown(searchBox, { keyCode: KeyCodes.ESC, charCode: KeyCodes.ESC })
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      await animationRender()
      trigger = getByRole('button')
      expect(document.activeElement).toBe(trigger)
    })

    test('values that are not in options should be added', async () => {
      const { getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value="superior"
            comboBox
          />
        </StyleProvider>
      )
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value="superior"
            comboBox
          />
        </StyleProvider>
      )
      let trigger: HTMLElement = getByRole('button')
      expect(trigger).toHaveTextContent('superior')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value="superior"
            comboBox
          />
        </StyleProvider>
      )
      await animationRender()
      expect(getByRole('listbox')).toHaveTextContent('superior')
    })

    test('values should stay in options even after they are removed from the value', async () => {
      const { getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value="superior"
            comboBox
          />
        </StyleProvider>
      )
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            value="globe"
            comboBox
          />
        </StyleProvider>
      )
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      let trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} comboBox />
        </StyleProvider>
      )
      const listbox = getByRole('listbox')
      expect(listbox).toHaveTextContent('superior')
      expect(listbox).toHaveTextContent('globe')
    })
  })

  describe('with multiple=true && comboBox=true', () => {
    test('CLICK on option should select it and keep the list open', async () => {
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            comboBox
            multiple
          />
        </StyleProvider>
      )
      let trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            comboBox
            multiple
          />
        </StyleProvider>
      )
      await animationRender()
      const flagstaff: HTMLElement = getByText('flagstaff')
      const phoenix: HTMLElement = getByText('phoenix')
      fireEvent.click(flagstaff)
      fireEvent.click(phoenix)
      expect(flagstaff.getAttribute('aria-selected')).toBe('true')
      expect(phoenix.getAttribute('aria-selected')).toBe('true')
      expect(getByRole('listbox')).not.toBeNull()
    })

    test('RETURN on option should select it and keep the list open', async () => {
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            comboBox
            multiple
          />
        </StyleProvider>
      )
      let trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            comboBox
            multiple
          />
        </StyleProvider>
      )
      await animationRender()
      const searchBox: HTMLElement = document.activeElement as HTMLElement
      fireEvent.keyDown(searchBox, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      fireEvent.keyDown(searchBox, { keyCode: KeyCodes.RETURN, charCode: KeyCodes.RETURN })
      fireEvent.keyDown(searchBox, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      fireEvent.keyDown(searchBox, { keyCode: KeyCodes.RETURN, charCode: KeyCodes.RETURN })
      const phoenix: HTMLElement = getByText('phoenix')
      const tucson: HTMLElement = getByText('tucson')
      expect(phoenix.getAttribute('aria-selected')).toBe('true')
      expect(tucson.getAttribute('aria-selected')).toBe('true')
      expect(getByRole('listbox')).not.toBeNull()
    })

    test('RETURN w/ metaKey should select the option and close', async () => {
      const { getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            comboBox
            multiple
          />
        </StyleProvider>
      )
      let trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            comboBox
            multiple
          />
        </StyleProvider>
      )
      await animationRender()
      const searchBox: HTMLElement = document.activeElement as HTMLElement
      fireEvent.keyDown(searchBox, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      fireEvent.keyDown(searchBox, {
        keyCode: KeyCodes.RETURN,
        charCode: KeyCodes.RETURN,
        metaKey: true,
      })
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            comboBox
            multiple
          />
        </StyleProvider>
      )
      await animationRender()
      trigger = getByRole('button')
      expect(document.activeElement).toBe(trigger)
      expect(document.activeElement).toHaveTextContent('phoenix')
    })

    test('blurring the list box to focus on the input should not close the list', async () => {
      const { getByRole, getByText, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            comboBox
            multiple
          />
        </StyleProvider>
      )
      let trigger: HTMLElement = getByRole('button')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={['phoenix', 'tucson', 'flagstaff']}
            comboBox
            multiple
          />
        </StyleProvider>
      )
      await animationRender()
      fireEvent.click(getByText('flagstaff'))
      fireEvent.click(getByRole('search'))
      expect(getByRole('listbox')).not.toBeNull()
    })

    test('values that are not in options should be added', async () => {
      const { getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={[]}
            value={['boolest', 'coolest']}
            comboBox
            multiple
          />
        </StyleProvider>
      )
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={[]}
            value={['boolest', 'coolest']}
            comboBox
            multiple
          />
        </StyleProvider>
      )
      let trigger: HTMLElement = getByRole('button')
      expect(trigger).toHaveTextContent('boolestcoolest')
      fireEvent.click(trigger)
      rerender(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            options={[]}
            value={['boolest', 'coolest']}
            comboBox
            multiple
          />
        </StyleProvider>
      )
      await animationRender()
      const listbox = getByRole('listbox')
      expect(listbox.childNodes[0]).toHaveTextContent('boolest')
      expect(listbox.childNodes[1]).toHaveTextContent('coolest')
    })
  })
})
