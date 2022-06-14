import cactusTheme from '@repay/cactus-theme'
import { render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import icons from '../ts'

const iconEntries = Object.entries(icons)

test.each(iconEntries)('renders %s', (_, Component): void => {
  const { asFragment } = render(
    <ThemeProvider theme={cactusTheme}>
      <Component />
    </ThemeProvider>
  )
  expect(asFragment()).toMatchSnapshot()
})
