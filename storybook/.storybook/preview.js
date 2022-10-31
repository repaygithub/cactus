import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'
import { DocsContainer } from '@storybook/addon-docs'
import React from 'react'

import { StyleProvider } from '../../modules/cactus-web/src/'

const STYLE = { global: true }
export const decorators = [
  (Story) => <StyleProvider global><Story /></StyleProvider>
]

const customViewports = {
  medium: {
    name: 'Medium',
    styles: {
      width: '1050px',
      height: '1000px',
    },
  },
  large: {
    name: 'Large',
    styles: {
      width: '1250px',
      height: '1000px',
    },
  },
}

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  docs: {
    inlineStories: false,
    iframeHeight: 'auto',
    container: (props) => (
      <StyleProvider global>
        <DocsContainer {...props} />
      </StyleProvider>
    ),
  },
  layout: 'fullscreen',
  viewport: {
    viewports: {
      ...MINIMAL_VIEWPORTS,
      ...customViewports,
    },
  },
}
