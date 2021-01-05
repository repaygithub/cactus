import { ActionsDelete, NavigationCircleDown, NavigationCircleUp } from '@repay/cactus-icons'
import { generateTheme } from '@repay/cactus-theme'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { ReactElement } from 'react'

import animationRender from '../../tests/helpers/animationRender'
import Flex from '../Flex/Flex'
import KeyCodes from '../helpers/keyCodes'
import IconButton from '../IconButton/IconButton'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Text from '../Text/Text'
import Accordion from './Accordion'

const openAccordion = async () => animationRender()

const closeAccordion = async (accordionLabel: string) => {
  await animationRender()
  fireEvent.transitionEnd(screen.getByLabelText(accordionLabel, { selector: '[role="region"]' }))
}

const getAccordionButton = (accordionLabel: string) =>
  screen.getByLabelText(accordionLabel, { selector: '[data-role="accordion-button"]' })

const ControlledAccordion: React.FC<{
  initOpenId?: string[]
  maxOpen?: number
  useDefaultOpen?: boolean
  changeHook?: (id: string) => void
}> = ({ changeHook, initOpenId = [], maxOpen, useDefaultOpen }) => {
  const [open, setOpen] = React.useState<string[]>(initOpenId)

  const toggleAccordion = (toggleId: string) => {
    changeHook?.(toggleId)
    setOpen((currentOpen) => {
      if (currentOpen.includes(toggleId)) {
        return currentOpen.filter((id) => id !== toggleId)
      }
      return [...currentOpen, toggleId]
    })
  }

  return (
    <Accordion.Provider openId={open} maxOpen={maxOpen} onChange={toggleAccordion}>
      <Accordion id="A1">
        <Accordion.Header>
          <Text as="h3">Accordion 1</Text>
        </Accordion.Header>
        <Accordion.Body>Should show A1</Accordion.Body>
      </Accordion>
      <Accordion defaultOpen={useDefaultOpen} id="A2">
        <Accordion.Header>
          <Text as="h3">Accordion 2</Text>
        </Accordion.Header>
        <Accordion.Body>Should show A2</Accordion.Body>
      </Accordion>
    </Accordion.Provider>
  )
}

const UncontrolledAccordion = () => (
  <Accordion.Provider maxOpen={2}>
    <Accordion>
      <Accordion.Header>
        <Text as="h3">Accordion 1</Text>
      </Accordion.Header>
      <Accordion.Body>A1 Content</Accordion.Body>
    </Accordion>
    <Accordion>
      <Accordion.Header>
        <Text as="h3">Accordion 2</Text>
      </Accordion.Header>
      <Accordion.Body>A2 Content</Accordion.Body>
    </Accordion>
  </Accordion.Provider>
)

