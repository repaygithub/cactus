import * as icons from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import Flex from '../Flex/Flex'
import Text from '../Text/Text'

interface ListProps extends MarginProps, React.HTMLAttributes<HTMLUListElement> {
  dividers?: boolean
}

interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  icon?: keyof typeof icons
  header?: React.ReactNode
  headerAs?: keyof JSX.IntrinsicElements | React.ComponentType<any>
}

const UL = styled.ul<{ $dividers: boolean }>`
  padding: 0;
  margin: 0;
  list-style-type: none;
  ${margin}

  & & {
    margin-top: 8px;
    margin-bottom: 8px;
    margin-left: 24px;
  }

  ${(p) =>
    p.$dividers &&
    `
    li {
      border-top: 1px solid ${p.theme.colors.lightContrast};
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
  ({ icon, children, header, headerAs, ...props }, ref) => {
    const Icon = icon && icons[icon]
    const iconElement = Icon ? <Icon aria-hidden mr={3} /> : null
    return (
      <li tabIndex={1} className={props.onClick && 'clickable'} {...props} ref={ref}>
        {header ? (
          <Flex alignItems="center">
            {iconElement}
            <Text fontWeight="600" m={0} as={headerAs || 'p'}>
              {header}
            </Text>
          </Flex>
        ) : (
          iconElement
        )}
        {children}
      </li>
    )
  }
)

List.displayName = 'List'
ListItem.displayName = 'ListItem'

List.propTypes = {
  dividers: PropTypes.bool,
}

ListItem.propTypes = {
  icon: PropTypes.oneOf(Object.keys(icons) as (keyof typeof icons)[]),
  header: PropTypes.string,
  headerAs: PropTypes.node as PropTypes.Requireable<
    keyof JSX.IntrinsicElements | React.ComponentType<any>
  >,
}

type ListType = typeof List & { Item: typeof ListItem }
const TypedList = List as ListType

TypedList.Item = ListItem

export { ListItem }

export default TypedList
