import * as React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'
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
})
