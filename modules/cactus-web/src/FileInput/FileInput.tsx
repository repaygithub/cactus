import {
  ActionsUpload,
  BatchstatusOpen,
  NavigationClose,
  NotificationError,
  StatusCheck,
} from '@repay/cactus-icons'
import PropTypes, { Validator } from 'prop-types'
import React, { useRef } from 'react'
import styled, { css } from 'styled-components'
import { margin, MarginProps, maxWidth, MaxWidthProps, width, WidthProps } from 'styled-system'

import Avatar, { AvatarStatus } from '../Avatar/Avatar'
import Flex from '../Flex/Flex'
import accepts from '../helpers/accept'
import {
  CactusChangeEvent,
  CactusEventTarget,
  CactusFocusEvent,
  isFocusOut,
} from '../helpers/events'
import { omitProps, split } from '../helpers/omit'
import { useRenderTrigger } from '../helpers/react'
import { border, radius, textStyle } from '../helpers/theme'
import useId from '../helpers/useId'
import { IconButton } from '../IconButton/IconButton'
import Spinner from '../Spinner/Spinner'
import StatusMessage from '../StatusMessage/StatusMessage'
import { focusStyle, TextButton } from '../TextButton/TextButton'

const FILE_TYPE_ERR = 'FileTypeError'
const NOT_FOUND_ERR = 'NotFoundError'
const SECURITY_ERR = 'SecurityError'
const ABORT_ERR = 'AbortError'
const NOT_READABLE_ERR = 'NotReadableError'
const ENCODING_ERR = 'EncodingError'

type FileStatus = 'unloaded' | 'loading' | 'loaded' | 'error'

type Target = CactusEventTarget<FileObject[]>

type WrapperProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'onDrop' | 'onFocus' | 'onBlur'
>
type InputProps = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  'disabled' | 'form' | 'required' | 'multiple' | 'capture'
>

interface CommonProps extends MarginProps, MaxWidthProps, WidthProps, InputProps, WrapperProps {
  name: string
  accept?: string[]
  labels?: FileInfoLabels
  buttonText?: React.ReactNode
  prompt?: React.ReactNode
  children?: never
}

export interface FileInputProps extends CommonProps {
  value?: '' | FileObject[]
  onChange?: React.ChangeEventHandler<Target>
  onFocus?: React.FocusEventHandler<Target>
  onBlur?: React.FocusEventHandler<Target>
}

interface FileInputState {
  inputKey: number
  files: FileObject[]
}

interface InnerInputProps extends CommonProps, FileInputState {
  deleteFile: (index: number, event: React.SyntheticEvent) => void
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: (event: React.FocusEvent<HTMLElement>) => void
  onBlur: (event: React.FocusEvent<HTMLElement>) => void
}

type FileInfoLabels = { [K in FileStatus | 'delete']?: string }

interface FileInfoProps {
  disabled?: boolean
  labels: FileInfoLabels
  index: number
  deleteFile: (i: number, e: React.SyntheticEvent) => void
  fileObj: FileObject
}

type LoadFunc = (file: File) => Promise<unknown>

export interface FileObject {
  file: File
  status: FileStatus
  contents?: unknown
  error?: Error & { original?: any }
  errorMsg?: React.ReactNode
  load: (l?: LoadFunc) => Promise<unknown>
}

interface LoadingFile extends FileObject {
  $promise?: Promise<unknown>
}

const triggerMap = new WeakMap<FileObject, () => void>()

const updateStatus = (fileObj: LoadingFile, newStatus: FileStatus) => {
  fileObj.status = newStatus
  delete fileObj.$promise
  triggerMap.get(fileObj)?.()
}

const loadBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      let dataURL = reader.result as string
      if (file.size > 250000000 && dataURL === '') {
        reject(getError(NOT_READABLE_ERR))
        return
      }
      const prefixIndex = dataURL.indexOf('base64')
      if (prefixIndex >= 0) {
        dataURL = dataURL.slice(prefixIndex + 7)
      }
      resolve(dataURL)
    }

    reader.onerror = () => {
      reader.abort()
      reject(reader.error)
    }
    reader.readAsDataURL(file)
  })
}

