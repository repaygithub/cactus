import { border, color, colorStyle, mediaGTE, radius, textStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { compose, height, HeightProps, margin, MarginProps, width, WidthProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'
import { textFieldStatusMap } from '../helpers/status'
import { Status, StatusPropType } from '../StatusMessage/StatusMessage'

type AreaElementProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'height' | 'width'>
export interface TextAreaProps extends AreaElementProps, MarginProps, HeightProps, WidthProps {
  disabled?: boolean
  status?: Status | null
  resize?: boolean
}

interface AreaProps extends TextAreaProps {
  $height: string
  $width: string
}

const displayStatus = (props: AreaProps) => {
  if (props.status && !props.disabled) {
    return textFieldStatusMap[props.status]
  } else {
    return ''
  }
}

const Area = styled.textarea<AreaProps>`
  border: ${border('darkContrast')};
  border-radius: ${radius(8)};
  min-height: 100px;
  ${mediaGTE('small')} {
    min-width: 336px;
  }
  box-sizing: border-box;
  ${textStyle('body')}
  padding: 8px 16px;
  outline: none;
  ${colorStyle('standard')};
  height: ${(p) => p.$height};
  width: ${(p) => p.$width};
  display: block;
  resize: ${(p) => (p.resize ? 'vertical' : 'none')};

  &:first-line {
    padding-right: 15px;
  }

  &:focus {
    border-color: ${color('callToAction')};
  }

  &:disabled {
    cursor: not-allowed;
    border-color: ${color('lightGray')};
    ${colorStyle('disable')};
  }

  &:disabled::placeholder {
    color: ${color('mediumGray')};
    font-style: oblique;
  }
  ${displayStatus}
`

const TextAreaBase = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props: TextAreaProps, ref) => {
    const { className, height, width, ...rest } = omitMargins(props)

    return (
      <div className={className}>
        <Area {...rest} ref={ref} $height={control(height)} $width={control(width)} />
      </div>
    )
  }
)
const control = (val: unknown) => (val ? '100%' : 'auto')

export const TextArea = styled(TextAreaBase)`
  position: relative;
  display: block;

  &&& {
    ${compose(margin, height, width)}
  }
`

TextArea.propTypes = {
  disabled: PropTypes.bool,
  status: StatusPropType,
  width: PropTypes.string,
  height: PropTypes.string,
  resize: PropTypes.bool,
}

TextArea.defaultProps = {
  disabled: false,
  status: null,
  resize: false,
}

export default TextArea
