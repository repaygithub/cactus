import { StyleProvider } from '@repay/cactus-web'
import { cleanup, render } from '@testing-library/react'
import React from 'react'

import * as icons from '../ts'

afterEach(cleanup)

const iconEntries = Object.entries(icons).filter(([name]) => name !== 'iconSizes')

test.each(iconEntries)('renders %s', (_, Component) => {
  const { asFragment } = render(
    <StyleProvider>
      <Component />
    </StyleProvider>
  )
  expect(asFragment()).toMatchSnapshot()
})
