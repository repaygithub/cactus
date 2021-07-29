import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

export interface DimmerProps extends React.HTMLAttributes<HTMLDivElement> {
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
  render(): React.ReactElement | null {
    const { active, ...rest } = this.props
    return active ? <DimmerStyled {...rest} /> : null
  }
}

export const dimmerStyles = `
  position: fixed;
  display: flex;
  background: rgba(46, 53, 56, 0.9);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`

const DimmerStyled = styled.div`
  ${dimmerStyles}
`

export default Dimmer
