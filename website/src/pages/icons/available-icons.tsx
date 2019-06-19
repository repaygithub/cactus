import * as React from 'react'

import { categories, iconsCategoryMap } from '../../helpers/iconGroups'
import { Flex } from '@repay/cactus-web'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import Text from '../../components/Text'

const Code = styled.code`
  white-space: nowrap;
  font-size: 9.6px;
`

const Pre = styled.pre`
  padding: ${p => p.theme.space[4]}px;
  background-color: ${p => p.theme.colors.lightGray};
  white-space: pre-line;
`

const importFromRootCode = `
import * as React from 'react'
import { ActionsAdd, ActionsDelete } from '@repay/cactus-icons'

export default () => (
  <React.Fragment>
    <ActionsAdd />
    <ActionsDelete />
  </React.Fragment>
)
`.trim()

const importIndividually = `
import * as React from 'react'
import ActionsAdd from '@repay/cactus-icons/i/actions-add'
import ActionsDelete from '@repay/cactus-icons/i/actions-delete'

export default () => (
  <React.Fragment>
    <ActionsAdd />
    <ActionsDelete />
  </React.Fragment>
)
`.trim()

export default () => (
  <>
    <Helmet title="Available Icons" />
    <Text as="h1" fontSize="h1">
      Available Icons
    </Text>
    <Text>The icon library allows icons to be imported in two different manners.</Text>
    <Text>From the root by name:</Text>
    <Pre>{importFromRootCode}</Pre>
    <Text>Individually by file path:</Text>
    <Pre>{importIndividually}</Pre>
    <Text>
      See below for the list of available icons and the names and paths by which they can be
      referenced.
    </Text>
    {categories.map(cat => {
      const iconList = iconsCategoryMap[cat]
      return (
        <React.Fragment key={cat}>
          <Text as="h3" fontSize="h3" style={{ textTransform: 'capitalize' }}>
            {cat}
          </Text>
          <Flex flexWrap="wrap" justifyContent="start">
            {iconList.map(({ fullName, path, Icon }) => (
              <Flex key={path} m={4} flexBasis="64px" flexDirection="column" alignItems="center">
                <Icon style={{ fontSize: '40px' }} />
                <Text m={0} fontSize="12px">
                  {fullName}
                </Text>
                <Code>/i/{path}</Code>
              </Flex>
            ))}
          </Flex>
        </React.Fragment>
      )
    })}
  </>
)
