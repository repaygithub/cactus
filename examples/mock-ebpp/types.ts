interface FileObj {
  fileName: string
  contents: string
  status: string
}

export interface UIConfigData {
  displayName: string
  merchantName: string
  termsAndConditions: string
  welcomeContent: string
  footerContent: string
  allowCustomerLogin: boolean
  useCactusStyles: boolean
  selectColor: string
  fileInput: FileObj[]
  notificationEmail: string
  allLocations: string[]
  mpLocation: string
  cardBrands: string[]
  establishedDate: string
}

export type RulesData = {
  key: string
  conditions: { key: string; variable: string; operator: string; value: string }[]
  actions: { key: string; action: string }[]
}[]
