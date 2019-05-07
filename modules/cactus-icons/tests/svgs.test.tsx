import React from 'react'

import * as icons from '../ts'
import { cleanup, render } from 'react-testing-library'
import { ThemeProvider } from 'styled-components'
import cactusTheme from '@repay/cactus-theme'

afterEach(cleanup)

const iconEntries = Object.entries(icons)

test.each(iconEntries)('renders %s', (_, Component) => {
  const { asFragment } = render(
    <ThemeProvider theme={cactusTheme}>
      <Component />
    </ThemeProvider>
  )
  expect(asFragment()).toMatchSnapshot()
})
