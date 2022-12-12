import { ActionsDelete, NavigationCircleDown, NavigationCircleUp } from '@repay/cactus-icons'
import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { ReactElement } from 'react'

import animationRender from '../../tests/helpers/animationRender'
import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Flex from '../Flex/Flex'
import KeyCodes from '../helpers/keyCodes'
import IconButton from '../IconButton/IconButton'
import Text from '../Text/Text'
import Accordion from './Accordion'

const openAccordion = async () => animationRender()

const closeAccordion = async (accordionLabel: string) =>
  waitForElementToBeRemoved(screen.getByLabelText(accordionLabel, { selector: '[role="region"]' }))

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

describe('component: Accordion', () => {
  describe('Component', () => {
    test('Should render Accordion', () => {
      const { container } = renderWithTheme(
        <Accordion id="accordion">
          <Accordion.Header>
            <Text as="h3">Test Header</Text>
          </Accordion.Header>
          <Accordion.Body>Test Body</Accordion.Body>
        </Accordion>
      )

      expect(container).toHaveTextContent('Test Header')
      expect(container).not.toHaveTextContent('Test Body')
    })

    test('Should render outline accordion', () => {
      const { container } = renderWithTheme(
        <Accordion id="accordion" variant="outline">
          <Accordion.Header>
            <Text as="h3">Test Header</Text>
          </Accordion.Header>
          <Accordion.Body>Test Body</Accordion.Body>
        </Accordion>
      )

      expect(container).toHaveTextContent('Test Header')
      expect(container).not.toHaveTextContent('Test Body')
    })

    test('Should open Accordion when button is clicked', async () => {
      const { container } = renderWithTheme(
        <Accordion>
          <Accordion.Header>
            <Text as="h3">Test Header</Text>
          </Accordion.Header>
          <Accordion.Body>Test Body</Accordion.Body>
        </Accordion>
      )

      const toggleButton = getAccordionButton('Test Header')
      userEvent.click(toggleButton)
      await openAccordion()
      expect(container).toHaveTextContent('Test Body')
    })

    test('Should allow the user to initialize accordions as open', () => {
      const { container } = renderWithTheme(
        <Accordion defaultOpen>
          <Accordion.Header>
            <Text as="h3">Test Header</Text>
          </Accordion.Header>
          <Accordion.Body>Test Body</Accordion.Body>
        </Accordion>
      )

      expect(container).toHaveTextContent('Test Body')
    })

    test('Should support nested accordions', async () => {
      const { container } = renderWithTheme(
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

  describe('Provider', () => {
    test('Should manage Accordion state', async () => {
      const { container } = renderWithTheme(
        <Accordion.Provider>
          <Accordion>
            <Accordion.Header>
              <Text as="h3">Test Header</Text>
            </Accordion.Header>
            <Accordion.Body>Test Body</Accordion.Body>
          </Accordion>
        </Accordion.Provider>
      )

      const toggleButton = getAccordionButton('Test Header')
      userEvent.click(toggleButton)
      await openAccordion()
      expect(container).toHaveTextContent('Test Body')
    })

    test('Should close one Accordion when another opens', async () => {
      const onChange = jest.fn()
      const { container } = renderWithTheme(
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

    test('Should allow two Accordions to be open at the same time', async () => {
      const onChange = jest.fn()
      const { container } = renderWithTheme(
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

    test('Should allow the user to initialize accordions as open', async () => {
      const onChange = jest.fn()
      const { container } = renderWithTheme(
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
      )

      await openAccordion()
      expect(container).toHaveTextContent('Should show A1')
      expect(container).toHaveTextContent('Should show A2')
      expect(onChange).not.toHaveBeenCalled()
    })

    test('Should allow the user to control which accordions are open', async () => {
      const changeHook = jest.fn()
      const { container } = renderWithTheme(
        <ControlledAccordion initOpenId={['A2']} changeHook={changeHook} />
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

    test('Should ignore any non-existent IDs', () => {
      const { container } = renderWithTheme(<ControlledAccordion initOpenId={['foo']} />)

      expect(container).not.toHaveTextContent('Should show A1')
      expect(container).not.toHaveTextContent('Should show A2')
    })

    test('Should ignore maxOpen if the user controls the open accordions', async () => {
      const error = console.error
      console.error = jest.fn()

      const { container } = renderWithTheme(<ControlledAccordion initOpenId={['A1']} maxOpen={1} />)

      expect(container).toHaveTextContent('Should show A1')
      expect(container).not.toHaveTextContent('Should show A2')

      userEvent.click(getAccordionButton('Accordion 2'))
      await openAccordion()

      expect(container).toHaveTextContent('Should show A1')
      expect(container).toHaveTextContent('Should show A2')

      console.error = error
    })

    test('Should ignore defaultOpen props on children if the user controls open accordions', () => {
      const warn = console.warn
      console.warn = jest.fn()

      const { container } = renderWithTheme(
        <ControlledAccordion initOpenId={['A1']} useDefaultOpen={true} />
      )

      expect(container).toHaveTextContent('Should show A1')
      expect(container).not.toHaveTextContent('Should show A2')

      console.warn = warn
    })

    test('Should properly handle Accordion deletion', async () => {
      const TestAccordion = () => {
        const [accordionHeaders, setAccordionHeaders] = React.useState([
          'First Accordion',
          'Second Accordion',
          'Third Accordion',
          'Fourth Accordion',
          'Fifth Accordion',
        ])

        const handleDelete = (index: number) => {
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
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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

      const { getByLabelText, getByText, queryByText } = renderWithTheme(<TestAccordion />)

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

  describe('Keyboard Interactions - Controlled', () => {
    test('DOWN arrow should move focus to the next accordion', () => {
      renderWithTheme(<ControlledAccordion />)

      const a1 = getAccordionButton('Accordion 1')
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { key: KeyCodes.DOWN })
      expect(document.activeElement).toBe(getAccordionButton('Accordion 2'))
    })

    test('UP arrow should move focus to the previous accordion', () => {
      renderWithTheme(<ControlledAccordion />)

      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a2)
      fireEvent.keyUp(a2, { key: KeyCodes.UP })
      expect(document.activeElement).toBe(getAccordionButton('Accordion 1'))
    })

    test('UP/DOWN arrows should loop on the accordions', () => {
      renderWithTheme(<ControlledAccordion />)

      const a1 = getAccordionButton('Accordion 1')
      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { key: KeyCodes.UP })
      expect(document.activeElement).toBe(a2)
      fireEvent.keyUp(a2, { key: KeyCodes.DOWN })
      expect(document.activeElement).toBe(a1)
    })

    test('SPACE should open/close the accordion', () => {
      renderWithTheme(<ControlledAccordion />)

      const a = getAccordionButton('Accordion 1')
      fireEvent.focus(a)
      fireEvent.keyUp(a, { key: KeyCodes.SPACE })
      expect(a.getAttribute('aria-expanded')).toBe('true')
      fireEvent.keyUp(a, { key: KeyCodes.SPACE })
      expect(a.getAttribute('aria-expanded')).toBe('false')
    })

    test('RETURN should open/close the accordion', () => {
      renderWithTheme(<ControlledAccordion />)

      const a = getAccordionButton('Accordion 1')
      fireEvent.focus(a)
      fireEvent.keyUp(a, { key: KeyCodes.RETURN })
      expect(a.getAttribute('aria-expanded')).toBe('true')
      fireEvent.keyUp(a, { key: KeyCodes.RETURN })
      expect(a.getAttribute('aria-expanded')).toBe('false')
    })

    test('HOME should focus on the first accordion', () => {
      renderWithTheme(<ControlledAccordion />)

      const a1 = getAccordionButton('Accordion 1')
      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a2)
      fireEvent.keyUp(a2, { key: KeyCodes.HOME })
      expect(document.activeElement).toBe(a1)
    })

    test('END should focus on the last accordion', () => {
      renderWithTheme(<ControlledAccordion />)

      const a1 = getAccordionButton('Accordion 1')
      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { key: KeyCodes.END })
      expect(document.activeElement).toBe(a2)
    })
  })

  describe('Keyboard Interactions - Uncontrolled', () => {
    test('DOWN arrow should move focus to the next accordion', () => {
      renderWithTheme(<UncontrolledAccordion />)

      const a1 = getAccordionButton('Accordion 1')
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { key: KeyCodes.DOWN })
      expect(document.activeElement).toBe(getAccordionButton('Accordion 2'))
    })

    test('UP arrow should move focus to the previous accordion', () => {
      renderWithTheme(<UncontrolledAccordion />)

      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a2)
      fireEvent.keyUp(a2, { key: KeyCodes.UP })
      expect(document.activeElement).toBe(getAccordionButton('Accordion 1'))
    })

    test('UP/DOWN arrows should loop on the accordions', () => {
      renderWithTheme(<UncontrolledAccordion />)

      const a1 = getAccordionButton('Accordion 1')
      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { key: KeyCodes.UP })
      expect(document.activeElement).toBe(a2)
      fireEvent.keyUp(a2, { key: KeyCodes.DOWN })
      expect(document.activeElement).toBe(a1)
    })

    test('SPACE should open/close the accordion', () => {
      renderWithTheme(<UncontrolledAccordion />)

      const a = getAccordionButton('Accordion 1')
      fireEvent.focus(a)
      fireEvent.keyUp(a, { key: KeyCodes.SPACE })
      expect(a.getAttribute('aria-expanded')).toBe('true')
      fireEvent.keyUp(a, { key: KeyCodes.SPACE })
      expect(a.getAttribute('aria-expanded')).toBe('false')
    })

    test('RETURN should open/close the accordion', () => {
      renderWithTheme(<UncontrolledAccordion />)

      const a = getAccordionButton('Accordion 1')
      fireEvent.focus(a)
      fireEvent.keyUp(a, { key: KeyCodes.RETURN })
      expect(a.getAttribute('aria-expanded')).toBe('true')
      fireEvent.keyUp(a, { key: KeyCodes.RETURN })
      expect(a.getAttribute('aria-expanded')).toBe('false')
    })

    test('HOME should focus on the first accordion', () => {
      renderWithTheme(<UncontrolledAccordion />)

      const a1 = getAccordionButton('Accordion 1')
      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a2)
      fireEvent.keyUp(a2, { key: KeyCodes.HOME })
      expect(document.activeElement).toBe(a1)
    })

    test('END should focus on the last accordion', () => {
      renderWithTheme(<UncontrolledAccordion />)

      const a1 = getAccordionButton('Accordion 1')
      const a2 = getAccordionButton('Accordion 2')
      fireEvent.focus(a1)
      fireEvent.keyUp(a1, { key: KeyCodes.END })
      expect(document.activeElement).toBe(a2)
    })
  })

  describe('Render Prop', () => {
    let suppliedHeaderId: string
    const noop = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
    }
    test('Should allow developer to customize content in header', async () => {
      const { getByTestId, getByText } = renderWithTheme(
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

    test('Clicking icon buttons inside header should not trigger opening/closing', async () => {
      const noop = jest.fn()
      const { getByTestId, container } = renderWithTheme(
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
      )

      const deleteButton = getByTestId('delete')
      userEvent.click(deleteButton)
      await openAccordion()
      expect(noop).toHaveBeenCalled()
      expect(container).not.toHaveTextContent('Should not show')
    })
  })

  describe('With theme customization', () => {
    test('Simple accordion should have 2px border', () => {
      const { container } = renderWithTheme(
        <Accordion id="accordion">
          <Accordion.Header>
            <Text as="h3">Test Header</Text>
          </Accordion.Header>
          <Accordion.Body>Test Body</Accordion.Body>
        </Accordion>,
        { border: 'thick' }
      )

      const accordion = container.querySelector('#accordion')
      const styles = window.getComputedStyle(accordion as Element)
      expect(styles.borderBottomWidth).toBe('2px')
    })

    test('Outline accordion should have 4px border-radius', () => {
      const { container } = renderWithTheme(
        <Accordion id="accordion" variant="outline">
          <Accordion.Header>
            <Text as="h3">Test Header</Text>
          </Accordion.Header>
          <Accordion.Body>Test Body</Accordion.Body>
        </Accordion>,
        { shape: 'intermediate' }
      )

      const accordion = container.querySelector('#accordion')
      const styles = window.getComputedStyle(accordion as Element)
      expect(styles.borderRadius).toBe('4px')
    })

    test('Outline accordion should have 0px border-radius', () => {
      const { container } = renderWithTheme(
        <Accordion id="accordion" variant="outline">
          <Accordion.Header>
            <Text as="h3">Test Header</Text>
          </Accordion.Header>
          <Accordion.Body>Test Body</Accordion.Body>
        </Accordion>,
        { shape: 'square' }
      )

      const accordion = container.querySelector('#accordion')
      const styles = window.getComputedStyle(accordion as Element)
      expect(styles.borderRadius).toBe('0px')
    })
  })

  test('Should support flex item props', () => {
    const { getByTestId } = renderWithTheme(
      <Accordion data-testid="flex-accordion" flex={1} flexGrow={1} flexShrink={0} flexBasis={0}>
        <Accordion.Header>
          <Text as="h3">I Have Flex Item Props</Text>
        </Accordion.Header>
        <Accordion.Body>La dee da</Accordion.Body>
      </Accordion>
    )

    const accordion = getByTestId('flex-accordion')
    expect(accordion).toHaveStyle('flex: 1')
    expect(accordion).toHaveStyle('flex-grow: 1')
    expect(accordion).toHaveStyle('flex-shrink: 0')
    expect(accordion).toHaveStyle('flex-basis: 0')
  })
})
