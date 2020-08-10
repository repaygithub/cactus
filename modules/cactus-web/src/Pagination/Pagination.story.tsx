import { number } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Pagination from './Pagination'

const paginationStories = storiesOf('Pagination', module)

paginationStories.add(
  'Basic Usage',
  (): React.ReactElement => <ManagedPagination pageCount={number('Page Count', 10)} />
)

function ManagedPagination({ pageCount }: { pageCount: number }): React.ReactElement {
  const [current, setCurrent] = React.useState(1)
  return <Pagination currentPage={current} pageCount={pageCount} onPageChange={setCurrent} />
}
