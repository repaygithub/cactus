import React from 'react'

import * as icons from '../ts'
import { cleanup, render } from 'react-testing-library'
import { StyleProvider } from '@repay/cactus-web'

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
