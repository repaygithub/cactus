import { ActionsDelete, NavigationCircleDown, NavigationCircleUp } from '@repay/cactus-icons'
import React, { Fragment, ReactElement, useCallback, useState } from 'react'

import { Accordion, Box, Flex, IconButton, Text, TextButton } from '../'
import { Action, actions, HIDE_CONTROL, SPACE, Story, STRING } from '../helpers/storybook'

interface ContentManagerState {
  [group: number]: number
}

type ContentManagerParams = ContentManagerState & {
  changeContent: (group: number, increase?: boolean) => void
}

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
      setState((s): ContentManagerState => {
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

const ContentBlocks = ({ number: num }: { number: number }): ReactElement | null => {
  if (num < 1) {
    return null
  }
  const children = []
  for (let i = 0; i < num; ++i) {
    children.push(
      <Text key={i} tabIndex={0}>
        {longText}
      </Text>
    )
  }
  return <Fragment>{children}</Fragment>
}

type ChangeArg = { onChange: Action<string> }
type ControlledArgs = { isControlled: boolean } & ChangeArg
const WithOutline: Story<typeof Accordion, ControlledArgs> = ({
  isControlled,
  onChange,
  ...args
}) => {
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

  const handleChange = isControlled ? onChange.wrap(toggleAccordion) : onChange

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
    <Box width={['100%', '75%']}>
      <Accordion.Provider
        openId={isControlled ? open : undefined}
        onChange={handleChange}
        maxOpen={isControlled ? undefined : 2}
      >
        {accordionHeaders.map(
          (header, index): ReactElement => (
            <Accordion key={header} {...args}>
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
              <Accordion.Body>{longText}</Accordion.Body>
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
  argTypes: { defaultOpen: HIDE_CONTROL },
} as const

interface LabelArgs {
  header: string
  content: string
}
// Force remount when defaultOpen changes, otherwise it has no effect.
export const BasicUsage: Story<typeof Accordion, LabelArgs> = ({
  header,
  content,
  margin,
  ...props
}) => (
  <Box width="312px">
    <Accordion {...props} key={props.defaultOpen?.toString()}>
      <Accordion.Header>
        <Text as="h3">{header}</Text>
      </Accordion.Header>
      <Accordion.Body m={margin}>{content}</Accordion.Body>
    </Accordion>
  </Box>
)
BasicUsage.argTypes = {
  defaultOpen: { control: 'boolean' },
  header: STRING,
  content: STRING,
  margin: SPACE,
}
BasicUsage.args = {
  header: 'Accordion',
  content: 'Some Accordion Content',
}

export const Long: Story<typeof Accordion, LabelArgs> = ({ header, content, ...props }) => (
  <Box width="960px">
    <Accordion {...props}>
      <Accordion.Header>
        <Text as="h3">{header}</Text>
      </Accordion.Header>
      <Accordion.Body>{content}</Accordion.Body>
    </Accordion>
  </Box>
)
Long.argTypes = { header: STRING, content: STRING }
Long.args = BasicUsage.args

const longText = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar,
  mauris eu tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et
  massa. Vestibulum lacinia ultrices urna, non rhoncus justo mollis vitae.
  Integer facilisis gravida ex, nec euismod augue aliquam vel.
`

interface ProviderArgs {
  accordions: string[]
  maxOpen: number
}

export const Provider: Story<typeof Accordion, ProviderArgs> = ({
  accordions,
  maxOpen,
  ...props
}) => (
  <Box width="312px">
    <Accordion.Provider maxOpen={maxOpen}>
      {accordions.map((header, ix) => (
        <Accordion {...props} key={ix}>
          <Accordion.Header>
            <Text as="h3">{header}</Text>
          </Accordion.Header>
          <Accordion.Body>{longText}</Accordion.Body>
        </Accordion>
      ))}
    </Accordion.Provider>
  </Box>
)
Provider.args = {
  maxOpen: 1,
  accordions: ['Accordion 1', 'Accordion 2', 'Accordion 3', 'Accordion 4'],
}
Provider.parameters = { cactus: { overrides: { height: '150vh' } } }

export const WithDynamicContent: Story<typeof Accordion> = (args) => (
  <ContentManager>
    {({ changeContent, ...state }): ReactElement => {
      return (
        <Box width="400px" maxWidth="90vw" height="100vh" py={5} px={3} overflowY="auto">
          <Accordion.Provider maxOpen={1}>
            {((): JSX.Element[] => {
              const blocks = []
              let index = 0
              while (typeof state[index] === 'number') {
                const group = index
                blocks.push(
                  <Accordion key={group} {...args}>
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
type OpenArgs = ProviderArgs & ChangeArg
export const WithOpenInitialization: Story<typeof Accordion, OpenArgs> = ({
  accordions,
  maxOpen,
  onChange,
  ...args
}) => (
  <Box width="312px">
    <Accordion.Provider maxOpen={maxOpen} onChange={onChange}>
      {accordions.map((header, ix) => (
        <Accordion {...args} key={ix} defaultOpen>
          <Accordion.Header>
            <Text as="h3">{header}</Text>
          </Accordion.Header>
          <Accordion.Body>{longText}</Accordion.Body>
        </Accordion>
      ))}
    </Accordion.Provider>
  </Box>
)
WithOpenInitialization.argTypes = actions('onChange')
WithOpenInitialization.args = { maxOpen: 2, accordions: ['Accordion 1', 'Accordion 2'] }

export { WithOutline }
WithOutline.argTypes = actions('onChange')
WithOutline.args = { variant: 'outline', isControlled: false }
