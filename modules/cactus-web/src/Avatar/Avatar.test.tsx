import * as React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Avatar from './Avatar'
import cactusTheme from '@repay/cactus-theme'

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
        <Avatar usage="feedBack" type="error" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Alert', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar usage="feedBack" type="warning" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Information', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar usage="feedBack" type="info" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Check', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar usage="feedBack" type="success" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Error', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar usage="alert" type="error" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Alert', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar usage="alert" type="warning" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Information', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar usage="alert" type="info" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Check', () => {
    const { container } = render(
      <StyleProvider>
        <Avatar usage="alert" type="success" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
