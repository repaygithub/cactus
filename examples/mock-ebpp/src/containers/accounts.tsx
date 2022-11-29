import { navigate, RouteComponentProps } from '@reach/router'
import { Alert, DataGrid, Flex, SplitButton, Text } from '@repay/cactus-web'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import { Account, fetchAccounts } from '../api'

interface PaginationOptions {
  currentPage: number
  pageSize: number
  pageCount?: number
}

interface SortOption {
  id: string
  sortAscending: boolean
}

interface State {
  accounts: Account[]
  alert: string
  paginationOptions: PaginationOptions
  sortOptions: SortOption[]
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const Accounts = (props: RouteComponentProps): React.ReactElement => {
  const [state, setState] = useState<State>({
    accounts: [],
    alert: '',
    paginationOptions: { currentPage: 1, pageSize: 5, pageCount: 2 },
    sortOptions: [],
  })

  useEffect((): void => {
    const accounts = fetchAccounts()
    setState((state) => ({ ...state, accounts: accounts }))
  }, [])

  const paginateData = (): { [key: string]: any }[] => {
    const { paginationOptions, accounts } = state
    const index1 = (paginationOptions.currentPage - 1) * paginationOptions.pageSize
    const index2 = index1 + paginationOptions.pageSize
    return accounts.slice(index1, index2)
  }

  const handlePageChange = (newPaginationOptions: PaginationOptions) => {
    setState((state) => ({ ...state, paginationOptions: newPaginationOptions }))
  }

  const handleSort = (newSortOptions: SortOption[]) => {
    const sortId = newSortOptions[0].id
    const sortAscending = newSortOptions[0].sortAscending
    const accountsCopy = JSON.parse(JSON.stringify(state.accounts))
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
    setState((state) => ({ ...state, sortOptions: newSortOptions, accounts: accountsCopy }))
  }

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
          paddingTop="40px"
          paddingBottom="40px"
        >
          <DataGrid
            paginationOptions={state.paginationOptions}
            onPageChange={handlePageChange}
            sortOptions={state.sortOptions}
            onSort={handleSort}
            cardBreakpoint="small"
          >
            <DataGrid.Table data={paginateData()}>
              <DataGrid.DataColumn id="firstName" title="First Name" sortable />
              <DataGrid.DataColumn id="lastName" title="Last Name" sortable />
              <DataGrid.DataColumn id="dob" title="Date of Birth" sortable />
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
                        setState((state) => ({
                          ...state,
                          accounts: state.accounts.filter(
                            (acct: Account): boolean => acct.id !== rowData.id
                          ),
                          alert: `Account ${rowData.id} deleted successfully`,
                        }))
                      }}
                    >
                      {`Delete Account ${rowData.id}`}
                    </SplitButton.Action>
                  </SplitButton>
                )}
              </DataGrid.Column>
            </DataGrid.Table>
            <DataGrid.BottomSection justifyContent="flex-end">
              <DataGrid.Pagination />
            </DataGrid.BottomSection>
          </DataGrid>
        </Flex>
      </Flex>
    </div>
  )
}

export default Accounts
