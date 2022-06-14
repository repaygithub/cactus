import { color } from '@repay/cactus-theme'
import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled from 'styled-components'

import { isIE } from '../helpers/constants'

export type SlideDirection = 'left' | 'right'

export interface SliderProps {
  transition?: SlideDirection
  transitionKey?: string
}

const TIMEOUT = isIE ? 400 : 300

const Slider: React.FC<React.PropsWithChildren<SliderProps>> = ({
  transition,
  transitionKey,
  children,
}) => (
  <TransitionGroup component={SlideWrapper}>
    <CSSTransition key={transitionKey} timeout={TIMEOUT} classNames={transition}>
      {children}
    </CSSTransition>
  </TransitionGroup>
)

export default Slider

// Using `-enter ~ *` works better than `-exit` when you alternate directions.
const SlideWrapper = styled.div`
  position: relative;
  background-color: ${color('lightContrast')};

  > * {
    position: absolute;
    :first-child {
      position: relative;
    }
  }

  .right-enter {
    left: 300px;
  }
  .right-enter-active {
    left: 0;
    transition: left ${TIMEOUT}ms ease-out;
  }
  .right-enter ~ * {
    right: 0;
  }
  .right-enter-active ~ * {
    right: 300px;
    transition: right ${TIMEOUT}ms ease-out;
  }

  .left-enter {
    right: 300px;
  }
  .left-enter-active {
    right: 0;
    transition: right ${TIMEOUT}ms ease-out;
  }
  .left-enter ~ * {
    left: 0;
  }
  .left-enter-active ~ * {
    left: 300px;
    transition: left ${TIMEOUT}ms ease-out;
  }
`
