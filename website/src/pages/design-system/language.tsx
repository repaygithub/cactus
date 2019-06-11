import * as React from 'react'

import { Flex } from '@repay/cactus-web'
import Helmet from 'react-helmet'
import Link from '../../components/Link'
import styled from 'styled-components'

const Em = styled.em`
  font-style: normal;
  font-weight: 600;
  color: ${p => p.theme.colors.callToAction};
`

export default () => {
  return (
    <>
      <Helmet title="Design Language" />
      <h1>Cactus Design Language</h1>
      <p>
        Our system is built based on the atomic design approach. It provides guidelines, reusable UI
        components, and visual styles. Everything you need to deliver a clear, consistent visual
        experience across all platforms.
      </p>
      <h2>Design Principles</h2>
      <p>
        Our priorities are based on creating a clear design, with consistent patterns that are
        intuitive and reusable, for a solid and timeless experience. These 4 principles serve as a
        foundation for our design and creative process. They are our fundamental truth.
      </p>
      <Flex display="flex" justifyContent="space-between">
        <Flex p="8px" flexBasis="25%" flexDirection="column">
          <h4>Clear</h4>
          <p>
            An easy to perceive and understand design. It should take minimal effort to identify a
            component or navigate the interface. The text is legible at every size, icons are
            well-defined and obvious. Color is monochrome and minimal. Components are accessible by
            default.
          </p>
        </Flex>
        <Flex p="8px" flexBasis="25%" flexDirection="column">
          <h4>Consistent</h4>
          <p>
            A consistent interface is one of our key principles both in design and experience.
            Consistency is the thread that ties together elements in a single design and across
            multiple platforms. This ensures <i>clarity</i> between applications and pages.
          </p>
        </Flex>
        <Flex p="8px" flexBasis="25%" flexDirection="column">
          <h4>Intuitive</h4>
          <p>
            A design is intuitive when users can focus on a task at hand without stopping. An
            intuitive design directs attention to important tasks which creates an easy-to-use
            product and frictionless experience.
          </p>
        </Flex>
        <Flex p="8px" flexBasis="25%" flexDirection="column">
          <h4>Reusable</h4>
          <p>
            Our design goal is to create a library with reusable components and behaviors. Instances
            of the same component can be used throuout the interface to streamline development and
            reduce the need for users to re-learn or remember.
          </p>
        </Flex>
      </Flex>
      <h2>Design Methodology</h2>
      <p>Designing with an atomic methodology.</p>
      <p>
        Repay visual design is constructed with an <Em>Atomic Design</Em> approach. The creation of
        our structure begins by establishing a <Em>foundation</Em> of shared styles: Colors,
        Typography, Icons, Grid System. Then we describe the basic building blocks that will create
        our <Em>atoms</Em>: text inputs, buttons, and other form elements. Multiple atoms bound
        together with the same purpose create our <Em>molecules</Em>: form fields (label and input),
        tables, batch cards, notification messages, etc. Atoms and molecules compose our{' '}
        <Em>organisms</Em>: navigation, sidebars, and carousel payment actions. For more information
        on the Atomic Design methodology, see the{' '}
        <a href="http://atomicdesign.bradfrost.com/">book by Brad Frost</a> who created it.
      </p>
      <p>
        Next, we'll present and dicuss our <Link to="/design-system/foundation/">foundation</Link>{' '}
        of design tokens.
      </p>
    </>
  )
}
