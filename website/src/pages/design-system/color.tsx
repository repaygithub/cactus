import * as React from 'react'
import Helmet from 'react-helmet'
import Color from 'color'
import Box from '../../components/Box'
import Text from '../../components/Text'
import { Link } from 'gatsby'
import cactusTheme, { ColorVariant, CactusColor } from '@repay/cactus-theme'

const upperCaseFirst = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

const extraStyles: React.CSSProperties = { textAlign: 'right', borderRadius: '4px' }

type ColorDisplayProps = {
  displayName?: string
  color: CactusColor | string
  textColor?: CactusColor | string
}

function isCactusColor(color: string): color is CactusColor {
  return cactusTheme.colors.hasOwnProperty(color)
}

function ColorDisplay({ displayName, color, textColor }: ColorDisplayProps) {
  const hasDisplayName = Boolean(displayName)
  let hslaStr: string
  if (isCactusColor(color)) {
    hslaStr = cactusTheme.colors[color]
  } else {
    hslaStr = color
  }
  let c = Color(hslaStr)
  let [hue, saturation, luminosity, alpha] = c.array()
  const isWhite = hue === 0 && saturation === 0 && luminosity === 100
  return (
    <Box
      pt={hasDisplayName ? 4 : 3}
      px={3}
      pb={3}
      mb={hasDisplayName ? 0 : '-4px'}
      width="100%"
      color={textColor}
      bg={color}
      borderWidth="1px"
      borderStyle="solid"
      borderColor={isWhite ? cactusTheme.colors.mediumGray : color}
      style={extraStyles}
    >
      {hasDisplayName && (
        <>
          <span>#{displayName}</span>
          <br />
        </>
      )}
      <span>Hex {c.hex().slice(1)}</span>
      <br />
      <span>
        H{hue} S{saturation} L{luminosity} A{alpha}
      </span>
    </Box>
  )
}

type ColorBoxProps = {
  name: ColorVariant
  title?: string
  children?: React.ReactNode
}

function ColorBox({ name, title, children }: ColorBoxProps) {
  let displayName = title || upperCaseFirst(name)
  let variant = cactusTheme.colorStyles[name]
  return (
    <Box px={4} py={3} width="240px">
      <ColorDisplay
        displayName={displayName}
        color={variant.backgroundColor}
        textColor={variant.color}
      />
      {children}
    </Box>
  )
}

type PaletteItem = {
  bg: CactusColor
  color: CactusColor
}

type PaletteBoxProps = {
  colors: PaletteItem[]
  title: string
  children?: React.ReactNode
}

function PaletteBox({ colors, title, children }: PaletteBoxProps) {
  return (
    <Box px={4} py={3} width="240px">
      {colors.map((item, index) => (
        <ColorDisplay
          displayName={index === colors.length ? title : undefined}
          color={item.bg}
          textColor={item.color}
        />
      ))}
      {children}
    </Box>
  )
}

