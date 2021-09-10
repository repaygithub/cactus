import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import addons from '@storybook/addons'
import { addDecorator, addParameters } from '@storybook/react'

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

addons.setConfig({
  theme: storybookTheme,
})

addParameters({
  layout: 'fullscreen',
  controls: { sort: 'alpha' },
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      ...customViewports,
    },
  },
})
export const parameters = { docs: { inlineStories: false, iframeHeight: 'auto' } }

addDecorator(CactusAddon)
