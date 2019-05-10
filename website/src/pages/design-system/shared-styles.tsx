import * as React from 'react'

import Text from '../../components/Text'

export default () => {
  return (
    <>
      <Text as="h1" fontSize="h1">
        Shared Styles
      </Text>
      <Text as="h2" fontSize="h2">
        Shadow
      </Text>
      <Text>TODO</Text>
      <Text as="h2" fontSize="h2">
        Base Grid
      </Text>
      <Text>
        The base grid is the reference from which the rest of the layout structures are built. It
        defines the starting point of the dimensions, as well as the paddings and margins of the
        elements of the interface.
      </Text>
      <Text>
        The grid is built from a base 8 pixel module so that both the sizes of the elements and the
        spaces between them will always be multiples of 8: 16, 24, 32, 40, 48.
      </Text>
      <Text>
        There may be situations, however where a value smaller than 8px is required; the 4px unit is
        available for these cases.
      </Text>
      <Text>
        This grid enables the creation of a standard interface by defining the abstract composition
        of an page and how individual components associate within an interface.
      </Text>
      <Text>TODO: grid images, column system</Text>
      <Text as="h2" fontSize="h2">
        Break-points
      </Text>
      <Text>TODO: break-points table</Text>
      <Text as="h2" fontSize="h2">
        Spacing
      </Text>
      <Text>TODO: spacing examples</Text>
    </>
  )
}
