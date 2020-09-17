import { action } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import BrandBar from './BrandBar'

storiesOf('BrandBar', module).add('Basic Usage', () => (
  <BrandBar
    onProfilePage={boolean('On profile page?', false)}
    usernameText={text('Menu Title', 'Hershell Jewess')}
    logo="https://repay-merchant-resources.s3.amazonaws.com/staging/24bd1970-a677-4ca7-a4d2-e328ddd4691b/repay_logo_new.jpg"
  >
    <BrandBar.Item onSelect={action('Settings')}>Settings</BrandBar.Item>
    <BrandBar.Item onSelect={action('Logout')}>Logout</BrandBar.Item>
  </BrandBar>
))
