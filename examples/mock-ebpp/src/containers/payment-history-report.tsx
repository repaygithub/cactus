import { RouteComponentProps } from '@reach/router'
import { Flex, Text } from '@repay/cactus-web'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import { fetchPaymentHistory, PaymentData } from '../api'

interface State {
  payments: PaymentData[]
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const PaymentHistoryReport = (props: RouteComponentProps): React.ReactElement => {
  const [state, setState] = useState<State>({ payments: [] })

  useEffect((): void => {
    const payments = fetchPaymentHistory()
    setState({ payments: payments })
  }, [])

  return (
    <div>
      <Helmet>
        <title> Payment History Report </title>
      </Helmet>
      <Flex justifyContent="center">
        <Flex width="90%" backgroundColor="base" alignItems="center" paddingLeft="10px">
          <Text color="white" textStyle="h2">
            Payment History Report
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
                <th> Pay Ref</th>
                <th> Date</th>
                <th> Last Four</th>
                <th> ID</th>
              </tr>
            </thead>

            <tbody style={{ fontSize: '22px' }}>
              {state.payments.map(
                (payment: PaymentData, index: number): React.ReactElement => {
                  const color = index % 2 === 1 ? 'lightgrey' : 'white'

                  return (
                    <tr
                      key={payment.pnref}
                      style={{
                        backgroundColor: `${color}`,
                        border: '2px solid black',
                        textAlign: 'center',
                      }}
                    >
                      <td> {payment.firstName} </td>
                      <td> {payment.lastName} </td>
                      <td> {payment.pnref} </td>
                      <td> {payment.date} </td>
                      <td> {payment.cardLastFour} </td>
                      <td> {payment.id} </td>
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

export default PaymentHistoryReport
