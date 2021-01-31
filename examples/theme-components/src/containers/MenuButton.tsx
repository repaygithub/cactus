import { RouteComponentProps } from '@reach/router'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import { Flex, MenuButton, Text } from '@repay/cactus-web'
import React, { ReactElement, useState } from 'react'

import Link from '../components/Link'

const MenuButtonExample: React.FC<RouteComponentProps> = (): ReactElement => {
  const [action, setAction] = useState('')
  const [nav, setNav] = useState('')

  const stopNav = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, name: string): void => {
    e.preventDefault()
    setNav(name)
  }

  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center" mb={0}>
        Link
      </Text>
      <Flex height="80px" justifyContent="space-evenly" width="100%" alignItems="center">
        <Flex height="80px" justifyContent="flex-start" flexDirection="row" alignItems="center">
          <MenuButton label="Demo Actions" mr={5}>
            <MenuButton.Item onSelect={(): void => setAction('Action one clicked')}>
              Action One
            </MenuButton.Item>
            <MenuButton.Item onSelect={(): void => setAction('Action two clicked')}>
              Action two
            </MenuButton.Item>
            <MenuButton.Item onSelect={(): void => setAction('Action three clicked')}>
              Action one
            </MenuButton.Item>
          </MenuButton>
          <span>{action}</span>
        </Flex>
        <Flex height="80px" justifyContent="flex-start" flexDirection="row" alignItems="center">
          <MenuButton label="Demo Links" mr={5}>
            <MenuButton.Link
              href="#"
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void =>
                stopNav(e, '/Link')
              }
            >
              Link
            </MenuButton.Link>
            <MenuButton.Link
              href="#"
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void =>
                stopNav(e, '/Label')
              }
            >
              Label
            </MenuButton.Link>
            <MenuButton.Link
              href="#"
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void =>
                stopNav(e, '/IconButton')
              }
            >
              IconButton
            </MenuButton.Link>
          </MenuButton>
          <span>Would redirect to: {nav}</span>
        </Flex>
      </Flex>
    </div>
  )
}

export default MenuButtonExample
