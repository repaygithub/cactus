import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

export interface DimmerProps {
  active: boolean
  page?: boolean
}

type DimmerType = React.FC<DimmerProps> & {
  DimmableContent: typeof DimmableContent
}

const DimmableContent: React.FC = ({ children }) => {
  return <Container>{children}</Container>
}

const Dimmer: DimmerType = (props): React.ReactElement => {
  const { active, page, children } = props
  return active && (<DimmerStyled page={page}>{children}</DimmerStyled>)
}

Dimmer.DimmableContent = DimmableContent

const Container = styled.div`
  position: relative;
`

const DimmerStyled = styled.div<DimmerProps>`
  position: ${(p): string => (p.page ? 'fixed' : 'absolute')};
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
  page: PropTypes.bool,
}

Dimmer.defaultProps = {
  active: false,
  page: false,
}

DimmableContent.propTypes = {
  active: PropTypes.bool.isRequired,
}

DimmableContent.defaultProps = {
  active: false,
}

export default Dimmer
