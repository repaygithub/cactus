import {
  Alert,
  Button,
  CheckBoxField,
  DateInputField,
  FileInputField,
  Flex,
  RadioButtonField,
  SelectField,
  Text,
  TextAreaField,
  TextInputField,
  ToggleField,
} from '@repay/cactus-web'
import { Helmet } from 'react-helmet'
import { post } from '../api'
import { RouteComponentProps } from '@reach/router'
import React, { useState } from 'react'

interface UIConfigProps extends RouteComponentProps {}

interface FileObject {
  fileName: string
  contents: File | string | null
  status: 'loading' | 'loaded' | 'error'
  errorMsg?: string
}

interface State {
  formData: {
    display_name: string
    merchant_name: string
    terms_and_conditions: string
    welcome_content: string
    footer_content: string
    notification_email: string
    all_locations: Array<string>
    mp_location: string
    card_brands: Array<string>
    allow_customer_login: boolean
    use_cactus_styles: boolean
    select_color: string
    file_input: Array<FileObject> | undefined
    established_date: string
  }

  status: {
    error: boolean | undefined
    message: string
  }
}

const getInitialState = () => ({
  formData: {
    display_name: '',
    merchant_name: '',
    terms_and_conditions: '',
    welcome_content: '',
    footer_content: '',
    notification_email: '',
    all_locations: [],
    mp_location: '',
    card_brands: [],
    allow_customer_login: false,
    use_cactus_styles: false,
    select_color: '',
    file_input: undefined,
    established_date: '2019-10-16',
  },
  status: {
    error: undefined,
    message: '',
  },
})

const formatKey = (key: string) => {
  const words = key.replace('_', ' ').split(' ')
  let newWords: Array<string> = []

  words.forEach(word => {
    newWords.push(word.charAt(0).toUpperCase() + word.slice(1))
  })
  return newWords.join(' ')
}

