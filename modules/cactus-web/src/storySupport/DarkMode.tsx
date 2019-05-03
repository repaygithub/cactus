import React, { Component } from 'react'

import cactusTheme from '@repay/cactus-theme'

const darkModeStyle: React.CSSProperties = {
  backgroundColor: cactusTheme.colors.base,
  width: '100vw',
  height: '100vh',
  textAlign: 'center',
  padding: '20px',
}

class DarkMode extends Component {
  render() {
    return <div style={darkModeStyle}>{this.props.children}</div>
  }
}

export default DarkMode
