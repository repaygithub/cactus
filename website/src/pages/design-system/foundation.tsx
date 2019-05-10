import * as React from 'react'

import { color, ColorProps, textAlign, TextAlignProps } from 'styled-system'
import { Link } from 'gatsby'
import Box, { Flex } from '../../components/Box'
import Helmet from 'react-helmet'
import styled from 'styled-components'

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
      <Flex display="flex" justifyContent="space-between" flexDirection="row">
        <Flex p={3} flexBasis="25%">
          <Heading textAlign="center">Color</Heading>
          <CenteredList>
            <li>General Description</li>
            <li>Color Scheme</li>
            <li>Color Application</li>
            <li>Accessibility Standards</li>
          </CenteredList>
        </Flex>
        <Flex p={3} flexBasis="25%">
          <Heading textAlign="center">Typography</Heading>
          <CenteredList>
            <li>General Description</li>
            <li>Scale</li>
            <li>Weight</li>
            <li>Heirarchy</li>
          </CenteredList>
        </Flex>
        <Flex p={3} flexBasis="25%">
          <Heading textAlign="center">Icons</Heading>
          <CenteredList>
            <li>Size</li>
            <li>Categories</li>
          </CenteredList>
        </Flex>
        <Flex p={3} flexBasis="25%">
          <Heading textAlign="center">Grid</Heading>
          <CenteredList>
            <li>Description</li>
            <li>Application</li>
          </CenteredList>
        </Flex>
      </Flex>
      <p>
        Let's review the <Link to="/design-system/color/">color system</Link>.
      </p>
    </>
  )
}
