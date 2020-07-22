import { RouteComponentProps } from '@reach/router'
import ActionsDelete from '@repay/cactus-icons/i/actions-delete'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import NavigationCircleDown from '@repay/cactus-icons/i/navigation-circle-down'
import NavigationCircleUp from '@repay/cactus-icons/i/navigation-circle-up'
import { Accordion, Box, Flex, IconButton, Text } from '@repay/cactus-web'
import React, { useState } from 'react'

import Link from '../components/Link'

const AccordionComponent: React.FC<RouteComponentProps> = () => {
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
    <Flex flexDirection="column" height="100%">
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center">
        Accordion
      </Text>
      <Flex alignItems="center" flexDirection="column" width="80%" margin="auto" marginTop={0}>
        <Accordion.Provider>
          {accordionHeaders.map((header, index) => (
            <Accordion variant="outline" key={header}>
              <Accordion.Header
                render={({ isOpen, headerId }: { isOpen: boolean; headerId: string }) => {
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris
                eu tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa.
                Vestibulum lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis
                gravida ex, nec euismod augue aliquam vel.
              </Accordion.Body>
            </Accordion>
          ))}
        </Accordion.Provider>
      </Flex>
    </Flex>
  )
}

export default AccordionComponent
