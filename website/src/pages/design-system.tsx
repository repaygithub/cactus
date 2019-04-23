import * as React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import Box from '../../components/Box'

const Em = styled.em`
  font-style: normal;
  font-weight: 600;
  color: ${p => p.theme.colors.callToAction};
`

export default () => {
  return (
    <>
      <Helmet title="Style Guide" />
      <h1>Cactus Design System</h1>
      <p>
        We present our living style guide for the Cactus Design System. Everything here will evolve
        as our design system learns from implementation.
      </p>
      <p>
        Next, read about our <a href="/design-system/language/">design language</a>.
      </p>
    </>
  )
}
