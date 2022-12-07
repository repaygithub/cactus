import React from 'react'

// import { AccessibleField } from '../'
import { Field } from '../'
import { Form } from 'react-final-form'
// import { Story } from '../helpers/storybook'
import docsMeta from './Field.story.mdx'

delete docsMeta.includeStories
export default {
  title: 'Cactus Form/Components/Test',
  ...docsMeta,
  parameters: {
    ...docsMeta.parameters,
    cactus: { overrides: { maxWidth: '500px' } },
  },
} as const

const FormWrapper = ({ children }) => (
  <Form onSubmit={() => {}}>{() => <form onSubmit={() => {}}>{children}</form>}</Form>
)

export const BasicUsage = () => (
  <FormWrapper>
    <Field name="Field Name" label="Basic Field" />
  </FormWrapper>
)
