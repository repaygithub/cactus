import * as React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Avatar from './Avatar'

afterEach(cleanup)

describe('component: Avatars', () => {
  test('Default Avatar', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Error', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="error" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Alert', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="warning" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Information', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="info" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Check', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="success" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Error', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="error" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Alert', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="warning" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Information', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="info" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Check', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="success" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Default Avatar, disabled', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Error, disabled', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="error" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Alert, disabled', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="warning" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Information, disabled', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="info" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Check, disabled', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="feedback" status="success" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Error, disabled', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="error" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Alert, disabled', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="warning" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Information, disabled', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="info" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Check, disabled', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar type="alert" status="success" disabled={true} />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
