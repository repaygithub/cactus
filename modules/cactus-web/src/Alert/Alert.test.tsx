import { waitFor } from '@testing-library/react'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Alert from './Alert'

describe('component: Alert', (): void => {
  test('Should render the inner text', (): void => {
    const { getByText } = renderWithTheme(<Alert>Message</Alert>)
    expect(getByText('Message')).toBeInTheDocument()
  })
  test('should support style props', () => {
    const { getByTestId } = renderWithTheme(
      <Alert data-testid="flex-alert" margin={2} minWidth="300px" flex="2 3 400px">
        I have flex props
      </Alert>
    )

    expect(getByTestId('flex-alert')).toHaveStyle({
      margin: '4px',
      minWidth: '300px',
      flex: '2 3 400px',
    })
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
