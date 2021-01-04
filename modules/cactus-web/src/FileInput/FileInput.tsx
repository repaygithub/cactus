import {
  ActionsUpload,
  BatchstatusOpen,
  NavigationClose,
  NotificationError,
  StatusCheck,
} from '@repay/cactus-icons'
import { CactusTheme } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { MutableRefObject, useEffect, useRef } from 'react'
import styled, { css, StyledComponentBase } from 'styled-components'
import { margin, MarginProps, maxWidth, MaxWidthProps, width, WidthProps } from 'styled-system'

import Avatar from '../Avatar/Avatar'
import Flex from '../Flex/Flex'
import accepts from '../helpers/accept'
import {
  CactusChangeEvent,
  CactusEventTarget,
  CactusFocusEvent,
  isFocusOut,
} from '../helpers/events'
import { omitMargins } from '../helpers/omit'
import { useBox } from '../helpers/react'
import { border, radius, textStyle } from '../helpers/theme'
import { IconButton } from '../IconButton/IconButton'
import Spinner from '../Spinner/Spinner'
import StatusMessage from '../StatusMessage/StatusMessage'
import { TextButton } from '../TextButton/TextButton'

const FILE_TYPE_ERR = 'FileTypeError'
const NOT_FOUND_ERR = 'NotFoundError'
const SECURITY_ERR = 'SecurityError'
const ABORT_ERR = 'AbortError'
const NOT_READABLE_ERR = 'NotReadableError'
const ENCODING_ERR = 'EncodingError'
const UNKNOWN_ERR = 'UnknownError'

type ErrorType =
  | 'FileTypeError'
  | 'NotFoundError'
  | 'SecurityError'
  | 'AbortError'
  | 'NotReadableError'
  | 'EncodingError'
  | 'UnknownError'
type FileStatus = 'loading' | 'loaded' | 'error'

type ErrorHandler = (type: ErrorType, accept?: string[]) => React.ReactChild
type Target = CactusEventTarget<FileObject[]>

// These are the props mostly used in callbacks.
interface CallbackProps {
  accept?: string[]
  onChange?: React.ChangeEventHandler<Target>
  onFocus?: React.FocusEventHandler<Target>
  onBlur?: React.FocusEventHandler<Target>
  onError?: ErrorHandler
  multiple?: boolean
  disabled?: boolean
  rawFiles?: boolean
}

interface PropBox extends CallbackProps {
  onError: ErrorHandler
  isMounted?: boolean
  isFocused?: boolean
  event?: React.SyntheticEvent
}

export interface FileInputProps
  extends MarginProps,
    MaxWidthProps,
    WidthProps,
    CallbackProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onError' | 'onFocus' | 'onBlur'> {
  name: string
  labels?: { delete?: string; loading?: string; loaded?: string }
  buttonText?: React.ReactNode
  prompt?: React.ReactNode
  value?: FileObject[]
}

