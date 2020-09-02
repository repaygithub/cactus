import { RouteComponentProps } from '@reach/router'
import { DescriptiveHome } from '@repay/cactus-icons'
import { Box, MenuBar, ScreenSizeContext, SIZES } from '@repay/cactus-web'
import React, { useEffect, useState } from 'react'

import { Account, fetchAccounts } from '../api'

interface ContainerProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    RouteComponentProps {}

const MenuBarComponent = (props: ContainerProps): React.ReactElement => {
  const [state, setState] = useState<Account[]>([])
  const { children } = props

  useEffect((): void => {
    const accounts = fetchAccounts()
    setState(accounts)
  }, [])

  return (
    <>
      <ScreenSizeContext.Provider value={SIZES.large}>
        <MenuBar>
          <MenuBar.Item as="a" href="/">
            <DescriptiveHome iconSize="medium" />
          </MenuBar.Item>
          <MenuBar.Item as="a" href="/payment-history">
            Payment History Report
          </MenuBar.Item>
          <MenuBar.List title="Accounts">
            <MenuBar.Item as="a" href="/accounts">
              View All
            </MenuBar.Item>
            {state.map((e) => (
              <MenuBar.Item as="a" href={`/account/${e.id}`} key={e.id}>
                {e.firstName} {e.lastName}
              </MenuBar.Item>
            ))}
          </MenuBar.List>
          <MenuBar.Item as="a" href="/ui-config">
            UI Config
          </MenuBar.Item>
          <MenuBar.Item as="a" href="/faq">
            FAQ
          </MenuBar.Item>
          <MenuBar.Item as="a" href="/rules">
            Rules
          </MenuBar.Item>
          <MenuBar.Item
            as="a"
            href="https://www.npmjs.com/package/@repay/create-ui"
            target="_blank"
          >
            Take a look at our CLI
          </MenuBar.Item>
          <MenuBar.Item as="a" href="https://repaygithub.github.io/cactus/" target="_blank">
            Documentation for Cactus
          </MenuBar.Item>
          <MenuBar.List title="Other example apps">
            <MenuBar.Item
              as="a"
              href="https://github.com/repaygithub/cactus/blob/master/examples/standard"
            >
              Standard Example
            </MenuBar.Item>
            <MenuBar.Item
              as="a"
              href="https://github.com/repaygithub/cactus/blob/master/examples/theme-components"
            >
              Theme Components
            </MenuBar.Item>
          </MenuBar.List>
          <MenuBar.List title="Explore our modules on GitHub">
            <MenuBar.Item
              as="a"
              href="https://github.com/repaygithub/cactus/blob/master/modules/cactus-fwk"
            >
              Cactus Framework
            </MenuBar.Item>
            <MenuBar.Item
              as="a"
              href="https://github.com/repaygithub/cactus/blob/master/modules/cactus-i18n"
            >
              Cactus i18n
            </MenuBar.Item>
            <MenuBar.Item
              as="a"
              href="https://github.com/repaygithub/cactus/blob/master/modules/cactus-icons"
            >
              Cactus Icons
            </MenuBar.Item>
            <MenuBar.Item
              as="a"
              href="https://github.com/repaygithub/cactus/blob/master/modules/cactus-theme"
            >
              Cactus Theme
            </MenuBar.Item>
            <MenuBar.Item
              as="a"
              href="https://github.com/repaygithub/cactus/blob/master/modules/cactus-web"
            >
              Cactus Web
            </MenuBar.Item>
          </MenuBar.List>
        </MenuBar>
      </ScreenSizeContext.Provider>
      <Box mt="10px">{children}</Box>
    </>
  )
}

export default MenuBarComponent
