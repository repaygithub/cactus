import { CactusTheme, generateTheme, GeneratorOptions } from '@repay/cactus-theme'
import { render, RenderResult } from '@testing-library/react'
import React from 'react'

import { StyleProvider } from '../../src/StyleProvider/StyleProvider'

type OptionsWithOptionalHue = Omit<GeneratorOptions, 'primaryHue'> & { primaryHue?: number }

// Wrapper for @testing-library/react's `render` function. Wraps any content in `StyleProvider`.
const renderWithTheme = (
  content: React.ReactElement,
  generatorOptions?: OptionsWithOptionalHue
): RenderResult => {
  let theme: CactusTheme | undefined = undefined
  if (generatorOptions) {
    // `primaryHue` is required. It shouldn't matter what it's set to for most test cases, though, so we can
    // omit it from tests and just put it here. If it really needs to be overridden, it's easy enough to do that.
    theme = generateTheme({ primaryHue: 200, ...generatorOptions })
  }

  const renderResult = render(<StyleProvider theme={theme}>{content}</StyleProvider>)

  const rerender = renderResult.rerender
  renderResult.rerender = (rerenderContent: React.ReactElement) => {
    rerender(<StyleProvider theme={theme}>{rerenderContent}</StyleProvider>)
  }

  return renderResult
}

export default renderWithTheme
