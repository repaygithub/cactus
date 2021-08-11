import { ActionsCopy } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import Box from '../Box/Box'
import Divider from '../Divider/Divider'
import Flex from '../Flex/Flex'
import { insetBorder } from '../helpers/theme'
import IconButton from '../IconButton/IconButton'
import { SIZES, useScreenSize } from '../ScreenSizeProvider/ScreenSizeProvider'
import Text from '../Text/Text'
import TextInput from '../TextInput/TextInput'

export interface Organization {
  name: string
  id: string
  subdomain: string
}

interface OrgSelectProps {
  orgs: Organization[]
  onOrgClick: (org: Organization) => void
  currentOrg?: Organization
  onChange?: (searchValue: string) => void
}

const List = styled.ul`
  margin: 0;
  padding: 0;
  max-height: 300px;
  overflow: auto;
`

const ListItem = styled.li`
  padding: ${(p) => p.theme.space[2]}px;
  padding-left: ${(p) => p.theme.space[3]}px;
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

export const OrgSelect: React.FC<OrgSelectProps> = ({
  currentOrg,
  orgs: passedOrgs,
  onOrgClick,
  onChange,
}) => {
  const [searchValue, setSearchValue] = React.useState<string>('')
  const [orgs, setOrgs] = React.useState<Organization[]>(passedOrgs)
  const isTiny = SIZES.tiny === useScreenSize()

  React.useEffect(() => {
    if (!onChange && typeof onChange !== 'function') {
      if (!searchValue) {
        setOrgs(passedOrgs)
      } else {
        setOrgs((currentOrgs) =>
          currentOrgs.filter((org) => org.name.toLowerCase().includes(searchValue.toLowerCase()))
        )
      }
    } else {
      setOrgs(passedOrgs)
    }
  }, [searchValue, onChange, passedOrgs])

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value)
  }

  return (
    <Box width={isTiny ? '100%' : '260px'} pt={2} textStyle="small">
      <Box width="100%" px={2}>
        <TextInput
          width="100%"
          name="search"
          placeholder="Search Orgs..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            if (onChange && typeof onChange === 'function') {
              onChange(e.target.value)
            }
          }}
        />
      </Box>
      <Divider mb={searchValue ? 0 : undefined} />
      {searchValue ? (
        <List>
          {orgs.map((org, ix) => (
            <React.Fragment key={ix}>
              <ListItem role="menuitem" tabIndex={0} onClick={() => onOrgClick(org)}>
                {org.name}
              </ListItem>
              {ix !== orgs.length - 1 && (
                <Flex justifyContent="center">
                  <Divider width="97%" m={0} />
                </Flex>
              )}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <>
          {currentOrg && (
            <>
              <Flex width="100%" justifyContent="center">
                <strong>Current Org Info</strong>
              </Flex>
              <Box px={3}>
                <Text my={1}>{currentOrg.name}</Text>
                <Flex alignItems="center" my={1} flexWrap="nowrap">
                  <Text m={0}>{currentOrg.id}</Text>
                  <IconButton
                    iconSize="small"
                    ml={3}
                    label="copy organization id"
                    onClick={() => handleCopy(currentOrg.id)}
                  >
                    <ActionsCopy />
                  </IconButton>
                </Flex>
                <Flex alignItems="center" my={1} flexWrap="nowrap">
                  <Text m={0}>
                    <strong>Subdomain: </strong>
                    {currentOrg.subdomain}
                  </Text>
                  <IconButton
                    iconSize="small"
                    ml={3}
                    label="copy organization subdomain"
                    onClick={() => handleCopy(currentOrg.subdomain)}
                  >
                    <ActionsCopy />
                  </IconButton>
                </Flex>
              </Box>
            </>
          )}
          <Box width="100%" backgroundColor="lightContrast" py={2}>
            <Flex width="100%" justifyContent="center">
              All Orgs
            </Flex>
          </Box>
          <Box width="100%">
            <List>
              {orgs.map((org, ix) => (
                <React.Fragment key={ix}>
                  <ListItem role="menuitem" key={ix} tabIndex={0} onClick={() => onOrgClick(org)}>
                    {org.name}
                  </ListItem>
                  {ix !== orgs.length - 1 && (
                    <Flex justifyContent="center">
                      <Divider width="97%" m={0} />
                    </Flex>
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </>
      )}
    </Box>
  )
}

OrgSelect.displayName = 'OrgSelect'

OrgSelect.propTypes = {
  orgs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      subdomain: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  onOrgClick: PropTypes.func.isRequired,
  currentOrg: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    subdomain: PropTypes.string.isRequired,
  }),
  onChange: PropTypes.func,
}

export default OrgSelect