export default () => {
  return (
    <>
      <Helmet title="Color" />
      <h1>Color</h1>
      <p>
        The first foundation is Color which is one of the most important aspects of our platform.
        Based on REPAY having many white-labelled products, we carefully thought of a strategy so we
        can achieve the same look and feel and meet the accessibility standards.
      </p>
      <Box display="flex" justifyContent="center" flexWrap="wrap" maxWidth="1200px" m="0 auto">
        <ColorBox name="base" />
        <ColorBox name="callToAction" />
        <ColorBox name="standard" title="White" />
        <ColorBox name="lightContrast" />
        <ColorBox name="darkestContrast" />
        <ColorBox name="success" />
        <ColorBox name="error" />
        <ColorBox name="warning" />
        <ColorBox name="disable" />
      </Box>
      <h2>Color Scheme</h2>
      <p>
        The standard Cactus color scheme is based on a monochromatic palette and a complementary
        action scheme. All the colors of the monochromatic scheme are based on one factor (HUE) and
        the rest will be variations (brightness and saturation).
      </p>
      <h3 style={{ fontWeight: 400 }}>Monochromatic Scheme</h3>
      <Box display="flex" justifyContent="center" flexWrap="wrap" maxWidth="1200px" m="0 auto">
        <ColorBox name="base">
          <h4>Base Color</h4>
          <Text fontSize="small">
            This color will be the base of the color scheme and will be common throughout the
            product. As the base, it will define the rest of the palette.
          </Text>
        </ColorBox>
        <ColorBox name="callToAction">
          <h4>Call to Action</h4>
          <Text fontSize="small">
            It is a variation of our base color; the standard scheme has a dark base and this color
            as additional luminosity / lightness. This is an accent color and is used infrequently
            to draw attention and imply an action.
          </Text>
        </ColorBox>
        <ColorBox name="standard" title="White">
          <h4>White</h4>
          <Text fontSize="small">
            White is a common color and will be used throughout to balance and harmonize the scheme.
          </Text>
        </ColorBox>
        <ColorBox name="lightContrast">
          <h4>Light Contrast</h4>
          <Text fontSize="small">
            Contrast colors are founded on the base color, but desaturated and built on a scale.
          </Text>
        </ColorBox>
        <ColorBox name="darkestContrast">
          <h4>Darkest Contrast</h4>
          <Text fontSize="small">A dark and desaturated version of the base color.</Text>
        </ColorBox>
        <ColorBox name="success">
          <h4>Green</h4>
          <Text fontSize="small">
            This color is part of our intuitive scheme, so green will mean success and positive
            outcomes.
          </Text>
        </ColorBox>
        <ColorBox name="error">
          <h4>Red</h4>
          <Text fontSize="small">
            This color is part of our intuitive scheme, so red will mean error and negative.
          </Text>
        </ColorBox>
        <ColorBox name="warning">
          <h4>Yellow</h4>
          <Text fontSize="small">
            This color is part of our intuitive scheme, yellow will indicate warning and bringing to
            attention but moderate.
          </Text>
        </ColorBox>
        <ColorBox name="disable">
          <h4>Gray</h4>
          <Text fontSize="small">
            The fully desaturated gray color indicates disabled or not yet available.
          </Text>
        </ColorBox>
      </Box>
      <h2>Color Application</h2>
      <p>
        Colors must be used in a consistent manor throughout the application to solidify the design
        language and guide the user.
      </p>
      <Box display="flex" justifyContent="center" flexWrap="wrap" maxWidth="1200px" margin="0 auto">
        <ColorBox name="base">
          <h4>Base Color</h4>
          <Text fontSize="small">Headers, standard buttons, selection controls, hover states</Text>
        </ColorBox>
        <ColorBox name="callToAction">
          <h4>Call to Action</h4>
          <Text fontSize="small">Call to action buttons, Icons, hover and focus states</Text>
        </ColorBox>
        <ColorBox name="standard" title="White">
          <h4>White</h4>
          <Text fontSize="small">Surfaces, text for dark backgrounds, and creating contrast</Text>
        </ColorBox>
        <PaletteBox
          title="LightContrast"
          colors={[
            { bg: 'darkContrast', color: 'white' },
            { bg: 'mediumContrast', color: 'white' },
            { bg: 'lightContrast', color: 'darkestContrast' },
          ]}
        >
          <h4>Light Contrast</h4>
          <Text fontSize="small">Zebra contrast, shadows, text field placeholder</Text>
        </PaletteBox>
        <ColorBox name="darkestContrast">
          <h4>Darkest Contrast</h4>
          <Text fontSize="small">Text</Text>
        </ColorBox>
        <ColorBox name="success">
          <h4>Green</h4>
          <Text fontSize="small">
            Positive indicators, alert messages, action buttons, text fields, headlines, and icons
          </Text>
        </ColorBox>
        <ColorBox name="error">
          <h4>Red</h4>
          <Text fontSize="small">
            Negative indicators, alert messages, action buttons, text fields, headlines, and icons
          </Text>
        </ColorBox>
        <ColorBox name="warning">
          <h4>Yellow</h4>
          <Text fontSize="small">
            Moderate indicators, alert messages, action buttons, text fields, headlines, and icons
          </Text>
        </ColorBox>
        <PaletteBox
          title="Disable"
          colors={[
            { bg: 'darkGray', color: 'white' },
            { bg: 'mediumGray', color: 'white' },
            { bg: 'lightGray', color: 'darkestContrast' },
          ]}
        >
          <h4>Gray</h4>
          <Text fontSize="small">
            Neutral indicators, alert messages, action buttons, text fields, headlines, and icons
          </Text>
        </PaletteBox>
      </Box>
      <p>TODO: Accessibility charts</p>
      <p>
        Next, we will review the <Link to="/design-system/typography/">typography</Link>.
      </p>
    </>
  )
}
