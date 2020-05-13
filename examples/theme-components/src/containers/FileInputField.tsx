import React from 'react'

import { FileInputField, Flex, Text } from '@repay/cactus-web'
import { RouteComponentProps } from '@reach/router'
import Link from '../components/Link'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'

const FileInputFieldExample: React.FC<RouteComponentProps> = () => {
  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center">
        File Input Field
      </Text>
      <Flex justifyContent="center">
        <FileInputField
          label="File Input Field"
          accept={['.md', '.txt', '.pdf']}
          name="input-field"
          tooltip="Upload files from your system"
          rawFiles={false}
          multiple={true}
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

export default FileInputFieldExample
