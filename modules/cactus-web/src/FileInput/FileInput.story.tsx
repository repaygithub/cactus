import React from 'react'

import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import FileInput from './FileInput'

storiesOf('FileInput', module).add('Basic Usage', () => {
  const fileTypes = ['.doc', '.txt', '.md']
  return (
    <FileInput
      name="my-file-loader"
      rawFiles={boolean('rawFiles', false)}
      multiple={boolean('multiple', true)}
      accept={fileTypes}
      labels={{
        delete: text('delete label', 'Click to delete file'),
        retry: text('retry label', 'Click to retry file upload'),
      }}
      onChange={(name, files) => {
        console.log(name)
        console.log(files)
      }}
    />
  )
})
