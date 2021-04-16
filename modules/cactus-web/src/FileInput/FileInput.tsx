import {
  ActionsUpload,
  BatchstatusOpen,
  NavigationClose,
  NotificationError,
  StatusCheck,
} from '@repay/cactus-icons'
import { CactusTheme } from '@repay/cactus-theme'
import PropTypes, { Validator } from 'prop-types'
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
import { omitProps } from '../helpers/omit'
import { useRenderTrigger } from '../helpers/react'
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

type FileStatus = 'unloaded' | 'loading' | 'loaded' | 'error'

type Target = CactusEventTarget<FileObject[]>

interface CommonProps extends MarginProps, MaxWidthProps, WidthProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onDrop' | 'onFocus' | 'onBlur'> {
  name: string
  labels?: FileInfoLabels
  buttonText?: React.ReactNode
  prompt?: React.ReactNode
  multiple?: boolean
  disabled?: boolean
}

export interface FileInputProps extends CommonProps {
  value?: '' | FileObject[]
  accept?: string[]
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
  onFocus: (event: React.FocusEvent) => void
  onBlur: (event: React.FocusEvent) => void
}

interface FileInfoLabels {
  delete?: string
  loading?: string
  loaded?: string
  unloaded?: string
}

interface FileInfoProps extends FileBoxProps {
  className?: string
  disabled?: boolean
  labels: FileInfoLabels
  index: number
  deleteFile: (i: number, e: React.SyntheticEvent) => void
  fileObj: FileObject
  boxRef?: MutableRefObject<HTMLDivElement | null>
}

// This is based on DOMException used by FileReader
// TODO How to make it easier to translate error messages?
interface FileError {
  name: string
  message: string
}

export interface FileObject {
  file: File
  status: FileStatus
  contents?: string
  error?: FileError
  errorMsg?: React.ReactChild // TODO?
  $promise: Promise<string, FileError>
  loadBase64: () => Promise<string, FileError>
}

const DEFAULT_LABELS = {
  delete: 'Delete File',
  loading: 'Loading',
  loaded: 'Successful',
}

const baseValuePropType = PropTypes.arrayOf(
  // TODO Fix this
  PropTypes.shape({
    fileName: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    status: PropTypes.oneOf(['loading', 'loaded', 'error']),
    errorMsg: PropTypes.node,
  })
)

const valuePropType: Validator<FileInputProps['value']> = (props, ...args) =>
  props.value === '' ? null : baseValuePropType(props, ...args)

const isSameFile = (f1: File, f2: File) => f1.size === f2.size && f1.name === f2.name

const DEFAULT_ERROR_MSG = 'An unknown error occurred when reading the file.'
const DEFAULT_BUTTON_TEXT = 'Select Files...'
const DEFAULT_PROMPT = 'Drag files here or'

const DEFAULT_LABELS = {
  delete: 'Delete File',
  loading: 'Loading',
  loaded: 'Successful',
  unloaded: 'Not Loaded',
}

/** Handles all external-facing event & state logic */
class FileInput extends React.Component<FileInputProps, FileInputState> {
  static propTypes = {
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
    multiple: PropTypes.bool,
    value: valuePropType,
  }

  static defaultProps = { disabled: false, multiple: false }

  private isFocused: boolean = false
  private eventTarget = new CactusEventTarget<FileObject[]>({})
  public state: FileInputState = { inputKey: 0, files: [] }

  private static getDerivedStateFromProps(
    props: FileInputProps,
    state: FileInputState,
  ): Partial<FileInputState> | null {
    if (props.value !== undefined && props.value !== state.files) {
      const files = !Array.isArray(props.value) ? [] : props.value
      if (files.length || state.files.length) {
        const newState: Partial<FileInputState> = { files }
        if (files.length !== state.files.length || state.files.some(
          (f, ix) => f.file !== files[ix].file)) {
          newState.inputKey = state.inputKey + 1
        }
        return newState
      }
    }
    return null
  }

  private deleteFile = (index: number, event: React.SyntheticEvent) => {
    event.persist()
    // TODO call order...
    this.setState((state) => {
      const files = state.files.splice(index, 1)
      this.raiseChange(files, event)
      return { inputKey: state.inputKey + 1, files }
    })
  }

  private toFileObj = (file: File) => toFileObj(file, this.props.accept)

  private handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    trapEvent(event)
    if (this.props.disabled) return

