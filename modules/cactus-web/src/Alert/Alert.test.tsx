import { waitFor } from '@testing-library/react'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Alert from './Alert'

describe('component: Alert', (): void => {
  test('Should render the inner text', (): void => {
    const { getByText } = renderWithTheme(<Alert>Message</Alert>)
    expect(getByText('Message')).toBeInTheDocument()
  })
  test('should support flex item props', () => {
    const { getByTestId } = renderWithTheme(
      <Alert data-testid="flex-alert" flex={1} flexGrow={1} flexShrink={0} flexBasis={0}>
        I have flex props
      </Alert>
    )

    const alert = getByTestId('flex-alert')
    expect(alert).toHaveStyle('flex: 1')
    expect(alert).toHaveStyle('flex-grow: 1')
    expect(alert).toHaveStyle('flex-shrink: 0')
    expect(alert).toHaveStyle('flex-basis: 0')
  })
  test('Should call the onClose fn after timeout', async () => {
    const setOpen = jest.fn()
    const { queryByText } = renderWithTheme(
      <Alert closeTimeout={3} onClose={setOpen}>
        Notification
      </Alert>
    )

    expect(queryByText('Notification')).toBeInTheDocument()

    await waitFor(() => expect(setOpen).toHaveBeenCalled())
  })
})
