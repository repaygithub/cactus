import { RouteComponentProps } from '@reach/router'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import { Flex, MenuButton, Text } from '@repay/cactus-web'
import React, { useState } from 'react'

import Link from '../components/Link'

const MenuButtonExample: React.FC<RouteComponentProps> = () => {
  const [action, setAction] = useState('')
  const [nav, setNav] = useState('')

  const stopNav = (e: Event, name: string) => {
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
            <MenuButton.Item onSelect={() => setAction('Action one clicked')} name="action1">
              Action One
            </MenuButton.Item>
            <MenuButton.Item onSelect={() => setAction('Action two clicked')} name="action1">
              Action two
            </MenuButton.Item>
            <MenuButton.Item onSelect={() => setAction('Action three clicked')} name="action1">
              Action one
            </MenuButton.Item>
          </MenuButton>
          <span>{action}</span>
        </Flex>
        <Flex height="80px" justifyContent="flex-start" flexDirection="row" alignItems="center">
          <MenuButton label="Demo Links" mr={5}>
            <MenuButton.Link href="#" onClick={(e: Event) => stopNav(e, '/Link')}>
              Link
            </MenuButton.Link>
            <MenuButton.Link href="#" onClick={(e: Event) => stopNav(e, '/Label')}>
              Label
            </MenuButton.Link>
            <MenuButton.Link href="#" onClick={(e: Event) => stopNav(e, '/IconButton')}>
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
