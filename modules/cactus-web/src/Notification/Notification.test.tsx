import { render, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import * as React from 'react'

import animationRender from '../../tests/helpers/animationRender'
import Alert from '../Alert/Alert'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Notification from './Notification'

describe('component: Notification', () => {
  test('should render children in the correct position on the page', () => {
    const { getByTestId, rerender } = render(
      <StyleProvider>
        <Notification open vertical="top" horizontal="left" data-testid="notification-wrapper">
          <Alert status="error">Error Notification</Alert>
        </Notification>
      </StyleProvider>
    )

    let wrapper = getByTestId('notification-wrapper')
    expect(wrapper).toHaveStyle('top: 40px')
    expect(wrapper).toHaveStyle('left: 40px')

    rerender(
      <StyleProvider>
        <Notification open vertical="top" horizontal="center" data-testid="notification-wrapper">
          <Alert status="error">Error Notification</Alert>
        </Notification>
      </StyleProvider>
    )

    wrapper = getByTestId('notification-wrapper')
    expect(wrapper).toHaveStyle('top: 40px')
    expect(wrapper).toHaveStyle('left: 50%')
    expect(wrapper).toHaveStyle('transform: translateX(-50%)')

    rerender(
      <StyleProvider>
        <Notification open vertical="top" horizontal="right" data-testid="notification-wrapper">
          <Alert status="error">Error Notification</Alert>
        </Notification>
      </StyleProvider>
    )

    wrapper = getByTestId('notification-wrapper')
    expect(wrapper).toHaveStyle('top: 40px')
    expect(wrapper).toHaveStyle('right: 40px')

    rerender(
      <StyleProvider>
        <Notification open vertical="bottom" horizontal="left" data-testid="notification-wrapper">
          <Alert status="error">Error Notification</Alert>
        </Notification>
      </StyleProvider>
    )

    wrapper = getByTestId('notification-wrapper')
    expect(wrapper).toHaveStyle('bottom: 40px')
    expect(wrapper).toHaveStyle('left: 40px')

    rerender(
      <StyleProvider>
        <Notification open vertical="bottom" horizontal="center" data-testid="notification-wrapper">
          <Alert status="error">Error Notification</Alert>
        </Notification>
      </StyleProvider>
    )

    wrapper = getByTestId('notification-wrapper')
    expect(wrapper).toHaveStyle('bottom: 40px')
    expect(wrapper).toHaveStyle('left: 50%')
    expect(wrapper).toHaveStyle('transform: translateX(-50%)')

    rerender(
      <StyleProvider>
        <Notification open vertical="bottom" horizontal="right" data-testid="notification-wrapper">
          <Alert status="error">Error Notification</Alert>
        </Notification>
      </StyleProvider>
    )

    wrapper = getByTestId('notification-wrapper')
    expect(wrapper).toHaveStyle('bottom: 40px')
    expect(wrapper).toHaveStyle('right: 40px')
  })

  test('should not render children when open is false', () => {
    const { queryByText } = render(
      <StyleProvider>
        <Notification open={false} vertical="top" horizontal="left">
          <Alert status="error">Error Notification</Alert>
        </Notification>
      </StyleProvider>
    )

    expect(queryByText('Error Notification')).toBeNull()
  })

  test('Should call the onClose fn after timeout', async () => {
    const setOpen = jest.fn()
    const { queryByText } = render(
      <StyleProvider>
        <Notification open={true} vertical="top" horizontal="left">
          <Alert closeTimeout={3} onClose={setOpen}>
            Notification
          </Alert>
        </Notification>
      </StyleProvider>
    )

    expect(queryByText('Notification')).toBeInTheDocument()

    await waitFor(() => {
      expect(setOpen).toHaveBeenCalled()
    })
  })
})
