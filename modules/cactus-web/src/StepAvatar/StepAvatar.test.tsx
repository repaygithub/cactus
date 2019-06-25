import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import { StyleProvider } from '../StyleProvider/StyleProvider'

import StepAvatar from './StepAvatar'

afterEach(cleanup)

describe('component: StepAvatar', () => {
  test('Default Step', () => {
    const { container } = render(
      <StyleProvider>
        <StepAvatar />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Step Avatar, Not Done', () => {
    const { container } = render(
      <StyleProvider>
        <StepAvatar type="notDone" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Step Avatar, In Process', () => {
    const { container } = render(
      <StyleProvider>
        <StepAvatar type="inProcess" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Step Avatar, Done', () => {
    const { container } = render(
      <StyleProvider>
        <StepAvatar type="done" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
