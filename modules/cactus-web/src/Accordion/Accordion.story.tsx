import { ActionsDelete, NavigationCircleDown, NavigationCircleUp } from '@repay/cactus-icons'
import { boolean, number, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { Fragment, ReactElement, useCallback, useState } from 'react'

import { Accordion, Box, Flex, IconButton, Text, TextButton } from '../'
import { AccordionVariants } from './Accordion'

interface ContentManagerState {
  [group: number]: number
}

type ContentManagerParams = ContentManagerState & {
  changeContent: (group: number, increase?: boolean) => void
}

const accordionVariants: AccordionVariants[] = ['simple', 'outline']

const initializeContent = (): ContentManagerState => {
  let num = 4
  const state: ContentManagerState = {}
  do {
    state[num] = 0
  } while (--num >= 0)
  return state
}

const ContentManager = ({
  children,
}: {
  children: (params: ContentManagerParams) => JSX.Element
}): ReactElement => {
  const [state, setState] = useState<ContentManagerState>(initializeContent)
  const changeContent = useCallback(
    (group: number, increase?: boolean): void =>
      setState(
        (s): ContentManagerState => {
          let value = s[group] || 0
          if (increase) {
            ++value
          } else if (value > 0) {
            --value
          }
          return { ...s, [group]: value }
        }
      ),
    [setState]
  )
  return children({ ...state, changeContent })
}

const textContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex,
nec euismod augue aliquam vel.`
const ContentBlocks = ({ number: num }: { number: number }): ReactElement | null => {
  if (num < 1) {
    return null
  }
  const children = []
  for (let i = 0; i < num; ++i) {
    children.push(
      <Text key={i} tabIndex={0}>
        {textContent}
      </Text>
    )
  }
  return <Fragment>{children}</Fragment>
}

const ReorderAccordions: React.FC<{ isControlled?: boolean }> = ({ isControlled }) => {
  const [open, setOpen] = useState<string[]>([])
  const toggleAccordion = (toggleId: string) => {
    setOpen((currentOpen) => {
      if (currentOpen.includes(toggleId)) {
        return currentOpen.filter((id) => id !== toggleId)
      }
      return [...currentOpen, toggleId]
    })
  }

  const [accordionHeaders, setAccordionHeaders] = useState([
    'First Accordion',
    'Second Accordion',
    'Third Accordion',
    'Fourth Accordion',
    'Fifth Accordion',
  ])

  const handleChange = (id: string) => {
    console.log(`onChange: ${id}`)

    if (isControlled) {
      toggleAccordion(id)
    }
  }

  const handleUpClick = (index: number): void => {
    const headersCopy = [...accordionHeaders]
    const temp = headersCopy[index - 1]
    headersCopy[index - 1] = headersCopy[index]
    headersCopy[index] = temp
    setAccordionHeaders(headersCopy)
  }

  const handleDownClick = (index: number): void => {
    const headersCopy = [...accordionHeaders]
    const temp = headersCopy[index + 1]
    headersCopy[index + 1] = headersCopy[index]
    headersCopy[index] = temp
    setAccordionHeaders(headersCopy)
  }

  const handleDelete = (index: number): void => {
    const headersCopy = [...accordionHeaders]
    headersCopy.splice(index, 1)
    setAccordionHeaders(headersCopy)
  }

  return (
    <Box width="968px">
      <Accordion.Provider
        openId={isControlled ? open : undefined}
        onChange={handleChange}
        maxOpen={isControlled ? undefined : 2}
      >
        {accordionHeaders.map(
          (header, index): ReactElement => (
            <Accordion
              variant="outline"
              key={header}
              useBoxShadows={boolean('useBoxShadows', true)}
            >
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
                      <Flex
                        alignItems="center"
                        ml={isOpen ? 0 : 'auto'}
                        pl={4}
                        borderLeft="1px solid"
                        borderLeftColor="lightContrast"
                      >
                        <IconButton
                          iconSize="medium"
                          mr={1}
                          label={`Move ${header} down`}
                          onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
                            handleDownClick(index)
                            e.stopPropagation()
                          }}
                          disabled={index === accordionHeaders.length - 1}
                        >
                          <NavigationCircleDown aria-hidden="true" />
                        </IconButton>
                        <IconButton
                          iconSize="medium"
                          label={`Move ${header} up`}
                          onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
                            handleUpClick(index)
                            e.stopPropagation()
                          }}
                          disabled={index === 0}
                        >
                          <NavigationCircleUp aria-hidden="true" />
                        </IconButton>
                      </Flex>
                    </Flex>
                  )
                }}
              />
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris
                eu tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa.
                Vestibulum lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis
                gravida ex, nec euismod augue aliquam vel.
              </Accordion.Body>
            </Accordion>
          )
        )}
      </Accordion.Provider>
    </Box>
  )
}

export default {
  title: 'Accordion',
  component: Accordion,
} as Meta

export const BasicUsage = (): ReactElement => (
  <Box width="312px">
    <Accordion
      variant={select('variant', accordionVariants, 'simple')}
      useBoxShadows={boolean('useBoxShadows', true)}
    >
      <Accordion.Header>
        <Text as="h3">{text('header', 'Accordion')}</Text>
      </Accordion.Header>
      <Accordion.Body>{text('content', 'Some Accordion Content')}</Accordion.Body>
    </Accordion>
  </Box>
)

export const Long = (): ReactElement => (
  <Box width="960px">
    <Accordion>
      <Accordion.Header>
        <Text as="h3">{text('header', 'Accordion')}</Text>
      </Accordion.Header>
      <Accordion.Body>{text('content', 'Some Accordion Content')}</Accordion.Body>
    </Accordion>
  </Box>
)
export const Provider = (): ReactElement => (
  <Box width="312px">
    <Accordion.Provider maxOpen={number('maxOpen', 1)}>
      <Accordion>
        <Accordion.Header>
          <Text as="h3">{text('header 1', 'Accordion 1')}</Text>
        </Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
          tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
          lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex, nec
          euismod augue aliquam vel.
        </Accordion.Body>
      </Accordion>
      <Accordion>
        <Accordion.Header>
          <Text as="h3">{text('header 2', 'Accordion 2')}</Text>
        </Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
          tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
          lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex, nec
          euismod augue aliquam vel.
        </Accordion.Body>
      </Accordion>
      <Accordion>
        <Accordion.Header>
          <Text as="h3">{text('header 3', 'Accordion 3')}</Text>
        </Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
          tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
          lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex, nec
          euismod augue aliquam vel.
        </Accordion.Body>
      </Accordion>
      <Accordion>
        <Accordion.Header>
          <Text as="h3">{text('header 4', 'Accordion 4')}</Text>
        </Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
          tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
          lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex, nec
          euismod augue aliquam vel.
        </Accordion.Body>
      </Accordion>
    </Accordion.Provider>
  </Box>
)

Provider.parameters = { cactus: { overrides: { height: '150vh' } } }

export const WithDynamicContent = (): ReactElement => (
  <ContentManager>
    {({ changeContent, ...state }): ReactElement => {
      return (
        <Box width="400px" maxWidth="90vw" height="100vh" py={5} style={{ overflowY: 'auto' }}>
          <Accordion.Provider maxOpen={1}>
            {((): JSX.Element[] => {
              const blocks = []
              let index = 0
              while (typeof state[index] === 'number') {
                const group = index
                blocks.push(
                  <Accordion key={group}>
                    <Accordion.Header>
                      <Text as="h3">{group} Accordion</Text>
                    </Accordion.Header>
                    <Accordion.Body>
                      {(!state[group] || state[group] < 10) && (
                        <Text>
                          <TextButton
                            onClick={(): void => changeContent(group, true)}
                            variant="action"
                          >
                            Add One Block
                          </TextButton>
                        </Text>
                      )}
                      <ContentBlocks number={state[group]} />
                      {state[group] > 0 && (
                        <Text>
                          <TextButton onClick={(): void => changeContent(group)} variant="danger">
                            Remove One Block
                          </TextButton>
                        </Text>
                      )}
                    </Accordion.Body>
                  </Accordion>
                )
                index++
              }

              return blocks
            })()}
          </Accordion.Provider>
        </Box>
      )
    }}
  </ContentManager>
)
export const WithOpenInitialization = (): ReactElement => (
  <Box width="312px">
    <Accordion.Provider
      maxOpen={number('maxOpen', 2)}
      onChange={(id: string) => console.log(`onChange: ${id}`)}
    >
      <Accordion defaultOpen>
        <Accordion.Header>
          <Text as="h3">{text('header 1', 'Accordion 1')}</Text>
        </Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
          tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
          lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex, nec
          euismod augue aliquam vel.
        </Accordion.Body>
      </Accordion>
      <Accordion defaultOpen>
        <Accordion.Header>
          <Text as="h3">{text('header 2', 'Accordion 2')}</Text>
        </Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
          tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
          lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex, nec
          euismod augue aliquam vel.
        </Accordion.Body>
      </Accordion>
    </Accordion.Provider>
  </Box>
)

export const WithOutline = (): ReactElement => <ReorderAccordions />

export const WithControlledOutline = (): ReactElement => <ReorderAccordions isControlled={true} />
WithControlledOutline.parameters = { storyshots: false }
