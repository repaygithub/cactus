import PropTypes from 'prop-types'
import React, { ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'

import { cloneAll } from '../helpers/react'
import { textStyle } from '../helpers/theme'
import MenuButton from '../MenuButton/MenuButton'
import { ScreenSizeContext } from '../ScreenSizeProvider/ScreenSizeProvider'
import { DataGridContext, getMediaQuery } from './helpers'
import { DataColumnObject, JustifyContent, TransientProps } from './types'

export interface TopSectionProps {
  sortLabels?: SortLabels
  justifyContent?: JustifyContent
  spacing?: string | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
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
  const { sortLabels = {}, children, justifyContent = 'space-between', spacing = 4 } = props
  const { columns, sortOptions, onSort, isCardView, cardBreakpoint, variant } =
    useContext(DataGridContext)
  const screenSize = useContext(ScreenSizeContext)
  const { space } = useTheme()
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

  const margin = typeof spacing === 'number' ? `${space[spacing]}px` : spacing
  const isTinyScreen = screenSize.toString() === 'tiny'

  return (
    <StyledTopSection
      className={`top-section ${
        (hasChildren || (isCardView && sortableColumns.size > 0)) && 'has-content'
      }`}
      $isCardView={isCardView}
      $cardBreakpoint={cardBreakpoint}
      $justifyContent={justifyContent}
      $variant={variant}
    >
      {isCardView && sortableColumns.size > 0 && (
        <div className="sort-buttons">
          <MenuButton variant="unfilled" label={sortLabels.sortBy || 'Sort by'} mr={4}>
            {[...sortableColumns.keys()].map((key): ReactElement => {
              const col = sortableColumns.get(key) as DataColumnObject
              return (
                <MenuButton.Item key={key} onSelect={() => handleSortColChange(key)}>
                  {col.title}
                </MenuButton.Item>
              )
            })}
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
      {cloneAll(
        children,
        {
          style: isTinyScreen ? { marginTop: margin } : { marginLeft: margin },
        },
        (element: React.ReactElement, cloneProps: any, index): React.ReactElement => {
          if (!isTinyScreen && !isCardView && index === 0) {
            return element
          }
          return React.cloneElement(element, cloneProps)
        }
      )}
    </StyledTopSection>
  )
}

const StyledTopSection = styled.div<TransientProps & { $justifyContent: JustifyContent }>`
  // Card view styles
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
  ${(p) => textStyle(p.theme, p.$variant === 'mini' ? 'small' : 'body')}}

  &.has-content {
    margin-bottom: ${(p) =>
      p.$variant === 'mini' ? `${p.theme.space[3]}px` : `${p.theme.space[7]}px`};
  }

  // Non-card view styles
  ${getMediaQuery} {
    flex-direction: row;
    align-items: flex-start;
    ${(p) => `justify-content: ${p.$justifyContent};`}
  }

  // Card view styles when screen is larger than tiny
  ${(p) =>
    p.$isCardView &&
    `${p.theme.mediaQueries && p.theme.mediaQueries.small} {
      flex-direction: row;
      justify-content: ${p.$justifyContent};

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
  justifyContent: 'space-between',
  spacing: 4,
}

TopSection.propTypes = {
  sortLabels: PropTypes.shape({
    sortBy: PropTypes.node,
    order: PropTypes.node,
    ascending: PropTypes.node,
    descending: PropTypes.node,
  }),
  justifyContent: PropTypes.oneOf([
    'unset',
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
  ]),
  spacing: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7])]),
  children: PropTypes.node,
}

TopSection.displayName = 'TopSection'

export default TopSection
