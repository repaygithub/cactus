import React from 'react'

import { Field, Form as _Form, FORM_ERROR, FormSpy, SubmitButton } from '../'
import docsMeta from './Form.story.mdx'

delete docsMeta.includeStories
export default {
  ...docsMeta,
} as const

interface formValues {
  username: string
  password?: string
  willFail?: boolean
}

const onSubmit = (values: formValues) => {
  try {
    if (values.willFail) throw 'Form submission failed'
    if (values.username !== 'Repay1') throw { username: 'Invalid username' }
  } catch (e) {
    if (typeof e === 'object') {
      return e
    }
    return { [FORM_ERROR]: e }
  }
}

export const Form = () => (
  <_Form onSubmit={onSubmit}>
    <Field name="username" label="Username*" placeholder="Repay1" required />
    <Field name="password" label="Password" mb={4} />
    <Field name="willFail" label="Submit Will Fail" type="checkbox" defaultValue={false} />
    <FormSpy subscription={{ submitError: true }}>
      {({ submitError }: { submitError: string }) => <div>{submitError}</div>}
    </FormSpy>
    <SubmitButton mb={6} mt={4} />
    <FormSpy>
      {({ values, valid, submitFailed }) => (
        <div>
          <div>Submit Failed: {JSON.stringify(submitFailed)}</div>
          <div>Form is valid: {JSON.stringify(valid)}</div>
          <div>Form State: {JSON.stringify(values)}</div>
        </div>
      )}
    </FormSpy>
  </_Form>
)
