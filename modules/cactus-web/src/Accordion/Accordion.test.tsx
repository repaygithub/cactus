import * as React from 'react'

import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { ActionsDelete, NavigationCircleDown, NavigationCircleUp } from '@repay/cactus-icons'
import { generateTheme } from '@repay/cactus-theme'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Accordion from './Accordion'
import animationRender from '../../tests/helpers/animationRender'
import Flex from '../Flex/Flex'
import IconButton from '../IconButton/IconButton'
import KeyCodes from '../helpers/keyCodes'
import Text from '../Text/Text'

afterEach(() => {
  cleanup()
})

describe('component: Accordion', () => {
  describe('Component', () => {
    test('Should render Accordion', () => {
      const { container } = render(
        <StyleProvider>
          <Accordion id="accordion">
            <Accordion.Header>
              <Text as="h3">Test Header</Text>
            </Accordion.Header>
            <Accordion.Body>Test Body</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      expect(container).toHaveTextContent('Test Header')
      expect(container).not.toHaveTextContent('Test Body')
      expect(container).toMatchSnapshot()
    })

    test('Should render outline accordion', () => {
      const { container } = render(
        <StyleProvider>
          <Accordion id="accordion" variant="outline">
            <Accordion.Header>
              <Text as="h3">Test Header</Text>
            </Accordion.Header>
            <Accordion.Body>Test Body</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      expect(container).toHaveTextContent('Test Header')
      expect(container).not.toHaveTextContent('Test Body')
      expect(container).toMatchSnapshot()
    })

    test('Should open Accordion when button is clicked', async () => {
      const { container } = render(
        <StyleProvider>
          <Accordion>
            <Accordion.Header>
              <Text as="h3">Test Header</Text>
            </Accordion.Header>
            <Accordion.Body>Test Body</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      const toggleButton = container.querySelector('button') as HTMLButtonElement
      await act(async () => {
        fireEvent.click(toggleButton)
        await animationRender()
      })
      expect(container).toHaveTextContent('Test Body')
    })

    test('should allow the user to initialize accordions as open', () => {
      const { container } = render(
        <StyleProvider>
          <Accordion defaultOpen>
            <Accordion.Header>
              <Text as="h3">Test Header</Text>
            </Accordion.Header>
            <Accordion.Body>Test Body</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      expect(container).toHaveTextContent('Test Body')
    })

    test('should support nested accordions', async () => {
      const { container, getByTestId } = render(
        <StyleProvider>
          <Accordion data-testid="parent">
            <Accordion.Header>
              <Text as="h3">Parent</Text>
            </Accordion.Header>
            <Accordion.Body>
              <Accordion data-testid="child">
                <Accordion.Header>
                  <Text as="h4">Child</Text>
                </Accordion.Header>
                <Accordion.Body>Child Content</Accordion.Body>
              </Accordion>
            </Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      const parentAccordion = getByTestId('parent')
      const parentButton = parentAccordion.querySelector('button') as HTMLElement
      await act(async () => {
        fireEvent.click(parentButton)
        await animationRender()
      })
      expect(container).toHaveTextContent('Child')

      const childAccordion = getByTestId('child')
      const childButton = childAccordion.querySelector('button') as HTMLElement
      await act(async () => {
        fireEvent.click(childButton)
        await animationRender()
      })
      expect(container).toHaveTextContent('Child Content')
    })
  })

  describe('Provider', () => {
    test('Should manage Accordion state', async () => {
      const { container } = render(
        <StyleProvider>
          <Accordion.Provider>
            <Accordion>
              <Accordion.Header>
                <Text as="h3">Test Header</Text>
              </Accordion.Header>
              <Accordion.Body>Test Body</Accordion.Body>
            </Accordion>
          </Accordion.Provider>
        </StyleProvider>
      )

      const toggleButton = container.querySelector('button') as HTMLButtonElement
      await act(async () => {
        fireEvent.click(toggleButton)
        await animationRender()
      })
      expect(container).toHaveTextContent('Test Body')
    })

    test('Should close one Accordion when another opens', async () => {
      const { container, getByTestId } = render(
        <StyleProvider>
          <Accordion.Provider>
            <Accordion data-testid="A1">
              <Accordion.Header>
                <Text as="h3">Accordion 1</Text>
              </Accordion.Header>
              <Accordion.Body>Should show first and not second</Accordion.Body>
            </Accordion>
            <Accordion data-testid="A2">
              <Accordion.Header>
                <Text as="h3">Accordion 2</Text>
              </Accordion.Header>
              <Accordion.Body>Should show second and not first</Accordion.Body>
            </Accordion>
          </Accordion.Provider>
        </StyleProvider>
      )

      const a1Accordion = getByTestId('A1')
      const a1Button = a1Accordion.querySelector('button') as HTMLButtonElement
      const a2Button = getByTestId('A2').querySelector('button') as HTMLButtonElement
      await act(async () => {
        fireEvent.click(a1Button)
        await animationRender()
      })
      expect(container).toHaveTextContent('Should show first and not second')
      expect(container).not.toHaveTextContent('Should show second and not first')

      await act(async () => {
        fireEvent.click(a2Button)
        await animationRender()
        // @ts-ignore
        fireEvent.transitionEnd(a1Accordion.childNodes[1])
        await animationRender()
      })
      expect(container).toHaveTextContent('Should show second and not first')
      expect(container).not.toHaveTextContent('Should show first and not second')
    })

    test('Should allow two Accordions to be open at the same time', async () => {
      const { container, getByTestId } = render(
        <StyleProvider>
          <Accordion.Provider maxOpen={2}>
            <Accordion data-testid="A1">
              <Accordion.Header>
                <Text as="h3">Accordion 1</Text>
              </Accordion.Header>
              <Accordion.Body>Should show A1</Accordion.Body>
            </Accordion>
            <Accordion data-testid="A2">
              <Accordion.Header>
                <Text as="h3">Accordion 2</Text>
              </Accordion.Header>
              <Accordion.Body>Should show A2</Accordion.Body>
            </Accordion>
          </Accordion.Provider>
        </StyleProvider>
      )

      const a1Button = getByTestId('A1').querySelector('button') as HTMLButtonElement
      const a2Button = getByTestId('A2').querySelector('button') as HTMLButtonElement
      await act(async () => {
        fireEvent.click(a1Button)
        await animationRender()
      })
      expect(container).toHaveTextContent('Should show A1')
      expect(container).not.toHaveTextContent('Should show A2')

      await act(async () => {
        fireEvent.click(a2Button)
        await animationRender()
      })
      expect(container).toHaveTextContent('Should show A1')
      expect(container).toHaveTextContent('Should show A2')
    })

    test('should allow the user to initialize accordions as open', () => {
      const { container } = render(
        <StyleProvider>
          <Accordion.Provider maxOpen={2}>
            <Accordion defaultOpen>
              <Accordion.Header>
                <Text as="h3">Accordion 1</Text>
              </Accordion.Header>
              <Accordion.Body>Should show A1</Accordion.Body>
            </Accordion>
            <Accordion defaultOpen>
              <Accordion.Header>
                <Text as="h3">Accordion 2</Text>
              </Accordion.Header>
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
              <Accordion.Header>
                <Text as="h3">Accordion 1</Text>
              </Accordion.Header>
              <Accordion.Body>A1 Content</Accordion.Body>
            </Accordion>
            <Accordion data-testid="A2">
              <Accordion.Header>
                <Text as="h3">Accordion 2</Text>
              </Accordion.Header>
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
              <Accordion.Header>
                <Text as="h3">Accordion 1</Text>
              </Accordion.Header>
              <Accordion.Body>A1 Content</Accordion.Body>
            </Accordion>
            <Accordion data-testid="A2">
              <Accordion.Header>
                <Text as="h3">Accordion 2</Text>
              </Accordion.Header>
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
              <Accordion.Header>
                <Text as="h3">Accordion 1</Text>
              </Accordion.Header>
              <Accordion.Body>A1 Content</Accordion.Body>
            </Accordion>
            <Accordion data-testid="A2">
              <Accordion.Header>
                <Text as="h3">Accordion 2</Text>
              </Accordion.Header>
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
            <Accordion.Header>
              <Text as="h3">My Accordion</Text>
            </Accordion.Header>
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
              <Accordion.Header>
                <Text as="h3">Accordion 1</Text>
              </Accordion.Header>
              <Accordion.Body>A1 Content</Accordion.Body>
            </Accordion>
            <Accordion data-testid="A2">
              <Accordion.Header>
                <Text as="h3">Accordion 2</Text>
              </Accordion.Header>
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
              <Accordion.Header>
                <Text as="h3">Accordion 1</Text>
              </Accordion.Header>
              <Accordion.Body>A1 Content</Accordion.Body>
            </Accordion>
            <Accordion data-testid="A2">
              <Accordion.Header>
                <Text as="h3">Accordion 2</Text>
              </Accordion.Header>
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

  describe('Render Prop', () => {
    let suppliedHeaderId: string
    const noop = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
    }
    test('should allow developer to customize content in header', async () => {
      const { getByTestId, getByText } = render(
        <StyleProvider>
          <Accordion data-testid="accordion" variant="outline">
            <Accordion.Header
              render={({ isOpen, headerId }) => {
                suppliedHeaderId = headerId
                return (
                  <Flex alignItems="center" width="100%">
                    <Text as="h3" id={headerId}>
                      Test Header
                    </Text>
                    {isOpen && (
                      <IconButton
                        iconSize="medium"
                        variant="danger"
                        ml="auto"
                        mr={4}
                        label="Delete"
                        onClick={noop}
                      >
                        <ActionsDelete aria-hidden="true" />
                      </IconButton>
                    )}
                    <Flex
                      alignItems="center"
                      ml={isOpen ? 0 : 'auto'}
                      pl={4}
                      borderLeft="1px solid"
                      borderLeftColor="lightContrast"
                    >
                      <IconButton iconSize="medium" mr={1} label="Move Down" onClick={noop}>
                        <NavigationCircleDown aria-hidden="true" />
                      </IconButton>
                      <IconButton iconSize="medium" label="Move Up" onClick={noop}>
                        <NavigationCircleUp aria-hidden="true" />
                      </IconButton>
                    </Flex>
                  </Flex>
                )
              }}
            />
            <Accordion.Body>Test Body</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      expect(getByText('Test Header').getAttribute('id')).toEqual(suppliedHeaderId)
      const accordion = getByTestId('accordion')
      expect(accordion.querySelector('button[aria-label="Move Down"]')).toBeInTheDocument()
      expect(accordion.querySelector('button[aria-label="Move Up"]')).toBeInTheDocument()
      expect(accordion.querySelector('button[aria-label=Delete]')).not.toBeInTheDocument()

      await act(async () => {
        fireEvent.click(
          accordion.querySelector('button[data-role="accordion-button"]') as HTMLButtonElement
        )
        await animationRender()
      })

      expect(accordion.querySelector('button[aria-label=Delete]')).toBeInTheDocument()
    })

    test('clicking icon buttons inside header should not trigger opening/closing', async () => {
      const noop = jest.fn()
      const { getByTestId, container } = render(
        <StyleProvider>
          <Accordion>
            <Accordion.Header
              render={() => (
                <Flex alignItems="center" width="100%">
                  <Text as="h3">Test Header</Text>
                  <IconButton
                    iconSize="medium"
                    variant="danger"
                    ml="auto"
                    label="Delete"
                    onClick={noop}
                    data-testid="delete"
                  >
                    <ActionsDelete aria-hidden="true" />
                  </IconButton>
                </Flex>
              )}
            />
            <Accordion.Body>test</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      const deleteButton = getByTestId('delete')
      await act(async () => {
        fireEvent.click(deleteButton)
        await animationRender()
      })
      expect(noop).toHaveBeenCalled()
      expect(container).not.toHaveTextContent('Should not show')
    })
  })

  describe('with theme customization', () => {
    test('simple accordion should have 2px border', () => {
      const theme = generateTheme({ primaryHue: 200, border: 'thick' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <Accordion id="accordion">
            <Accordion.Header>
              <Text as="h3">Test Header</Text>
            </Accordion.Header>
            <Accordion.Body>Test Body</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('outline accordion should not have box shadows when open', () => {
      const theme = generateTheme({ primaryHue: 200, boxShadows: false })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <Accordion id="accordion" variant="outline">
            <Accordion.Header>
              <Text as="h3">Test Header</Text>
            </Accordion.Header>
            <Accordion.Body>Test Body</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('outline accordion should have 2px border', () => {
      const theme = generateTheme({ primaryHue: 200, border: 'thick' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <Accordion id="accordion" variant="outline">
            <Accordion.Header>
              <Text as="h3">Test Header</Text>
            </Accordion.Header>
            <Accordion.Body>Test Body</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('outline accordion should have 4px border-radius', () => {
      const theme = generateTheme({ primaryHue: 200, shape: 'intermediate' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <Accordion id="accordion" variant="outline">
            <Accordion.Header>
              <Text as="h3">Test Header</Text>
            </Accordion.Header>
            <Accordion.Body>Test Body</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('outline accordion should have 1px border-radius', () => {
      const theme = generateTheme({ primaryHue: 200, shape: 'square' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <Accordion id="accordion" variant="outline">
            <Accordion.Header>
              <Text as="h3">Test Header</Text>
            </Accordion.Header>
            <Accordion.Body>Test Body</Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
