import icons from '@repay/cactus-icons'
import { border } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import { margin, MarginProps } from 'styled-system'

import Flex from '../Flex/Flex'
import { flexItem, FlexItemProps, withStyles } from '../helpers/styled'
import Text, { TextProps } from '../Text/Text'

interface ListProps extends MarginProps, FlexItemProps {
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
  ${List} {
    margin-top: 8px;
    margin-bottom: 8px;
    margin-left: 24px;
  }
`

export const List = withStyles('ul', {
  displayName: 'List',
  styles: [margin, flexItem],
  transitiveProps: ['dividers'],
})<ListProps>`
  padding: 0;
  margin: 0;
  list-style-type: none;
  ${nested}

  ${(p) =>
    p.dividers &&
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
