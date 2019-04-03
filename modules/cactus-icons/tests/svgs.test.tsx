import React from 'react'
import { render, cleanup } from 'react-testing-library'
import * as icons from '../ts'

afterEach(cleanup)

const iconEntries = Object.entries(icons)

test.each(iconEntries)('renders %s', (_, Component) => {
  const { asFragment } = render(<Component />)
  expect(asFragment()).toMatchSnapshot()
})
