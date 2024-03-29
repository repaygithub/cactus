import icons from '@repay/cactus-icons'
import { border } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { compose, margin, MarginProps } from 'styled-system'

import Flex from '../Flex/Flex'
import { flexItem, FlexItemProps } from '../helpers/styled'
import Text, { TextProps } from '../Text/Text'

interface ListProps extends MarginProps, FlexItemProps, React.HTMLAttributes<HTMLUListElement> {
  dividers?: boolean
}

interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  icon?: keyof typeof icons
}

interface ItemHeaderProps extends Omit<TextProps, 'color'> {
  children?: React.ReactNode
  icon?: keyof typeof icons
  as?: React.ElementType<any>
}

// Workaround for a styled-components bug when using `&` in a nested style.
const nested = (): string => `
  ${UL} {
    margin-top: 8px;
    margin-bottom: 8px;
    margin-left: 24px;
  }
`

const UL = styled.ul<{ $dividers: boolean }>`
  padding: 0;
  margin: 0;
  list-style-type: none;
  ${nested}

  && {
    ${compose(flexItem, margin)}
  }

  ${(p) =>
    p.$dividers &&
    `
    li {
      border-top: ${border(p, 'lightContrast')};
    }
    li:first-of-type {
      border-top: none;
    }
  `}

  .clickable {
    cursor: pointer;
  }
`

export const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ children, dividers = false, ...props }, ref) => (
    <UL $dividers={dividers} {...props} ref={ref}>
      {children}
    </UL>
  )
)

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ icon, children, ...props }, ref) => {
    const Icon = icon && icons[icon]
    const iconElement = Icon ? <Icon aria-hidden mr={3} /> : null
    return (
      <li className={props.onClick && 'clickable'} {...props} ref={ref}>
        {iconElement}
        {children}
      </li>
    )
  }
)

const ItemHeader: React.FC<ItemHeaderProps> = ({ icon, ...props }) => {
  const Icon = icon && icons[icon]
  const iconElement = Icon ? <Icon aria-hidden mr={3} /> : null
  return (
    <Flex alignItems="center">
      {iconElement}
      <Text fontWeight="600" m={0} {...props} />
    </Flex>
  )
}

List.displayName = 'List'
ListItem.displayName = 'List.Item'
ItemHeader.displayName = 'List.ItemHeader'

List.propTypes = {
  dividers: PropTypes.bool,
}

ListItem.propTypes = {
  icon: PropTypes.oneOf(Object.keys(icons) as (keyof typeof icons)[]),
}

type ListType = typeof List & { Item: typeof ListItem; ItemHeader: typeof ItemHeader }
const TypedList = List as ListType

TypedList.Item = ListItem
TypedList.ItemHeader = ItemHeader

export { ListItem, ItemHeader }

export default TypedList
