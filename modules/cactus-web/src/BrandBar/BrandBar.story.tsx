import { DescriptiveAt } from '@repay/cactus-icons'
import { Page } from 'puppeteer'
import React from 'react'
import styled from 'styled-components'

import {
  ActionBar,
  Box,
  BrandBar,
  Divider,
  Flex,
  Layout,
  Link,
  SelectField,
  SIZES,
  Text,
  TextInput,
  useScreenSize,
} from '../'
import { Story, STRING } from '../helpers/storybook'
import { insetBorder } from '../helpers/theme'
import { SelectValueType } from '../Select/Select'

interface Org {
  name: string
  id: string
  subdomain: string
}

const ORGS: { favorites: Org[]; recent: Org[] } = {
  favorites: [
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
  ],
  recent: [
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
  ],
}

const LOGO =
  'https://repay-merchant-resources.s3.amazonaws.com/staging/24bd1970-a677-4ca7-a4d2-e328ddd4691b/repay_logo_new.jpg'

const action = (msg: string) => () => console.log(msg)

export default {
  title: 'BrandBar',
  component: BrandBar,
  argTypes: { logo: STRING },
  args: { logo: LOGO },
} as const

type LogoArg = { logo: string }
export const BasicUsage: Story<
  {
    isProfilePage: boolean
    menuLabel: string
    userMenuItems: string[]
  } & LogoArg
> = ({ isProfilePage, menuLabel, userMenuItems, logo }) => (
  <Layout>
    <BrandBar logo={logo}>
      <BrandBar.UserMenu isProfilePage={isProfilePage} label={menuLabel}>
        {userMenuItems.map((item, ix) => (
          <BrandBar.UserMenuItem key={ix} onClick={action(item)}>
            {item}
          </BrandBar.UserMenuItem>
        ))}
        <BrandBar.UserMenuItem as={Link} href="https://www.google.com">
          Go to Google
        </BrandBar.UserMenuItem>
      </BrandBar.UserMenu>
    </BrandBar>
    <Layout.Content />
  </Layout>
)
BasicUsage.argTypes = {
  isProfilePage: { name: 'is on profile page' },
  menuLabel: { name: 'user display name' },
  userMenuItems: { name: 'user menu actions' },
}
BasicUsage.args = {
  isProfilePage: false,
  menuLabel: 'Hershell Jewess',
  userMenuItems: ['Settings', 'Logout'],
}

export const CustomItems: Story<
  {
    moveItem: boolean
  } & LogoArg
> = ({ logo, moveItem }): React.ReactElement => {
  const [org, setOrg] = React.useState<SelectValueType>('OWE')
  const onOrgChange = React.useCallback(
    (e: React.ChangeEvent<{ value: SelectValueType }>) => setOrg(e.target.value),
    [setOrg]
  )
  const icon = moveItem ? <DescriptiveAt /> : undefined
  return (
    <Layout>
      <BrandBar logo={logo}>
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
      <Layout.Content />
    </Layout>
  )
}
CustomItems.argTypes = { moveItem: { name: 'move org select to ActionBar' } }
CustomItems.args = { moveItem: false }

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

const List = styled.ul`
  margin: 0;
  padding: 0;
`

const ListItem = styled.li<{ $isLastItem: boolean }>`
  padding: ${(p) => p.theme.space[2]}px;
  border-bottom: ${(p) => (p.$isLastItem ? 'none' : `1px solid ${p.theme.colors.lightContrast}`)};
  cursor: pointer;
  list-style-type: none;
  outline: none;

  &:focus {
    color: ${(p) => p.theme.colors.callToAction};
    ${(p) => insetBorder(p.theme, 'callToAction')};
  }

  &:hover {
    color: ${(p) => p.theme.colors.callToAction};
  }
`

