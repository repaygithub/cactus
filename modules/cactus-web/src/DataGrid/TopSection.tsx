import PropTypes from 'prop-types'
import React, { ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import MenuButton from '../MenuButton/MenuButton'
import { DataGridContext, getMediaQuery } from './helpers'
import { DataColumnObject, TransientProps } from './types'

export interface TopSectionProps {
  sortLabels?: SortLabels
  children?: React.ReactNode
}

interface SortLabels {
  sortBy?: React.ReactChild
  order?: React.ReactChild
  ascending?: React.ReactChild
  descending?: React.ReactChild
}

const TopSection = (props: TopSectionProps): ReactElement | null => {
  const [hasChildren, setHasChildren] = useState<boolean>(false)
  const { sortLabels = {}, children } = props
  const { columns, sortOptions, onSort, isCardView, cardBreakpoint } = useContext(DataGridContext)
  const sortableColumns = useMemo(() => {
    const sortableCols: Map<string, DataColumnObject> = new Map()
    for (const k of columns.keys()) {
      let col = columns.get(k)
      if (col !== undefined && col.hasOwnProperty('sortable')) {
        col = col as DataColumnObject
        if (col.sortable) {
          sortableCols.set(k, col)
        }
      }
    }
    return sortableCols
  }, [columns])

  const handleSortColChange = (id: string) => {
    if (sortOptions) {
      const { sortAscending: currentSortAscending } = sortOptions[0] || {}
      const newOptions = [
        { id, sortAscending: currentSortAscending !== undefined ? currentSortAscending : false },
      ]
      onSort(newOptions)
    }
  }

  const handleSortDirChange = (sortAscending: boolean) => {
    if (sortOptions) {
      onSort([{ ...sortOptions[0], sortAscending }])
    }
  }

  useEffect(() => {
    setHasChildren(false)
    React.Children.forEach(children, (child) => {
      if (child && child !== null) {
        setHasChildren(true)
      }
    })
  }, [children])

  return (
    <StyledTopSection
      className={`top-section ${
        (hasChildren || (isCardView && sortableColumns.size > 0)) && 'has-content'
      }`}
      $isCardView={isCardView}
      $cardBreakpoint={cardBreakpoint}
    >
      {isCardView && sortableColumns.size > 0 && (
        <div className={`sort-buttons ${hasChildren && 'has-siblings'}`}>
          <MenuButton variant="unfilled" label={sortLabels.sortBy || 'Sort by'} mr={4}>
            {[...sortableColumns.keys()].map(
              (key): ReactElement => {
                const col = sortableColumns.get(key) as DataColumnObject
                return (
                  <MenuButton.Item key={key} onSelect={() => handleSortColChange(key)}>
                    {col.title}
                  </MenuButton.Item>
                )
              }
            )}
          </MenuButton>
          <MenuButton variant="unfilled" label={sortLabels.order || 'Order'}>
            <MenuButton.Item onSelect={() => handleSortDirChange(true)}>
              {sortLabels.ascending || 'Ascending'}
            </MenuButton.Item>
            <MenuButton.Item onSelect={() => handleSortDirChange(false)}>
              {sortLabels.descending || 'Descending'}
            </MenuButton.Item>
          </MenuButton>
        </div>
      )}
      {children}
    </StyledTopSection>
  )
}

const StyledTopSection = styled.div<TransientProps>`
  // Card view styles
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;

  &.has-content {
    margin-bottom: 40px;
  }

  // Non-card view styles
  ${getMediaQuery} {
    flex-direction: row;
    align-items: flex-start;
  }

  .sort-buttons {
    &.has-siblings {
      margin-bottom: 16px;
    }
  }

  // Card view styles when screen is larger than tiny
  ${(p) =>
    p.$isCardView &&
    `${p.theme.mediaQueries && p.theme.mediaQueries.small} {
      flex-direction: row;

      &.has-content {
        margin-bottom: 16px;
      }
      .sort-buttons {
        margin-bottom: 0px;
      }
    }`}
`

TopSection.defaultProps = {
  sortLabels: {
    sortBy: 'Sort by',
    order: 'Order',
    ascending: 'Ascending',
    descending: 'Descending',
  },
}

TopSection.propTypes = {
  sortLabels: PropTypes.shape({
    sortBy: PropTypes.node,
    order: PropTypes.node,
    ascending: PropTypes.node,
    descending: PropTypes.node,
  }),
  children: PropTypes.node,
}

TopSection.displayName = 'TopSection'

export default TopSection
