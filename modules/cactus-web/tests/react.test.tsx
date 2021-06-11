import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'

import { useStateWithCallback } from '../src/helpers/react'

describe('React Helper Tests', () => {
  describe('useStateWithCallback', () => {
    const callback = jest.fn()
    const otherCallback = jest.fn()
    const TestingComponent = () => {
      const [mainState, setMainState] = useStateWithCallback('foo')
      const [otherState, setOtherState] = useState('other')

      return (
        <>
          <button type="button" onClick={() => setMainState('updated', callback)}>
            Update Main State with Callback
          </button>
          <button type="button" onClick={() => setOtherState('otherUpdated')}>
            Update Other State
          </button>
          <button type="button" onClick={() => setMainState('updatedAgain', otherCallback)}>
            Update Main State with Other Callback
          </button>
          <button type="button" onClick={() => setMainState('updatedAnotherTime')}>
            Update Main State with No Callback
          </button>
          <div aria-label="Main State">{mainState}</div>
          <div aria-label="Other State">{otherState}</div>
        </>
      )
    }

    it('sets the state and runs the callback ONLY after the state updates', async () => {
      render(<TestingComponent />)
      const updateMainStateWithCallbackButton = screen.getByText('Update Main State with Callback')
      const updateOtherStateButton = screen.getByText('Update Other State')
      const updateMainStateWithOtherCallbackButton = screen.getByText(
        'Update Main State with Other Callback'
      )
      const updateMainStateWithNoCallbackButton = screen.getByText(
        'Update Main State with No Callback'
      )
      const currentMainState = screen.getByLabelText('Main State')
      const currentOtherState = screen.getByLabelText('Other State')

      expect(callback).not.toHaveBeenCalled()
      expect(otherCallback).not.toHaveBeenCalled()
      expect(currentMainState).toHaveTextContent('foo')
      expect(currentOtherState).toHaveTextContent('other')

      userEvent.click(updateMainStateWithCallbackButton)
      await waitFor(() => expect(callback).toHaveBeenCalledTimes(1))
      expect(otherCallback).not.toHaveBeenCalled()
      expect(currentMainState).toHaveTextContent('updated')
      expect(currentOtherState).toHaveTextContent('other')

      userEvent.click(updateOtherStateButton)
      expect(callback).toHaveBeenCalledTimes(1)
      expect(otherCallback).not.toHaveBeenCalled()
      expect(currentMainState).toHaveTextContent('updated')
      expect(currentOtherState).toHaveTextContent('otherUpdated')

      userEvent.click(updateMainStateWithOtherCallbackButton)
      await waitFor(() => expect(otherCallback).toHaveBeenCalledTimes(1))
      expect(callback).toHaveBeenCalledTimes(1)
      expect(currentMainState).toHaveTextContent('updatedAgain')
      expect(currentOtherState).toHaveTextContent('otherUpdated')

      userEvent.click(updateMainStateWithNoCallbackButton)
      expect(callback).toHaveBeenCalledTimes(1)
      expect(otherCallback).toHaveBeenCalledTimes(1)
      expect(currentMainState).toHaveTextContent('updatedAnotherTime')
      expect(currentOtherState).toHaveTextContent('otherUpdated')
    })
  })
})
