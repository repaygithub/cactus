import { noop } from 'lodash'
import React from 'react'
import { Form } from 'react-final-form'

import { Field } from '../'
import docsMeta from './SubmitButton.story.mdx'

delete docsMeta.includeStories
export default {
  title: 'Cactus Form/Components/Submit Button',
  ...docsMeta,
  parameters: {
    ...docsMeta.parameters,
    cactus: { overrides: { maxWidth: '500px' } },
  },
} as const

const FormWrapper = ({ children }) => (
  <Form onSubmit={noop}>{() => <form onSubmit={noop}>{children}</form>}</Form>
)

export const BasicUsage = () => (
  <FormWrapper>
    <Field name="Field Name" label="Basic Field" />
  </FormWrapper>
)
