import { action } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import BrandBar from './BrandBar'

storiesOf('BrandBar', module).add('Basic Usage', () => (
  <BrandBar
    isProfilePage={boolean('On profile page?', false)}
    userMenuText={text('Menu Title', 'Hershell Jewess')}
    logo="https://repay-merchant-resources.s3.amazonaws.com/staging/24bd1970-a677-4ca7-a4d2-e328ddd4691b/repay_logo_new.jpg"
  >
    <BrandBar.UserMenuItem onSelect={action('Settings')}>
      {text('Action one', 'Settings')}
    </BrandBar.UserMenuItem>
    <BrandBar.UserMenuItem onSelect={action('Logout')}>
      {text('Action two', 'Logout')}
    </BrandBar.UserMenuItem>
  </BrandBar>
))
