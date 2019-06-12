import React from 'react'

import * as icons from '@repay/cactus-icons/i'
import { actions } from '@storybook/addon-actions'
import { boolean, select } from '@storybook/addon-knobs/react'
import { storiesOf } from '@storybook/react'
import Grid from '../Grid/Grid'
import IconButton, { IconButtonSizes, IconButtonVariants } from './IconButton'

const iconButtonVariants: IconButtonVariants[] = ['standard', 'action']
const iconButtonSizes: IconButtonSizes[] = ['tiny', 'small', 'medium', 'large']
type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]
const eventLoggers = actions('onClick', 'onFocus', 'onBlur')

storiesOf('IconButton', module)
  .add('Basic Usage', () => {
    const iconName: IconName = select('icon', iconNames, 'ActionsAdd')
    const Icon = icons[iconName]
    return (
      <IconButton
        variant={select('variant', iconButtonVariants, 'standard')}
        iconSize={select('size', iconButtonSizes, 'medium')}
        disabled={boolean('disabled', false)}
        inverse={boolean('inverse', false)}
        label="add"
        {...eventLoggers}
      >
        <Icon />
      </IconButton>
    )
  })
  .add('All Icons', () => {
    const variantSelection = select('variant', iconButtonVariants, 'standard')
    return (
      <Grid justify="center">
        {Object.values(icons).map(Icon => (
          <Grid.Item tiny={3} medium={2} large={1}>
            <IconButton variant={variantSelection}>
              <Icon />
            </IconButton>
          </Grid.Item>
        ))}
      </Grid>
    )
  })
