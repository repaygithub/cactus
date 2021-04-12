import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Preview from './Preview'

const IMAGES = ['http://placekitten.com/400/450', 'http://placekitten.com/450/250']

describe('component: Preview', () => {
  describe('Mouse Interactions', () => {
    test('Should be able to change the image using the arrows', () => {
      const { getByAltText, queryByAltText, getByLabelText } = render(
        <StyleProvider>
          <Preview>
            {IMAGES.map((src, ix) => (
              <img src={src} alt={`Cute kitten number ${ix + 1}`} key={ix} />
            ))}
          </Preview>
        </StyleProvider>
      )

      const leftArrow = getByLabelText('Go to the previous image')
      const rightArrow = getByLabelText('Go to the next image')

      expect(getByAltText('Cute kitten number 1')).toBeInTheDocument()
      expect(queryByAltText('Cute kitten number 2')).not.toBeInTheDocument()
      expect(leftArrow).toBeDisabled()
      userEvent.click(rightArrow)
      expect(getByAltText('Cute kitten number 2')).toBeInTheDocument()
      expect(queryByAltText('Cute kitten number 1')).not.toBeInTheDocument()
      expect(rightArrow).toBeDisabled()
      userEvent.click(leftArrow)
      expect(getByAltText('Cute kitten number 1')).toBeInTheDocument()
    })

    test('should be able to expand an image', () => {
      const { getByAltText, getAllByAltText, getByLabelText } = render(
        <StyleProvider>
          <Preview>
            {IMAGES.map((src, ix) => (
              <img src={src} alt={`Cute kitten number ${ix + 1}`} key={ix} />
            ))}
          </Preview>
        </StyleProvider>
      )

      const image = getByAltText('Cute kitten number 1')
      userEvent.click(image)
      const closeButton = getByLabelText('Close the image')
      expect(document.activeElement).toBe(closeButton)
      expect(getAllByAltText('Cute kitten number 1')[1]).toBeInTheDocument()
      userEvent.click(closeButton)
      expect(getAllByAltText('Cute kitten number 1').length).toBe(1)
    })
  })

  describe('Keyboard Interactions', () => {
    test('Should be able to change the image using the arrows', () => {
      const { getByAltText, queryByAltText, getByLabelText } = render(
        <StyleProvider>
          <Preview>
            {IMAGES.map((src, ix) => (
              <img src={src} alt={`Cute kitten number ${ix + 1}`} key={ix} />
            ))}
          </Preview>
        </StyleProvider>
      )

      const leftArrow = getByLabelText('Go to the previous image')
      const rightArrow = getByLabelText('Go to the next image')

      expect(getByAltText('Cute kitten number 1')).toBeInTheDocument()
      expect(queryByAltText('Cute kitten number 2')).not.toBeInTheDocument()
      expect(leftArrow).toBeDisabled()
      fireEvent.keyDown(rightArrow, { key: 'Enter' })
      expect(getByAltText('Cute kitten number 2')).toBeInTheDocument()
      expect(queryByAltText('Cute kitten number 1')).not.toBeInTheDocument()
      expect(rightArrow).toBeDisabled()
      fireEvent.keyDown(leftArrow, { key: 'Enter' })
      expect(getByAltText('Cute kitten number 1')).toBeInTheDocument()
    })

    test('Should be able to expand an image', () => {
      const { getByAltText, getAllByAltText, getByLabelText } = render(
        <StyleProvider>
          <Preview>
            {IMAGES.map((src, ix) => (
              <img src={src} alt={`Cute kitten number ${ix + 1}`} key={ix} />
            ))}
          </Preview>
        </StyleProvider>
      )

      const image = getByAltText('Cute kitten number 1')
      fireEvent.keyDown(image, { key: 'Enter' })
      const closeButton = getByLabelText('Close the image')
      expect(document.activeElement).toBe(closeButton)
      expect(getAllByAltText('Cute kitten number 1')[1]).toBeInTheDocument()
      fireEvent.keyDown(closeButton, { key: 'Enter' })
      expect(getAllByAltText('Cute kitten number 1').length).toBe(1)
    })
  })
})
