import * as React from 'react'

import { categories, iconsCategoryMap } from '../../helpers/iconGroups'
import { Flex } from '@repay/cactus-web'
import Helmet from 'react-helmet'
import Link from '../../components/Link'
import Text from '../../components/Text'

export default () => (
  <>
    <Helmet title="Icons" />
    <Text as="h1" fontSize="h1">
      Icons
    </Text>
    <Text>
      Icons should be descriptive, simple, readable, and consistent. Use them to communicate an
      action, status, or help separate objects in a list. In other words, icons can represent
      objects, tools, actions, or desired results.
    </Text>
    <Text as="h2" fontSize="h2">
      Available Icons
    </Text>
    <Text>
      All icons are part of a category based on primary purpose. Some generic icons will by used
      outside the named purposed due to utility.
    </Text>
    <Text>
      To learn how to use the icons see the <Link href="/icons/">Icons documentation</Link>.
    </Text>
    {categories.map((cat) => {
      const iconList = iconsCategoryMap[cat]
      return (
        <React.Fragment key={cat}>
          <Text as="h3" fontSize="h3" style={{ textTransform: 'capitalize' }}>
            {cat}
          </Text>
          <Flex flexWrap="wrap" justifyContent="start">
            {iconList.map(({ name, path, Icon }) => (
              <Flex key={path} m={4} flexBasis="64px" flexDirection="column" alignItems="center">
                <Icon style={{ fontSize: '40px' }} />
                <Text m={0} fontSize="12px">
                  {name}
                </Text>
              </Flex>
            ))}
          </Flex>
        </React.Fragment>
      )
    })}
    <Text mt={6} mb={5} fontSize="h3">
      Lastly, the <Link href="/design-system/shared-styles/">shared styles</Link> such as shadows
      and spacing which round out the foundation.
    </Text>
  </>
)
