import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

export interface DimmerProps {
  active: boolean
}

const Dimmer: React.FC<DimmerProps> = (props): React.ReactElement => {
  const { active, children } = props
  return active ? <DimmerStyled active>{children}</DimmerStyled> : <></>
}

const DimmerStyled = styled.div<DimmerProps>`
  position: fixed;
  display: ${(p): string => (!p.active ? 'none' : 'flex')};
  background: rgba(46, 53, 56, 0.9);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  vertical-align: middle;
  flex-direction: column;
  justify-content: center;
  z-index: 100;
`

Dimmer.propTypes = {
  active: PropTypes.bool.isRequired,
}

Dimmer.defaultProps = {
  active: false,
}

export default Dimmer
