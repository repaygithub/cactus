import { number } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Pagination from './Pagination'

export default {
  title: 'Pafination',
  component: Pagination,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <ManagedPagination pageCount={number('Page Count', 10)} />
)

function ManagedPagination({ pageCount }: { pageCount: number }): React.ReactElement {
  const [current, setCurrent] = React.useState(1)
  return <Pagination currentPage={current} pageCount={pageCount} onPageChange={setCurrent} />
}
