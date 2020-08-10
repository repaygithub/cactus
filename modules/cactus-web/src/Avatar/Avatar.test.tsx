import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Avatar from './Avatar'

describe('component: Avatars', (): void => {
  test('Default Avatar', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Error', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="error" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Alert', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="warning" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Information', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="info" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Check', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="success" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Error', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="error" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Alert', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="warning" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Information', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="info" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Check', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="success" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Default Avatar, disabled', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Error, disabled', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="error" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Alert, disabled', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="warning" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Information, disabled', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="info" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Check, disabled', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="success" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Error, disabled', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="error" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Alert, disabled', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="warning" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Information, disabled', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="info" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Check, disabled', (): void => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="success" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
