import * as React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Alert from './Alert'

afterEach(cleanup)

describe('component: Alert', () => {
  test('should render the default props, general info alert', () => {
    const { container } = render(
      <StyleProvider>
        <Alert> Message </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render general info alert', () => {
    const { container } = render(
      <StyleProvider>
        <Alert status="info" type="general">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('should render general error alert', () => {
    const { container } = render(
      <StyleProvider>
        <Alert status="error" type="general">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render general warning alert', () => {
    const { container } = render(
      <StyleProvider>
        <Alert status="warning" type="general">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('should render general success alert', () => {
    const { container } = render(
      <StyleProvider>
        <Alert status="success" type="general">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render push notification info alert', () => {
    const { container } = render(
      <StyleProvider>
        <Alert status="info" type="push">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('should render push notification error alert', () => {
    const { container } = render(
      <StyleProvider>
        <Alert status="error" type="push">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render push notification warning alert', () => {
    const { container } = render(
      <StyleProvider>
        <Alert status="warning" type="push">
          Message
        </Alert>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
  test('should render push notification success alert', () => {
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
