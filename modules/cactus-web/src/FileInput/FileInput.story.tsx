import { boolean, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'
import styled from 'styled-components'

import { Button, FileInput, Label } from '../'

export default {
  title: 'FileInput',
  component: FileInput,
} as Meta

const file: File = Object.create(File.prototype)
Object.defineProperty(file, 'name', { enumerable: true, value: 'boolest.txt' })
Object.defineProperty(file, 'size', { enumerable: true, value: 42 })
const unloaded = FileInput.toFileObj(file)
const fileStatuses: typeof unloaded[] = [
  unloaded,
  { ...unloaded, status: 'error', errorMsg: 'This file is fake!' },
  { ...unloaded, status: 'loading' },
  { ...unloaded, status: 'loaded' },
]

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 1px;
  max-height: 100%;
  overflow-y: scroll;
  & > * {
    flex-shrink: 0;
  }
`

export const BasicUsage = (): React.ReactElement => {
  const fileTypes = ['.doc', '.txt', '.md']
  const [files, setState] = React.useState<any>()
  const loadFiles = React.useCallback(() => {
    for (const file of files) {
      file.load().catch(() => file)
    }
  }, [files])
  return (
    <Wrapper>
      <FileInput
        name="my-file-loader"
        disabled={boolean('disabled', false)}
        multiple={boolean('multiple', true)}
        accept={fileTypes}
        labels={{
          error: 'probably not used in this story',
          unloaded: 'Just chillin',
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
      <Button mt={3} onClick={loadFiles}>
        Load Files
      </Button>
      <Label my={3}>File Statuses</Label>
      <FileInput
        name="file-statuses"
        disabled={boolean('disabled', false)}
        multiple
        value={fileStatuses}
      />
    </Wrapper>
  )
}
