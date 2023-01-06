import { mediaGTE, radius, textStyle } from '@repay/cactus-theme'
import { Property } from 'csstype'
import PropTypes from 'prop-types'
import React from 'react'
import { margin, MarginProps, ResponsiveValue, system } from 'styled-system'

import { StatusProps, StatusPropType } from '../helpers/status'
import {
  flexItem,
  FlexItemProps,
  sizing,
  SizingProps,
  styledProp,
  withStyles,
} from '../helpers/styled'
import { commonInputStyles } from '../TextInput/TextInput'

type AreaElementProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'height' | 'width'>
export interface TextAreaProps
  extends AreaElementProps,
    StatusProps,
    FlexItemProps,
    MarginProps,
    SizingProps {
  resize?: ResponsiveValue<Property.Resize>
}
const resizeSS = system({ resize: true })

const TextArea = withStyles('textarea', {
  displayName: 'TextArea',
  styles: [margin, sizing, flexItem, resizeSS],
  transitiveProps: ['status'],
})<TextAreaProps>`
  border-radius: ${radius(8)};
  height: 100px;
  ${mediaGTE('small')} {
    width: 336px;
  }
  ${textStyle('body')}
  padding: 8px 16px;
  position: relative;
  resize: none;
  ${commonInputStyles}
`

TextArea.propTypes = {
  disabled: PropTypes.bool,
  status: StatusPropType,
  width: styledProp,
  height: styledProp,
}

export default TextArea
