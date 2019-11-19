import React, { Fragment, useCallback, useState } from 'react'

import { number, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import Accordion from './Accordion'
import Box from '../Box/Box'
import Text from '../Text/Text'
import TextButton from '../TextButton/TextButton'

interface ContentManagerState {
  [group: number]: number
}

type ContentManagerParams = ContentManagerState & {
  changeContent: (group: number, increase?: boolean) => void
}

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

storiesOf('Accordion', module)
  .add('Basic Usage', () => (
    <div style={{ width: '312px' }}>
      <Accordion>
        <Accordion.Header>{text('header', 'Accordion')}</Accordion.Header>
        <Accordion.Body>{text('content', 'Some Accordion Content')}</Accordion.Body>
      </Accordion>
    </div>
  ))
  .add('Long', () => (
    <div style={{ width: '960px' }}>
      <Accordion>
        <Accordion.Header>{text('header', 'Accordion')}</Accordion.Header>
        <Accordion.Body>{text('content', 'Some Accordion Content')}</Accordion.Body>
      </Accordion>
    </div>
  ))
  .add(
    'Provider',
    () => (
      <div style={{ width: '312px' }}>
        <Accordion.Provider maxOpen={number('maxOpen', 1)}>
          <Accordion>
            <Accordion.Header>{text('header 1', 'Accordion 1')}</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
              tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
              lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex,
              nec euismod augue aliquam vel.
            </Accordion.Body>
          </Accordion>
          <Accordion>
            <Accordion.Header>{text('header 2', 'Accordion 2')}</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
              tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
              lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex,
              nec euismod augue aliquam vel.
            </Accordion.Body>
          </Accordion>
          <Accordion>
            <Accordion.Header>{text('header 3', 'Accordion 3')}</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
              tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
              lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex,
              nec euismod augue aliquam vel.
            </Accordion.Body>
          </Accordion>
          <Accordion>
            <Accordion.Header>{text('header 4', 'Accordion 4')}</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
              tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
              lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex,
              nec euismod augue aliquam vel.
            </Accordion.Body>
          </Accordion>
        </Accordion.Provider>
      </div>
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
                      <Accordion.Header>{group} Accordion</Accordion.Header>
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
