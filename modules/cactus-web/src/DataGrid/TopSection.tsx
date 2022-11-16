import { mediaGTE, space, textStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { ReactElement, useContext } from 'react'
import styled, { useTheme } from 'styled-components'

import MenuButton from '../MenuButton/MenuButton'
import { DataGridContext, getMediaQuery } from './helpers'
import { JustifyContent, TransientProps } from './types'

export interface TopSectionProps {
  sortLabels?: SortLabels
  justifyContent?: JustifyContent
  spacing?: string | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  children?: React.ReactNode
}

interface ExtTransientProps extends TransientProps {
  $justifyContent: JustifyContent
  $itemMargin: string
}

interface SortLabels {
  sortBy?: React.ReactChild
  order?: React.ReactChild
  ascending?: React.ReactChild
  descending?: React.ReactChild
}

const TopSection = (props: TopSectionProps): ReactElement | null => {
  const { sortLabels = {}, children, justifyContent = 'space-between', spacing = 4 } = props
  const { sortableColumns, sortOptions, onSort, isCardView, cardBreakpoint, variant } =
    useContext(DataGridContext)
  const theme = useTheme()

  const handleSortColChange = (id: string) => {
    // TODO We should have a way (per column) to specify default sort direction.
    const { sortAscending: currentSortAscending = false } = sortOptions[0] || {}
    const newOptions = [{ id, sortAscending: currentSortAscending }]
    onSort(newOptions)
  }

  const handleSortDirChange = (sortAscending: boolean) => {
    if (sortOptions.length) {
      onSort([{ ...sortOptions[0], sortAscending }])
    }
  }

  const margin = typeof spacing === 'number' ? space(theme, spacing) : spacing

  return (
    <StyledTopSection
      className="top-section"
      $isCardView={isCardView}
      $cardBreakpoint={cardBreakpoint}
      $justifyContent={justifyContent}
      $itemMargin={margin}
      $variant={variant}
    >
      {isCardView && sortableColumns.length > 0 && (
        <div className="sort-buttons">
          <MenuButton variant="unfilled" label={sortLabels.sortBy || 'Sort by'} mr={4}>
            {sortableColumns.map(({ key, title }): ReactElement => {
              return (
                <MenuButton.Item key={key} onSelect={() => handleSortColChange(key)}>
                  {title}
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
      {children}
    </StyledTopSection>
  )
}

const StyledTopSection = styled.div<ExtTransientProps>`
  // Card view styles
  display: flex;
  flex-direction: column;
  align-items: center;
  ${(p) => textStyle(p, p.$variant === 'mini' ? 'small' : 'body')}

  margin-bottom: ${(p) => (p.$variant === 'mini' ? space(p, 3) : space(p, 7))};

  &:empty {
    display: none;
  }

  & > *:not(:first-child) {
    margin-top: ${(p) => p.$itemMargin};
    ${mediaGTE('small')} {
      margin-top: 0;
      margin-left: ${(p) => p.$itemMargin};
    }
  }

  // Non-card view styles
  ${getMediaQuery} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: ${(p) => p.$justifyContent};
  }

  // Card view styles when screen is larger than tiny
  ${(p) =>
    p.$isCardView &&
    `${mediaGTE(p, 'small')} {
      flex-direction: row;
      justify-content: ${p.$justifyContent};
      margin-bottom: 16px;

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
