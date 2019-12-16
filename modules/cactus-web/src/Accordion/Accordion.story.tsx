import React, { Fragment, useCallback, useState } from 'react'

import { ActionsDelete, NavigationCircleDown, NavigationCircleUp } from '@repay/cactus-icons'
import { number, select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import Accordion, { AccordionVariants } from './Accordion'
import Box from '../Box/Box'
import Flex from '../Flex/Flex'
import IconButton from '../IconButton/IconButton'
import Text from '../Text/Text'
import TextButton from '../TextButton/TextButton'

interface ContentManagerState {
  [group: number]: number
}

type ContentManagerParams = ContentManagerState & {
  changeContent: (group: number, increase?: boolean) => void
}

const accordionVariants: AccordionVariants[] = ['simple', 'outline']

const initializeContent = () => {
  let number = 4
  let state: ContentManagerState = {}
  do {
    state[number] = 0
  } while (--number >= 0)
  return state
}

const ContentManager = ({
  children,
}: {
  children: (params: ContentManagerParams) => JSX.Element
}) => {
  const [state, setState] = useState<ContentManagerState>(initializeContent)
  const changeContent = useCallback(
    (group: number, increase?: boolean) =>
      setState(s => {
        let value = s[group] || 0
        if (increase) {
          ++value
        } else if (value > 0) {
          --value
        }
        return { ...s, [group]: value }
      }),
    [setState]
  )
  return children({ ...state, changeContent })
}

const textContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex,
nec euismod augue aliquam vel.`
const ContentBlocks = ({ number }: { number: number }) => {
  if (number < 1) {
    return null
  }
  let children = []
  for (let i = 0; i < number; ++i) {
    children.push(
      <Text key={i} tabIndex={0}>
        {textContent}
      </Text>
    )
  }
  return <Fragment>{children}</Fragment>
}

const ReorderAccordions = () => {
  const [accordionHeaders, setAccordionHeaders] = useState([
    'First Accordion',
    'Second Accordion',
    'Third Accordion',
    'Fourth Accordion',
    'Fifth Accordion',
  ])

  const handleUpClick = (index: number) => {
    const headersCopy = [...accordionHeaders]
    const temp = headersCopy[index - 1]
    headersCopy[index - 1] = headersCopy[index]
    headersCopy[index] = temp
    setAccordionHeaders(headersCopy)
  }

  const handleDownClick = (index: number) => {
    const headersCopy = [...accordionHeaders]
    const temp = headersCopy[index + 1]
    headersCopy[index + 1] = headersCopy[index]
    headersCopy[index] = temp
    setAccordionHeaders(headersCopy)
  }

  const handleDelete = (index: number) => {
    const headersCopy = [...accordionHeaders]
    headersCopy.splice(index, 1)
    setAccordionHeaders(headersCopy)
  }

  return (
    <Box width="968px">
      <Accordion.Provider>
        {accordionHeaders.map((header, index) => (
          <Accordion variant="outline" key={header}>
            <Accordion.Header
              render={({ isOpen, headerId }) => {
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
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
              tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
              lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex,
              nec euismod augue aliquam vel.
            </Accordion.Body>
          </Accordion>
        ))}
      </Accordion.Provider>
    </Box>
  )
}

storiesOf('Accordion', module)
  .add('Basic Usage', () => (
    <Box width="312px">
      <Accordion variant={select('variant', accordionVariants, 'simple')}>
        <Accordion.Header>
          <Text as="h3">{text('header', 'Accordion')}</Text>
        </Accordion.Header>
        <Accordion.Body>{text('content', 'Some Accordion Content')}</Accordion.Body>
      </Accordion>
    </Box>
  ))
  .add('Long', () => (
    <Box width="960px">
      <Accordion>
        <Accordion.Header>
          <Text as="h3">{text('header', 'Accordion')}</Text>
        </Accordion.Header>
        <Accordion.Body>{text('content', 'Some Accordion Content')}</Accordion.Body>
      </Accordion>
    </Box>
  ))
  .add(
    'Provider',
    () => (
      <Box width="312px">
        <Accordion.Provider maxOpen={number('maxOpen', 1)}>
          <Accordion>
            <Accordion.Header>
              <Text as="h3">{text('header 1', 'Accordion 1')}</Text>
            </Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
              tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
              lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex,
              nec euismod augue aliquam vel.
            </Accordion.Body>
          </Accordion>
          <Accordion>
            <Accordion.Header>
              <Text as="h3">{text('header 2', 'Accordion 2')}</Text>
            </Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
              tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
              lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex,
              nec euismod augue aliquam vel.
            </Accordion.Body>
          </Accordion>
          <Accordion>
            <Accordion.Header>
              <Text as="h3">{text('header 3', 'Accordion 3')}</Text>
            </Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
              tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
              lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex,
              nec euismod augue aliquam vel.
            </Accordion.Body>
          </Accordion>
          <Accordion>
            <Accordion.Header>
              <Text as="h3">{text('header 4', 'Accordion 4')}</Text>
            </Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
              tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
              lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex,
              nec euismod augue aliquam vel.
            </Accordion.Body>
          </Accordion>
        </Accordion.Provider>
      </Box>
    ),
    { cactus: { overrides: { height: '150vh' } } }
  )
  .add('With Dynamic Content', () => (
    <ContentManager>
      {({ changeContent, ...state }) => {
        return (
          <Box width="400px" maxWidth="90vw" height="100vh" py={5} style={{ overflowY: 'auto' }}>
            <Accordion.Provider maxOpen={1}>
              {(() => {
                let blocks = []
                let index = 0
                while (typeof state[index] === 'number') {
                  let group = index
                  blocks.push(
                    <Accordion key={group}>
                      <Accordion.Header>
                        <Text as="h3">{group} Accordion</Text>
                      </Accordion.Header>
                      <Accordion.Body>
                        {(!state[group] || state[group] < 10) && (
                          <Text>
                            <TextButton onClick={() => changeContent(group, true)} variant="action">
                              Add One Block
                            </TextButton>
                          </Text>
                        )}
                        <ContentBlocks number={state[group]} />
                        {state[group] > 0 && (
                          <Text>
                            <TextButton onClick={() => changeContent(group)} variant="danger">
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
  ))
  .add('With Open Initialization', () => (
    <Box width="312px">
      <Accordion.Provider maxOpen={number('maxOpen', 2)}>
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
  ))
  .add('With Outline', () => <ReorderAccordions />)