function load(this: LoadingFile, loader: LoadFunc = loadBase64): Promise<unknown> {
  if (!(this.file instanceof File)) {
    throw new Error('Invalid file instance')
  } else if (this.status === 'error') {
    return Promise.reject(this.error)
  } else if (this.status === 'loaded') {
    return Promise.resolve(this.contents)
  } else if (this.status === 'loading' && this.$promise) {
    return this.$promise
  }
  updateStatus(this, 'loading')
  const promise = loader(this.file)
  Object.defineProperty(this, '$promise', { configurable: true, value: promise })
  promise.then(
    (fileContent: unknown) => {
      this.contents = fileContent
      updateStatus(this, 'loaded')
    },
    (error: any) => {
      if (error?.name && error?.message) {
        this.error = error
      } else {
        this.error = getError()
        this.error.original = error
      }
      updateStatus(this, 'error')
    }
  )
  return promise
}

// I hate you gatsby.
const fileType: any = typeof File !== 'undefined' ? File : () => undefined
const baseValuePropType = PropTypes.arrayOf(
  PropTypes.shape({
    file: PropTypes.instanceOf(fileType).isRequired,
    status: PropTypes.oneOf<FileStatus>(['unloaded', 'loading', 'loaded', 'error']).isRequired,
    error: PropTypes.shape({
      name: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    }) as Validator<Error>,
    errorMsg: PropTypes.node,
  }).isRequired as Validator<FileObject>
)

const valuePropType: Validator<FileInputProps['value']> = (props, ...args) =>
  props.value === '' ? null : baseValuePropType(props, ...args)

// Not 100% fool proof, but should be good enough.
const isSameFile = (f1: File, f2: File) => f1.size === f2.size && f1.name === f2.name

const DEFAULT_ERROR_MSG = 'An error occurred when reading the file.'
const DEFAULT_BUTTON_TEXT = 'Select Files...'
const DEFAULT_PROMPT = 'Drag files here or'

const DEFAULT_LABELS = {
  delete: 'Delete File',
  error: 'Error Loading File',
  loading: 'Loading',
  loaded: 'Successful',
  unloaded: 'Not Loaded',
}

const filesAreDifferent = (left: FileObject[], right: FileObject[]) =>
  left.length !== right.length || left.some((f, ix) => f.file !== right[ix].file)

/** Handles all external-facing event & state logic */
class FileInput extends React.Component<FileInputProps, FileInputState> {
  static displayName = 'FileInput'
  static propTypes = {
    name: PropTypes.string.isRequired,
    accept: PropTypes.arrayOf(PropTypes.string),
    disabled: PropTypes.bool,
    labels: PropTypes.shape({
      delete: PropTypes.string,
      error: PropTypes.string,
      loading: PropTypes.string,
      loaded: PropTypes.string,
      unloaded: PropTypes.string,
    }),
    buttonText: PropTypes.node,
    prompt: PropTypes.node,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    multiple: PropTypes.bool,
    value: valuePropType,
  }

  private hasFocus = false
  private eventTarget = new CactusEventTarget<FileObject[]>({})
  public state: FileInputState = { inputKey: 0, files: [] }

  static getDerivedStateFromProps(
    props: Readonly<FileInputProps>,
    state: FileInputState
  ): Partial<FileInputState> | null {
    if (props.value !== undefined && props.value !== state.files) {
      const files = !Array.isArray(props.value) ? [] : props.value
      if (files.length || state.files.length) {
        const newState: Partial<FileInputState> = { files }
        // Can't set the value/FileList of a file input, so the only option is to remount it.
        if (filesAreDifferent(files, state.files)) {
          newState.inputKey = state.inputKey + 1
        }
        return newState
      }
    }
    return null
  }