interface EmptyPromptsProps {
  prompt: React.ReactNode
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

interface FileBoxProps {
  fileName: string
  onDelete: React.MouseEventHandler<HTMLElement>
  status: FileStatus
  labels: { delete?: string; loading?: string; loaded?: string }
  className?: string
  errorMsg?: React.ReactChild
  disabled?: boolean
}

interface FileInfoProps extends FileBoxProps {
  labels: { delete?: string; loading?: string; loaded?: string }
  boxRef?: MutableRefObject<HTMLDivElement | null>
}

export interface FileObject {
  fileName: string
  contents: File | string | null
  status: FileStatus
  errorMsg?: React.ReactChild
}

interface FileAction {
  deleteFile?: string
  control?: FileObject[]
  append?: boolean
  files?: FileList | null
  event?: React.SyntheticEvent
}

const EmptyPromptsBase = (props: EmptyPromptsProps): React.ReactElement => (
  <div className={props.className}>
    <ActionsUpload iconSize="large" />
    <Flex flexDirection="column" alignItems="center" m={3}>
      <span>{props.prompt}</span>
      {props.children}
    </Flex>
  </div>
)

const EmptyPrompts = styled(EmptyPromptsBase)`
  width: 100%;
  height: 100px;
  margin: 0 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${ActionsUpload} {
    color: ${(p): string => (p.disabled ? p.theme.colors.mediumGray : p.theme.colors.callToAction)};
  }
  span {
    color: ${(p): string =>
      p.disabled ? p.theme.colors.mediumGray : p.theme.colors.mediumContrast};
  }
`

const fileBoxMap = {
  loading: css`
    background-color: ${(p): string => p.theme.colors.lightContrast};
  `,
  loaded: css`
    border: ${(p): string => border(p.theme, p.theme.colors.success)};
    background-color: ${(p): string => p.theme.colors.transparentSuccess};
  `,
  error: css`
    border: ${(p): string => border(p.theme, p.theme.colors.error)};
    background-color: ${(p): string => p.theme.colors.transparentError};
  `,
  disabled: css`
    border: ${(p): string => border(p.theme, p.theme.colors.mediumGray)};
    background-color: ${(p): string => p.theme.colors.lightGray};
  `,
}

const fileStatus = (props: FileBoxProps) =>
  props.disabled ? fileBoxMap.disabled : fileBoxMap[props.status]

const FileBoxBase = React.forwardRef<HTMLDivElement, FileBoxProps>(
  (props, ref): React.ReactElement => {
    const { fileName, className, status, errorMsg, onDelete, labels, disabled } = props

    let label = fileName
    if (status === 'loaded') {
      label += labels.loaded ? `, ${labels.loaded}` : ', Successful'
    } else if (status === 'error' && errorMsg) {
      label += `, ${errorMsg}`
    } else if (status === 'loading') {
      label += labels.loading ? `, ${labels.loading}` : ', Loading'
    }

    return (
      <div className={className} tabIndex={0} aria-label={label} aria-disabled={disabled} ref={ref}>
        {status === 'error' ? (
          <Avatar type="alert" status="error" disabled={disabled} />
        ) : (
          status === 'loaded' && <Avatar type="alert" status="success" disabled={disabled} />
        )}
        <span>{fileName}</span>
        {status === 'loading' ? (
          <Spinner />
        ) : (
          <IconButton
            onClick={onDelete}
            data-filename={fileName}
            label={labels.delete}
            disabled={disabled}
          >
            <NavigationClose />
          </IconButton>
        )}
      </div>
    )
  }
)

const FileBox = styled(FileBoxBase)`
  box-sizing: border-box;
  width: 100%;
  min-height: 36px;
  margin-top: 8px;
  padding: 0 8px 0 8px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(p): string =>
    p.disabled ? p.theme.colors.mediumGray : p.theme.colors.darkestContrast};

  span {
    margin-left: 8px;
    margin-right: 8px;
    ${(p) => textStyle(p.theme, 'body')};
  }
  button {
    padding: 0;
  }

  ${Avatar} {
    height: 24px;
    width: 24px;

    ${NotificationError} {
      height: 16px;
      width: 16px;
    }

    ${StatusCheck} {
      height: 18px;
      width: 18px;
    }
  }

  ${Spinner} {
    height: 12px;
    width: 12px;
  }

  ${IconButton} {
    margin-left: auto;
  }

  ${NavigationClose} {
    height: 12px;
    width: 12px;
  }

  ${fileStatus}
`

const FileInfoBase = (props: FileInfoProps): React.ReactElement => {
  const { className, errorMsg, labels, boxRef, disabled, ...rest } = props

  return (
    <div className={className}>
      <FileBox errorMsg={errorMsg} labels={labels} ref={boxRef} disabled={disabled} {...rest} />
      {errorMsg && !disabled && <StatusMessage status="error">{errorMsg}</StatusMessage>}
    </div>
  )
}

const FileInfo = styled(FileInfoBase)`
  width: 100%;

  ${StatusMessage} {
    position: relative;
    margin-top: 4px;
  }
`

const defaultErrorHandler = (errorType: ErrorType, accept: string[] | undefined = []): string => {
  let errorMsg = 'An unknown error occurred when reading the file.'
  switch (errorType) {
    case FILE_TYPE_ERR:
      errorMsg = `The file provided does not match any of the accepted file types: ${accept.join(
        ', '
      )}`
      break
    case NOT_FOUND_ERR:
      errorMsg = 'The file provided could not be found. Please try again.'
      break
    case SECURITY_ERR:
      errorMsg = 'The file could not be read due to security restrictions.'
      break
    case ABORT_ERR:
      errorMsg = 'The file read operation was aborted. Please try again.'
      break
    case NOT_READABLE_ERR:
      errorMsg =
        'The file read operation failed. The file may be too large. Please try again or select a different file.'
      break
    case ENCODING_ERR:
      errorMsg = 'The encoding or decoding operation failed. Please try again.'
      break
  }

  return errorMsg
}

function trapEvent(e: React.DragEvent) {
  e.preventDefault()
  e.stopPropagation()
}

function deleteFile(files: FileObject[], fileToDelete: string) {
  const filtered = files.filter((file) => file.fileName !== fileToDelete)
  // If nothing was actually deleted, no reason to change the state.
  return filtered.length === files.length ? files : filtered
}

function removeDuplicates(oldFiles: FileObject[], newFiles: FileList) {
  const files: File[] = []
  for (let i = 0; i < newFiles.length; i++) {
    const file = newFiles[i]
    const isSameFile = (f: FileObject) => {
      const sameName = f.fileName === file.name
      if (f.contents instanceof File) {
        // Should be pretty unlikely to have two different files with the same name and timestamp.
        return sameName && f.contents.lastModified === file.lastModified
      }
      return sameName
    }
    if (!oldFiles.some(isSameFile)) {
      files.push(file)
    }
  }
  return files
}

const toFileObj = (box: PropBox) => (file: File): FileObject => {
  const { rawFiles, accept, onError } = box
  if (accept && !accepts(file, accept)) {
    const errorMsg = onError(FILE_TYPE_ERR, accept)
    return {
      fileName: file.name,
      contents: null,
      status: 'error',
      errorMsg: errorMsg,
    }
  } else if (rawFiles) {
    return {
      fileName: file.name,
      contents: file,
      status: 'loaded',
    }
  }
  return {
    fileName: file.name,
    contents: file,
    status: 'loading',
  }
}

const loadFile = (box: PropBox) => (fileObj: FileObject): Promise<FileObject> => {
  const { onError } = box
  if (fileObj.status !== 'loading') {
    return Promise.resolve(fileObj)
  }
  const file = fileObj.contents as File
  const reader = new FileReader()
  return new Promise<FileObject>((resolve): void => {
    reader.onload = (): void => {
      const dataURL = reader.result as string
      if (file.size > 250000000 && dataURL === '') {
        const errorMsg = onError(NOT_READABLE_ERR)
        resolve({
          fileName: file.name,
          contents: null,
          status: 'error',
          errorMsg: errorMsg,
        })
      }
      resolve({ fileName: file.name, contents: dataURL, status: 'loaded' })
    }

    reader.onerror = (): void => {
      reader.abort()
      let errorType: ErrorType = UNKNOWN_ERR
      if (reader.error) {
        switch (reader.error.name) {
          case NOT_FOUND_ERR:
            errorType = NOT_FOUND_ERR
            break
          case SECURITY_ERR:
            errorType = SECURITY_ERR
            break
          case ABORT_ERR:
            errorType = ABORT_ERR
            break
          case NOT_READABLE_ERR:
            errorType = NOT_READABLE_ERR
            break
          case ENCODING_ERR:
            errorType = ENCODING_ERR
            break
        }
      }
      const errorMsg = onError(errorType)
      resolve({
        fileName: file.name,
        contents: null,
        status: 'error',
        errorMsg: errorMsg,
      })
    }

    reader.readAsDataURL(file)
  })
}

const reducer = (files: FileObject[], action: FileAction, box: PropBox) => {
  const { disabled, isMounted, multiple } = box
  let newFiles = files
  if (action.control) {
    newFiles = action.control
  } else if (disabled || !isMounted) {
    return files
  }
  if (action.deleteFile) {
    newFiles = deleteFile(files, action.deleteFile)
  } else if (action.files) {
    if (action.append && multiple) {
      const actionFiles = removeDuplicates(files, action.files)
      if (actionFiles.length) {
        newFiles = [...files, ...actionFiles.map(toFileObj(box))]
      }
    } else {
      newFiles = Array.from(action.files).map(toFileObj(box))
    }
  }
  if (!multiple && newFiles.length > 1) {
    newFiles = [newFiles[0]]
  }
  return newFiles
}

const useFileState = (box: PropBox, initial: FileObject[]) => {
  const [files, setFiles] = React.useState<FileObject[]>(initial)
  const setter = useRef<(a: FileAction) => void>()
  if (setter.current === undefined) {
    const $loadFile = loadFile(box)
    setter.current = (action) => {
      box.event = action.event
      box.event?.persist?.()
      setFiles((existingFiles) => {
        const newFiles = reducer(existingFiles, action, box)
        if (newFiles !== existingFiles && newFiles.some((f) => f.status === 'loading')) {
          Promise.all(newFiles.map($loadFile)).then((results) => {
            if (box.isMounted) {
              setFiles(results)
            }
          })
        }
        return newFiles
      })
    }
  }
  return [files, setter.current] as const
}

const FileInputBase = (props: FileInputProps): React.ReactElement => {
  const {
    className,
    onChange,
    onError = defaultErrorHandler,
    onFocus,
    onBlur,
    rawFiles,
    name,
    accept,
    labels = {},
    buttonText = 'Select Files...',
    prompt = 'Drag files here or',
    multiple,
    value,
    id,
    disabled = false,
    'aria-describedby': describedBy,
    ...fileInputProps
  } = omitMargins(props, 'width', 'maxWidth') as Omit<
    FileInputProps,
    keyof MarginProps | 'width' | 'maxWidth'
  >
  const fileSelector = useRef<HTMLInputElement | null>(null)
  const topFileBox = useRef<HTMLDivElement | null>(null)
  const box = useBox<PropBox>({
    accept,
    disabled,
    multiple,
    rawFiles,
    onChange,
    onError,
    onFocus,
    onBlur,
  })
  const [files, updateFiles] = useFileState(box, value || [])
  // Not adding `multiple` or `type=file` because Formik doesn't properly support file inputs.
  const eventTarget = useBox(
    new CactusEventTarget<FileObject[]>({ id, name, value: files })
  )
  const [inputKey, setInputKey] = React.useState<number>(0)

  useEffect(() => {
    box.isMounted = true
    return () => {
      box.isMounted = false
    }
  }, [box])

  useEffect((): void => {
    const { onChange: boxOnChange, event } = box
    if (boxOnChange && event && !files.some((f) => f.status === 'loading')) {
      box.event = undefined
      const cactusEvent = new CactusChangeEvent(eventTarget, event)
      boxOnChange(cactusEvent)
    }
    if (topFileBox.current) {
      topFileBox.current.focus()
    }
  }, [box, eventTarget, files])

  useEffect((): void => {
    if (value) {
      updateFiles({ control: value })
    }
  }, [value, updateFiles])

  const handleDrop = React.useCallback<React.DragEventHandler>(
    (event) => {
      trapEvent(event)
      updateFiles({ files: event.dataTransfer.files, append: true, event })
    },
    [updateFiles]
  )

  const handleOpenFileSelect = React.useCallback<React.MouseEventHandler>(
    (event) => {
      event.preventDefault()
      if (fileSelector.current) {
        fileSelector.current.click()
      }
    },
    [fileSelector]
  )

  const handleFileSelect = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation()
      updateFiles({ files: event.target.files, event })
    },
    [updateFiles]
  )

  const onDelete = React.useCallback<React.MouseEventHandler<HTMLElement>>(
    (e) => {
      e.currentTarget.blur()
      const fileName = e.currentTarget.getAttribute('data-filename') as string
      updateFiles({ deleteFile: fileName, event: e })
      setInputKey((k) => k + 1)
    },
    [updateFiles]
  )

  const handleFocus = React.useCallback(
    (event: React.FocusEvent) => {
      const { isFocused, onFocus: boxOnFocus } = box
      if (!isFocused) {
        box.isFocused = true
        if (boxOnFocus) {
          const cactusEvent = new CactusFocusEvent('focus', eventTarget, event)
          boxOnFocus(cactusEvent)
        }
      }
    },
    [box, eventTarget]
  )

  const handleBlur = React.useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      if (isFocusOut(event)) {
        box.isFocused = false
        const { onBlur: boxOnBlur } = box
        if (boxOnBlur) {
          const cactusEvent = new CactusFocusEvent('blur', eventTarget, event)
          boxOnBlur(cactusEvent)
        }
      }
    },
    [box, eventTarget]
  )

  const emptyClassName = files.length === 0 ? 'empty' : 'notEmpty'

  return (
    <div
      {...fileInputProps}
      className={`${className} ${emptyClassName}`}
      onDragEnter={trapEvent}
      onDragLeave={trapEvent}
      onDragOver={trapEvent}
      onDrop={handleDrop}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <input
        key={inputKey}
        type="file"
        ref={fileSelector}
        accept={accept && accept.join()}
        name={name}
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={disabled}
      />
      {files.length === 0 ? (
        <EmptyPrompts prompt={prompt} disabled={disabled}>
          <TextButton
            variant="action"
            id={id}
            aria-describedby={describedBy}
            disabled={disabled}
            onClick={handleOpenFileSelect}
          >
            <BatchstatusOpen iconSize="small" />
            {buttonText}
          </TextButton>
        </EmptyPrompts>
      ) : (
        <React.Fragment>
          {files.map(
            (file, index): React.ReactElement => (
              <FileInfo
                key={file.fileName}
                fileName={file.fileName}
                onDelete={onDelete}
                status={file.status}
                errorMsg={file.errorMsg}
                labels={labels}
                boxRef={index === 0 ? topFileBox : undefined}
                disabled={disabled}
              />
            )
          )}
          <TextButton
            variant="action"
            id={id}
            aria-describedby={describedBy}
            disabled={disabled}
            onClick={handleOpenFileSelect}
          >
            <BatchstatusOpen iconSize="small" />
            {buttonText}
          </TextButton>
        </React.Fragment>
      )}
    </div>
  )
}

