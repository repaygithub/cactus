import React from 'react'

import * as icons from '../ts'
import { cleanup, render } from 'react-testing-library'

afterEach(cleanup)

const iconEntries = Object.entries(icons)

test.each(iconEntries)('renders %s', (_, Component) => {
  const { asFragment } = render(<Component />)
  expect(asFragment()).toMatchSnapshot()
})
