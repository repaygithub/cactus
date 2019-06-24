import * as React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Avatars from './Avatars'
import cactusTheme from '@repay/cactus-theme'

afterEach(cleanup)

describe('component: Avatars', () => {
  test('Default Avatar', () => {
    const { container } = render(
      <StyleProvider>
        <Avatars />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Error', () => {
    const { container } = render(
      <StyleProvider>
        <Avatars avatarUsage="feedBack" avatarType="NotificationError" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Alert', () => {
    const { container } = render(
      <StyleProvider>
        <Avatars avatarUsage="feedBack" avatarType="NotificationAlert" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Information', () => {
    const { container } = render(
      <StyleProvider>
        <Avatars avatarUsage="feedBack" avatarType="NotificationInfo" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Feed Back Avatar, Check', () => {
    const { container } = render(
      <StyleProvider>
        <Avatars avatarUsage="feedBack" avatarType="StatusCheck" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Error', () => {
    const { container } = render(
      <StyleProvider>
        <Avatars avatarUsage="alert" avatarType="NotificationError" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Alert', () => {
    const { container } = render(
      <StyleProvider>
        <Avatars avatarUsage="alert" avatarType="NotificationAlert" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Information', () => {
    const { container } = render(
      <StyleProvider>
        <Avatars avatarUsage="alert" avatarType="NotificationInfo" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Alert Avatar, Check', () => {
    const { container } = render(
      <StyleProvider>
        <Avatars avatarUsage="alert" avatarType="StatusCheck" />
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
