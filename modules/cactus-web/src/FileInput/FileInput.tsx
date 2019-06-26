import React, { MutableRefObject, useEffect, useRef, useState } from 'react'

import {
  ActionsRefresh,
  ActionsUpload,
  BatchstatusOpen,
  NavigationClose,
  NotificationError,
  StatusCheck,
} from '@repay/cactus-icons'
import { CactusTheme } from '@repay/cactus-theme'
import { FieldOnChangeHandler, Omit } from '../types'
import { IconButton } from '../IconButton/IconButton'
import { MarginProps, margins } from '../helpers/margins'
import { maxWidth, MaxWidthProps, width, WidthProps } from 'styled-system'
import { TextButton } from '../TextButton/TextButton'
import accepts from '../helpers/accept'
import PropTypes from 'prop-types'
import Spinner from '../Spinner/Spinner'
import StatusMessage from '../StatusMessage/StatusMessage'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

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

interface FileInputProps
  extends MarginProps,
    MaxWidthProps,
    WidthProps,
    Omit<
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      'onChange' | 'onError' | 'onFocus' | 'onBlur'
    > {
  name: string
  accept: string[]
  labels?: { delete?: string; retry?: string; loading?: string; loaded?: string }
  buttonText?: string
  prompt?: string
  onChange?: FieldOnChangeHandler<FileObject[]>
  onError?: (type: ErrorType, accept?: string[]) => string
  onFocus?: (name: string) => void
  onBlur?: (name: string) => void
  rawFiles?: boolean
  multiple?: boolean
  value?: FileObject[]
}

interface EmptyPromptsProps {
  prompt: string
  className?: string
}

interface FileBoxProps {
  fileName: string
  onDelete: (fileName: string) => void
  status: FileStatus
  labels: { delete?: string; loading?: string; loaded?: string }
  className?: string
  errorMsg?: string
}

interface FileInfoProps extends FileBoxProps {
  labels: { delete?: string; retry?: string; loading?: string; loaded?: string }
  onRetry: (fileName: string) => void
  boxRef?: MutableRefObject<HTMLDivElement | null>
}

interface AvatarProps {
  success: boolean
  className?: string
}

interface FileObject {
  fileName: string
  contents: File | string | null
  status: FileStatus
  errorMsg?: string
}

interface State {
  files: FileObject[]
  inputKey: string
  isRetrying: boolean
}

const EmptyPromptsBase = (props: EmptyPromptsProps) => (
  <div className={props.className}>
    <ActionsUpload iconSize="large" />
    <span>{props.prompt}</span>
  </div>
)

const EmptyPrompts = styled(EmptyPromptsBase)`
  width: 300px;
  height: 100px;

  ${ActionsUpload} {
    position: absolute;
    top: 30%;
    left: 15%;
    color: ${p => p.theme.colors.callToAction};
  }

  span {
    position: absolute;
    top: 20%;
    left: 37%;
    color: ${p => p.theme.colors.darkGray};
  }
`

const AvatarBase = (props: AvatarProps) => (
  <div className={props.className}>{props.success ? <StatusCheck /> : <NotificationError />}</div>
)

const Avatar = styled(AvatarBase)`
  box-sizing: border-box;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${p =>
    p.success ? p.theme.colors.status.avatar.success : p.theme.colors.status.avatar.error};

  ${NotificationError} {
    height: 16px;
    width: 16px;
  }

  ${StatusCheck} {
    height: 18px;
    width: 18px;
  }
`