describe('component: Accordion', (): void => {
  describe('Component', (): void => {
    test('Should render Accordion', (): void => {
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

    test('Should render outline accordion', (): void => {
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

    test('Should open Accordion when button is clicked', async (): Promise<void> => {
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

      const toggleButton = getAccordionButton('Test Header')
      userEvent.click(toggleButton)
      await openAccordion()
      expect(container).toHaveTextContent('Test Body')
    })

    test('should allow the user to initialize accordions as open', (): void => {
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

    test('should support nested accordions', async (): Promise<void> => {
      const { container } = render(
        <StyleProvider>
          <Accordion>
            <Accordion.Header>
              <Text as="h3">Parent</Text>
            </Accordion.Header>
            <Accordion.Body>
              <Accordion>
                <Accordion.Header>
                  <Text as="h4">Child</Text>
                </Accordion.Header>
                <Accordion.Body>Child Content</Accordion.Body>
              </Accordion>
            </Accordion.Body>
          </Accordion>
        </StyleProvider>
      )

      const parentButton = getAccordionButton('Parent')
      userEvent.click(parentButton)
      await openAccordion()
      expect(container).toHaveTextContent('Child')

      const childButton = getAccordionButton('Child')
      userEvent.click(childButton)
      await openAccordion()
      expect(container).toHaveTextContent('Child Content')
    })
  })

  describe('Provider', (): void => {
    test('Should manage Accordion state', async (): Promise<void> => {
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

      const toggleButton = getAccordionButton('Test Header')
      userEvent.click(toggleButton)
      await openAccordion()
      expect(container).toHaveTextContent('Test Body')
    })

    test('Should close one Accordion when another opens', async (): Promise<void> => {
      const onChange = jest.fn()
      const { container } = render(
        <StyleProvider>
          <Accordion.Provider onChange={onChange}>
            <Accordion id="A1">
              <Accordion.Header>
                <Text as="h3">Accordion 1</Text>
              </Accordion.Header>
              <Accordion.Body>Should show first and not second</Accordion.Body>
            </Accordion>
            <Accordion id="A2">
              <Accordion.Header>
                <Text as="h3">Accordion 2</Text>
              </Accordion.Header>
              <Accordion.Body>Should show second and not first</Accordion.Body>
            </Accordion>
          </Accordion.Provider>
        </StyleProvider>
      )

      const a1Button = getAccordionButton('Accordion 1')
      const a2Button = getAccordionButton('Accordion 2')
      userEvent.click(a1Button)
      await openAccordion()
      expect(container).toHaveTextContent('Should show first and not second')
      expect(container).not.toHaveTextContent('Should show second and not first')
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenLastCalledWith('A1')

      userEvent.click(a2Button)
      await openAccordion()
      await closeAccordion('Accordion 1')
      expect(container).toHaveTextContent('Should show second and not first')
      expect(container).not.toHaveTextContent('Should show first and not second')
      expect(onChange).toHaveBeenCalledTimes(3)
      expect(onChange).toHaveBeenNthCalledWith(2, 'A2')
      expect(onChange).toHaveBeenNthCalledWith(3, 'A1')
    })

    test('Should allow two Accordions to be open at the same time', async (): Promise<void> => {
      const onChange = jest.fn()
      const { container } = render(
        <StyleProvider>
          <Accordion.Provider maxOpen={2} onChange={onChange}>
            <Accordion id="A1">
              <Accordion.Header>
                <Text as="h3">Accordion 1</Text>
              </Accordion.Header>
              <Accordion.Body>Should show A1</Accordion.Body>
            </Accordion>
            <Accordion id="A2">
              <Accordion.Header>
                <Text as="h3">Accordion 2</Text>
              </Accordion.Header>
              <Accordion.Body>Should show A2</Accordion.Body>
            </Accordion>
          </Accordion.Provider>
        </StyleProvider>
      )

      const a1Button = getAccordionButton('Accordion 1')
      const a2Button = getAccordionButton('Accordion 2')
      userEvent.click(a1Button)
      await openAccordion()
      expect(container).toHaveTextContent('Should show A1')
      expect(container).not.toHaveTextContent('Should show A2')
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenLastCalledWith('A1')

      userEvent.click(a2Button)
      await openAccordion()
      expect(container).toHaveTextContent('Should show A1')
      expect(container).toHaveTextContent('Should show A2')
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(onChange).toHaveBeenLastCalledWith('A2')
    })

    test('should allow the user to initialize accordions as open', async () => {
      const onChange = jest.fn()
      const { container } = render(
        <StyleProvider>
          <Accordion.Provider maxOpen={2} onChange={onChange}>
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

      await openAccordion()
      expect(container).toHaveTextContent('Should show A1')
      expect(container).toHaveTextContent('Should show A2')
      expect(onChange).not.toHaveBeenCalled()
    })

    test('should allow the user to control which accordions are open', async () => {
      const changeHook = jest.fn()
      const { container } = render(
        <StyleProvider>
          <ControlledAccordion initOpenId={['A2']} changeHook={changeHook} />
        </StyleProvider>
      )

      expect(container).not.toHaveTextContent('Should show A1')
      expect(container).toHaveTextContent('Should show A2')
      expect(changeHook).not.toHaveBeenCalled()

      userEvent.click(getAccordionButton('Accordion 1'))
      await openAccordion()

      expect(container).toHaveTextContent('Should show A1')
      expect(container).toHaveTextContent('Should show A2')
      expect(changeHook).toHaveBeenCalledTimes(1)
      expect(changeHook).toHaveBeenLastCalledWith('A1')

      userEvent.click(getAccordionButton('Accordion 2'))
      await closeAccordion('Accordion 2')

      expect(container).toHaveTextContent('Should show A1')
      expect(container).not.toHaveTextContent('Should show A2')
      expect(changeHook).toHaveBeenCalledTimes(2)
      expect(changeHook).toHaveBeenLastCalledWith('A2')
    })

    test('should ignore any non-existent IDs', (): void => {
      const { container } = render(
        <StyleProvider>
          <ControlledAccordion initOpenId={['foo']} />
        </StyleProvider>
      )

      expect(container).not.toHaveTextContent('Should show A1')
      expect(container).not.toHaveTextContent('Should show A2')
    })

    test('should ignore maxOpen if the user controls the open accordions', async () => {
      const error = console.error
      console.error = jest.fn()

      const { container } = render(
        <StyleProvider>
          <ControlledAccordion initOpenId={['A1']} maxOpen={1} />
        </StyleProvider>
      )

      expect(container).toHaveTextContent('Should show A1')
      expect(container).not.toHaveTextContent('Should show A2')

      userEvent.click(getAccordionButton('Accordion 2'))
      await openAccordion()

      expect(container).toHaveTextContent('Should show A1')
      expect(container).toHaveTextContent('Should show A2')

      console.error = error
    })

    test('should ignore defaultOpen props on children if the user controls open accordions', (): void => {
      const warn = console.warn
      console.warn = jest.fn()

      const { container } = render(
        <StyleProvider>
          <ControlledAccordion initOpenId={['A1']} useDefaultOpen={true} />
        </StyleProvider>
      )

      expect(container).toHaveTextContent('Should show A1')
      expect(container).not.toHaveTextContent('Should show A2')

      console.warn = warn
    })

    test('should properly handle Accordion deletion', async () => {
      const TestAccordion = () => {
        const [accordionHeaders, setAccordionHeaders] = React.useState([
          'First Accordion',
          'Second Accordion',
          'Third Accordion',
          'Fourth Accordion',
          'Fifth Accordion',
        ])

        const handleDelete = (index: number): void => {
          const headersCopy = [...accordionHeaders]
          headersCopy.splice(index, 1)
          setAccordionHeaders(headersCopy)
        }

        return (
          <Accordion.Provider maxOpen={1}>
            {accordionHeaders.map(
              (header, index): ReactElement => (
                <Accordion variant="outline" key={header}>
                  <Accordion.Header
                    render={({ isOpen, headerId }): ReactElement => {
                      return (
                        <Flex alignItems="center" width="100%">
                          <Text as="h3" id={headerId}>
                            {header}
                          </Text>
                          {isOpen && (
                            <IconButton
                              iconSize="medium"
                              variant="danger"
                              ml="auto"
                              mr={4}
                              label={`Delete ${header}`}
                              onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
                                handleDelete(index)
                                e.stopPropagation()
                              }}
                            >
                              <ActionsDelete aria-hidden="true" />
                            </IconButton>
                          )}
                        </Flex>
                      )
                    }}
                  />
                  <Accordion.Body>This is the body of the {header}</Accordion.Body>
                </Accordion>
              )
            )}
          </Accordion.Provider>
        )
      }

      const { getByLabelText, getByText, queryByText } = render(
        <StyleProvider>
          <TestAccordion />
        </StyleProvider>
      )

      const a1Button = getAccordionButton('First Accordion')
      userEvent.click(a1Button)
      await openAccordion()
      expect(getByText('This is the body of the First Accordion')).toBeVisible()

      const a1DeleteButton = getByLabelText('Delete First Accordion')
      userEvent.click(a1DeleteButton)

      const a2Button = getAccordionButton('Second Accordion')
      userEvent.click(a2Button)
      await openAccordion()
      expect(getByText('This is the body of the Second Accordion')).toBeVisible()

      const a2DeleteButton = getByLabelText('Delete Second Accordion')
      userEvent.click(a2DeleteButton)

      expect(queryByText('First Accordion')).toBeNull()
      expect(queryByText('Second Accordion')).toBeNull()

      expect(getByText('Third Accordion')).toBeVisible()
      expect(queryByText('This is the body of the Third Accordion')).toBeNull()

      expect(getByText('Fourth Accordion')).toBeVisible()
      expect(queryByText('This is the body of the Fourth Accordion')).toBeNull()

      expect(getByText('Fifth Accordion')).toBeVisible()
      expect(queryByText('This is the body of the Fifth Accordion')).toBeNull()
    })
  })

  describe('Keyboard Interactions - Controlled', (): void => {
    test('DOWN arrow should move focus to the next accordion', (): void => {
      render(
        <StyleProvider>
          <ControlledAccordion />
        </StyleProvider>
      )

      const a1 = getAccordionButton('Accordion 1')
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      expect(document.activeElement).toBe(getAccordionButton('Accordion 2'))
    })

    test('UP arrow should move focus to the previous accordion', (): void => {
      render(
        <StyleProvider>
          <ControlledAccordion />
        </StyleProvider>
      )

      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a2)
      fireEvent.keyUp(a2, { keyCode: KeyCodes.UP, charCode: KeyCodes.UP })
      expect(document.activeElement).toBe(getAccordionButton('Accordion 1'))
    })

    test('UP/DOWN arrows should loop on the accordions', (): void => {
      render(
        <StyleProvider>
          <ControlledAccordion />
        </StyleProvider>
      )

      const a1 = getAccordionButton('Accordion 1')
      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { keyCode: KeyCodes.UP, charCode: KeyCodes.UP })
      expect(document.activeElement).toBe(a2)
      fireEvent.keyUp(a2, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      expect(document.activeElement).toBe(a1)
    })

    test('SPACE should open/close the accordion', (): void => {
      render(
        <StyleProvider>
          <ControlledAccordion />
        </StyleProvider>
      )

      const a = getAccordionButton('Accordion 1')
      fireEvent.focus(a)
      fireEvent.keyUp(a, { keyCode: KeyCodes.SPACE, charCode: KeyCodes.SPACE })
      expect(a.getAttribute('aria-expanded')).toBe('true')
      fireEvent.keyUp(a, { keyCode: KeyCodes.SPACE, charCode: KeyCodes.SPACE })
      expect(a.getAttribute('aria-expanded')).toBe('false')
    })

    test('RETURN should open/close the accordion', (): void => {
      render(
        <StyleProvider>
          <ControlledAccordion />
        </StyleProvider>
      )

      const a = getAccordionButton('Accordion 1')
      fireEvent.focus(a)
      fireEvent.keyUp(a, { keyCode: KeyCodes.RETURN, charCode: KeyCodes.RETURN })
      expect(a.getAttribute('aria-expanded')).toBe('true')
      fireEvent.keyUp(a, { keyCode: KeyCodes.RETURN, charCode: KeyCodes.RETURN })
      expect(a.getAttribute('aria-expanded')).toBe('false')
    })

    test('HOME should focus on the first accordion', (): void => {
      render(
        <StyleProvider>
          <ControlledAccordion />
        </StyleProvider>
      )

      const a1 = getAccordionButton('Accordion 1')
      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a2)
      fireEvent.keyUp(a2, { keyCode: KeyCodes.HOME, charCode: KeyCodes.HOME })
      expect(document.activeElement).toBe(a1)
    })

    test('END should focus on the last accordion', (): void => {
      render(
        <StyleProvider>
          <ControlledAccordion />
        </StyleProvider>
      )

      const a1 = getAccordionButton('Accordion 1')
      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { keyCode: KeyCodes.END, charCode: KeyCodes.END })
      expect(document.activeElement).toBe(a2)
    })
  })

  describe('Keyboard Interactions - Uncontrolled', (): void => {
    test('DOWN arrow should move focus to the next accordion', (): void => {
      render(
        <StyleProvider>
          <UncontrolledAccordion />
        </StyleProvider>
      )

      const a1 = getAccordionButton('Accordion 1')
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      expect(document.activeElement).toBe(getAccordionButton('Accordion 2'))
    })

    test('UP arrow should move focus to the previous accordion', (): void => {
      render(
        <StyleProvider>
          <UncontrolledAccordion />
        </StyleProvider>
      )

      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a2)
      fireEvent.keyUp(a2, { keyCode: KeyCodes.UP, charCode: KeyCodes.UP })
      expect(document.activeElement).toBe(getAccordionButton('Accordion 1'))
    })

    test('UP/DOWN arrows should loop on the accordions', (): void => {
      render(
        <StyleProvider>
          <UncontrolledAccordion />
        </StyleProvider>
      )

      const a1 = getAccordionButton('Accordion 1')
      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { keyCode: KeyCodes.UP, charCode: KeyCodes.UP })
      expect(document.activeElement).toBe(a2)
      fireEvent.keyUp(a2, { keyCode: KeyCodes.DOWN, charCode: KeyCodes.DOWN })
      expect(document.activeElement).toBe(a1)
    })

    test('SPACE should open/close the accordion', (): void => {
      render(
        <StyleProvider>
          <UncontrolledAccordion />
        </StyleProvider>
      )

      const a = getAccordionButton('Accordion 1')
      fireEvent.focus(a)
      fireEvent.keyUp(a, { keyCode: KeyCodes.SPACE, charCode: KeyCodes.SPACE })
      expect(a.getAttribute('aria-expanded')).toBe('true')
      fireEvent.keyUp(a, { keyCode: KeyCodes.SPACE, charCode: KeyCodes.SPACE })
      expect(a.getAttribute('aria-expanded')).toBe('false')
    })

    test('RETURN should open/close the accordion', (): void => {
      render(
        <StyleProvider>
          <UncontrolledAccordion />
        </StyleProvider>
      )

      const a = getAccordionButton('Accordion 1')
      fireEvent.focus(a)
      fireEvent.keyUp(a, { keyCode: KeyCodes.RETURN, charCode: KeyCodes.RETURN })
      expect(a.getAttribute('aria-expanded')).toBe('true')
      fireEvent.keyUp(a, { keyCode: KeyCodes.RETURN, charCode: KeyCodes.RETURN })
      expect(a.getAttribute('aria-expanded')).toBe('false')
    })

    test('HOME should focus on the first accordion', (): void => {
      render(
        <StyleProvider>
          <UncontrolledAccordion />
        </StyleProvider>
      )

      const a1 = getAccordionButton('Accordion 1')
      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a2)
      fireEvent.keyUp(a2, { keyCode: KeyCodes.HOME, charCode: KeyCodes.HOME })
      expect(document.activeElement).toBe(a1)
    })

    test('END should focus on the last accordion', (): void => {
      render(
        <StyleProvider>
          <UncontrolledAccordion />
        </StyleProvider>
      )

      const a1 = getAccordionButton('Accordion 1')
      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { keyCode: KeyCodes.END, charCode: KeyCodes.END })
      expect(document.activeElement).toBe(a2)
    })
  })

  describe('Render Prop', (): void => {
    let suppliedHeaderId: string
    const noop = (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.stopPropagation()
    }
    test('should allow developer to customize content in header', async (): Promise<void> => {
      const { getByTestId, getByText } = render(
        <StyleProvider>
          <Accordion data-testid="accordion" variant="outline">
            <Accordion.Header
              render={({ isOpen, headerId }): React.ReactElement => {
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

      const accordionButton = accordion.querySelector(
        'button[data-role="accordion-button"]'
      ) as HTMLButtonElement
      userEvent.click(accordionButton)
      await openAccordion()

      expect(accordion.querySelector('button[aria-label=Delete]')).toBeInTheDocument()
    })

    test('clicking icon buttons inside header should not trigger opening/closing', async (): Promise<
      void
    > => {
      const noop = jest.fn()
      const { getByTestId, container } = render(
        <StyleProvider>
          <Accordion>
            <Accordion.Header
              render={(): React.ReactElement => (
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
      userEvent.click(deleteButton)
      await openAccordion()
      expect(noop).toHaveBeenCalled()
      expect(container).not.toHaveTextContent('Should not show')
    })
  })

  describe('with theme customization', (): void => {
    test('simple accordion should have 2px border', (): void => {
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

    test('outline accordion should not have box shadows when open', (): void => {
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

    test('outline accordion should have 2px border', (): void => {
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

    test('outline accordion should have 4px border-radius', (): void => {
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

    test('outline accordion should have 1px border-radius', (): void => {
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
