import { noop } from 'lodash'
import React from 'react'

import { DependentField as _DependentField, Field, Form } from '../'
import docsMeta from './DependentField.story.mdx'

delete docsMeta.includeStories
export default {
  title: 'Cactus Form/Components/DependentField',
  ...docsMeta,
} as const

const selectValues = [
  {
    label: 'Label 1',
    value: 'value-1',
  },
  {
    label: 'Label 2',
    value: 'value-2',
  },
  {
    label: 'Label 3',
    value: 'value-3',
  },
]

export const DependentField = () => (
  <Form onSubmit={noop}>
    <Field name="Independent Field" label="Basic Field" type="select" options={selectValues} />
    <_DependentField
      dependsOn="Independent Field"
      name="Dependent Field"
      label="Dependent Field"
      onDependencyChange={(state, { onChange }: any) => {
        onChange(state.value)
      }}
    />
  </Form>
)
