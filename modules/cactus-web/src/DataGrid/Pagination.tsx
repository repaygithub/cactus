import { assignWith, isEqual } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Pagination, { PaginationProps } from '../Pagination/Pagination'
import PrevNext, { PrevNextProps } from '../PrevNext/PrevNext'
import { DataGridContext } from './helpers'
import { PageState, PageStateAction, pageStateKeys, PaginationOptions } from './types'

interface PageStateProps extends PageState {
  initialPage?: number
}

export interface ExtendedPaginationProps
  extends Omit<PaginationProps, 'currentPage' | 'pageCount'>,
    PageStateProps {}

export interface ExtendedPrevNextProps extends PrevNextProps, PageStateProps {}

export const calcPageState = (p: PageState): PaginationOptions => {
  // TS appeasement: comparison operators work perfectly fine with undefined.
  const r = p as Required<PageState>
  if (r.pageSize > 0) {
    if (r.itemCount >= 0) {
      r.pageCount = Math.ceil(r.itemCount / r.pageSize)
    }
    if (r.currentPage > 0) {
      if (r.currentPage > r.pageCount) {
        r.currentPage = r.pageCount
      }
      r.itemOffset = (r.currentPage - 1) * r.pageSize
    } else if (r.itemOffset >= 0) {
      r.currentPage = Math.floor(r.itemOffset / r.pageSize) + 1
      if (r.currentPage > r.pageCount) {
        r.currentPage = r.pageCount
        r.itemOffset = (r.currentPage - 1) * r.pageSize
      }
    }
  }
  return r
}

const assignIfUndefined = (dest: unknown, src: unknown) => dest ?? src

const interleave = (state: PageState, updates: PageState) => {
  // To get the correct derived/implied values from the updates, we do the
  // calculations twice: first with updates + pageSize, then combined with state.
  const combinedState = calcPageState({ pageSize: state.pageSize, ...updates })
  return calcPageState(assignWith(combinedState, state, assignIfUndefined))
}

export const pageStateReducer = (state: PaginationOptions, action: PageStateAction) => {
  const updates = typeof action === 'function' ? action(state) : action
  if (updates !== state) {
    const nextState = interleave(state, updates)
    return isEqual(state, nextState) ? state : nextState
  }
  return state
}

const usePageState = (props: PageStateProps) => {
  const { pageState, updatePageState } = React.useContext(DataGridContext)
  const controlledProps: PageState = {}
  for (const key of pageStateKeys) {
    if (props[key] !== undefined) controlledProps[key] = props[key]
    delete props[key] // Remove from props so the rest can be safely forwarded.
  }
  const combinedState = interleave(pageState, controlledProps)
  if (!combinedState.currentPage) {
    controlledProps.currentPage = combinedState.currentPage = props.initialPage || 1
  }
  delete props.initialPage

  React.useEffect(() => {
    updatePageState(controlledProps)
  })
  return [combinedState, updatePageState] as const
}

export const DataGridPagination: React.FC<ExtendedPaginationProps> = ({
  onPageChange,
  ...props
}) => {
  const [pageState, updatePageState] = usePageState(props)
  if (!pageState.pageCount) return null
  return (
    <Pagination
      {...props}
      currentPage={pageState.currentPage}
      pageCount={pageState.pageCount}
      onPageChange={(currentPage) => {
        updatePageState({ currentPage }, true)
        onPageChange?.(currentPage)
      }}
    />
  )
}
DataGridPagination.displayName = 'DataGrid.Pagination'

DataGridPagination.propTypes = {}
pageStateKeys.forEach((key) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  DataGridPagination.propTypes![key] = PropTypes.number
})

const incrementPage: PageStateAction = ({ currentPage = 0 }) => ({ currentPage: currentPage + 1 })
const decrementPage: PageStateAction = ({ currentPage = 2 }) => ({ currentPage: currentPage - 1 })

export const DataGridPrevNext: React.FC<ExtendedPrevNextProps> = ({ onNavigate, ...props }) => {
  const [pageState, updatePageState] = usePageState(props)
  return (
    <PrevNext
      disablePrev={pageState.currentPage === 1}
      onNavigate={(direction: 'prev' | 'next'): void => {
        updatePageState(direction === 'prev' ? decrementPage : incrementPage, true)
        onNavigate?.(direction)
      }}
      {...props}
    />
  )
}
DataGridPrevNext.displayName = 'DataGrid.PrevNext'

DataGridPrevNext.propTypes = {
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  itemOffset: PropTypes.number,
}
