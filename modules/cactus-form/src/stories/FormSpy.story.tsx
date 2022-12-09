import { noop } from 'lodash'
import React from 'react'

import { Field, Form, FormSpy } from '../'
import docsMeta from './FormSpy.story.mdx'

delete docsMeta.includeStories
export default {
  title: 'Cactus Form/Components/FormSpy',
  ...docsMeta,
} as const

export const BasicUsage = () => (
  <Form onSubmit={noop}>
    <Field name="field 1" label="Field 1" />
    <Field name="field 2" label="Field 2" />
    <FormSpy subscription={{ dirty: true }}>
      {({ dirty }) => <div>the form is {dirty ? 'dirty' : 'clean'}</div>}
    </FormSpy>
  </Form>
)
