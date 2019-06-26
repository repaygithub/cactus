import React from 'react'

import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import FileInputField from './FileInputField'

storiesOf('FileInputField', module).add('Basic Usage', () => (
  <FileInputField
    label={text('label', 'File Input Field')}
    accept={['.md', '.txt']}
    name="input-field"
    tooltip={text('tooltip', 'Upload files from your system')}
    rawFiles={boolean('rawFiles', false)}
    multiple={boolean('multiple', true)}
    labels={{
      delete: text('delete label', 'Click to delete file'),
      retry: text('retry label', 'Click to retry file upload'),
      loading: text('loading label', 'File uploading'),
      loaded: text('loaded label', 'File uploaded successfully'),
    }}
    prompt={text('prompt', 'Drag files here or')}
    buttonText={text('buttonText', 'Select Files...')}
  />
))
