import { RouteComponentProps } from '@reach/router'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import { FileInput, Flex, Text } from '@repay/cactus-web'
import React from 'react'

import Link from '../components/Link'

const FileInputExample: React.FC<RouteComponentProps> = () => {
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
          rawFiles={false}
          multiple={true}
          accept={fileTypes}
          labels={{
            delete: 'Click to delete file',
            retry: 'Click to retry file upload',
            loading: 'File uploading',
            loaded: 'File uploaded successfully',
          }}
          prompt="Drag files here or"
          buttonText="Select Files..."
        />
      </Flex>
    </div>
  )
}

export default FileInputExample
