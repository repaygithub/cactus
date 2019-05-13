import React from 'react'

import * as icons from '../ts'
import { cleanup, render } from 'react-testing-library'
import { StyleProvider } from '@repay/cactus-web'
import cactusTheme from '@repay/cactus-theme'

afterEach(cleanup)

const iconEntries = Object.entries(icons)

test.each(iconEntries)('renders %s', (_, Component) => {
  const { asFragment } = render(
    <StyleProvider theme={cactusTheme}>
      <Component />
    </StyleProvider>
  )
  expect(asFragment()).toMatchSnapshot()
})
