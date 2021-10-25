import { StyleProvider } from '@repay/cactus-web'
import { render } from '@testing-library/react'
import React from 'react'

import icons from '../ts'

const iconEntries = Object.entries(icons)

test.each(iconEntries)('renders %s', (_, Component): void => {
  const { asFragment } = render(
    <StyleProvider>
      <Component />
    </StyleProvider>
  )
  expect(asFragment()).toMatchSnapshot()
})
