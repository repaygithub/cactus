import { Flex } from '@repay/cactus-web'
import { Link } from 'gatsby'
import * as React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { color, ColorProps, textAlign, TextAlignProps } from 'styled-system'

const CenteredList = styled.ul`
  list-style: none;
  text-align: center;
  padding-left: 0;

  @media only screen and (max-width: 500px) {
    font-size: 15px;
  }
`

const Heading = styled.h2<TextAlignProps & ColorProps>`
  ${color}
  ${textAlign}

  @media only screen and (max-width: 500px) {
    font-size: 20px;
  }
`

export default (): React.ReactElement => {
  return (
    <>
      <Helmet title="Foundation" />
      <h1>Cactus Foundations</h1>
      <p>The foundations are the building blocks that unify our system.</p>
      <Flex display="flex" justifyContent="space-between">
        <Flex p={3} flexBasis="25%" flexDirection="column">
          <Heading textAlign="center">Color</Heading>
          <CenteredList>
            <li>General Description</li>
            <li>Color Scheme</li>
            <li>Color Application</li>
            <li>Accessibility Standards</li>
          </CenteredList>
        </Flex>
        <Flex p={3} flexBasis="25%" flexDirection="column">
          <Heading textAlign="center">Typography</Heading>
          <CenteredList>
            <li>General Description</li>
            <li>Scale</li>
            <li>Weight</li>
            <li>Heirarchy</li>
          </CenteredList>
        </Flex>
        <Flex p={3} flexBasis="25%" flexDirection="column">
          <Heading textAlign="center">Icons</Heading>
          <CenteredList>
            <li>Size</li>
            <li>Categories</li>
          </CenteredList>
        </Flex>
        <Flex p={3} flexBasis="25%" flexDirection="column">
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
