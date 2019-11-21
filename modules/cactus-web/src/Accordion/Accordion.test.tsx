import * as React from 'react'

import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Accordion from './Accordion'
import KeyCodes from '../helpers/keyCodes'

let _requestAnimationFrame = window.requestAnimationFrame

beforeEach(() => {
  _requestAnimationFrame = window.requestAnimationFrame
  window.requestAnimationFrame = (cb: Function) => cb()
})

afterEach(() => {
  window.requestAnimationFrame = _requestAnimationFrame
  cleanup()
})

describe('component: Accordion', () => {
  describe('Component', () => {
    test('Should render Accordion', () => {
      const { container } = render(
        <StyleProvider>
          <Accordion id="accordion">
            <Accordion.Header>Test Header</Accordion.Header>
            <Accordion.Body>Test Body</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      expect(container).toHaveTextContent('Test Header')
      expect(container).not.toHaveTextContent('Test Body')
      expect(container).toMatchSnapshot()
    })

    test('Should open Accordion when button is clicked', () => {
      const { container } = render(
        <StyleProvider>
          <Accordion>
            <Accordion.Header>Test Header</Accordion.Header>
            <Accordion.Body>Test Body</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      const toggleButton = container.querySelector('button') as HTMLButtonElement
      act(() => {
        fireEvent.click(toggleButton)
      })
      expect(container).toHaveTextContent('Test Body')
    })

    test('should allow the user to initialize accordions as open', () => {
      const { container } = render(
        <StyleProvider>
          <Accordion open>
            <Accordion.Header>Test Header</Accordion.Header>
            <Accordion.Body>Test Body</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      expect(container).toHaveTextContent('Test Body')
    })
  })

  describe('Provider', () => {
    test('Should manage Accordion state', () => {
      const { container } = render(
        <StyleProvider>
          <Accordion.Provider>
            <Accordion>
              <Accordion.Header>Test Header</Accordion.Header>
              <Accordion.Body>Test Body</Accordion.Body>
            </Accordion>
          </Accordion.Provider>
        </StyleProvider>
      )

      const toggleButton = container.querySelector('button') as HTMLButtonElement
      act(() => {
        fireEvent.click(toggleButton)
      })
      expect(container).toHaveTextContent('Test Body')
    })

    test('Should close one Accordion when another opens', () => {
      const { container, getByTestId } = render(
        <StyleProvider>
          <Accordion.Provider>
            <Accordion data-testid="A1">
              <Accordion.Header>Accordion 1</Accordion.Header>
              <Accordion.Body>Should show first and not second</Accordion.Body>
            </Accordion>
            <Accordion data-testid="A2">
              <Accordion.Header>Accordion 2</Accordion.Header>
              <Accordion.Body>Should show second and not first</Accordion.Body>
            </Accordion>
          </Accordion.Provider>
        </StyleProvider>
      )

      const a1Accordion = getByTestId('A1')
      const a1Button = a1Accordion.querySelector('button') as HTMLButtonElement
      const a2Button = getByTestId('A2').querySelector('button') as HTMLButtonElement
      act(() => {
        fireEvent.click(a1Button)
      })
      expect(container).toHaveTextContent('Should show first and not second')
      expect(container).not.toHaveTextContent('Should show second and not first')

      act(() => {
        fireEvent.click(a2Button)
      })
      act(() => {
        // @ts-ignore
        fireEvent.transitionEnd(a1Accordion.childNodes[1])
      })
      expect(container).toHaveTextContent('Should show second and not first')
      expect(container).not.toHaveTextContent('Should show first and not second')
    })

    test('Should allow two Accordions to be open at the same time', () => {
      const { container, getByTestId } = render(
        <StyleProvider>
          <Accordion.Provider maxOpen={2}>
            <Accordion data-testid="A1">
              <Accordion.Header>Accordion 1</Accordion.Header>
              <Accordion.Body>Should show A1</Accordion.Body>
            </Accordion>
            <Accordion data-testid="A2">
              <Accordion.Header>Accordion 2</Accordion.Header>
              <Accordion.Body>Should show A2</Accordion.Body>
            </Accordion>
          </Accordion.Provider>
        </StyleProvider>
      )

      const a1Button = getByTestId('A1').querySelector('button') as HTMLButtonElement
      const a2Button = getByTestId('A2').querySelector('button') as HTMLButtonElement
      act(() => {
        fireEvent.click(a1Button)
      })
      expect(container).toHaveTextContent('Should show A1')
      expect(container).not.toHaveTextContent('Should show A2')

      act(() => {
        fireEvent.click(a2Button)
      })
      expect(container).toHaveTextContent('Should show A1')
      expect(container).toHaveTextContent('Should show A2')
    })

    test('should allow the user to initialize accordions as open', () => {
      const { container } = render(
        <StyleProvider>
          <Accordion.Provider maxOpen={2}>
            <Accordion open>
              <Accordion.Header>Accordion 1</Accordion.Header>
              <Accordion.Body>Should show A1</Accordion.Body>
            </Accordion>
            <Accordion open>
              <Accordion.Header>Accordion 2</Accordion.Header>
              <Accordion.Body>Should show A2</Accordion.Body>
            </Accordion>
          </Accordion.Provider>
        </StyleProvider>
      )

      expect(container).toHaveTextContent('Should show A1')
      expect(container).toHaveTextContent('Should show A2')
    })
  })

  describe('Keyboard Interactions', () => {
    test('DOWN arrow should move focus to the next accordion', () => {
      const { getByTestId } = render(
        <StyleProvider>
          <Accordion.Provider maxOpen={2}>
            <Accordion data-testid="A1">
              <Accordion.Header>Accordion 1</Accordion.Header>
              <Accordion.Body>A1 Content</Accordion.Body>
            </Accordion>
            <Accordion data-testid="A2">
              <Accordion.Header>Accordion 2</Accordion.Header>
              <Accordion.Body>A2 Content</Accordion.Body>
            </Accordion>
          </Accordion.Provider>
        </StyleProvider>
      )

      const a1 = getByTestId('A1').querySelector('button') as HTMLButtonElement
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      expect(document.activeElement).toBe(getByTestId('A2').querySelector('button'))
    })

    test('UP arrow should move focus to the previous accordion', () => {
      const { getByTestId } = render(
        <StyleProvider>
          <Accordion.Provider maxOpen={2}>
            <Accordion data-testid="A1">
              <Accordion.Header>Accordion 1</Accordion.Header>
              <Accordion.Body>A1 Content</Accordion.Body>
            </Accordion>
            <Accordion data-testid="A2">
              <Accordion.Header>Accordion 2</Accordion.Header>
              <Accordion.Body>A2 Content</Accordion.Body>
            </Accordion>
          </Accordion.Provider>
        </StyleProvider>
      )

      const a2 = getByTestId('A2').querySelector('button') as HTMLButtonElement
      fireEvent.focus(a2)
      fireEvent.keyUp(a2, { keyCode: KeyCodes.UP, charCode: KeyCodes.UP })
      expect(document.activeElement).toBe(getByTestId('A1').querySelector('button'))
    })

    test('UP/DOWN arrows should loop on the accordions', () => {
      const { getByTestId } = render(
        <StyleProvider>
          <Accordion.Provider maxOpen={2}>
            <Accordion data-testid="A1">
              <Accordion.Header>Accordion 1</Accordion.Header>
              <Accordion.Body>A1 Content</Accordion.Body>
            </Accordion>
            <Accordion data-testid="A2">
              <Accordion.Header>Accordion 2</Accordion.Header>
              <Accordion.Body>A2 Content</Accordion.Body>
            </Accordion>
          </Accordion.Provider>
        </StyleProvider>
      )

      const a1 = getByTestId('A1').querySelector('button') as HTMLButtonElement
      const a2 = getByTestId('A2').querySelector('button') as HTMLButtonElement
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { keyCode: KeyCodes.UP, charCode: KeyCodes.UP })
      expect(document.activeElement).toBe(a2)
      fireEvent.keyUp(a2, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      expect(document.activeElement).toBe(a1)
    })

    test('SPACE should open/close the accordion', () => {
      const { getByTestId } = render(
        <StyleProvider>
          <Accordion data-testid="Accordion">
            <Accordion.Header>My Accordion</Accordion.Header>
            <Accordion.Body>My Accordion Content</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      const a = getByTestId('Accordion').querySelector('button') as HTMLButtonElement
      fireEvent.focus(a)
      fireEvent.keyUp(a, { keyCode: KeyCodes.SPACE, charCode: KeyCodes.SPACE })
      expect(a.getAttribute('aria-expanded')).toBe('true')
      fireEvent.keyUp(a, { keyCode: KeyCodes.SPACE, charCode: KeyCodes.SPACE })
      expect(a.getAttribute('aria-expanded')).toBe('false')
    })

    test('RETURN should open/close the accordion', () => {
      const { getByTestId } = render(
        <StyleProvider>
          <Accordion data-testid="Accordion">
            <Accordion.Header>My Accordion</Accordion.Header>
            <Accordion.Body>My Accordion Content</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      const a = getByTestId('Accordion').querySelector('button') as HTMLButtonElement
      fireEvent.focus(a)
      fireEvent.keyUp(a, { keyCode: KeyCodes.RETURN, charCode: KeyCodes.RETURN })
      expect(a.getAttribute('aria-expanded')).toBe('true')
      fireEvent.keyUp(a, { keyCode: KeyCodes.RETURN, charCode: KeyCodes.RETURN })
      expect(a.getAttribute('aria-expanded')).toBe('false')
    })

    test('HOME should focus on the first accordion', () => {
      const { getByTestId } = render(
        <StyleProvider>
          <Accordion.Provider maxOpen={2}>
            <Accordion data-testid="A1">
              <Accordion.Header>Accordion 1</Accordion.Header>
              <Accordion.Body>A1 Content</Accordion.Body>
            </Accordion>
            <Accordion data-testid="A2">
              <Accordion.Header>Accordion 2</Accordion.Header>
              <Accordion.Body>A2 Content</Accordion.Body>
            </Accordion>
          </Accordion.Provider>
        </StyleProvider>
      )

      const a1 = getByTestId('A1').querySelector('button') as HTMLButtonElement
      const a2 = getByTestId('A2').querySelector('button') as HTMLButtonElement
      fireEvent.focus(a2)
      fireEvent.keyUp(a2, { keyCode: KeyCodes.HOME, charCode: KeyCodes.HOME })
      expect(document.activeElement).toBe(a1)
    })

    test('END should focus on the last accordion', () => {
      const { getByTestId } = render(
        <StyleProvider>
          <Accordion.Provider maxOpen={2}>
            <Accordion data-testid="A1">
              <Accordion.Header>Accordion 1</Accordion.Header>
              <Accordion.Body>A1 Content</Accordion.Body>
            </Accordion>
            <Accordion data-testid="A2">
              <Accordion.Header>Accordion 2</Accordion.Header>
              <Accordion.Body>A2 Content</Accordion.Body>
            </Accordion>
          </Accordion.Provider>
        </StyleProvider>
      )

      const a1 = getByTestId('A1').querySelector('button') as HTMLButtonElement
      const a2 = getByTestId('A2').querySelector('button') as HTMLButtonElement
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { keyCode: KeyCodes.END, charCode: KeyCodes.END })
      expect(document.activeElement).toBe(a2)
    })
  })
})
