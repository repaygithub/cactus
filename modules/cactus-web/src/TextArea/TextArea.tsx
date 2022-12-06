import { mediaGTE, radius, textStyle } from '@repay/cactus-theme'
import { Property } from 'csstype'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { compose, margin, MarginProps, ResponsiveValue, system } from 'styled-system'

import { StatusProps, StatusPropType } from '../helpers/status'
import {
  allHeight,
  AllHeightProps,
  allWidth,
  AllWidthProps,
  flexItem,
  FlexItemProps,
  styledProp,
} from '../helpers/styled'
import { commonInputStyles } from '../TextInput/TextInput'

type AreaElementProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'height' | 'width'>
export interface TextAreaProps
  extends AreaElementProps,
    StatusProps,
    FlexItemProps,
    MarginProps,
    AllHeightProps,
    AllWidthProps {
  resize?: ResponsiveValue<Property.Resize>
}
const resizeSS = system({ resize: true })

const TextArea = styled.textarea<TextAreaProps>`
  border-radius: ${radius(8)};
  height: 100px;
  ${mediaGTE('small')} {
    width: 336px;
  }
  ${textStyle('body')}
  padding: 8px 16px;
  display: block;
  position: relative;
  resize: none;
  ${commonInputStyles}
  &&& {
    ${compose(margin, allHeight, allWidth, flexItem, resizeSS)}
  }
`

TextArea.propTypes = {
  disabled: PropTypes.bool,
  status: StatusPropType,
  width: styledProp,
  height: styledProp,
  resize: PropTypes.oneOf(['none', 'both', 'horizontal', 'vertical', 'initial', 'inherit']),
}

export default TextArea
