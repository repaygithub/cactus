import { boolean } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { Table, Toggle } from '../'

export default {
  title: 'Toggle',
  component: Toggle,
} as Meta

const ToggleManager = (props: any) => {
  const [checked, setChecked] = React.useState<boolean>(false)
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`onChange '${e.target.name}': ${e.target.checked}`)
      setChecked(e.target.checked)
    },
    [setChecked]
  )
  return <Toggle {...props} checked={checked} onChange={onChange} />
}

export const BasicUsage = (): React.ReactElement => {
  return <ToggleManager disabled={boolean('Disabled', false)} />
}

export const InAlignedTable = (): React.ReactElement => (
  <Table fullWidth={true}>
    <Table.Body>
      <Table.Row>
        <Table.Cell align="left">
          <Toggle />
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell align="center">
          <Toggle />
        </Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell align="right">
          <Toggle />
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
)
