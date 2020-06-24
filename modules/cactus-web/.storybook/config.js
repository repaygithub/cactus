import { addDecorator, addParameters, configure } from '@storybook/react'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { withKnobs } from '@storybook/addon-knobs'
import CactusAddon from '../cactus-addon'
import storybookTheme from './theme'

const customViewports = {
  tiny: {
    name: 'Tiny',
    styles: {
      width: '375px',
      height: '1000px',
    },
  },
  small: {
    name: 'Small',
    styles: {
      width: '780px',
      height: '1000px',
    },
  },
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

addParameters({
  options: {
    theme: storybookTheme,
  },
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      ...customViewports,
    },
  },
})
addDecorator(withKnobs)
addDecorator(CactusAddon)

function requireAll(req) {
  req.keys().forEach((filename) => req(filename))
}

const componentStories = require.context('../src', true, /\.(story|stories)\.(j|t)sx?$/)

configure(() => {
  requireAll(componentStories)
}, module)
