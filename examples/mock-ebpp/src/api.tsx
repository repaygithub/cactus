//@ts-ignore
import accounts from './accounts.json'

export interface Account {
  firstName: string
  lastName: string
  cardLastFour: string
  dob: string
  id: string
  payments: Payment[]
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

export const fetchAccounts = (): Account[] => {
  return accounts
}

export const fetchAccount = (id: string | undefined): Account | undefined => {
  return accounts.find((acct): boolean => acct.id === id)
}

export const fetchPaymentHistory = (): PaymentData[] => {
  const payments: PaymentData[] = []

  accounts.forEach((account: Account): void => {
    account.payments.forEach((payment: Payment): void => {
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

export const post = (data: { [k: string]: any }): void => {
  ;(window as any).apiData = data
}
