import * as React from 'react'

import { cleanup, render } from '@testing-library/react'
import { generateTheme } from '@repay/cactus-theme'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import TextArea from './TextArea'
import userEvent from '@testing-library/user-event'

afterEach(cleanup)

describe('component: TextArea', () => {
  test('should render a textarea', () => {
    const { container } = render(
      <StyleProvider>
        <TextArea />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a disabled textarea', () => {
    const { container } = render(
      <StyleProvider>
        <TextArea disabled={true} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a textarea with a placeholder', () => {
    const { container } = render(
      <StyleProvider>
        <TextArea placeholder="Type something!" />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a success textarea', () => {
    const { container } = render(
      <StyleProvider>
        <TextArea status="success" />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a warning textarea', () => {
    const { container } = render(
      <StyleProvider>
        <TextArea status="warning" />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render an error textarea', () => {
    const { container } = render(
      <StyleProvider>
        <TextArea status="error" />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const { container } = render(
      <StyleProvider>
        <TextArea ml={5} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should trigger onChange handler', () => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = render(
      <StyleProvider>
        <TextArea onChange={onChange} placeholder="get me" />
      </StyleProvider>
    )

    userEvent.type(getByPlaceholderText('get me'), 'typing in a textarea')
    expect(onChange).toHaveBeenCalled()
  })

  describe('with theme customization', () => {
    test('should have 1px border', () => {
      const theme = generateTheme({ primaryHue: 200, border: 'thin' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <TextArea />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('should have 8px border radius', () => {
      const theme = generateTheme({ primaryHue: 200, shape: 'intermediate' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <TextArea />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })

    test('should have 1px border radius', () => {
      const theme = generateTheme({ primaryHue: 200, shape: 'square' })
      const { asFragment } = render(
        <StyleProvider theme={theme}>
          <TextArea />
        </StyleProvider>
      )

      expect(asFragment()).toMatchSnapshot()
    })
  })
})
