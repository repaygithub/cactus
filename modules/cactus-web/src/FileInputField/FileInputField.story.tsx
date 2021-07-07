import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { Button, FileInputField } from '../'

export default {
  title: 'FileInputField',
  component: FileInputField,
} as Meta

export const BasicUsage = (): React.ReactElement => {
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
        label={text('label', 'File Input Field')}
        disabled={boolean('disabled', false)}
        accept={['.md', '.txt']}
        name="input-field"
        tooltip={text('tooltip', 'Upload files from your system')}
        multiple={boolean('multiple', true)}
        labels={{
          error: "don't think this story ever meets conditions to show this :shrug:",
          unloaded: text('unloaded label', 'Just chillin'),
          delete: text('delete label', 'Click to delete file'),
          loading: text('loading label', 'File uploading'),
          loaded: text('loaded label', 'File uploaded successfully'),
        }}
        prompt={text('prompt', 'Drag files here or')}
        buttonText={text('buttonText', 'Select Files...')}
        success={text('success', '')}
        warning={text('warning', '')}
        error={text('error', '')}
        autoTooltip={boolean('autoTooltip', false)}
        onChange={({ target }) => {
          fileRef.current = target.value
          console.log(`onChange '${target.name}':`, target.value)
        }}
        onFocus={({ target }) => console.log('onFocus:', target.name)}
        onBlur={({ target }) => console.log('onBlur:', target.name)}
        disableTooltip={select('disableTooltip', [false, true, undefined], false)}
        alignTooltip={select('alignTooltip', ['left', 'right'], 'right')}
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
