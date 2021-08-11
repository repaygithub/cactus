import { DescriptiveAt } from '@repay/cactus-icons'
import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import { Page } from 'puppeteer'
import React from 'react'

import {
  ActionBar,
  Box,
  BrandBar,
  Flex,
  Layout,
  Link,
  OrgSelect,
  SelectField,
  SIZES,
  useScreenSize,
} from '../'
import { Organization } from '../OrgSelect/OrgSelect'
import { SelectValueType } from '../Select/Select'

const ORGS: Organization[] = [
  {
    name: 'Test Org',
    id: '123456',
    subdomain: 'test-org',
  },
  {
    name: 'Faker',
    id: '123465',
    subdomain: 'faker',
  },
  {
    name: 'Favorite',
    id: '213456',
    subdomain: 'fav',
  },

  {
    name: 'Most Recent',
    id: '654321',
    subdomain: 'most-recent',
  },
  {
    name: 'My Org',
    id: '654312',
    subdomain: 'my-org',
  },
  {
    name: 'Fleeting',
    id: '124356',
    subdomain: 'fleeting',
  },
  {
    name: 'Low',
    id: '987654',
    subdomain: 'low-life',
  },
]

const LOGO =
  'https://repay-merchant-resources.s3.amazonaws.com/staging/24bd1970-a677-4ca7-a4d2-e328ddd4691b/repay_logo_new.jpg'

const action = (msg: string) => () => console.log(msg)

export default {
  title: 'BrandBar',
  component: BrandBar,
} as Meta

export const BasicUsage = (): React.ReactElement => (
  <Layout>
    <BrandBar logo={LOGO}>
      <BrandBar.UserMenu
        isProfilePage={boolean('On profile page?', false)}
        label={text('Menu Title', 'Hershell Jewess')}
      >
        <BrandBar.UserMenuItem onClick={action('Settings')}>
          {text('Action one', 'Settings')}
        </BrandBar.UserMenuItem>
        <BrandBar.UserMenuItem onClick={action('Logout')}>
          {text('Action two', 'Logout')}
        </BrandBar.UserMenuItem>
        <BrandBar.UserMenuItem as={Link} to="https://www.google.com">
          Go to Google
        </BrandBar.UserMenuItem>
      </BrandBar.UserMenu>
    </BrandBar>
  </Layout>
)

export const CustomItems = (): React.ReactElement => {
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
          <BrandBar.UserMenuItem onClick={action('Settings')}>Settings</BrandBar.UserMenuItem>
          <BrandBar.UserMenuItem onClick={action('Logout')}>Logout</BrandBar.UserMenuItem>
        </BrandBar.UserMenu>
      </BrandBar>
      <ActionBar />
    </Layout>
  )
}

CustomItems.parameters = {
  beforeScreenshot: async (page: Page) => {
    await page.click('[id="org-select"]')
    await page.focus('[id="org-select-REPAY"]')
  },
}

BasicUsage.parameters = {
  beforeScreenshot: async (page: Page) => {
    await page.click('[role="button"]')
    await page.focus('[role="menuitem"]')
  },
}

const BrandBarWithOrgDropdown = () => {
  const [currentOrg, setCurrentOrg] = React.useState<Organization>(ORGS[0])
  const isTiny = SIZES.tiny === useScreenSize()
  const align: 'left' | 'right' = select('align', ['left', 'right'], 'right')

  const handleOrgSelect = (newOrg: Organization) => {
    setCurrentOrg(newOrg)
  }

  return (
    <BrandBar logo={LOGO}>
      <BrandBar.Item align="left">
        <Box
          p={4}
          flexGrow={1}
          borderLeft={isTiny ? undefined : '1px solid'}
          borderRight={isTiny || align === 'left' ? undefined : '1px solid'}
          borderLeftColor="lightContrast"
          borderRightColor="lightContrast"
        >
          <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
            <strong>{currentOrg.name}</strong>
          </Flex>
        </Box>
      </BrandBar.Item>
      <BrandBar.Item>
        <Box
          p={4}
          borderRight={align === 'left' && !isTiny ? '1px solid' : undefined}
          borderRightColor="lightContrast"
        >
          <Flex height="100%" alignItems="center" p={2}>
            Some Custom Content
          </Flex>
        </Box>
      </BrandBar.Item>
      <BrandBar.Item as={BrandBar.Dropdown} label="Select Org" align={align}>
        <OrgSelect orgs={ORGS} currentOrg={currentOrg} onOrgClick={handleOrgSelect} />
      </BrandBar.Item>
      <BrandBar.UserMenu label="Userforce One">
        <BrandBar.UserMenuItem onSelect={action('Settings')}>Settings</BrandBar.UserMenuItem>
        <BrandBar.UserMenuItem onSelect={action('Logout')}>Logout</BrandBar.UserMenuItem>
      </BrandBar.UserMenu>
    </BrandBar>
  )
}

export const WithOrgDropdown = (): React.ReactElement => {
  return (
    <Layout>
      <BrandBarWithOrgDropdown />
      <ActionBar />
    </Layout>
  )
}