  private deleteFile = (index: number, event: React.SyntheticEvent) => {
    const files = [...this.state.files]
    files.splice(index, 1)
    this.setState({ inputKey: Math.random(), files })
    this.raiseChange(files, event)
  }

  private handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    trapEvent(event)
    if (this.props.disabled) return

    let files = this.state.files
    const isUnique = (f: File) => !files.some(({ file }) => isSameFile(file, f))
    const newFiles = Array.from(event.dataTransfer.files).filter(isUnique).map(this.toFileObj)
    if (newFiles.length) {
      files = this.props.multiple ? files.concat(newFiles) : newFiles.slice(0, 1)
      this.setState({ files })
      this.raiseChange(files, event)
    }
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    const inFiles = event.target.files
    const files = inFiles ? Array.from(inFiles).map(this.toFileObj) : []
    this.setState({ files })
    this.raiseChange(files, event)
  }

  private syncTarget(files: FileObject[] = this.state.files) {
    this.eventTarget.id = this.props.id
    this.eventTarget.name = this.props.name
    this.eventTarget.value = files
    return this.eventTarget
  }

  private raiseChange(files: FileObject[], event: React.SyntheticEvent) {
    const changeHandler = this.props.onChange
    if (typeof changeHandler === 'function') {
      const cactusEvent = new CactusChangeEvent(this.syncTarget(files), event)
      changeHandler(cactusEvent)
    }
  }

  private handleFocus = (event: React.FocusEvent<HTMLElement>) => {
    event.stopPropagation()
    if (!this.hasFocus) {
      this.hasFocus = true
      const focusHandler = this.props.onFocus
      if (typeof focusHandler === 'function') {
        const cactusEvent = new CactusFocusEvent('focus', this.syncTarget(), event)
        focusHandler(cactusEvent)
      }
    }
  }

  private handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    event.stopPropagation()
    if (isFocusOut(event)) {
      this.hasFocus = false
      const blurHandler = this.props.onBlur
      if (typeof blurHandler === 'function') {
        const cactusEvent = new CactusFocusEvent('blur', this.syncTarget(), event)
        blurHandler(cactusEvent)
      }
    }
  }

  render(): React.ReactElement {
    const { value, onChange, onFocus, onBlur, ...props } = this.props
    return (
      <InnerFileInput
        {...props}
        {...this.state}
        onChange={this.handleChange}
        onDrop={this.handleDrop}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        deleteFile={this.deleteFile}
      />
    )
  }

  private toFileObj = (file: File) => FileInput.toFileObj(file, this.props.accept)

  static toFileObj(file: File, accept?: string[]): FileObject {
    const fileObj: FileObject = { file, load, status: 'unloaded' }
    if (accept && !accepts(file, accept)) {
      fileObj.error = getError(FILE_TYPE_ERR, accept)
      fileObj.status = 'error'
    }
    return fileObj
  }

  static toString(): string {
    return InnerFileInput.toString()
  }
}

const EmptyPrompts = styled.div`
  width: 100%;
  height: 100px;
  margin: 0 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.mediumContrast};
`

const fileBoxColors = {
  unloaded: css`
    border-color: ${(p) => p.theme.colors.mediumContrast};
  `,
  loading: css`
    background-color: ${(p) => p.theme.colors.lightContrast};
  `,
  loaded: css`
    border-color: ${(p) => p.theme.colors.success};
    background-color: ${(p) => p.theme.colors.transparentSuccess};
  `,
  error: css`
    border-color: ${(p) => p.theme.colors.error};
    background-color: ${(p) => p.theme.colors.transparentError};
  `,
}

