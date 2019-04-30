import * as React from 'react'
import { cleanup, render, fireEvent } from 'react-testing-library'
import CheckBoxField from './CheckBoxField'
import repayTheme from '../repayTheme'
import { ThemeProvider } from 'styled-components'

afterEach(cleanup)

describe('component: CheckBoxField', () => {
  test('snapshot', () => {
    const { container } = render(
      <ThemeProvider theme={repayTheme}>
        <CheckBoxField />
      </ThemeProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
