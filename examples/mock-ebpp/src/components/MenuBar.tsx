import { RouteComponentProps } from '@reach/router'
import { DescriptiveHome } from '@repay/cactus-icons'
import { Box, MenuBar } from '@repay/cactus-web'
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
      </MenuBar>
      <Box mt="10px">{children}</Box>
    </>
  )
}

export default MenuBarComponent