    let files = this.state.files
    const isUnique = (f: File) => !files.some(({ file }) => isSameFile(file, f))
    const newFiles = event.dataTransfer.files.filter(isUnique).map(this.toFileObj)
    if (newFiles.length) {
      files = this.props.multiple ? files.concat(newFiles) : newFiles.slice(0, 1)
      // TODO Does the post-update callback run before the next render? If so,
      // should maybe raise the change event in that and do the uniqueness
      // calculation inside the update callback.
      this.setState({ files })
      this.raiseChange(files, event)
    }
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    // Don't need to check `multiple` or `disabled` here because the DOM input does it for us.
    const files = Array.from(event.target.files).map(this.toFileObj)
    // TODO Should we just always change the input key?
    // It'd avoid all issues with the component state not matching the input state...
    this.setState({ files })
    this.raiseChange(files, event)
  }

  private raiseChange(files, event) {
    const { eventTarget, props: { onChange } } = this
    eventTarget.value = files
    if (onChange) {
      const cactusEvent = new CactusChangeEvent(eventTarget, event)
      onChange(cactusEvent)
    }
  }

  private handleFocus = (event: React.FocusEvent) => {
    const onFocus = this.props.onFocus
    if (!this.isFocused) {
      this.isFocused = true
      if (onFocus) {
        const cactusEvent = new CactusFocusEvent('focus', this.eventTarget, event)
        onFocus(cactusEvent)
      }
    }
  }

  private handleBlur = (event: React.FocusEvent) => {
    if (isFocusOut(event)) {
      this.isFocused = false
      const onBlur = this.props.onBlur
      if (onBlur) {
        const cactusEvent = new CactusFocusEvent('blur', this.eventTarget, event)
        onBlur(cactusEvent)
      }
    }
  }

  // Allow reference as styled-components CSS class.
  // TODO I think it might be possible to style components while still not allowing
  // them to be overridden with the `as` prop by doing something like this:
  // const SC = styled(C).attrs({ $as: C })`
  //   ...styles
  // ` as React.FC<CProps>
  // The type change is to make Typescript complain if they try to pass `as`.
  static toString() {
    return InnerFileInput.toString()
  }

  render() {
    this.eventTarget.id = this.props.id
    this.eventTarget.name = this.props.name
    const {
      value,
      accept,
      onChange,
      onFocus,
      onBlur,
      ...props
    } = this.props
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
  loading: css`
    background-color: ${(p) => p.theme.colors.lightContrast};
  `,
  loaded: css`
    border: ${(p) => border(p.theme, 'success')};
    background-color: ${(p) => p.theme.colors.transparentSuccess};
  `,
  error: css`
    border: ${(p) => border(p.theme, 'error')};
    background-color: ${(p) => 'transparentError'};
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
  ${(p) => fileBoxColors[props.$status]};

  &[aria-disabled] {
    color: ${(p) => p.theme.colors.mediumGray};
    border: ${(p) => border(p.theme, 'mediumGray')};
    background-color: ${(p) => p.theme.colors.lightGray};
  }

  span {
    margin-left: 8px;
    margin-right: 8px;
    max-width: calc(100% - 52px);/* margins + avatar + button */
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

  ${IconButton} {
    padding: 0;
    margin-left: auto;
  }

  ${NavigationClose} {
    height: 12px;
    width: 12px;
  }
`
const FileInfo: React.FC<FileInfoProps> = (props) => {
  const {
    disabled,
    labels = {},
    index,
    deleteFile,
    fileObj: {
      file,
      error,
      status,
      $promise,
    },
  } = props

  const triggerRerender = useRenderTrigger()
  const isMounted = React.useRef<boolean>(true)
  React.useEffect(() => {
    isMounted.current = true
    const handler = () => {
      if (isMounted.current) triggerRerender()
    }
    $promise.then(handler, handler)
    return () => {
      isMounted.current = false
    }
  }, [$promise])

  const hasError = error && !disabled
  let label = file.name
  let avatarStatus: string | undefined = undefined
  if (status === 'unloaded') {
    label += `, ${labels.unloaded || DEFAULT_LABELS.unloaded}`
    avatarStatus = 'info' // TODO?
  } else if (status === 'loaded') {
    label += `, ${labels.loaded || DEFAULT_LABELS.loaded}`
    avatarStatus = 'success'
  } else if (status === 'error') {
    label += `, ${error?.message || DEFAULT_ERROR_MSG}`
    avatarStatus = 'error'
  } else if (status === 'loading') {
    label += `, ${labels.loading || DEFAULT_LABELS.loading}`
  }

  const onDelete = React.useCallback(
    (event: React.MouseEvent) => deleteFile(index, event),
    [deleteFile, index],
  )

  return (
    <>
      <FileBox
        tabIndex={0}
        aria-label={label}
        aria-disabled={disabled || undefined}
        ref={boxRef}
        $status={status}
      >
        {avatarStatus && (
          <Avatar type="alert" status={avatarStatus} disabled={disabled} />
        )}
        <span>{file.name}</span>
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
      {hasError && <StatusMessage status="error">{error.message}</StatusMessage>}
    </>
  )
}

const toFileObj = (file: File, accept?: string[]): FileObject => {
  const fileObj: any = { file, status: 'unloaded' }
  fileObj.$promise = new Promise((resolve, reject) => {
    if (accept && !accepts(file, accept)) {
      reject(setCustomError(fileObj, FILE_TYPE_ERR, accept))
    }

    fileObj.loadBase64 = () => {
      if (fileObj.status === 'unloaded') {
        fileObj.status = 'loading'
        const reader = new FileReader()

        reader.onload = () => {
          let dataURL = reader.result as string
          if (file.size > 250000000 && dataURL === '') {
            reject(setCustomError(fileObj, NOT_READABLE_ERR))
            return
          }
          const prefixIndex = dataURL.indexOf('base64')
          if (prefixIndex >= 0) {
            dataURL = dataURL.slice(prefixIndex + 7)
          }
          fileObj.contents = dataURL
          fileObj.status = 'loaded'
          resolve(dataURL)
        }

        reader.onerror = () => {
          reader.abort()
          fileObj.status = 'error'
          reject(fileObj.error = reader.error)
        }

        reader.readAsDataURL(fileObj.file)
      }
      return fileObj.$promise
    }
  })
  return fileObj
}

const setCustomError = (fileObj: FileObject, errName: string, accept?: string[]) => {
  let errorMsg = DEFAULT_ERROR_MSG
  switch (errorName) {
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
      errorMsg = 'The file read operation failed: the file may be too large.'
        + ' Please try again or select a different file.'
      break
    case ENCODING_ERR:
      errorMsg = 'The encoding or decoding operation failed. Please try again.'
      break
  }
  fileObj.status = 'error'
  const error = fileObj.error = new Error(errMsg)
  error.name = errName
  return error
}

function trapEvent(e: React.DragEvent) {
  e.preventDefault()
  e.stopPropagation()
}

const FileInputBase = (props: InnerInputProps): React.ReactElement => {
  const {
    className,
    name,
    accept,
    labels,
    buttonText,
    prompt,
    multiple,
    value,
    id,
    disabled,
    'aria-describedby': describedBy,
    onChange,
    onDrop,
    onFocus,
    onBlur,
    deleteFile,
    files,
    inputKey,
    ...fileInputProps
  } = props
  const fileSelector = useRef<HTMLInputElement | null>(null)
  const topFileBox = useRef<HTMLDivElement | null>(null)

  useEffect((): void => {
    // TODO is this step necessary? How can I do it with the new outer class component?
    if (topFileBox.current) {
      topFileBox.current.focus()
    }
  }, [files])

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
      id={id}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={handleOpenFileSelect}
    >
      <BatchstatusOpen iconSize="small" />
      {buttonText || DEFAULT_BUTTON_TEXT}
    </TextButton>
  )

  return (
    <div
      {...fileInputProps}
      className={className}
      onDragEnter={trapEvent}
      onDragLeave={trapEvent}
      onDragOver={trapEvent}
      onDrop={onDrop}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-disabled={disabled || undefined}
    >
      <input
        key={inputKey}
        type="file"
        ref={fileSelector}
        accept={accept && accept.join()}
        name={name}
        multiple={multiple}
        onChange={onChange}
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
                boxRef={index === 0 ? topFileBox : undefined}
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

const InnerFileInput = styled(FileInputBase).withConfig(omitProps(margin, width, maxWidth))`
  ${(p) => textStyle(p.theme, 'body')};
  box-sizing: border-box;
  border-radius: ${radius(8)};
  border: 2px dotted ${(p) => p.theme.colors.darkestContrast};
  min-width: 300px;
  min-height: 100px;
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  ${(p) => textStyle(p.theme, 'body')};

  ${(p) => !p.files.length && `
    flex-direction: column;
    border-color: ${p.theme.colors.callToAction};
    padding: 0 8px;

    ${TextButton} {
      position: relative;
      margin: 16px 0 16px 0;
    }
  `}

  &[aria-disabled] {
    border: 2px solid ${(p) => p.theme.colors.lightGray};
    background-color: ${(p) => p.theme.colors.lightGray};
    * {
      color: ${(p) => p.theme.colors.mediumGray};
    }
  }

  ${StatusMessage} {
    margin-top: 4px;
  }

  input {
    display: none;
  }

  ${margin}
  ${width}
  ${maxWidth}
` as any

export default FileInput
