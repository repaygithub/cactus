interface FileObj {
  fileName: string
  contents: string
  status: string
}

export interface ApiData {
  display_name: string
  merchant_name: string
  terms_and_conditions: string
  welcome_content: string
  footer_content: string
  allow_customer_login: boolean
  use_cactus_styles: boolean
  select_color: string
  file_input: Array<FileObj>
}
