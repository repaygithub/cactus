import { boolean, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import FileInput from './FileInput'

export default {
  title: 'FileInput',
  component: FileInput,
} as Meta

export const BasicUsage = (): React.ReactElement => {
  const fileTypes = ['.doc', '.txt', '.md']
  const [files, setState] = React.useState<any>()
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
      onChange={({ target }) => {
        console.log(`onChange '${target.name}':`, target.value)
        setState(target.value)
      }}
      onFocus={({ target }) => console.log('onFocus:', target.name)}
      onBlur={({ target }) => console.log('onBlur:', target.name)}
      value={files}
    />
  )
}