const FileBox = styled.div<{ $status: FileStatus }>`
  box-sizing: border-box;
  width: 100%;
  margin-top: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(p) => p.theme.colors.darkestContrast};
  border: ${(p) => border(p.theme, 'lightContrast')};
  ${(p) => fileBoxColors[p.$status]};

  &[aria-disabled] {
    color: ${(p) => p.theme.colors.mediumGray};
    border: ${(p) => border(p.theme, 'mediumGray')};
    background-color: ${(p) => p.theme.colors.lightGray};
  }

  span {
    flex-grow: 1;
    margin-left: 8px;
    margin-right: 8px;
    max-width: calc(100% - 52px); /* margins + avatar + button */
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  ${Avatar} {
    height: 24px;
    width: 24px;
    flex-shrink: 0;

    ${NotificationError} {
      height: 16px;
      width: 16px;
    }

    ${StatusCheck} {
      height: 18px;
      width: 18px;
    }
  }

  ${IconButton}, ${Spinner} {
    padding: 0;
    flex-shrink: 0;
  }

  ${NavigationClose}, ${Spinner} {
    height: 12px;
    width: 12px;
  }
`

const FileInfo: React.FC<FileInfoProps> = (props) => {
  const { disabled, labels = {}, index, deleteFile, fileObj } = props

  // Attempt to track status changes with file loading. This will only work if the caller
  // (a) uses the provided `load()` method; AND (b) either does not copy the `fileObj`,
  // OR copies it but passes the new object in via the FileInput's `value` prop.
  const trigger = useRenderTrigger()
  React.useEffect(() => {
    triggerMap.set(fileObj, trigger)
    return () => {
      // Not sure if React allows this, but double-check in case another effect
      // in the same render cycle overwrote this (reordered files).
      if (triggerMap.get(fileObj) === trigger) {
        triggerMap.delete(fileObj)
      }
    }
  }, [fileObj, trigger])

  const statusId = useId(undefined, 'file-status')
  const errorMsg = !disabled && (fileObj.errorMsg || fileObj.error?.message)
  const status = fileObj.status
  let label = fileObj.file.name
  let avatarStatus: AvatarStatus = 'info'
  if (status === 'unloaded') {
    label += `, ${labels.unloaded || DEFAULT_LABELS.unloaded}`
  } else if (status === 'loaded') {
    label += `, ${labels.loaded || DEFAULT_LABELS.loaded}`
    avatarStatus = 'success'
  } else if (status === 'error') {
    label += `, ${labels.error || DEFAULT_LABELS.error}`
    avatarStatus = 'error'
  } else if (status === 'loading') {
    label += `, ${labels.loading || DEFAULT_LABELS.loading}`
  }

  const onDelete = React.useCallback(
    (event: React.MouseEvent) => deleteFile(index, event),
    [deleteFile, index]
  )

  return (
    <>
      <FileBox
        tabIndex={0}
        aria-label={label}
        aria-describedby={errorMsg ? statusId : undefined}
        aria-disabled={disabled || undefined}
        $status={status}
      >
        {avatarStatus && <Avatar type="alert" status={avatarStatus} disabled={disabled} />}
        <span>{fileObj.file.name}</span>
        {status === 'loading' ? (
          <Spinner />
        ) : (
          <IconButton
            onClick={onDelete}
            label={labels.delete || DEFAULT_LABELS.delete}
            disabled={disabled}
          >
            <NavigationClose />
          </IconButton>
        )}
      </FileBox>
      {errorMsg && (
        <StatusMessage id={statusId} status="error">
          {errorMsg}
        </StatusMessage>
      )}
    </>
  )
}

const getError = (errName = 'Error', accept?: string[]) => {
  let errorMsg = DEFAULT_ERROR_MSG
  switch (errName) {
    case FILE_TYPE_ERR:
      const acceptable = accept?.join(', ')
      errorMsg = `The file provided does not match any of the accepted file types: ${acceptable}.`
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
        'The file read operation failed: the file may be too large. Please try again or select a different file.'
      break
    case ENCODING_ERR:
      errorMsg = 'The encoding or decoding operation failed. Please try again.'
      break
  }
  const error = new Error(errorMsg)
  error.name = errName
  return error
}

