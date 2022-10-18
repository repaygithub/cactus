import PropTypes from 'prop-types'
import React from 'react'

import { styledUnpoly } from '../helpers/styled'

export interface DimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean
}

const DimmerBase = React.forwardRef<HTMLDivElement, DimmerProps>(({ active, ...props }, ref) => {
  React.useEffect(() => {
    if (active && document.activeElement) {
      try {
        ;(document.activeElement as HTMLElement).blur()
      } catch {}
    }
  }, [active])
  return active ? <div {...props} ref={ref} /> : null
})
DimmerBase.displayName = 'Dimmer'

export const Dimmer = styledUnpoly(DimmerBase)`
  position: fixed;
  display: flex;
  background: rgba(46, 53, 56, 0.9);
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`
Dimmer.propTypes = {
  active: PropTypes.bool.isRequired,
}

export default Dimmer
