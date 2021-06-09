import { RouteComponentProps } from '@reach/router'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import { FileInput, Flex, Text } from '@repay/cactus-web'
import React from 'react'

import Link from '../components/Link'

type File = { load: () => Promise<unknown> }

const loadFiles = (e: React.ChangeEvent<{ value: null | File[] }>) => {
  e.target.value?.forEach((f) => {
    f.load().catch(console.error)
  })
}

const FileInputExample: React.FC<RouteComponentProps> = (): React.ReactElement => {
  const fileTypes = ['.doc', '.txt', '.md', '.pdf']

  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center">
        FileInput
      </Text>
      <Flex justifyContent="center">
        <FileInput
          name="my-file-loader"
          multiple={true}
          accept={fileTypes}
          labels={{
            delete: 'Click to delete file',
            loading: 'File uploading',
            loaded: 'File uploaded successfully',
          }}
          prompt="Drag files here or"
          buttonText="Select Files..."
          onChange={loadFiles}
        />
      </Flex>
    </div>
  )
}

export default FileInputExample