type FileBoxMap = { [K in FileStatus]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const fileBoxMap: FileBoxMap = {
  loading: css`
    background-color: ${P => P.theme.colors.lightContrast};
  `,
  loaded: css`
    border: 2px solid ${p => p.theme.colors.success};
    background-color: ${p => p.theme.colors.transparentSuccess};
  `,
  error: css`
    border: 2px solid ${p => p.theme.colors.error};
    background-color: ${p => p.theme.colors.transparentError};
  `,
}

const fileStatus = (props: FileBoxProps) => fileBoxMap[props.status]

const FileBoxBase = React.forwardRef<HTMLDivElement, FileBoxProps>((props, ref) => {
  const { fileName, className, status, errorMsg, onDelete, labels } = props
  const onClick = () => {
    onDelete(fileName)
  }

  let label = fileName
  if (status === 'loaded') {
    label += labels.loaded ? `, ${labels.loaded}` : ', Successful'
  } else if (status === 'error' && errorMsg) {
    label += `, ${errorMsg}`
  } else if (status === 'loading') {
    label += labels.loading ? `, ${labels.loading}` : ', Loading'
  }

  return (
    <div className={className} tabIndex={0} aria-label={label} ref={ref}>
      {status === 'error' ? (
        <Avatar success={false} />
      ) : (
        status === 'loaded' && <Avatar success={true} />
      )}
      <span>{fileName}</span>
      {status === 'loading' ? (
        <Spinner />
      ) : (
        <IconButton onClick={onClick} label={labels.delete}>
          <NavigationClose />
        </IconButton>
      )}
    </div>
  )
})

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
  color: ${p => p.theme.colors.darkestContrast};

  span {
    margin-left: 8px;
    ${p => p.theme.textStyles.body};
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

const FileInfoBase = (props: FileInfoProps) => {
  const { className, onRetry, errorMsg, labels, boxRef, ...rest } = props
  const { retry, ...fileBoxLabels } = labels

  const onClick = () => {
    onRetry(rest.fileName)
  }

  return (
    <div className={className}>
      <FileBox errorMsg={errorMsg} labels={fileBoxLabels} ref={boxRef} {...rest} />
      {errorMsg && (
        <StatusMessage status="error">
          <span>{errorMsg}</span>
          <IconButton onClick={onClick} label={retry || 'Retry Upload'}>
            <ActionsRefresh />
          </IconButton>
        </StatusMessage>
      )}
    </div>
  )
}

const FileInfo = styled(FileInfoBase)`
  width: 100%;

  ${StatusMessage} {
    position: relative;
    margin-top: 4px;
    width: 100%;

    span {
      padding-right: 15px;
    }

    ${IconButton} {
      position: absolute;
      right: 11px;
      top: 14px;
      color: ${p => p.theme.colors.white};
    }

    ${ActionsRefresh} {
      height: 12px;
      width: 12px;
    }
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

const FileInputBase = (props: FileInputProps) => {
  const {
    className,
    onChange,
    onError = defaultErrorHandler,
    onFocus,
    onBlur,
    rawFiles,
    name,
    accept,
    labels = {
      delete: 'Delete File',
      retry: 'Retry Upload',
      loading: 'Loading',
      loaded: 'Successful',
    },
    buttonText = 'Select Files...',
    prompt = 'Drag files here or',
    multiple,
    value,
    ...fileInputProps
  } = props
  const [state, setState] = useState<State>({
    files: value || [],
    inputKey: Math.random().toString(36),
    isRetrying: false,
  })
  const isMounted = useRef(true)
  const fileSelector = useRef<HTMLInputElement | null>(null)
  const topFileBox = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (topFileBox.current) {
      topFileBox.current.focus()
    }
  }, [state.files])

  useEffect(() => {
    if (value && value !== state.files) {
      setState(state => ({ ...state, files: value }))
    }
  }, [state.files, value])

  const saveFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      const loadingFiles = Array.from(files).map(
        file => ({ fileName: file.name, contents: null, status: 'loading' } as FileObject)
      )
      if (state.isRetrying) {
        setState(state => ({ ...state, files: [...state.files, ...loadingFiles] }))
      } else {
        setState(state => ({ ...state, files: loadingFiles }))
      }

      const promises = Array.from(files).map(file => {
        if (!accepts(file, accept)) {
          return new Promise<FileObject>(resolve => {
            const errorMsg = onError(FILE_TYPE_ERR, accept)
            resolve({
              fileName: file.name,
              contents: null,
              status: 'error',
              errorMsg: errorMsg,
            })
          })
        }

        if (rawFiles) {
          return Promise.resolve<FileObject>({
            fileName: file.name,
            contents: file,
            status: 'loaded',
          })
        } else {
          const reader = new FileReader()

          return new Promise<FileObject>(resolve => {
            reader.onload = () => {
              let dataURL = reader.result as string
              if (file.size > 250000000 && dataURL === '') {
                const errorMsg = onError(NOT_READABLE_ERR)
                resolve({
                  fileName: file.name,
                  contents: null,
                  status: 'error',
                  errorMsg: errorMsg,
                })
              }
              dataURL = dataURL.replace(/data:.+\/.+\;base64,/g, '')
              resolve({ fileName: file.name, contents: dataURL, status: 'loaded' })
            }

            reader.onerror = () => {
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
      })

      Promise.all(promises).then(results => {
        if (isMounted.current === true) {
          if (state.isRetrying) {
            setState(state => {
              const final = state.files.map(file => {
                const updated = results.find(f => f.fileName === file.fileName)
                return updated ? updated : file
              })
              return { ...state, files: final, isRetrying: false }
            })
          } else {
            setState(state => ({ ...state, files: results }))
          }
          if (typeof onChange === 'function') {
            onChange(name, results)
          }
        }
      })
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    saveFiles(event.dataTransfer.files)
  }

  const handleOpenFileSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (fileSelector.current) {
      fileSelector.current.click()
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    saveFiles(event.target.files)
  }

  const handleDelete = (fileName: string) => {
    const files = state.files.filter(file => file.fileName !== fileName)
    setState({ files: files, inputKey: Math.random().toString(36), isRetrying: false })
    if (isMounted.current === true) {
      if (typeof onChange === 'function') {
        onChange(name, files)
      }
    }
  }

  const handleRetry = (fileName: string) => {
    const files = state.files.filter(file => file.fileName !== fileName)
    const promise = new Promise<State>(resolve => {
      resolve({ files: files, inputKey: Math.random().toString(36), isRetrying: true })
    })
    promise.then(result => {
      setState(result)
      if (isMounted.current === true) {
        if (typeof onChange === 'function') {
          onChange(name, result.files)
        }
      }
      if (fileSelector.current) {
        fileSelector.current.click()
      }
    })
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (typeof onFocus === 'function') {
      onFocus(name)
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (typeof onBlur === 'function') {
      onBlur(name)
    }
  }

  const emptyClassName =
    state === undefined ? 'empty' : state.files.length === 0 ? 'empty' : 'notEmpty'

  return (
    <div
      {...fileInputProps}
      className={`${className} ${emptyClassName}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileSelector}
        key={state.inputKey}
        accept={accept.join()}
        multiple={multiple}
        onChange={handleFileSelect}
      />
      {state === undefined ? null : state.files.length === 0 ? (
        <React.Fragment>
          <EmptyPrompts prompt={prompt} />
          <TextButton
            variant="action"
            onClick={handleOpenFileSelect}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          >
            <BatchstatusOpen iconSize="small" />
            {buttonText}
          </TextButton>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {state.files.map((file, index) => (
            <FileInfo
              key={file.fileName}
              fileName={file.fileName}
              onDelete={handleDelete}
              onRetry={handleRetry}
              status={file.status}
              errorMsg={file.errorMsg}
              labels={labels}
              boxRef={index === 0 ? topFileBox : undefined}
            />
          ))}
          <TextButton
            variant="action"
            onClick={handleOpenFileSelect}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
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
  border-radius: 8px;
  border: 2px ${p => (p.theme.disabled ? 'solid' : 'dotted')};
  border-color: ${p => (p.theme.disabled ? p.theme.colors.lightGray : p.theme.colors.darkContrast)};
  min-width: 300px;
  min-height: 100px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &.empty {
    ${TextButton} {
      position: absolute;
      left: 35%;
      bottom: 15%;
    }
  }

  &.notEmpty {
    flex-direction: column;
    border-color: ${p => p.theme.colors.callToAction};
    padding: 0 8px;

    ${TextButton} {
      position: relative;
      margin: 16px 0 16px 0;
    }
  }

  input {
    display: none;
  }

  ${margins}
  ${width}
  ${maxWidth}
`

// @ts-ignore
FileInput.propTypes = {
  name: PropTypes.string.isRequired,
  accept: PropTypes.arrayOf(PropTypes.string).isRequired,
  labels: PropTypes.shape({
    delete: PropTypes.string,
    retry: PropTypes.string,
    loading: PropTypes.string,
    loaded: PropTypes.string,
  }),
  buttonText: PropTypes.string,
  prompt: PropTypes.string,
  onChange: PropTypes.func,
  onError: PropTypes.func,
  rawFiles: PropTypes.bool,
  multiple: PropTypes.bool,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      status: PropTypes.oneOf(['loading', 'loaded', 'error']),
      errorMsg: PropTypes.string,
    })
  ),
}

FileInput.defaultProps = {
  rawFiles: false,
  multiple: false,
  labels: {
    delete: 'Delete File',
    retry: 'Retry Upload',
    loading: 'Loading',
    loaded: 'Successful',
  },
  buttonText: 'Select Files...',
  prompt: 'Drag files here or',
}

export default FileInput
