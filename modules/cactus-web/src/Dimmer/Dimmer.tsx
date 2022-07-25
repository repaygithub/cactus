import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

export interface DimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  active: boolean
}

// TODO Use the idea from Modal of having separate scroll & flex elements? Also scroll trap.
class DimmerBase extends React.Component<DimmerProps> {
  public static propTypes = {
    active: PropTypes.bool.isRequired,
  }
  componentDidUpdate(prevProps: DimmerProps): void {
    if (prevProps.active === false && this.props.active === true && document.activeElement) {
      try {
        ;(document.activeElement as HTMLElement).blur()
      } catch {}
    }
  }
  render(): React.ReactElement | null {
    const { active, ...rest } = this.props
    return active ? <div {...rest} /> : null
  }
}

export const Dimmer = styled(DimmerBase).attrs({ as: DimmerBase })`
  position: fixed;
  display: flex;
  background: rgba(46, 53, 56, 0.9);
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`

export default Dimmer
