import { ActionsDelete, NavigationCircleDown, NavigationCircleUp } from '@repay/cactus-icons'
import { Accordion, Flex, IconButton, Text } from '@repay/cactus-web'
import React, { FunctionComponent } from 'react'

interface FieldsAccordionProps {
  index: number
  header: string
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  defaultOpen?: boolean
  onDelete: (index: number) => void
  onUpClick: (index: number) => void
  onDownClick: (index: number) => void
  disableUp: (index: number) => boolean
  disableDown: (index: number) => boolean
}

const FieldsAccordion: FunctionComponent<FieldsAccordionProps> = (props): React.ReactElement => {
  const {
    index,
    header,
    onDelete,
    onUpClick,
    onDownClick,
    disableUp,
    disableDown,
    children,
    as: asProp,
    ...rest
  } = props
  return (
    <Accordion variant="outline" {...rest}>
      <Accordion.Header
        render={({
          isOpen,
          headerId,
        }: {
          isOpen: boolean
          headerId: string
        }): React.ReactElement => {
          return (
            <Flex alignItems="center" width="100%">
              <Text as={asProp || 'h3'} id={headerId}>
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
                    onDelete(index)
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
                    onDownClick(index)
                    e.stopPropagation()
                  }}
                  disabled={disableDown(index)}
                >
                  <NavigationCircleDown aria-hidden="true" />
                </IconButton>
                <IconButton
                  iconSize="medium"
                  label={`Move ${header} up`}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
                    onUpClick(index)
                    e.stopPropagation()
                  }}
                  disabled={disableUp(index)}
                >
                  <NavigationCircleUp aria-hidden="true" />
                </IconButton>
              </Flex>
            </Flex>
          )
        }}
      />
      <Accordion.Body>{children}</Accordion.Body>
    </Accordion>
  )
}

export default FieldsAccordion