export const FileInput = styled(FileInputBase)`
  box-sizing: border-box;
  border-radius: ${radius};
  border: ${(p): string => (p.disabled ? 'none' : '2px dotted')};
  border-color: ${(p): string => p.theme.colors.darkestContrast};
  min-width: 300px;
  min-height: 100px;
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  ${(p): string => (p.disabled ? `background-color: ${p.theme.colors.lightGray};` : '')}

  &.notEmpty {
    flex-direction: column;
    border-color: ${(p): string => p.theme.colors.callToAction};
    padding: 0 8px;

    ${TextButton} {
      position: relative;
      margin: 16px 0 16px 0;
    }
  }

  input {
    display: none;
  }

  ${margin}
  ${width}
  ${maxWidth}
` as any

FileInput.defaultErrorHandler = defaultErrorHandler

interface FileInputComponent
  extends StyledComponentBase<
    React.FunctionComponent<FileInputProps>,
    CactusTheme,
    FileInputProps
  > {
  defaultErrorHandler: (type: ErrorType, accept?: string[]) => string
}

FileInput.propTypes = {
  name: PropTypes.string.isRequired,
  accept: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  labels: PropTypes.shape({
    delete: PropTypes.string,
    loading: PropTypes.string,
    loaded: PropTypes.string,
  }),
  buttonText: PropTypes.node,
  prompt: PropTypes.node,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onError: PropTypes.func,
  rawFiles: PropTypes.bool,
  multiple: PropTypes.bool,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      status: PropTypes.oneOf(['loading', 'loaded', 'error']),
      errorMsg: PropTypes.node,
    })
  ),
}

FileInput.defaultProps = {
  disabled: false,
  rawFiles: false,
  multiple: false,
  labels: {
    delete: 'Delete File',
    loading: 'Loading',
    loaded: 'Successful',
  },
  buttonText: 'Select Files...',
  prompt: 'Drag files here or',
}

export default FileInput as FileInputComponent
