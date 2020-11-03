import { DescriptiveAt } from '@repay/cactus-icons'
import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import ActionBar from '../ActionBar/ActionBar'
import Layout from '../Layout/Layout'
import { SelectValueType } from '../Select/Select'
import SelectField from '../SelectField/SelectField'
import BrandBar from './BrandBar'

const LOGO =
  'https://repay-merchant-resources.s3.amazonaws.com/staging/24bd1970-a677-4ca7-a4d2-e328ddd4691b/repay_logo_new.jpg'

const action = (msg: string) => () => console.log(msg)

storiesOf('BrandBar', module)
  .add('Basic Usage', () => (
    <Layout>
      <BrandBar logo={LOGO}>
        <BrandBar.UserMenu
          isProfilePage={boolean('On profile page?', false)}
          label={text('Menu Title', 'Hershell Jewess')}
        >
          <BrandBar.UserMenuItem onSelect={action('Settings')}>
            {text('Action one', 'Settings')}
          </BrandBar.UserMenuItem>
          <BrandBar.UserMenuItem onSelect={action('Logout')}>
            {text('Action two', 'Logout')}
          </BrandBar.UserMenuItem>
        </BrandBar.UserMenu>
      </BrandBar>
    </Layout>
  ))
  .add('Custom Items', () => {
    const [org, setOrg] = React.useState<SelectValueType>('OWE')
    const onOrgChange = React.useCallback(
      (e: React.ChangeEvent<{ value: SelectValueType }>) => setOrg(e.target.value),
      [setOrg]
    )
    const icon = boolean('Move to ActionBar', false) ? <DescriptiveAt /> : undefined
    return (
      <Layout>
        <BrandBar logo={LOGO}>
          <BrandBar.Item id="org-item" mobileIcon={icon} aria-label="at">
            <SelectField
              m={3}
              label="Organization"
              id="org-select"
              name="organization"
              value={org}
              onChange={onOrgChange}
              comboBox
              canCreateOption={false}
              options={['OWE', 'REPAY', 'IPA', 'MLP Inc.']}
            />
          </BrandBar.Item>
          <BrandBar.UserMenu label="Userforce One">
            <BrandBar.UserMenuItem onSelect={action('Settings')}>Settings</BrandBar.UserMenuItem>
            <BrandBar.UserMenuItem onSelect={action('Logout')}>Logout</BrandBar.UserMenuItem>
          </BrandBar.UserMenu>
        </BrandBar>
        <ActionBar />
      </Layout>
    )
  })
