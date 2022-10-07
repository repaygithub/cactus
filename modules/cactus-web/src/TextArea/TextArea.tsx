import { mediaGTE, radius, textStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { compose, height, HeightProps, margin, MarginProps, width, WidthProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'
import { StatusProps, StatusPropType } from '../helpers/status'
import { styledProp } from '../helpers/styled'
import { commonInputStyles } from '../TextInput/TextInput'

type AreaElementProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'height' | 'width'>
export interface TextAreaProps
  extends AreaElementProps,
    StatusProps,
    MarginProps,
    HeightProps,
    WidthProps {
  resize?: boolean
}

interface AreaProps extends TextAreaProps {
  $height: string
  $width: string
}

const Area = styled.textarea<AreaProps>`
  border-radius: ${radius(8)};
  min-height: 100px;
  ${mediaGTE('small')} {
    min-width: 336px;
  }
  ${textStyle('body')}
  padding: 8px 16px;
  height: ${(p) => p.$height};
  width: ${(p) => p.$width};
  display: block;
  resize: ${(p) => (p.resize ? 'vertical' : 'none')};

  ${commonInputStyles}
`

const TextAreaBase = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props: TextAreaProps, ref) => {
    const { className, height: hasH, width: hasW, ...rest } = omitMargins(props)

    return (
      <div className={className}>
        <Area {...rest} ref={ref} $height={control(hasH)} $width={control(hasW)} />
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
  width: styledProp,
  height: styledProp,
  resize: PropTypes.bool,
}

export default TextArea
