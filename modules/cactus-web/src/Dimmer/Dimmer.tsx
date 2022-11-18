import PropTypes from 'prop-types'
import React from 'react'
import { ResponsiveValue, system } from 'styled-system'

import { withStyles } from '../helpers/styled'

type Opacity = string | number
interface DimmerStyleProps {
  opacity?: ResponsiveValue<Opacity>
  position?: ResponsiveValue<'fixed' | 'absolute'>
}

interface DimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean
}

const DimmerBase = React.forwardRef<HTMLDivElement, DimmerProps>(({ active, ...props }, ref) => {
  return active ? <div {...props} ref={ref} /> : null
})

const background = (opacity?: Opacity) => `rgba(46, 53, 56, ${opacity || '0.9'})`

const dimmerStyles = system({
  position: true,
  opacity: {
    properties: ['backgroundColor'],
    transform: background,
  },
})

export const Dimmer = withStyles('div', {
  displayName: 'Dimmer',
  as: DimmerBase,
  styles: [dimmerStyles],
})<DimmerStyleProps>`
  position: fixed;
  display: flex;
  background-color: ${background()};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  ${dimmerStyles}
`
Dimmer.propTypes = {
  active: PropTypes.bool.isRequired,
}

export default Dimmer
