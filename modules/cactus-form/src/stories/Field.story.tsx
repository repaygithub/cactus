import { noop } from 'lodash'
import React from 'react'

import { Field as _Field, Form } from '../'
import docsMeta from './Field.story.mdx'

delete docsMeta.includeStories
export default {
  title: 'Cactus Form/Components/Field',
  ...docsMeta,
} as const

export const Field = () => (
  <Form onSubmit={noop}>
    <_Field name="Field Name" label="Basic Field" />
  </Form>
)
