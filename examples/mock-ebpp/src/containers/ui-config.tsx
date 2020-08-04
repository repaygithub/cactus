import { RouteComponentProps } from '@reach/router'
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
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import { post } from '../api'

interface FileObject {
  fileName: string
  contents: File | string | null
  status: 'loading' | 'loaded' | 'error'
  errorMsg?: string
}

interface State {
  formData: {
    displayName: string
    merchantName: string
    termsAndConditions: string
    welcomeContent: string
    footerContent: string
    notificationEmail: string
    allLocations: string[]
    mpLocation: string
    cardBrands: string[]
    allowCustomerLogin: boolean
    useCactusStyles: boolean
    selectColor: string
    fileInput: FileObject[] | undefined
    establishedDate: string
  }

  status: {
    error: boolean | undefined
    message: string
  }
}

const getInitialState = (): State => ({
  formData: {
    displayName: '',
    merchantName: '',
    termsAndConditions: '',
    welcomeContent: '',
    footerContent: '',
    notificationEmail: '',
    allLocations: [],
    mpLocation: '',
    cardBrands: [],
    allowCustomerLogin: false,
    useCactusStyles: false,
    selectColor: '',
    fileInput: undefined,
    establishedDate: '2019-10-16',
  },
  status: {
    error: undefined,
    message: '',
  },
})

const formatKey = (key: string): string => {
  const words = key.replace('_', ' ').split(' ')
  let newWords: string[] = []

  words.forEach((word): void => {
    newWords.push(word.charAt(0).toUpperCase() + word.slice(1))
  })
  return newWords.join(' ')
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const UIConfig = (props: RouteComponentProps): React.ReactElement => {
  const [state, setState] = useState<State>(getInitialState())

  const handleChange = (name: string, value: any): void => {
    setState(
      (state): State => ({
        formData: { ...state.formData, [name]: value },
        status: { ...state.status },
      })
    )
  }

  const validate = (formData: typeof state.formData): void => {
    let errorFound = false
    Object.keys(formData).forEach((key): void => {
      //@ts-ignore
      const value = formData[key]

      if (value === '' || (Array.isArray(value) && value.length === 0)) {
        errorFound = true
        setState(
          (state): State => ({
            formData: { ...state.formData },
            status: { error: true, message: `${formatKey(key)} is empty.` },
          })
        )
        return
      }
    })

    if (errorFound === false) {
      setState(
        (state): State => ({
          formData: { ...state.formData },
          status: { error: false, message: `Form successfully submitted` },
        })
      )
    }
  }

  const handleSubmit = (event: React.SyntheticEvent): void => {
    event.preventDefault()
    validate(state.formData)
    post(state.formData)
    console.log((window as any).apiData)
  }

  const handleReset = (): void => {
    console.log(state.formData.fileInput)
    setState({ ...getInitialState() })
    console.log(state.formData.fileInput)
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
                name="displayName"
                label="Display Name"
                value={state.formData.displayName}
                tooltip="Enter your merchant display name"
              />

              <TextInputField
                onChange={handleChange}
                name="merchantName"
                label="Merchant Name"
                value={state.formData.merchantName}
                tooltip="Enter your merchant name"
              />
              <TextAreaField
                onChange={handleChange}
                name="termsAndConditions"
                label="Terms and Conditions"
                value={state.formData.termsAndConditions}
                tooltip="Enter the terms and conditions for your customers"
              />

              <TextAreaField
                onChange={handleChange}
                name="welcomeContent"
                label="Welcome Content"
                value={state.formData.welcomeContent}
                tooltip="Enter content to be displayed on login"
              />
              <TextAreaField
                onChange={handleChange}
                name="footerContent"
                label="Footer Content"
                my={4}
                value={state.formData.footerContent}
                tooltip="Enter content to be displayed in the footer"
              />
              <SelectField
                options={emails}
                label="Notification Email"
                name="notificationEmail"
                my={4}
                onChange={handleChange}
                value={state.formData.notificationEmail}
                tooltip="Select an email to recieve notifications "
              />
              <SelectField
                options={cities}
                multiple={true}
                label="All Locations"
                name="allLocations"
                onChange={handleChange}
                value={state.formData.allLocations}
                tooltip="Select all store locations"
              />
              <SelectField
                options={cities}
                comboBox={true}
                label="Most Popular Location"
                name="mpLocation"
                onChange={handleChange}
                value={state.formData.mpLocation}
                tooltip="Select your most popular location"
              />
              <SelectField
                options={cardBrands}
                multiple={true}
                comboBox={true}
                label="Card Brands"
                name="cardBrands"
                onChange={handleChange}
                value={state.formData.cardBrands}
                tooltip="Select or create your supported card brands"
              />

              <Flex width="50%">
                <FileInputField
                  my={4}
                  label="Upload Logo"
                  name="fileInput"
                  tooltip="Upload files"
                  accept={['.jpg', '.png']}
                  labels={{
                    delete: 'delete file',
                    loading: 'loading',
                    loaded: 'successful',
                  }}
                  prompt="Drag files here or"
                  buttonText="Select Files..."
                  onChange={handleChange}
                  value={state.formData.fileInput}
                />
              </Flex>

              <Flex flexDirection="column" my={3}>
                <h3 style={{ margin: '5px 0' }}>Select Color</h3>
                <RadioButtonField
                  name="selectColor"
                  value="yellow"
                  label="Yellow"
                  onChange={handleChange}
                  checked={state.formData.selectColor === 'yellow'}
                />
                <RadioButtonField
                  name="selectColor"
                  value="pink"
                  label="Pink"
                  onChange={handleChange}
                  checked={state.formData.selectColor === 'pink'}
                />
                <RadioButtonField
                  name="selectColor"
                  value="blue"
                  label="Blue"
                  onChange={handleChange}
                  checked={state.formData.selectColor === 'blue'}
                />
              </Flex>

              <ToggleField
                name="allowCustomerLogin"
                label="Allow Customer Login"
                onChange={handleChange}
                value={state.formData.allowCustomerLogin}
                my={4}
              />

              <CheckBoxField
                name="useCactusStyles"
                label="Use Cactus Styles"
                my={4}
                checked={state.formData.useCactusStyles}
                onChange={handleChange}
              />

              <DateInputField
                label="Established Date"
                name="establishedDate"
                id="established-date"
                tooltip="The date which the company was established"
                format="YYYY-MM-dd"
                value={state.formData.establishedDate}
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
