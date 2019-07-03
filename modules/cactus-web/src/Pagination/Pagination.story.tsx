import { number } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import Pagination from './Pagination'
import React from 'react'

storiesOf('Pagination', module).add('Managed', () => (
  <ManagedPagination size={number('Size', 10)} />
))

function ManagedPagination({ size }: any) {
  const [current, setCurrent] = React.useState(1)
  return <Pagination current={current} size={size} onPageChange={setCurrent} />
}
