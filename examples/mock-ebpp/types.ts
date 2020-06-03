interface FileObj {
  fileName: string
  contents: string
  status: string
}

export interface UIConfigData {
  display_name: string
  merchant_name: string
  terms_and_conditions: string
  welcome_content: string
  footer_content: string
  allow_customer_login: boolean
  use_cactus_styles: boolean
  select_color: string
  file_input: Array<FileObj>
  notification_email: string
  all_locations: string[]
  mp_location: string
  card_brands: string[]
  established_date: string
}

export type RulesData = Array<{
  key: string
  conditions: Array<{ key: string; variable: string; operator: string; value: string }>
  actions: Array<{ key: string; action: string }>
}>
