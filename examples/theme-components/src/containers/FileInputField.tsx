import { RouteComponentProps } from '@reach/router'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import { FileInputField, Flex, Text } from '@repay/cactus-web'
import React from 'react'

import Link from '../components/Link'

type File = { load: () => Promise<unknown> }

const loadFiles = (e: React.ChangeEvent<{ value: null | File[] }>) => {
  e.target.value?.forEach((f) => {
    f.load().catch(console.error)
  })
}

const FileInputFieldExample: React.FC<RouteComponentProps> = (): React.ReactElement => {
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
          multiple={true}
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

export default FileInputFieldExample
