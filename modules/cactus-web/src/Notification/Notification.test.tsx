import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Alert from '../Alert/Alert'
import Notification from './Notification'

describe('component: Notification', () => {
  test('should render children in the correct position on the page', () => {
    const { getByTestId, rerender } = renderWithTheme(
      <Notification open vertical="top" horizontal="left" data-testid="notification-wrapper">
        <Alert status="error">Error Notification</Alert>
      </Notification>
    )

    let wrapper = getByTestId('notification-wrapper')
    expect(wrapper).toHaveStyle('top: 40px')
    expect(wrapper).toHaveStyle('left: 40px')

    rerender(
      <Notification open vertical="top" horizontal="center" data-testid="notification-wrapper">
        <Alert status="error">Error Notification</Alert>
      </Notification>
    )

    wrapper = getByTestId('notification-wrapper')
    expect(wrapper).toHaveStyle('top: 40px')
    expect(wrapper).toHaveStyle('left: 50%')
    expect(wrapper).toHaveStyle('transform: translateX(-50%)')

    rerender(
      <Notification open vertical="top" horizontal="right" data-testid="notification-wrapper">
        <Alert status="error">Error Notification</Alert>
      </Notification>
    )

    wrapper = getByTestId('notification-wrapper')
    expect(wrapper).toHaveStyle('top: 40px')
    expect(wrapper).toHaveStyle('right: 40px')

    rerender(
      <Notification open vertical="bottom" horizontal="left" data-testid="notification-wrapper">
        <Alert status="error">Error Notification</Alert>
      </Notification>
    )

    wrapper = getByTestId('notification-wrapper')
    expect(wrapper).toHaveStyle('bottom: 40px')
    expect(wrapper).toHaveStyle('left: 40px')

    rerender(
      <Notification open vertical="bottom" horizontal="center" data-testid="notification-wrapper">
        <Alert status="error">Error Notification</Alert>
      </Notification>
    )

    wrapper = getByTestId('notification-wrapper')
    expect(wrapper).toHaveStyle('bottom: 40px')
    expect(wrapper).toHaveStyle('left: 50%')
    expect(wrapper).toHaveStyle('transform: translateX(-50%)')

    rerender(
      <Notification open vertical="bottom" horizontal="right" data-testid="notification-wrapper">
        <Alert status="error">Error Notification</Alert>
      </Notification>
    )

    wrapper = getByTestId('notification-wrapper')
    expect(wrapper).toHaveStyle('bottom: 40px')
    expect(wrapper).toHaveStyle('right: 40px')
  })

  test('should not render children when open is false', () => {
    const { queryByText } = renderWithTheme(
      <Notification open={false} vertical="top" horizontal="left">
        <Alert status="error">Error Notification</Alert>
      </Notification>
    )

    expect(queryByText('Error Notification')).toBeNull()
  })
})
