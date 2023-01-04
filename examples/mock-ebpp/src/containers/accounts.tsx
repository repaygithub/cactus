import { navigate, RouteComponentProps } from '@reach/router'
import { Alert, Box, DataGrid, Flex, SplitButton, Text } from '@repay/cactus-web'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import { Account, fetchAccounts } from '../api'

interface SortOption {
  id: string
  sortAscending: boolean
}

const pageSize = 5

const Accounts: React.FC<RouteComponentProps> = () => {
  const [alertMsg, setAlert] = useState('')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [currentPage, setPage] = useState(1)

  useEffect((): void => {
    const accounts = fetchAccounts()
    setAccounts(accounts)
  }, [])

  const endIndex = currentPage * pageSize
  const data = accounts.slice(endIndex - pageSize, endIndex)

  const handleSort = (newSortOptions: SortOption) => {
    const sortId = newSortOptions.id
    const sortAscending = newSortOptions.sortAscending
    const accountsCopy = [...accounts]
    if (sortId === 'firstName' || sortId === 'lastName') {
      if (sortAscending) {
        accountsCopy.sort((a: Account, b: Account) => {
          if (a[sortId] < b[sortId]) {
            return -1
          }
          if (a[sortId] > b[sortId]) {
            return 1
          }
          return 0
        })
      } else {
        accountsCopy.sort((a: Account, b: Account): number => {
          if (a[sortId] < b[sortId]) {
            return 1
          }
          if (a[sortId] > b[sortId]) {
            return -1
          }
          return 0
        })
      }
    }
    if (sortId === 'dob') {
      if (sortAscending) {
        accountsCopy.sort((a: Account, b: Account): number => {
          return (new Date(a.dob) as any) - (new Date(b.dob) as any)
        })
      } else {
        accountsCopy.sort((a: Account, b: Account): number => {
          return (new Date(b.dob) as any) - (new Date(a.dob) as any)
        })
      }
    }
    setAccounts(accountsCopy)
  }

  return (
    <div>
      <Helmet>
        <title> Accounts </title>
        <link rel="icon" type="image/png" sizes="16x16" href="src/assets/favicon.ico" />
      </Helmet>

      {alertMsg && (
        <Flex justifyContent="center" mt={4} mb={4}>
          <Alert status="success" onClose={(): void => setAlert('')} width="60%">
            {alertMsg}
          </Alert>
        </Flex>
      )}

      <Flex justifyContent="center">
        <Flex width="90%" backgroundColor="base" alignItems="center" paddingLeft="10px">
          <Text color="white" textStyle="h2">
            Accounts
          </Text>
        </Flex>

        <Box
          borderColor="base"
          borderWidth="2px"
          borderStyle="solid"
          width="90%"
          paddingY={7}
          paddingX={4}
        >
          <DataGrid data={data}>
            <DataGrid.Sort onSort={handleSort} />
            <DataGrid.Table variant={['card', 'card', 'table']}>
              <DataGrid.DataColumn id="firstName" title="First Name" defaultSort="desc" />
              <DataGrid.DataColumn id="lastName" title="Last Name" defaultSort="desc" />
              <DataGrid.DataColumn id="dob" title="Date of Birth" defaultSort="desc" />
              <DataGrid.DataColumn id="cardLastFour" title="Last 4 of Card" />
              <DataGrid.DataColumn id="id" title="Account ID" />
              <DataGrid.Column>
                {(rowData): React.ReactElement => (
                  <SplitButton>
                    <SplitButton.Action main onClick={() => navigate(`/account/${rowData.id}`)}>
                      View Account
                    </SplitButton.Action>
                    <SplitButton.Action
                      onClick={() => {
                        setAccounts((old) => old.filter((acct) => acct.id !== rowData.id))
                        setAlert(`Account ${rowData.id} deleted successfully`)
                      }}
                    >
                      {`Delete Account ${rowData.id}`}
                    </SplitButton.Action>
                  </SplitButton>
                )}
              </DataGrid.Column>
            </DataGrid.Table>
            <DataGrid.Pagination
              currentPage={currentPage}
              itemCount={accounts.length}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </DataGrid>
        </Box>
      </Flex>
    </div>
  )
}

export default Accounts
