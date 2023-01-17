import PropTypes from 'prop-types'
import React from 'react'
import { margin, MarginProps } from 'styled-system'

import {
  flexContainer,
  flexItem,
  FlexItemProps,
  FlexProps,
  gapWorkaround,
  withStyles,
} from '../helpers/styled'
import MenuButton from '../MenuButton/MenuButton'
import { useDataGridContext } from './DataGridContext'
import { SortEventHandler, SortInfo } from './types'

interface SortLabels {
  sortBy?: React.ReactNode
  order?: React.ReactNode
  ascending?: React.ReactNode
  descending?: React.ReactNode
}

interface SortProps extends React.HTMLAttributes<HTMLDivElement> {
  labels?: SortLabels
  sort?: SortInfo
  initialSort?: SortInfo
  onSort?: SortEventHandler
  showSortMenu?: boolean | 'card-only'
}

const DataGridSort: React.FC<SortProps> = (props) => {
  const { labels, sort, initialSort, onSort, showSortMenu, ...rest } = props
  const context = useDataGridContext('DataGrid.Sort')
  const { sortableColumns, sortInfo, updateSortInfo, tableVariant } = context
  // Attach handler to context so it's available when sorting by clicking table headers.
  React.useEffect(() => {
    context.onSort = onSort
  })

  const initRef = React.useRef(initialSort)
  React.useEffect(() => {
    if (sort) {
      updateSortInfo(sort, false)
    } else if (initRef.current) {
      updateSortInfo(initRef.current, false)
    }
    initRef.current = undefined
  }, [sort]) // eslint-disable-line react-hooks/exhaustive-deps

  const hide = !showSortMenu || (showSortMenu === 'card-only' && tableVariant !== 'card')
  if (hide || !sortableColumns.length) {
    return null
  }

  const handleSortColChange = (id: string) => {
    const column = sortableColumns.find((c) => c.id === id)
    if (column) {
      const isCurrent = sortInfo?.id === id
      const sortAscending = isCurrent ? !sortInfo.sortAscending : column.defaultSort !== 'desc'
      updateSortInfo({ id, sortAscending }, true)
    }
  }

  const sortAsc = () => {
    sortInfo && updateSortInfo({ id: sortInfo.id, sortAscending: true }, true)
  }
  const sortDesc = () => {
    sortInfo && updateSortInfo({ id: sortInfo.id, sortAscending: false }, true)
  }
  return (
    <div {...rest}>
      <MenuButton variant="unfilled" label={labels?.sortBy || 'Sort by'}>
        {sortableColumns.map(({ id = '', title }) => (
          <MenuButton.Item key={id} onSelect={() => handleSortColChange(id)}>
            {title}
          </MenuButton.Item>
        ))}
      </MenuButton>
      <MenuButton variant="unfilled" label={labels?.order || 'Order'}>
        <MenuButton.Item onSelect={sortAsc}>{labels?.ascending || 'Ascending'}</MenuButton.Item>
        <MenuButton.Item onSelect={sortDesc}>{labels?.descending || 'Descending'}</MenuButton.Item>
      </MenuButton>
    </div>
  )
}

const DGS = withStyles('div', {
  as: DataGridSort,
  displayName: 'DataGrid.Sort',
  styles: [margin, flexContainer, flexItem],
})<MarginProps & FlexProps & FlexItemProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  ${gapWorkaround}
`
DGS.defaultProps = { gap: 4, showSortMenu: 'card-only' }

const sortType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  sortAscending: PropTypes.bool.isRequired,
})

DGS.propTypes = {
  sort: sortType,
  initialSort: sortType,
  onSort: PropTypes.func,
  showSortMenu: PropTypes.oneOfType([
    PropTypes.bool.isRequired,
    PropTypes.oneOf<'card-only'>(['card-only']).isRequired,
  ]),
  labels: PropTypes.shape({
    sortBy: PropTypes.node,
    order: PropTypes.node,
    ascending: PropTypes.node,
    descending: PropTypes.node,
  }),
}

export default DGS
