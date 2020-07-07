import React from 'react'

import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import FileInput from './FileInput'

storiesOf('FileInput', module).add('Basic Usage', () => {
  const fileTypes = ['.doc', '.txt', '.md']
  return (
    <FileInput
      name="my-file-loader"
      disabled={boolean('disabled', false)}
      rawFiles={boolean('rawFiles', false)}
      multiple={boolean('multiple', true)}
      accept={fileTypes}
      labels={{
        delete: text('delete label', 'Click to delete file'),
        loading: text('loading label', 'File uploading'),
        loaded: text('loaded label', 'File uploaded successfully'),
      }}
      prompt={text('prompt', 'Drag files here or')}
      buttonText={text('buttonText', 'Select Files...')}
      onChange={(name, files) => {
        console.log(name)
        console.log(files)
      }}
    />
  )
})
