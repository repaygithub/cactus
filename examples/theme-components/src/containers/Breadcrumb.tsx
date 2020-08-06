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
          <Breadcrumb.Item label="Home" linkTo="/" />
          {paths.map(
            (e): React.ReactElement => (
              <Breadcrumb.Item label={e} linkTo="/" key={e} />
            )
          )}
          <Breadcrumb.Item label={path.substring(1)} linkTo={path} active />
        </Breadcrumb>
        <TextInputField
          label="Add a new path"
          name="path"
          value={value}
          onChange={(_, val): void => setValue(val)}
        />
        <Button onClick={addPaths} mt="10px">
          Add
        </Button>
      </Flex>
    </div>
  )
}

export default BreadcrumbExample
