import React from 'react'

import { Button, FileInputField } from '../'
import { Action, FIELD_ARGS, HIDE_CONTROL, HIDE_STYLED, Story, STRING } from '../helpers/storybook'

export default {
  title: 'FileInputField',
  component: FileInputField,
  argTypes: {
    value: HIDE_CONTROL,
    labelProps: HIDE_CONTROL,
    isOpen: HIDE_CONTROL,
    multiple: { control: 'boolean' },
    accept: { control: 'array' },
    buttonText: STRING,
    prompt: STRING,
    ...HIDE_STYLED,
    ...FIELD_ARGS,
  },
  args: {
    label: 'File Input Field',
    name: 'file-input',
    disabled: false,
    multiple: true,
    tooltip: 'Upload files from your system',
    labels: {
      unloaded: 'Just chillin',
      delete: 'Click to delete file',
      loading: 'File uploading',
      loaded: 'File uploaded successfully',
    },
  },
} as const

type FIStory = Story<typeof FileInputField, { onChange: Action<React.ChangeEvent<any>> }>
export const BasicUsage: FIStory = (args) => {
  // Using a ref to illustrate this will work even if the input is uncontrolled.
  const fileRef = React.useRef<any>([])
  const loadFiles = React.useCallback(() => {
    if (fileRef.current?.length) {
      for (const file of fileRef.current) {
        file.load().catch(console.error)
      }
    }
  }, [])
  return (
    <div>
      <FileInputField
        {...args}
        onChange={args.onChange.wrap(({ target }) => {
          fileRef.current = target.value
        })}
      />
      <Button my={3} onClick={loadFiles}>
        Load Files
      </Button>
      <FileInputField
        label="File Input Field Disabled"
        disabled
        tooltip="Help"
        name="input-field-disabled"
        disableTooltip
      />
    </div>
  )
}
