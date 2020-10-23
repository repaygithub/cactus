import { RouteComponentProps } from '@reach/router'
import {
  Button,
  CheckBoxField,
  DateInputField,
  FileInputField,
  Flex,
  RadioGroup,
  SelectField,
  Text,
  TextAreaField,
  TextInputField,
  ToggleField,
} from '@repay/cactus-web'
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik'
import React from 'react'
import { Helmet } from 'react-helmet'

import { post } from '../api'

type FormikFieldProps = Omit<
  React.ComponentProps<typeof Field>,
  'innerRef' | 'type' | 'render' | 'component'
>

const FormikField: React.FunctionComponent<FormikFieldProps> = ({
  as: WrappedComponent,
  name,
  validate,
  value: passedValue,
  ...rest
}) => (
  <Field name={name} validate={validate}>
    {({ field: { name, value }, form: { setFieldValue, setFieldTouched } }: FieldProps<any>) => {
      const valueToUse = passedValue === undefined || passedValue === null ? value : passedValue
      return (
        <WrappedComponent
          {...rest}
          name={name}
          value={valueToUse}
          onChange={(_: string, val: any) => setFieldValue(name, val)}
          onBlur={() => setFieldTouched(name, true)}
        />
      )
    }}
  </Field>
)

interface FileObject {
  fileName: string
  contents: File | string | null
  status: 'loading' | 'loaded' | 'error'
  errorMsg?: string
}

interface FormData {
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

type FormErrors = { [K in keyof FormData]?: string }

const initialValues: FormData = {
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
}

const UIConfig: React.FunctionComponent<RouteComponentProps> = () => {
  const onSubmit = (values: FormData, { setSubmitting }: FormikHelpers<FormData>) => {
    post(values)
    console.log((window as any).apiData)
    setSubmitting(false)
  }

  const validate = (values: FormData): FormErrors => {
    const errors: FormErrors = {}
    if (!values.displayName) {
      errors.displayName = 'Must provide display name'
    }
    if (!values.merchantName) {
      errors.merchantName = 'Must provide merchant name'
    }
    if (!values.termsAndConditions) {
      errors.termsAndConditions = 'Must provide terms & conditions'
    }
    if (!values.welcomeContent) {
      errors.welcomeContent = 'Must provide welcome content'
    }
    if (!values.footerContent) {
      errors.footerContent = 'Must provide footer content'
    }
    if (!values.notificationEmail) {
      errors.notificationEmail = 'Must select a notification email'
    }
    if (!values.allLocations || !values.allLocations.length) {
      errors.allLocations = 'Must select at least one location'
    }
    if (!values.mpLocation) {
      errors.mpLocation = 'Must select most popular location'
    }
    if (!values.cardBrands || !values.cardBrands.length) {
      errors.cardBrands = 'Must select supported card brands'
    }
    if (!values.selectColor) {
      errors.selectColor = 'Must choose a color'
    }
    if (!values.fileInput) {
      errors.fileInput = 'Must choose a logo'
    }
    if (!values.establishedDate) {
      errors.establishedDate = 'Must set established date'
    }
    return errors
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

        <Formik initialValues={initialValues} onSubmit={onSubmit} validate={validate}>
          {({ errors, touched }) => (
            <Flex borderColor="base" borderWidth="2px" borderStyle="solid" width="90%">
              <Flex width="100%">
                <Form style={{ width: '100%', padding: '16px' }}>
                  <Field
                    as={TextInputField}
                    name="displayName"
                    label="Display Name"
                    tooltip="Enter your merchant display name"
                    error={touched.displayName && errors.displayName}
                  />

                  <Field
                    as={TextInputField}
                    name="merchantName"
                    label="Merchant Name"
                    tooltip="Enter your merchant name"
                    error={touched.merchantName && errors.merchantName}
                  />
                  <Field
                    as={TextAreaField}
                    name="termsAndConditions"
                    label="Terms and Conditions"
                    tooltip="Enter the terms and conditions for your customers"
                    error={touched.termsAndConditions && errors.termsAndConditions}
                  />

                  <Field
                    as={TextAreaField}
                    name="welcomeContent"
                    label="Welcome Content"
                    tooltip="Enter content to be displayed on login"
                    error={touched.welcomeContent && errors.welcomeContent}
                  />
                  <Field
                    as={TextAreaField}
                    name="footerContent"
                    label="Footer Content"
                    my={4}
                    tooltip="Enter content to be displayed in the footer"
                    error={touched.footerContent && errors.footerContent}
                  />
                  <Field
                    as={SelectField}
                    options={emails}
                    label="Notification Email"
                    name="notificationEmail"
                    my={4}
                    tooltip="Select an email to receive notifications"
                    error={touched.notificationEmail && errors.notificationEmail}
                  />
                  <Field
                    as={SelectField}
                    options={cities}
                    multiple={true}
                    label="All Locations"
                    name="allLocations"
                    tooltip="Select all store locations"
                    error={touched.allLocations && errors.allLocations}
                  />
                  <Field
                    as={SelectField}
                    options={cities}
                    comboBox={true}
                    label="Most Popular Location"
                    name="mpLocation"
                    tooltip="Select your most popular location"
                    error={touched.mpLocation && errors.mpLocation}
                  />
                  <Field
                    as={SelectField}
                    options={cardBrands}
                    multiple={true}
                    comboBox={true}
                    label="Card Brands"
                    name="cardBrands"
                    tooltip="Select or create your supported card brands"
                    error={touched.cardBrands && errors.cardBrands}
                  />

                  <Flex width="50%">
                    <Field
                      as={FileInputField}
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
                      validate={(val?: any) => (!val ? 'Must upload a logo' : undefined)}
                      error={touched.fileInput && errors.fileInput}
                    />
                  </Flex>

                  <Field
                    as={RadioGroup}
                    name="selectColor"
                    label="Select Color"
                    my={3}
                    validate={(val?: string) => (!val ? 'Must select a color' : undefined)}
                    error={touched.selectColor && errors.selectColor}
                  >
                    <RadioGroup.Button value="yellow" label="Yellow" />
                    <RadioGroup.Button value="pink" label="Pink" />
                    <RadioGroup.Button value="blue" label="Blue" />
                  </Field>

                  <Field
                    as={ToggleField}
                    type="checkbox"
                    name="allowCustomerLogin"
                    label="Allow Customer Login"
                    my={4}
                  />

                  <Field
                    as={CheckBoxField}
                    type="checkbox"
                    name="useCactusStyles"
                    label="Use Cactus Styles"
                    my={4}
                  />

                  <FormikField
                    as={DateInputField}
                    label="Established Date"
                    name="establishedDate"
                    id="established-date"
                    tooltip="The date which the company was established"
                    format="YYYY-MM-dd"
                    error={touched.establishedDate && errors.establishedDate}
                  />

                  <Flex width="100%" justifyContent="center">
                    <Button type="reset" variant="standard" my={3} mr={3}>
                      Reset
                    </Button>
                    <Button type="submit" variant="action" my={3} ml={3}>
                      Submit
                    </Button>
                  </Flex>
                </Form>
              </Flex>
            </Flex>
          )}
        </Formik>
      </Flex>
    </div>
  )
}

export default UIConfig
