import { MarginProps, margins } from '../helpers/margins'
import {
  NavigationChevronLeft,
  NavigationChevronRight,
  NavigationMenuDots,
} from '@repay/cactus-icons'
import Box from '../Box/Box'
import IconButton from '../IconButton/IconButton'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

interface PaginationProps extends MarginProps {
  size: number
  className?: string
  onPageChange: (selected: number) => void
  current: number
}

interface NumbersProps {
  size: number
  current: number
  pageElements: Array<React.ReactNode>
  className?: string
}

const RotatedMenuDots = styled(NavigationMenuDots)`
  transform: rotate(90deg);
`

const Button = styled('button')`
  background: none;
  border: none;
  appearance: none;
`

const ElementBox = styled(Box)`
  min-width: 28px;
  height: 28px;
  text-align: center;
  line-height: 26px;
  font-size: 15px;
  color: ${p => p.theme.colors.darkGray};
  position: relative;
  z-index: 0;

  border-left: 2px solid ${p => p.theme.colors.darkGray};

  ${NavigationChevronLeft},
  ${NavigationChevronRight},
  ${RotatedMenuDots} {
    width: 15px;
    height: 15px;
    color: ${p => p.theme.colors.darkGray};
  }

  &:hover{ 
    ${Button} {
      color: ${p => p.theme.colors.callToActionText};
      width: 19px; 
      height: 19px;
      padding: 0px;
      border-radius: 50%;
      background-color: ${p => p.theme.colors.callToAction};
    }
  }

  &.is-selected {
    ${Button}{
      color: ${p => p.theme.colors.callToActionText};
      width: 19px; 
      height: 19px;
      border-radius: 50%;
      padding: 0px;
      background-color: ${p => p.theme.colors.base};
    }
  }
  & + & {
      border-left: 2px solid ${p => p.theme.colors.darkGray};
  }
`

function DotsIcon() {
  return (
    <ElementBox>
      <RotatedMenuDots />
    </ElementBox>
  )
}

const NumbersBase = (props: NumbersProps) => {
  const { size, current, pageElements, className } = props

  if (size < 6) {
    return <div className={className}>{pageElements}</div>
  } else if (current >= size - 1) {
    return (
      <div className={className}>
        {pageElements.slice(0, 2)}
        <DotsIcon />
        {pageElements.slice(-2)}
      </div>
    )
  } else if (current > 3) {
    return (
      <div className={className}>
        {pageElements[0]}
        <DotsIcon />
        {pageElements[current - 1]}
        <DotsIcon />
        {pageElements.slice(size - 1)}
      </div>
    )
  } else {
    return (
      <div className={className}>
        {pageElements.slice(0, 3)}
        <DotsIcon />
        {pageElements.slice(-1)}
      </div>
    )
  }
}

const Numbers = styled(NumbersBase)`
  display: flex;
  flex-direction: row;
`

const PaginationBase = (props: PaginationProps) => {
  const { size, current, className, onPageChange } = props

  const onClickRight = React.useCallback(() => onPageChange(current + 1), [current, onPageChange])
  const onClickLeft = React.useCallback(() => onPageChange(current - 1), [current, onPageChange])

  if (size < 1) {
    return <div />
  }

  var pages = Array.from(Array(size), (_, index) => index + 1)
  var pageElements = pages.map(function(page) {
    const className = current === page ? 'is-selected' : ''
    return (
      <ElementBox key={page} className={className}>
        <Button onClick={() => onPageChange(page)}> {page}</Button>
      </ElementBox>
    )
  })

  const leftDisabled = current === 1
  const rightDisabled = current >= size
  return (
    <div className={className}>
      <ElementBox style={{ border: 'none', lineHeight: '32px' }}>
        <IconButton
          variant="action"
          label="Left arrow, navigate to previous page"
          onClick={onClickLeft}
          disabled={leftDisabled}
        >
          <NavigationChevronLeft />
        </IconButton>
      </ElementBox>

      <Numbers size={size} current={current} pageElements={pageElements} />

      <ElementBox style={{ lineHeight: '32px' }}>
        <IconButton
          variant="action"
          label="Right arrow, navigate to next page"
          onClick={onClickRight}
          disabled={rightDisabled}
        >
          <NavigationChevronRight />
        </IconButton>
      </ElementBox>
    </div>
  )
}

export const Pagination = styled(PaginationBase)<PaginationProps>`
  ${margins}
  display: flex;
  flex-direction: row;
`

//@ts-ignore
Pagination.propTypes = {
  size: PropTypes.number.isRequired,
}

export default Pagination
