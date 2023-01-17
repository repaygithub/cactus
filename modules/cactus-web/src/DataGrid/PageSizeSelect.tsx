import { border, ColorStyle, textStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { ReactElement } from 'react'
import { margin, MarginProps } from 'styled-system'

import { keyDownAsClick } from '../helpers/a11y'
import { withStyles } from '../helpers/styled'
import { useDataGridContext } from './DataGridContext'

export interface PageSizeSelectProps {
  pageSize?: number
  onPageSizeChange?: (pageSize: number) => void
  initialPageSize?: number
  makePageSizeLabel?: (pageSize: number) => string
  pageSizeSelectLabel?: React.ReactNode
  pageSizeOptions: number[]
}

const defaultPageSizeLabel = (pageSize: number): string => `View ${pageSize} rows per page`

const BasePageSizeSelect = (props: PageSizeSelectProps): ReactElement => {
  const { pageState, updatePageState } = useDataGridContext('DataGrid.PageSizeSelect')
  const {
    pageSizeSelectLabel,
    pageSizeOptions,
    makePageSizeLabel = defaultPageSizeLabel,
    initialPageSize = 1,
    pageSize: currentPageSize = pageState.pageSize || initialPageSize,
    onPageSizeChange,
    ...rest
  } = props
  React.useEffect(() => {
    updatePageState({ pageSize: currentPageSize }, false)
  }, [currentPageSize]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div {...rest}>
      <span>{pageSizeSelectLabel || 'View'}</span>
      <ol className="page-options-list">
        {pageSizeOptions?.map((pageSize): ReactElement => {
          const isCurrentPageSize = currentPageSize === pageSize
          return (
            <li className="page-option" key={`page-size-option-${pageSize}`}>
              <a
                role="link"
                aria-selected={isCurrentPageSize ? 'true' : 'false'}
                onClick={() => {
                  updatePageState({ pageSize }, true)
                  onPageSizeChange?.(pageSize)
                }}
                onKeyDown={keyDownAsClick}
                tabIndex={isCurrentPageSize ? undefined : 0}
                aria-label={makePageSizeLabel(pageSize)}
              >
                {pageSize}
              </a>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

const PageSizeSelect = withStyles('div', {
  as: BasePageSizeSelect,
  displayName: 'PageSizeSelect',
  styles: [margin],
})<MarginProps>`
  display: inline-box;
  ${textStyle('small')}

  span {
    margin-right: 8px;
  }

  .page-options-list {
    display: inline-flex;
    flex-wrap: nowrap;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .page-option {
    min-width: 15px;
    height: 24px;
    text-align: center;
    background: none;
    appearance: none;
    padding: 2px 8px;
    display: block;

    border-left: ${border('lightContrast')};

    &:last-child {
      border-right: ${border('lightContrast')};
    }

    &,
    a {
      color: ${(p): string => p.theme.colors.darkestContrast};
      text-decoration: none;
    }

    a {
      cursor: pointer;
      padding: 3px;
      vertical-align: middle;
      display: block;
      border-radius: 8px;

      text-decoration: none;
      color: inherit;

      &:hover {
        color: ${(p): string => p.theme.colors.callToAction};
      }

      &:active,
      &:focus {
        // Re-stated to prevent a small shift when the button is clicked in Firefox
        padding: 3px;
        outline: none;
        ${(p): ColorStyle => p.theme.colorStyles.callToAction};
      }

      &[aria-selected='true'] {
        ${(p): ColorStyle => p.theme.colorStyles.base};
      }
    }
  }
`

PageSizeSelect.defaultProps = {
  makePageSizeLabel: defaultPageSizeLabel,
}

PageSizeSelect.propTypes = {
  makePageSizeLabel: PropTypes.func,
  pageSizeSelectLabel: PropTypes.node,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
}

export default PageSizeSelect
