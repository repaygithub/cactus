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

export const calcPageState = <S extends PageState>(pageState: S): S => {
  // TS appeasement: comparison operators work perfectly fine with undefined.
  const p = pageState as Required<PageState>
  if (p.pageSize > 0) {
    if (p.itemCount >= 0) {
      p.pageCount = Math.ceil(p.itemCount / p.pageSize)
    }
    if (p.currentPage > 0) {
      if (p.currentPage > p.pageCount) {
        p.currentPage = Math.max(1, p.pageCount)
      }
      p.itemOffset = (p.currentPage - 1) * p.pageSize
    } else if (p.itemOffset >= 0) {
      p.currentPage = Math.floor(p.itemOffset / p.pageSize) + 1
      if (p.currentPage > p.pageCount) {
        p.currentPage = Math.max(1, p.pageCount)
        p.itemOffset = (p.currentPage - 1) * p.pageSize
      }
    }
  }
  return pageState
}

const assignIfUndefined = (dest: unknown, src: unknown) => dest ?? src

const interleave = (state: PageState, updates: PageState) => {
  // To get the correct derived/implied values from the updates, we do the
  // calculations twice: first with updates + pageSize, then combined with state.
  const combinedState = calcPageState({ pageSize: state.pageSize, ...updates })
  return calcPageState(assignWith(combinedState, state, assignIfUndefined))
}

type PageStateReducer = React.Reducer<PaginationOptions, PageStateAction>
export const pageStateReducer: PageStateReducer = (state, action) => {
  const updates = typeof action === 'function' ? action(state) : action
  const nextState = interleave(state, updates) as PaginationOptions
  return isEqual(state, nextState) ? state : nextState
}

const usePageState = (props: PageStateProps) => {
  const { pageState, updatePageState } = React.useContext(DataGridContext)
  const pagePropValues = []
  const controlledProps: PageState = {}
  for (const key of pageStateKeys) {
    pagePropValues.push(props[key])
    if (props[key] !== undefined) controlledProps[key] = props[key]
    delete props[key] // Remove from props so the rest can be safely forwarded.
  }
  React.useEffect(() => {
    updatePageState(controlledProps)
  }, pagePropValues) // eslint-disable-line react-hooks/exhaustive-deps

  const combinedState = interleave(pageState, controlledProps)
  if (!combinedState.currentPage) {
    controlledProps.currentPage = combinedState.currentPage = props.initialPage || 1
  }
  delete props.initialPage
  return [combinedState, updatePageState] as const
}

export const DataGridPagination: React.FC<ExtendedPaginationProps> = ({
  onPageChange,
  ...props
}) => {
  const [pageState, updatePageState] = usePageState(props)
  if (!pageState.currentPage || !pageState.pageCount) return null
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
        const changePage = direction === 'prev' ? decrementPage : incrementPage
        updatePageState(changePage, true)
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
