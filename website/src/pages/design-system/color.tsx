import * as React from 'react'
import Helmet from 'react-helmet'
import Color from 'color'
import Box from '../../components/Box'
import cactusTheme, { ColorVariant } from '@repay/cactus-theme'

const upperCaseFirst = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

const extraStyles: React.CSSProperties = { textAlign: 'right', borderRadius: '4px' }

type ColorBoxProps = {
  name: ColorVariant
  title?: string
}

function ColorBox({ name, title }: ColorBoxProps) {
  let displayName = title || upperCaseFirst(name)
  let variant = cactusTheme.colorStyles[name]
  let hslaStr = variant.backgroundColor
  let c = Color(hslaStr)
  let [hue, saturation, luminosity, alpha] = c.array()
  return (
    <Box
      pt={4}
      px={3}
      pb={3}
      mx={4}
      my={3}
      flexBasis="240px"
      colors={name}
      borderWidth="1px"
      borderStyle="solid"
      borderColor={name === 'standard' ? cactusTheme.colors.mediumGray : variant.backgroundColor}
      style={extraStyles}
    >
      <span>#{displayName}</span>
      <br />
      <span>Hex {c.hex().slice(1)}</span>
      <br />
      <span>
        H{hue} S{saturation} L{luminosity} A{alpha}
      </span>
    </Box>
  )
}

export default () => {
  return (
    <>
      <Helmet title="Foundation" />
      <h1>Color</h1>
      <p>
        The first foundation is Color which is one of the most important aspects of our platform.
        Based on REPAY having many white-labelled products, we carefully thought of a strategy so we
        can achieve the same look and feel and meet the accessibility standards.
      </p>
      <Box display="flex" justifyContent="center" flexWrap="wrap">
        <ColorBox name="base" />
        <ColorBox name="callToAction" />
        <ColorBox name="standard" />
        <ColorBox name="lightContrast" />
        <ColorBox name="darkestContrast" />
        <ColorBox name="success" />
        <ColorBox name="error" />
        <ColorBox name="warning" />
        <ColorBox name="disable" />
      </Box>
      <p>
        Next, we will review the <a href="../typography/">typography</a>.
      </p>
    </>
  )
}