type AlignArgs = LogoArg & { align: 'right' | 'left' }
const BrandBarWithOrgDropdown = ({ logo, align }: AlignArgs) => {
  /*
   * Had to pull this into a separate component so we could use the
   * useScreenSize() hook.
   */
  const [currentOrg, setCurrentOrg] = React.useState<Org>(ORGS.favorites[0])
  const [searchValue, setSearchValue] = React.useState<string>('')
  const [searchedOrgs, setSearchedOrgs] = React.useState<Org[]>([])
  const isTiny = SIZES.tiny === useScreenSize()

  React.useEffect(() => {
    if (searchValue) {
      setSearchedOrgs(
        [...ORGS.favorites, ...ORGS.recent].filter((org) => org.name.includes(searchValue))
      )
    }
  }, [searchValue])

  const handleOrgSelect = (orgId: string) => {
    const newOrg = [...ORGS.favorites, ...ORGS.recent].find((org) => org.id === orgId)
    setCurrentOrg(newOrg as Org)
    setSearchValue('')
  }

  return (
    <BrandBar logo={logo}>
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
        <Box width={isTiny ? '100%' : undefined} pt={2} textStyle="small">
          <Box width="100%" px={2}>
            <TextInput
              width="100%"
              name="search"
              placeholder="Search Orgs..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
          </Box>
          <Divider mb={searchValue ? 0 : undefined} />
          {searchValue ? (
            <List>
              {searchedOrgs.map((org, ix) => (
                <ListItem
                  role="menuitem"
                  key={ix}
                  tabIndex={0}
                  $isLastItem={ix === searchedOrgs.length - 1}
                  onClick={() => handleOrgSelect(org.id)}
                >
                  {org.name}
                </ListItem>
              ))}
            </List>
          ) : (
            <>
              <Flex width="100%" justifyContent="center">
                <strong>Current Org Info</strong>
              </Flex>
              <Box px={3}>
                <Text my={1} as="p">
                  {currentOrg.name}
                </Text>
                <Text my={1} as="p">
                  {currentOrg.id}
                </Text>
                <Text my={1} as="p">
                  {currentOrg.subdomain}
                </Text>
              </Box>
              <Box width="100%" backgroundColor="lightContrast" py={2}>
                <Flex width="100%" justifyContent="center">
                  Favorites
                </Flex>
              </Box>
              <Box width="100%" px={2}>
                <List>
                  {ORGS.favorites.map((org, ix) => (
                    <ListItem
                      role="menuitem"
                      key={ix}
                      tabIndex={0}
                      $isLastItem={ix === ORGS.favorites.length - 1}
                      onClick={() => handleOrgSelect(org.id)}
                    >
                      {org.name}
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box width="100%" backgroundColor="lightContrast" py={2}>
                <Flex width="100%" justifyContent="center">
                  Recents
                </Flex>
              </Box>
              <Box width="100%" px={2}>
                <List>
                  {ORGS.recent.map((org, ix) => (
                    <ListItem
                      role="menuitem"
                      key={ix}
                      tabIndex={0}
                      $isLastItem={ix === ORGS.recent.length - 1}
                      onClick={() => handleOrgSelect(org.id)}
                    >
                      {org.name}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </>
          )}
        </Box>
      </BrandBar.Item>
      <BrandBar.UserMenu label="Userforce One">
        <BrandBar.UserMenuItem onSelect={action('Settings')}>Settings</BrandBar.UserMenuItem>
        <BrandBar.UserMenuItem onSelect={action('Logout')}>Logout</BrandBar.UserMenuItem>
      </BrandBar.UserMenu>
    </BrandBar>
  )
}

export const WithOrgDropdown: Story<AlignArgs> = (args) => {
  return (
    <Layout>
      <BrandBarWithOrgDropdown {...args} />
      <ActionBar />
      <Layout.Content />
    </Layout>
  )
}
WithOrgDropdown.argTypes = { align: { options: ['left', 'right'] } }
WithOrgDropdown.args = { align: 'right' }

WithOrgDropdown.parameters = {
  beforeScreenshot: async (page: Page) => {
    await page.click('[role="button"]')
    await page.focus('[role="menuitem"]')
  },
}
