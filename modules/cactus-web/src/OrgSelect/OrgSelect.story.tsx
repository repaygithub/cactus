import { boolean } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { OrgSelect } from '../'
import { Organization } from './OrgSelect'

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
  {
    name: 'Long',
    id: '456789',
    subdomain: 'some-really-long-subdomain-because-it-will-probably-happen',
  },
]

const lotsOfOrgs = [...Array(1000).keys()].map((_, index) => ({
  name: `Org ${index}`,
  id: String(index).repeat(6),
  subdomain: `org-${index}`,
}))

export default {
  title: 'OrgSelect',
  component: OrgSelect,
} as Meta

export const BasicUsage = (): React.ReactElement => {
  const [currentOrg, setCurrentOrg] = React.useState<Organization>(ORGS[0])
  const showCurrentOrg = boolean('Show current org', true)
  return (
    <OrgSelect
      orgs={ORGS}
      currentOrg={showCurrentOrg ? currentOrg : undefined}
      onOrgClick={setCurrentOrg}
    />
  )
}

export const Controlled = (): React.ReactElement => {
  const [currentOrg, setCurrentOrg] = React.useState<Organization>(ORGS[0])
  const [orgs, setOrgs] = React.useState<Organization[]>(ORGS)
  const showCurrentOrg = boolean('Show current org', true)

  const handleChange = (searchValue: string) => {
    if (searchValue) {
      setOrgs((currentOrgs) =>
        currentOrgs.filter((org) => org.name.toLowerCase().includes(searchValue.toLowerCase()))
      )
    } else {
      setOrgs(ORGS)
    }
  }

  return (
    <OrgSelect
      orgs={orgs}
      currentOrg={showCurrentOrg ? currentOrg : undefined}
      onOrgClick={setCurrentOrg}
      onChange={handleChange}
    />
  )
}

export const LotsOfOrgs = (): React.ReactElement => {
  const [currentOrg, setCurrentOrg] = React.useState<Organization>(lotsOfOrgs[0])
  const showCurrentOrg = boolean('Show current org', true)

  return (
    <OrgSelect
      orgs={lotsOfOrgs}
      currentOrg={showCurrentOrg ? currentOrg : undefined}
      onOrgClick={setCurrentOrg}
    />
  )
}
