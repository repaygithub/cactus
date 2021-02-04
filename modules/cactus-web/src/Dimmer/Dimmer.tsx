import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

export interface DimmerProps {
  active: boolean
}

class Dimmer extends React.Component<DimmerProps> {
  public static propTypes = {
    active: PropTypes.bool.isRequired,
  }
  public static defaultProps = {
    active: false,
  }
  componentDidUpdate(prevProps: DimmerProps): void {
    if (prevProps.active === false && this.props.active === true && document.activeElement) {
      try {
        ;(document.activeElement as HTMLElement).blur()
      } catch {}
    }
  }
  render(): React.ReactElement {
    const { active, children } = this.props
    return active ? <DimmerStyled>{children}</DimmerStyled> : <></>
  }
}

export const DimmerStyled = styled.div`
  position: fixed;
  display: flex;
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

export default Dimmer