function trapEvent(e: React.DragEvent) {
  e.preventDefault()
  e.stopPropagation()
}

const FileInputBase = (props: InnerInputProps): React.ReactElement => {
  const {
    labels = DEFAULT_LABELS,
    buttonText,
    prompt,
    deleteFile,
    files,
    accept,
    disabled,
    inputKey,
    ...rest
  } = props
  // aria-hidden & aria-disabled are inherited, so we leave them on the wrapper.
  const inputProps = split(
    rest,
    'aria-describedby',
    'aria-details',
    'aria-errormessage',
    'aria-invalid',
    'aria-labelledby',
    'aria-label',
    'aria-placeholder',
    'aria-required',
    'capture',
    'form',
    'id',
    'multiple',
    'name',
    'onChange',
    'required'
  )
  const fileSelector = useRef<HTMLInputElement | null>(null)

  const handleOpenFileSelect = React.useCallback<React.MouseEventHandler>(
    (event) => {
      event.preventDefault()
      if (fileSelector.current) {
        fileSelector.current.click()
      }
    },
    [fileSelector]
  )

  const openFileButton = (
    <TextButton
      variant="action"
      aria-controls={inputProps.id}
      disabled={disabled}
      onClick={handleOpenFileSelect}
      tabIndex={-1}
    >
      <BatchstatusOpen iconSize="small" />
      {buttonText || DEFAULT_BUTTON_TEXT}
    </TextButton>
  )

  return (
    <div
      {...rest}
      aria-disabled={disabled || undefined}
      onDragEnter={trapEvent}
      onDragLeave={trapEvent}
      onDragOver={trapEvent}
    >
      <input
        {...inputProps}
        key={inputKey}
        type="file"
        ref={fileSelector}
        accept={accept && accept.join()}
        disabled={disabled}
      />
      {files.length === 0 ? (
        <EmptyPrompts>
          <ActionsUpload iconSize="large" color="callToAction" />
          <Flex flexDirection="column" alignItems="center" m={3}>
            <span>{prompt || DEFAULT_PROMPT}</span>
            {openFileButton}
          </Flex>
        </EmptyPrompts>
      ) : (
        <>
          {files.map(
            (fileObj, index): React.ReactElement => (
              <FileInfo
                key={index}
                index={index}
                fileObj={fileObj}
                deleteFile={deleteFile}
                labels={labels}
                disabled={disabled}
              />
            )
          )}
          {openFileButton}
        </>
      )}
    </div>
  )
}

const InnerFileInput = styled(FileInputBase).withConfig(
  omitProps<InnerInputProps>(margin, width, maxWidth)
)`
  ${(p) => textStyle(p.theme, 'body')};
  ${(p) => p.theme.colorStyles.standard};
  box-sizing: border-box;
  border-radius: ${radius(8)};
  border: 2px dotted ${(p) => p.theme.colors.darkestContrast};
  min-width: 300px;
  max-width: 100%;
  min-height: 100px;
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  ${(p) => textStyle(p.theme, 'body')};

  ${(p) =>
    !!p.files.length &&
    `
    flex-direction: column;
    border-color: ${p.theme.colors.callToAction};
    padding: 0 8px;

    ${TextButton} {
      position: relative;
      margin: 16px 0 16px 0;
    }
  `}

  &[aria-disabled] {
    border-style: solid;
    border-color: ${(p) => p.theme.colors.lightGray};
    background-color: ${(p) => p.theme.colors.lightGray};
    * {
      color: ${(p) => p.theme.colors.mediumGray};
    }
  }

  ${StatusMessage} {
    margin-top: 4px;
    align-self: flex-start;
  }

  input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    z-index: -100;
  }

  /* When the input is focused, show visual focus on the button */
  input:focus ~ ${TextButton}, input:focus ~ * ${TextButton} {
    ${focusStyle}
  }

  ${margin}
  ${width}
  ${maxWidth}
`

export default FileInput
