import { ColorStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { ReactElement, useContext } from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { keyDownAsClick } from '../helpers/a11y'
import { border, fontSize } from '../helpers/theme'
import { DataGridContext } from './helpers'

export interface PageSizeSelectProps extends MarginProps {
  makePageSizeLabel?: (pageSize: number) => string
  pageSizeSelectLabel?: React.ReactChild
  pageSizeOptions: number[]
}

const defaultPageSizeLabel = (pageSize: number): string => `View ${pageSize} rows per page`

const PageSizeSelect = (props: PageSizeSelectProps): ReactElement => {
  const {
    pageSizeSelectLabel,
    pageSizeOptions,
    makePageSizeLabel = defaultPageSizeLabel,
    ...rest
  } = props
  const { paginationOptions, onPageChange } = useContext(DataGridContext)
  return (
    <StyledPageSizeSelect {...rest}>
      <span>{pageSizeSelectLabel || 'View'}</span>
      <ol className="page-options-list">
        {pageSizeOptions &&
          paginationOptions &&
          pageSizeOptions.map(
            (pageSize): ReactElement => {
              const isCurrentPageSize = paginationOptions.pageSize === pageSize
              return (
                <li className="page-option" key={`page-size-option-${pageSize}`}>
                  <a
                    role="link"
                    aria-selected={isCurrentPageSize ? 'true' : 'false'}
                    onClick={(): void => {
                      onPageChange({ ...paginationOptions, pageSize: pageSize })
                    }}
                    onKeyDown={keyDownAsClick}
                    tabIndex={isCurrentPageSize ? undefined : 0}
                    aria-label={makePageSizeLabel(pageSize)}
                  >
                    {pageSize}
                  </a>
                </li>
              )
            }
          )}
      </ol>
    </StyledPageSizeSelect>
  )
}

const StyledPageSizeSelect = styled.div`
  display: inline-box;
  ${margin}

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

    border-left: ${(p): string => border(p.theme, 'lightContrast')};

    &:last-child {
      border-right: ${(p): string => border(p.theme, 'lightContrast')};
    }

    &,
    a {
      color: ${(p): string => p.theme.colors.darkestContrast};
      ${(p): string => fontSize(p.theme, 'small')};
      line-height: 18px;
      text-decoration: none;
    }

    a {
      cursor: pointer;
      padding: 3px;
      vertical-align: middle;
      line-height: 18px;
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
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
}

PageSizeSelect.displayName = 'PageSizeSelect'

export default PageSizeSelect
