import * as React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'
import KeyCodes from '../helpers/keyCodes'
import Select from './Select'
import StyleProvider from '../StyleProvider/StyleProvider'

afterEach(cleanup)

function animationRender() {
  return new Promise(resolve => {
    setTimeout(() => {
      window.requestAnimationFrame(resolve)
    }, 0)
  })
}

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

  test('can recieve options as objects', () => {
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

  describe('keyboard interactions', () => {
    test('listbox gets focus on SPACE and first option selected', async () => {
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" options={['phoenix', 'tucson', 'flagstaff']} />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByText('Select an option').parentElement // default placeholder
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
      let trigger: HTMLElement = getByText('Select an option').parentElement // default placeholder
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
      let trigger: HTMLElement = getByText('Select an option').parentElement // default placeholder
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
      let trigger: HTMLElement = getByText('Select an option').parentElement // default placeholder
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
      let trigger: HTMLElement = getByText('Select an option').parentElement
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
        let trigger: HTMLElement = getByText('Select an option').parentElement // default placeholder
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
        let trigger: HTMLElement = getByText('Select an option').parentElement // default placeholder
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
      let trigger: HTMLElement = getByText('Click me!').parentElement
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
      const onChange = jest.fn()
      let cities = ['Apache Junction', 'Avondale', 'Benson', 'Bisbee', 'Buckeye', 'Bullhead City']
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select id="test-id" name="city" placeholder="Click me!" options={cities} />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByText('Click me!').parentElement
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
      const { getByText, getByRole, rerender } = render(
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
      let trigger: HTMLElement = getByText('phoenix').parentElement
      fireEvent.focus(trigger)
      fireEvent.blur(trigger)
      expect(onBlur).toHaveBeenCalledWith('city', 'phoenix')
    })

    test('is NOT called when list opens', async () => {
      const onBlur = jest.fn()
      const { getByText, getByRole, rerender } = render(
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
      let trigger: HTMLElement = getByText('phoenix').parentElement
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
      let trigger: HTMLElement = getByText('phoenix').parentElement
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
      expect(onBlur).toHaveBeenCalledWith('city', 'phoenix')
    })
  })

  describe('onFocus()', () => {
    test('is called when user focuses on Select', () => {
      const onFocus = jest.fn()
      const { getByText, getByRole, rerender } = render(
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
      let trigger: HTMLElement = getByText('phoenix').parentElement
      fireEvent.focus(trigger)
      expect(onFocus).toHaveBeenCalledWith('city', 'phoenix')
    })

    test('is NOT called when list closes via keyboard', async () => {
      const onFocus = jest.fn()
      const { getByText, getByRole, rerender } = render(
        <StyleProvider>
          <Select
            id="test-id"
            name="city"
            placeholder="Click me!"
            options={['phoenix', 'tucson', 'flagstaff']}
            value="phoenix"
          />
        </StyleProvider>
      )
      // @ts-ignore
      let trigger: HTMLElement = getByText('phoenix').parentElement
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
      fireEvent.keyDown(getByRole('listbox'), {
        keyCode: KeyCodes.ESC,
        charCode: KeyCodes.ESC,
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
})
