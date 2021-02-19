import * as icons from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import Flex from '../Flex/Flex'
import Text from '../Text/Text'

interface ListProps
  extends MarginProps,
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
  dividers?: boolean
}

interface ListItemProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  icon?: keyof typeof icons
  header?: React.ReactNode
  headerAs?: keyof JSX.IntrinsicElements | React.ComponentType<any>
}

const UL = styled.ul<{ $dividers: boolean }>`
  padding: 0;
  margin: 0;
  list-style-type: none;
  ${margin}

  & > li > .item-flex > .item-inner-flex > ul {
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
    let Icon: React.ComponentType<any> | null = null
    if (icon) {
      Icon = icons[icon]
    }
    return (
      <li tabIndex={1} className={props.onClick && 'clickable'} {...props} ref={ref}>
        <Flex className="item-flex" flexDirection="column" alignItems="flex-start">
          {header && (
            <Flex alignItems="center">
              {Icon && <Icon aria-hidden="true" mr={3} />}
              <Text fontWeight="600" m={0} as={headerAs || 'p'}>
                {header}
              </Text>
            </Flex>
          )}
          {React.Children.map(children, (child, index) => {
            return (
              <Flex className="item-inner-flex" alignItems="center" width="100%">
                {index === 0 && Icon && !header && <Icon aria-hidden="true" mr={3} />}
                {child}
              </Flex>
            )
          })}
        </Flex>
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
