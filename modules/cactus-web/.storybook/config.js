import { addDecorator, addParameters, configure } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import CactusAddon from '../cactus-addon'
import storybookTheme from './theme'

addParameters({
  options: {
    theme: storybookTheme,
  },
})
addDecorator(withKnobs)
addDecorator(CactusAddon)

function requireAll(req) {
  req.keys().forEach(filename => req(filename))
}

const componentStories = require.context('../src', true, /\.(story|stories)\.(j|t)sx?$/)

configure(() => {
  requireAll(componentStories)
}, module)
