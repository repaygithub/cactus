import { RouteComponentProps } from '@reach/router'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import { FieldWrapper, Flex, Text } from '@repay/cactus-web'
import React from 'react'

import Link from '../components/Link'

const FieldWrapperExample: React.FC<RouteComponentProps> = () => {
  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center">
        FieldWrapper
      </Text>
      <Flex justifyContent="center">
        <form>
          <FieldWrapper>
            <label>Input 1</label>
            <input />
          </FieldWrapper>
          <FieldWrapper>
            <label>Input 2</label>
            <input />
          </FieldWrapper>
          <FieldWrapper>
            <label>Input 3</label>
            <input />
          </FieldWrapper>
        </form>
      </Flex>
      <Text marginX="50px">
        The FieldWrapper component allows you to add spacing to components inside them. In this
        example it's used to add spacing between different inputs with labels.
      </Text>
    </div>
  )
}

export default FieldWrapperExample
