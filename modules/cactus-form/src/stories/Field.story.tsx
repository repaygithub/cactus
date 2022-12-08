import React from 'react'
import { noop } from 'lodash'
import { DependentField, Field, Form } from '../'
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

export const BasicUsage = () => (
  <Form onSubmit={noop}>
    <Field name="Field Name" label="Basic Field" />
  </Form>
)

export const DependentFieldUsage = () => (
  <Form onSubmit={noop}>
    <Field name="Independent Field" label="Basic Field" type="select" options={selectValues} />
    <DependentField
      dependsOn="Independent Field"
      name="Dependent Field"
      label="Dependent Field"
      onDependencyChange={(state, { onChange }) => {
        onChange(state.value)
      }}
    />
  </Form>
)
