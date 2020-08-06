import { cleanup, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import StepAvatar from './StepAvatar'

afterEach(cleanup)

describe('component: StepAvatar', (): void => {
  test('Default Step', (): void => {
    const { container } = render(
      <StyleProvider>
        <StepAvatar />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Step Avatar, Not Done', (): void => {
    const { container } = render(
      <StyleProvider>
        <StepAvatar status="notDone" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Step Avatar, In Process', (): void => {
    const { container } = render(
      <StyleProvider>
        <StepAvatar status="inProcess" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Step Avatar, Done', (): void => {
    const { container } = render(
      <StyleProvider>
        <StepAvatar status="done" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
