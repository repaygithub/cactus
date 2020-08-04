import { RouteComponentProps } from '@reach/router'
import { Flex, Text } from '@repay/cactus-web'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import { fetchAccount } from '../api'

interface AccountProps extends RouteComponentProps {
  accountId?: string
}

interface State {
  firstName: string
  lastName: string
  cardLastFour: string
  dob: string
  id: string
  payments: { pnref: string; date: string }[]
}

const Account = (props: AccountProps): React.ReactElement | null => {
  const [account, setAccount] = useState<State | undefined>(undefined)

  useEffect((): void => {
    setAccount(fetchAccount(props.accountId))
  }, [props.accountId])

  return account === undefined ? null : (
    <div>
      <Helmet>
        <title>Account {account.id}</title>
        <link rel="icon" type="image/png" sizes="16x16" href="src/assets/favicon.ico" />
      </Helmet>

      <Flex justifyContent="center">
        <Flex width="90%" backgroundColor="base" alignItems="center" paddingLeft="10px">
          <Text color="white" textStyle="h2">
            Account {account.id}
          </Text>
        </Flex>

        <Flex
          borderColor="base"
          borderWidth="2px"
          borderStyle="solid"
          width="90%"
          justifyContent="center"
        >
          <table
            style={{
              width: '90%',
              borderCollapse: 'collapse',
              marginBottom: '20px',
              marginTop: '20px',
            }}
          >
            <tbody>
              {(Object.keys(account) as (keyof typeof account)[]).map(
                (key): React.ReactElement | null => {
                  return key !== 'payments' ? (
                    <tr key={key}>
                      <th>{key}</th>
                      <td>{account[key]}</td>
                    </tr>
                  ) : null
                }
              )}
            </tbody>
          </table>
        </Flex>
      </Flex>
    </div>
  )
}

export default Account
