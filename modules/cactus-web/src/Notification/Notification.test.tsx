import userEvent from '@testing-library/user-event'
import React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Alert from '../Alert/Alert'
import Notification from './Notification'
import NotificationProvider, { AlertArgs, ElementArgs, useNotifications } from './Provider'

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

describe('component: NotificationProvider', () => {
  function NotificationSetter(args: AlertArgs): null
  function NotificationSetter(args: ElementArgs): null
  function NotificationSetter(args: any) {
    const { setNotification, clearNotification } = useNotifications()
    React.useEffect(() => {
      const key = setNotification(args)
      return () => clearNotification(key)
    })
    return null
  }

  test('should render single notification per position', () => {
    const { getByLabelText, getByTestId } = renderWithTheme(
      <NotificationProvider>
        <NotificationSetter message="Hey" status="info" aria-label="br1" />
        <NotificationSetter
          message="Ho"
          status="error"
          data-testid="br2"
          vertical="bottom"
          horizontal="right"
        />
        <NotificationSetter
          message="Where"
          status="success"
          aria-label="tl1"
          vertical="top"
          horizontal="left"
        />
        <NotificationSetter
          message="You Go"
          status="warning"
          data-testid="bc1"
          horizontal="center"
        />
      </NotificationProvider>
    )
    const br1 = getByLabelText('br1')
    const br2 = getByTestId('br2')
    const tl1 = getByLabelText('tl1')
    const bc1 = getByTestId('bc1')
    expect(br1).toHaveTextContent('Hey')
    expect(br2).toHaveTextContent('Ho')
    expect(tl1).toHaveTextContent('Where')
    expect(bc1).toHaveTextContent('You Go')
    expect(br1.parentElement).toBe(br2.parentElement)
    expect(br1.parentElement).not.toBe(tl1.parentElement)
    expect(br1.parentElement).not.toBe(bc1.parentElement)
    expect(bc1.parentElement).not.toBe(tl1.parentElement)
    expect(br1.parentElement).toHaveStyle({ bottom: '40px', right: '40px' })
    expect(tl1.parentElement).toHaveStyle({ top: '40px', left: '40px' })
    expect(bc1.parentElement).toHaveStyle({
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
    })
  })

  test('should render custom element', () => {
    const ref = React.createRef<HTMLDivElement>()
    const { getByTestId } = renderWithTheme(
      <NotificationProvider>
        <NotificationSetter element={<div ref={ref} data-testid="t123" />} />
      </NotificationProvider>
    )
    expect(getByTestId('t123')).toBe(ref.current)
    expect(ref.current?.parentElement).toHaveStyle({ bottom: '40px', right: '40px' })
  })

  test('should remove notification on close', () => {
    const { getByLabelText } = renderWithTheme(
      <NotificationProvider>
        <NotificationSetter
          message={<em>emphasis</em>}
          status="info"
          canClose
          closeLabel="So it closes"
          aria-label="alert"
        />
      </NotificationProvider>
    )
    const notification = getByLabelText('alert').parentElement
    expect(notification).toHaveTextContent('emphasis')
    userEvent.click(getByLabelText('So it closes'))
    expect(notification).not.toBeInTheDocument()
  })
})
