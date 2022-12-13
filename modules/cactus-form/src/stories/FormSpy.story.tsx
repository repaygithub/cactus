import { noop } from 'lodash'
import React from 'react'

import { Field, Form, FormSpy as _FormSpy } from '../'
import docsMeta from './FormSpy.story.mdx'

delete docsMeta.includeStories
export default {
  ...docsMeta,
} as const

export const FormSpy = () => (
  <Form onSubmit={noop}>
    <Field name="field 1" label="Field 1" />
    <Field name="field 2" label="Field 2" />
    <_FormSpy subscription={{ dirty: true }}>
      {({ dirty }) => <div>the form is {dirty ? 'dirty' : 'clean'}</div>}
    </_FormSpy>
  </Form>
)
