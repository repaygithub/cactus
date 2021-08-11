import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import OrgSelect, { Organization } from './OrgSelect'

const TEST_ORGS: Organization[] = [
  {
    name: 'Test Org',
    id: '1234',
    subdomain: 'test-org',
  },
  {
    name: 'Unit',
    id: '4321',
    subdomain: 'unit-test',
  },
  {
    name: 'My Worst',
    id: '5678',
    subdomain: 'blackbear',
  },
]

describe('component: OrgSelect', () => {
  test('Renders current org info', () => {
    const { getByText } = render(
      <StyleProvider>
        <OrgSelect orgs={TEST_ORGS} currentOrg={TEST_ORGS[2]} onOrgClick={jest.fn()} />
      </StyleProvider>
    )

    expect(getByText('Current Org Info')).toBeInTheDocument()
    expect(getByText('5678')).toBeInTheDocument()
    expect(getByText('blackbear')).toBeInTheDocument()

    // Unfortunately have not been able to find a way to test the copy to clipboard functionality
  })

  test('Can search orgs with uncontrolled input', () => {
    const handleOrgClick = jest.fn()
    const { getByText, queryByText, getByPlaceholderText } = render(
      <StyleProvider>
        <OrgSelect orgs={TEST_ORGS} onOrgClick={handleOrgClick} />
      </StyleProvider>
    )

    const searchBox = getByPlaceholderText('Search Orgs...')
    userEvent.type(searchBox, 'test')
    const searchedOption = getByText('Test Org')

    expect(queryByText('Unit')).not.toBeInTheDocument()
    expect(queryByText('My Worst')).not.toBeInTheDocument()

    userEvent.click(searchedOption)
    expect(handleOrgClick).toHaveBeenCalledWith(TEST_ORGS[0])
  })

  test('calls onChange when input is controlled', () => {
    const handleChange = jest.fn()
    const { getByPlaceholderText } = render(
      <StyleProvider>
        <OrgSelect orgs={TEST_ORGS} onOrgClick={jest.fn()} onChange={handleChange} />
      </StyleProvider>
    )

    const searchBox = getByPlaceholderText('Search Orgs...')
    userEvent.type(searchBox, 'test')

    expect(handleChange).toHaveBeenCalledWith('test')
  })
})