const UIConfig = (props: UIConfigProps) => {
  const [state, setState] = useState<State>(getInitialState())

  const handleChange = (name: string, value: any) => {
    setState(state => ({
      formData: { ...state.formData, [name]: value },
      status: { ...state.status },
    }))
  }

  const validate = (formData: typeof state.formData) => {
    let errorFound = false
    Object.keys(formData).forEach(key => {
      //@ts-ignore
      const value = formData[key]

      if (value === '' || (Array.isArray(value) && value.length === 0)) {
        errorFound = true
        setState(state => ({
          formData: { ...state.formData },
          status: { error: true, message: `${formatKey(key)} is empty.` },
        }))
        return
      }
    })

    if (errorFound === false) {
      setState(state => ({
        formData: { ...state.formData },
        status: { error: false, message: `Form successfully submitted` },
      }))
    }
  }

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    validate(state.formData)
    post(state.formData)
    console.log((window as any).apiData)
  }

  const handleReset = () => {
    console.log(state.formData.file_input)
    setState({ ...getInitialState() })
    console.log(state.formData.file_input)
  }

  const emails = ['vvyverman@repay.com', 'dhuber@repay.com']
  const cities = ['Tempe', 'Phoenix', 'Tucson', 'Flagstaff', 'Superior']
  const cardBrands = ['Visa', 'MasterCard', 'Amex', 'Discover']

  return (
    <div>
      <Helmet>
        <title> UI Config</title>
      </Helmet>
      <Flex justifyContent="center">
        <Flex width="90%" backgroundColor="base" alignItems="center" paddingLeft="10px">
          <Text color="white" textStyle="h2">
            UI Config
          </Text>
        </Flex>

        <Flex borderColor="base" borderWidth="2px" borderStyle="solid" width="90%">
          {state.status.error === true ? (
            <Alert status="error">{state.status.message}</Alert>
          ) : state.status.error === false ? (
            <Alert status="success"> {state.status.message} </Alert>
          ) : null}

          <Flex width="100%">
            <form onSubmit={handleSubmit} style={{ width: '100%', padding: '16px' }}>
              <TextInputField
                onChange={handleChange}
                name="display_name"
                label="Display Name"
                value={state.formData.display_name}
                tooltip="Enter your merchant display name"
              />

              <TextInputField
                onChange={handleChange}
                name="merchant_name"
                label="Merchant Name"
                value={state.formData.merchant_name}
                tooltip="Enter your merchant name"
              />
              <TextAreaField
                onChange={handleChange}
                name="terms_and_conditions"
                label="Terms and Conditions"
                value={state.formData.terms_and_conditions}
                tooltip="Enter the terms and conditions for your customers"
              />

              <TextAreaField
                onChange={handleChange}
                name="welcome_content"
                label="Welcome Content"
                value={state.formData.welcome_content}
                tooltip="Enter content to be displayed on login"
              />
              <TextAreaField
                onChange={handleChange}
                name="footer_content"
                label="Footer Content"
                my={4}
                value={state.formData.footer_content}
                tooltip="Enter content to be displayed in the footer"
              />
              <SelectField
                options={emails}
                label="Notification Email"
                name="notification_email"
                my={4}
                onChange={handleChange}
                value={state.formData.notification_email}
                tooltip="Select an email to recieve notifications "
              />
              <SelectField
                options={cities}
                multiple={true}
                label="All Locations"
                name="all_locations"
                onChange={handleChange}
                value={state.formData.all_locations}
                tooltip="Select all store locations"
              />
              <SelectField
                options={cities}
                comboBox={true}
                label="Most Popular Location"
                name="mp_location"
                onChange={handleChange}
                value={state.formData.mp_location}
                tooltip="Select your most popular location"
              />
              <SelectField
                options={cardBrands}
                multiple={true}
                comboBox={true}
                label="Card Brands"
                name="card_brands"
                onChange={handleChange}
                value={state.formData.card_brands}
                tooltip="Select or create your supported card brands"
              />

              <Flex width="50%">
                <FileInputField
                  my={4}
                  label="Upload Logo"
                  name="file_input"
                  tooltip="Upload files"
                  accept={['.jpg', '.png']}
                  labels={{
                    delete: 'delete file',
                    retry: 'retry file upload',
                    loading: 'loading',
                    loaded: 'successful',
                  }}
                  prompt="Drag files here or"
                  buttonText="Select Files..."
                  onChange={handleChange}
                  value={state.formData.file_input}
                />
              </Flex>

              <Flex flexDirection="column" my={3}>
                <h3 style={{ margin: '5px 0' }}>Select Color</h3>
                <RadioButtonField
                  name="select_color"
                  value="yellow"
                  label="Yellow"
                  onChange={handleChange}
                  checked={state.formData.select_color === 'yellow'}
                />
                <RadioButtonField
                  name="select_color"
                  value="pink"
                  label="Pink"
                  onChange={handleChange}
                  checked={state.formData.select_color === 'pink'}
                />
                <RadioButtonField
                  name="select_color"
                  value="blue"
                  label="Blue"
                  onChange={handleChange}
                  checked={state.formData.select_color === 'blue'}
                />
              </Flex>

              <ToggleField
                name="allow_customer_login"
                label="Allow Customer Login"
                onChange={handleChange}
                value={state.formData.allow_customer_login}
                my={4}
              />

              <CheckBoxField
                name="use_cactus_styles"
                label="Use Cactus Styles"
                my={4}
                checked={state.formData.use_cactus_styles}
                onChange={handleChange}
              />

              <DateInputField
                label="Established Date"
                name="established_date"
                id="established-date"
                tooltip="The date which the company was established"
                format="YYYY-MM-dd"
                value={state.formData.established_date}
                onChange={handleChange}
              />

              <Flex width="100%" justifyContent="center">
                <Button variant="standard" my={3} mr={3} onClick={handleReset}>
                  Reset
                </Button>
                <Button type="submit" variant="action" my={3} ml={3}>
                  Submit
                </Button>
              </Flex>
            </form>
          </Flex>
        </Flex>
      </Flex>
    </div>
  )
}

export default UIConfig
