import { navigate, RouteComponentProps } from '@reach/router'
import { Alert, Flex, SplitButton, Text } from '@repay/cactus-web'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import { Account, fetchAccounts } from '../api'

interface State {
  accounts: Account[]
  alert: string
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const Accounts = (props: RouteComponentProps): React.ReactElement => {
  const [state, setState] = useState<State>({ accounts: [], alert: '' })

  useEffect((): void => {
    const accounts = fetchAccounts()
    setState({ accounts: accounts, alert: '' })
  }, [])

  return (
    <div>
      <Helmet>
        <title> Accounts </title>
        <link rel="icon" type="image/png" sizes="16x16" href="src/assets/favicon.ico" />
      </Helmet>

      {state.alert && (
        <Flex justifyContent="center" mt={4} mb={4}>
          <Alert
            status="success"
            onClose={(): void => setState({ ...state, alert: '' })}
            width="60%"
          >
            {state.alert}
          </Alert>
        </Flex>
      )}

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
                <th />
              </tr>
            </thead>

            <tbody style={{ fontSize: '22px' }}>
              {state.accounts.map(
                (account: Account, index: number): React.ReactElement => {
                  const color = index % 2 === 1 ? 'lightgrey' : 'white'

                  const goToAccountPage = (): void => {
                    navigate(`/account/${account.id}`)
                  }

                  const deleteAccount = (): void => {
                    setState({
                      accounts: state.accounts.filter(
                        (acct: Account): boolean => acct.id !== account.id
                      ),
                      alert: `Account ${account.id} deleted successfully`,
                    })
                  }

                  return (
                    <tr
                      key={account.id}
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
                      <td>
                        <SplitButton
                          mainActionLabel="View Account"
                          onSelectMainAction={goToAccountPage}
                        >
                          <SplitButton.Action onSelect={deleteAccount}>
                            Delete Account
                          </SplitButton.Action>
                        </SplitButton>
                      </td>
                    </tr>
                  )
                }
              )}
            </tbody>
          </table>
        </Flex>
      </Flex>
    </div>
  )
}

export default Accounts
