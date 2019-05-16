import * as React from 'react'

import { AccessibilityBox, ColorBox, PaletteBox } from '../../components/Color'
import { Link } from 'gatsby'
import Box, { Flex } from '../../components/Box'
import Helmet from 'react-helmet'
import Text, { Span } from '../../components/Text'

export default () => {
  return (
    <>
      <Helmet title="Color" />
      <h1>Color</h1>
      <p>
        The first foundation is Color, which is one of the most important aspects of our platform.
        Based on REPAY having many white-labelled products, we carefully thought of a strategy so we
        can achieve the same look and feel while meeting accessibility standards.
      </p>
      <Flex display="flex" justifyContent="center" flexWrap="wrap" maxWidth="1200px" m="0 auto">
        <ColorBox name="base" />
        <ColorBox name="callToAction" />
        <ColorBox name="standard" title="White" />
        <ColorBox name="lightContrast" />
        <ColorBox name="darkestContrast" />
        <ColorBox name="success" />
        <ColorBox name="error" />
        <ColorBox name="warning" />
        <ColorBox name="disable" />
      </Flex>
      <h2>Color Scheme</h2>
      <p>
        The standard Cactus color scheme is based on a monochromatic palette and a complementary
        action scheme. All the colors of the monochromatic scheme are based on one factor (HUE) and
        the rest will be variations (brightness and saturation).
      </p>
      <h3 style={{ fontWeight: 400 }}>Monochromatic Scheme</h3>
      <Flex display="flex" justifyContent="center" flexWrap="wrap" maxWidth="1200px" m="0 auto">
        <ColorBox name="base">
          <h4>Base Color</h4>
          <Text fontSize="small">
            This color is the brand color or base color of the scheme. It will be prominent
            throughout the product.
          </Text>
        </ColorBox>
        <ColorBox name="callToAction">
          <h4>Call to Action</h4>
          <Text fontSize="small">
            This color is a lighter variation of the base color. This accent color will be used in
            small amounts in order to stand out.
          </Text>
        </ColorBox>
        <ColorBox name="standard" title="White">
          <h4>White</h4>
          <Text fontSize="small">
            White is a common color included in a color scheme. It provides balance and harmonizes
            the scheme.
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
            This color is part of our intuitive scheme. Green will mean success and positive
            outcomes.
          </Text>
        </ColorBox>
        <ColorBox name="error">
          <h4>Red</h4>
          <Text fontSize="small">
            This color is part of our intuitive scheme. Red will mean error and destructive
            outcomes.
          </Text>
        </ColorBox>
        <ColorBox name="warning">
          <h4>Yellow</h4>
          <Text fontSize="small">
            This color is part of our intuitive scheme. Yellow will indicate warning and bringing to
            attention.
          </Text>
        </ColorBox>
        <ColorBox name="disable">
          <h4>Gray</h4>
          <Text fontSize="small">
            This color is part of our intuitive scheme. Gray color indicates disabled or not yet
            available.
          </Text>
        </ColorBox>
      </Flex>
      <h2>Color Application</h2>
      <p>
        Colors must be used in a consistent manor throughout the application to solidify the design
        language and guide the user.
      </p>
      <Flex
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        maxWidth="1200px"
        margin="0 auto"
      >
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
      </Flex>
      <h2>Accessibility Standards</h2>
      <Text>
        Beware of foreground and background contrast issues and ensure the text always passes
        minimum WCAG AA guidance. We can quantify contrast in a "contrast ratio" of the background
        color and the text color.
      </Text>
      <Text>
        <Span fontWeight={600}>Level AA</Span> requires a contrast ratio of at least 4.5:1 for
        normal text and 3:1 for large text. <br />
        Graphics and user <Span fontWeight={600}>interface</Span> components (such as form input
        borders) also require a 3:1. <br />
        <Span fontWeight={600}>Level AAA</Span> requires a contrast ratio of at least 7:1 for normal
        text and 4.5:1 for large text.
      </Text>
      <Text fontStyle="italic">
        Large text is defined as 14 point (18.66px) and bold or 18 point (24px) and larger and not
        bold. Note that these requirements don't apply to decorative elements like logos and
        illustrations.
      </Text>
      <Flex
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        maxWidth="1200px"
        margin="0 auto"
      >
        <AccessibilityBox color="base" title="Base" isDark />
        <AccessibilityBox color="callToAction" title="CTA" isDark />
        <AccessibilityBox color="white" title="White" isDark={false} />
        <AccessibilityBox color="darkestContrast" title="DarkestContrast" isDark />
        <AccessibilityBox color="darkContrast" title="DarkContrast" isDark />
        <AccessibilityBox color="mediumContrast" title="MediumContrast" isDark />
        <AccessibilityBox color="lightContrast" title="LightContrast" isDark={false} />
        <AccessibilityBox color="success" title="Success" isDark />
        <AccessibilityBox color="error" title="Error" isDark />
        <AccessibilityBox color="warning" title="Warning" isDark={false} />
        <AccessibilityBox color="lightGray" title="LightGray" isDark={false} />
        <AccessibilityBox color="mediumGray" title="MediumGray" isDark />
        <AccessibilityBox color="darkGray" title="DarkGray" isDark />
      </Flex>
      <Text as="h4" fontSize="h4">
        Exceptions to contrast requirements:
      </Text>
      <Text>
        <Span fontWeight={600}>Large Text:</Span> Large-scale text and images of large-scale text
        have a contrast ratio of at least 3:1.
      </Text>
      <Text>
        <Span fontWeight={600}>Incidental:</Span> Text or images of text that are part of an
        inactive user interface component, pure decoration, not visible to users, or within a
        picture that contains significant other visual content all have no contrast requirements.
      </Text>
      <Text>
        <Span fontWeight={600}>Logos:</Span> Text that is part of a logo or brand name has no
        minimum contrast requirement.
      </Text>
      <p>
        Now we'll review <Link to="/design-system/typography/">typography</Link> decisions.
      </p>
    </>
  )
}
