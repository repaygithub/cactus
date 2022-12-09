import { noop } from 'lodash'
import React from 'react'

import { Field, FieldSpy as _FieldSpy, Form } from '../'
import docsMeta from './FieldSpy.story.mdx'

delete docsMeta.includeStories
export default {
  title: 'Cactus Form/Components/FieldSpy',
  ...docsMeta,
} as const

export const FieldSpy = () => (
  <Form onSubmit={noop}>
    <span>
      The FieldSpy will not re-render when the Irrelevant Field value is changed. It will re-render
      every time the value for the Relevant field does. Check the console for FieldSpy re-renders
    </span>
    <Field name="irrelevant field" label="Irrelevant Field" />
    <Field name="relevant field" label="Relevant Field" />
    <_FieldSpy fieldName="relevant field" subscription={{ value: true }}>
      {({ value }) => {
        console.log('FieldSpy has rerendered')
        return <span>The relevant field's value is: {value}</span>
      }}
    </_FieldSpy>
  </Form>
)
