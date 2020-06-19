//@ts-ignore
import accounts from './accounts.json'

export interface Account {
  firstName: string
  lastName: string
  cardLastFour: string
  dob: string
  id: string
  payments: Array<Payment>
}

export interface Payment {
  pnref: string
  date: string
}

export interface PaymentData extends Payment {
  firstName: string
  lastName: string
  id: string
  cardLastFour: string
}

export const fetchAccounts = () => {
  return accounts
}

export const fetchAccount = (id: string) => {
  return accounts.find(acct => acct.id === id)
}

export const fetchPaymentHistory = () => {
  let payments: Array<PaymentData> = []

  accounts.forEach((account: Account) => {
    account.payments.forEach((payment: Payment) => {
      const paymentData = {
        ...payment,
        firstName: account.firstName,
        lastName: account.lastName,
        id: account.id,
        cardLastFour: account.cardLastFour,
      }
      payments.push(paymentData)
    })
  })

  return payments
}

export const post = (data: object) => {
  ;(window as any).apiData = data
}
