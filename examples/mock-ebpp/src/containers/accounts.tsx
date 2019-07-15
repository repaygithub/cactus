import { Account, fetchAccounts } from '../api'
import { Box, Flex, Text } from '@repay/cactus-web'
import { Helmet } from 'react-helmet'
import { RouteComponentProps } from '@reach/router'
import React, { useEffect, useState } from 'react'

interface AccountsProps extends RouteComponentProps {}

interface State {
  accounts: Array<Account>
}

const Accounts = (props: AccountsProps) => {
  const [state, setState] = useState<State>({ accounts: [] })

  useEffect(() => {
    const accounts = fetchAccounts()
    setState({ accounts: accounts })
  }, [])

  return (
    <div>
      <Helmet>
        <title> Accounts </title>
        <link rel="icon" type="image/png" sizes="16x16" href="src/assets/favicon.ico" />
      </Helmet>

      <Flex justifyContent="center">
        <Flex width="90%" backgroundColor="base" alignItems="center" paddingLeft="10px">
          <Text color="white" textStyle="h2">
            Accounts
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
            <thead style={{ backgroundColor: 'grey', fontSize: '26px', border: '2px solid grey' }}>
              <tr>
                <th> First Name</th>
                <th> Last Name</th>
                <th> Date of Birth</th>
                <th> Last Four</th>
                <th> ID </th>
              </tr>
            </thead>

            <tbody style={{ fontSize: '22px' }}>
              {state.accounts.map((account: Account, index: number) => {
                const color = index % 2 === 1 ? 'lightgrey' : 'white'

                return (
                  <tr
                    style={{
                      backgroundColor: `${color}`,
                      border: '2px solid black',
                      textAlign: 'center',
                    }}
                  >
                    <td> {account.firstName} </td>
                    <td> {account.lastName} </td>
                    <td> {account.dob} </td>
                    <td> {account.cardLastFour} </td>
                    <td> {account.id} </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Flex>
      </Flex>
    </div>
  )
}

export default Accounts
