import { RouteComponentProps } from '@reach/router'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import { Breadcrumb, Button, Flex, Text, TextInputField } from '@repay/cactus-web'
import React, { useState } from 'react'

import Link from '../components/Link'

interface BreadProps {
  path: string
}

const BreadcrumbExample: React.FC<RouteComponentProps & BreadProps> = (
  props
): React.ReactElement => {
  const { path } = props
  const [value, setValue] = useState('')
  const [paths, setPaths] = useState<string[]>([])

  const addPaths = (): void => {
    setValue('')
    setPaths([...paths, value])
  }

  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center">
        Breadcrumb
      </Text>
      <Flex flexDirection="column" alignItems="center" justifyContent="flex-start" height="100vh">
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          {paths.map(
            (e): React.ReactElement => (
              <Breadcrumb.Item href="/" key={e}>
                {e}
              </Breadcrumb.Item>
            )
          )}
          <Breadcrumb.Item href={path} active>
            {path.substring(1)}
          </Breadcrumb.Item>
        </Breadcrumb>
        <TextInputField
          label="Add a new path"
          name="path"
          value={value}
          onChange={(e): void => setValue(e.target.value)}
        />
        <Button onClick={addPaths} mt="10px">
          Add
        </Button>
      </Flex>
    </div>
  )
}

export default BreadcrumbExample
