import * as React from 'react'
import Helmet from 'react-helmet'
import { color, ColorProps, textAlign, TextAlignProps } from 'styled-system'
import styled from 'styled-components'
import Box from '../../components/Box'

const CenteredList = styled.ul`
  list-style: none;
  text-align: center;
  padding-left: 0;
`

const Heading = styled.h2<TextAlignProps & ColorProps>`
  ${color}
  ${textAlign}
`

export default () => {
  return (
    <>
      <Helmet title="Foundation" />
      <h1>Cactus Foundations</h1>
      <p>The foundations are the building blocks that unify our system.</p>
      <Box display="flex" justifyContent="space-between" flexDirection="row">
        <Box p={3} flexBasis="25%">
          <Heading textAlign="center">Color</Heading>
          <CenteredList>
            <li>General Description</li>
            <li>Color Scheme</li>
            <li>Color Application</li>
            <li>Accessibility Standard</li>
          </CenteredList>
        </Box>
        <Box p={3} flexBasis="25%">
          <Heading textAlign="center">Typography</Heading>
          <CenteredList>
            <li>General Description</li>
            <li>Scale</li>
            <li>Weight</li>
            <li>Paragraph</li>
          </CenteredList>
        </Box>
        <Box p={3} flexBasis="25%">
          <Heading textAlign="center">Icons</Heading>
          <CenteredList>
            <li>Size</li>
            <li>Categories</li>
          </CenteredList>
        </Box>
        <Box p={3} flexBasis="25%">
          <Heading textAlign="center">Grid</Heading>
          <CenteredList>
            <li>Description</li>
            <li>Application</li>
          </CenteredList>
        </Box>
      </Box>
      <p>
        Next, we will review the <a href="../color/">color system</a>.
      </p>
    </>
  )
}
