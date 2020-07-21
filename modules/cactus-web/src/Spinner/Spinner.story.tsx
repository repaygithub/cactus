import cactusTheme from '@repay/cactus-theme'
import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Spinner from './Spinner'

type IconSize = 'tiny' | 'small' | 'medium' | 'large'
const iconSizes: IconSize[] = ['tiny', 'small', 'medium', 'large']
const colors = Object.keys(cactusTheme.colors)

storiesOf('Spinner', module)
  .add('Basic Usage', () => (
    <Spinner
      iconSize={select('iconSize', iconSizes, 'large')}
      color={select('color', colors, 'darkestContrast')}
    />
  ))
  .add('Custom Sizing', () => <Spinner iconSize={text('iconSize', '64px')} />)
  .add('using spacing', () => (
    <React.Fragment>
      <Spinner m={text('m', '0 auto')} />
    </React.Fragment>
  ))
