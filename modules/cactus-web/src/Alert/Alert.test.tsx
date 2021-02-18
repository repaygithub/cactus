import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Alert from './Alert'

describe('component: Alert', (): void => {
  test('should render the default props, general info alert', (): void => {
    const { container } = render(
      <StyleProvider>
        <Alert>Message</Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render general info alert', (): void => {
    const { container } = render(
      <StyleProvider>
        <Alert status="info" type="general">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('should render general error alert', (): void => {
    const { container } = render(
      <StyleProvider>
        <Alert status="error" type="general">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render general warning alert', (): void => {
    const { container } = render(
      <StyleProvider>
        <Alert status="warning" type="general">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('should render general success alert', (): void => {
    const { container } = render(
      <StyleProvider>
        <Alert status="success" type="general">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render push notification info alert', (): void => {
    const { container } = render(
      <StyleProvider>
        <Alert status="info" type="push">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('should render push notification error alert', (): void => {
    const { container } = render(
      <StyleProvider>
        <Alert status="error" type="push">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render push notification warning alert', (): void => {
    const { container } = render(
      <StyleProvider>
        <Alert status="warning" type="push">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('should render push notification success alert', (): void => {
    const { container } = render(
      <StyleProvider>
        <Alert status="success" type="push">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})