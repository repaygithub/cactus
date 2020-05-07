import { Breadcrumb, Button, Flex, Text, TextInputField } from '@repay/cactus-web'
import { RouteComponentProps } from '@reach/router'
import Link from '../components/Link'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import React, { useState } from 'react'

interface BreadProps {
  path: string
}

const BreadcrumbExample: React.FC<RouteComponentProps & BreadProps> = props => {
  const { path } = props
  const [value, setValue] = useState('')
  const [paths, setPaths] = useState<string[]>([])

  const addPaths = () => {
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
          {paths.map(e => (
            <Breadcrumb.Item label={e} linkTo="/" key={e} />
          ))}
          <Breadcrumb.Item label={path.substring(1)} linkTo={path} active />
        </Breadcrumb>
        <TextInputField
          label="Add a new path"
          name="path"
          value={value}
          onChange={(_, val) => setValue(val)}
        />
        <Button onClick={addPaths} mt="10px">
          Add
        </Button>
      </Flex>
    </div>
  )
}

export default BreadcrumbExample
