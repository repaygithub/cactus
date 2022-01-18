import React from 'react'
import styled from 'styled-components'

import { Button, FileInput, Label } from '../'
import { Action, actions, HIDE_CONTROL, Story, STRING } from '../helpers/storybook'

export default {
  title: 'FileInput',
  component: FileInput,
  argTypes: {
    value: HIDE_CONTROL,
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
    accept: { control: 'array' },
    buttonText: STRING,
    prompt: STRING,
    status: { options: ['success', 'warning', 'error'] },
    ...actions('onChange', 'onBlur', 'onFocus'),
  },
  args: {
    name: 'file-input',
    disabled: false,
    multiple: true,
    accept: ['.doc', '.txt', '.md'],
    labels: {
      unloaded: 'Just chillin',
      delete: 'Click to delete file',
      loading: 'File uploading',
      loaded: 'File uploaded successfully',
    },
  },
} as const

const dummyFile: File = Object.create(File.prototype)
Object.defineProperty(dummyFile, 'name', { enumerable: true, value: 'boolest.txt' })
Object.defineProperty(dummyFile, 'size', { enumerable: true, value: 42 })
const unloaded = FileInput.toFileObj(dummyFile)
const fileStatuses: typeof unloaded[] = [
  unloaded,
  { ...unloaded, status: 'error', errorMsg: 'This file is fake!' },
  { ...unloaded, status: 'loading' },
  { ...unloaded, status: 'loaded' },
]

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: scroll;
  & > * {
    flex-shrink: 0;
  }
`

type FIStory = Story<typeof FileInput, { onChange: Action<React.ChangeEvent<any>> }>
export const BasicUsage: FIStory = (args) => {
  const [files, setState] = React.useState<any>()
  const loadFiles = React.useCallback(() => {
    for (const file of files) {
      file.load().catch(() => file)
    }
  }, [files])
  return (
    <Wrapper>
      <FileInput {...args} onChange={args.onChange.wrap(setState, true)} value={files} />
      <Button mt={3} onClick={loadFiles}>
        Load Files
      </Button>
      <Label my={3}>File Statuses</Label>
      <FileInput {...args} name="file-statuses" multiple value={fileStatuses} />
    </Wrapper>
  )
}
