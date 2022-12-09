import { noop } from 'lodash'
import React from 'react'

import { Field, Form, SubmitButton as _SubmitButton } from '../'
import docsMeta from './SubmitButton.story.mdx'

delete docsMeta.includeStories
export default {
  title: 'Cactus Form/Components/Submit Button',
  ...docsMeta,
} as const

export const SubmitButton = () => (
  <Form onSubmit={noop}>
    <Field name="Field Name" label="Basic Field" />
    <_SubmitButton mt={4} />
  </Form>
)
