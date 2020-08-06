import { BorderSize, CactusTheme, Shape, TextStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, {
  css,
  FlattenInterpolation,
  FlattenSimpleInterpolation,
  ThemeProps,
} from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { omitMargins } from '../helpers/omit'
import { textStyle } from '../helpers/theme'
import { Status, StatusPropType } from '../StatusMessage/StatusMessage'
import { Omit } from '../types'

export interface TextInputProps
  extends Omit<
      React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
      'ref'
    >,
    MarginProps {
  /** !important */
  disabled?: boolean
  status?: Status | null
}

interface InputProps {
  disabled?: boolean
  status?: Status | null
}

type StatusMap = { [K in Status]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const statusMap: StatusMap = {
  success: css`
    border-color: ${(p): string => p.theme.colors.success};
    background: ${(p): string => p.theme.colors.transparentSuccess};
  `,
  warning: css`
    border-color: ${(p): string => p.theme.colors.warning};
    background: ${(p): string => p.theme.colors.transparentWarning};
  `,
  error: css`
    border-color: ${(p): string => p.theme.colors.error};
    background: ${(p): string => p.theme.colors.transparentError};
  `,
}

const displayStatus = (
  props: TextInputProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | string => {
  if (props.status && !props.disabled) {
    return statusMap[props.status]
  } else {
    return ''
  }
}

const TextInputBase = React.forwardRef<HTMLInputElement, TextInputProps>(
  (props: TextInputProps, forwardRef): React.ReactElement => {
    const { className, ...rest } = omitMargins(props)

    return (
      <div className={className}>
        <Input ref={forwardRef} {...rest} />
      </div>
    )
  }
)

const borderMap: { [K in BorderSize]: ReturnType<typeof css> } = {
  thin: css`
    border: 1px solid;
  `,
  thick: css`
    border: 2px solid;
  `,
}

const shapeMap: { [K in Shape]: ReturnType<typeof css> } = {
  square: css`
    border-radius: 1px;
  `,
  intermediate: css`
    border-radius: 8px;
  `,
  round: css`
    border-radius: 20px;
  `,
}

const getBorder = (borderSize: BorderSize): ReturnType<typeof css> => borderMap[borderSize]
const getShape = (shape: Shape): ReturnType<typeof css> => shapeMap[shape]

const Input = styled.input<InputProps>`
  box-sizing: border-box;
  ${(p): ReturnType<typeof css> => getBorder(p.theme.border)}
  border-color: ${(p): string =>
    p.disabled ? p.theme.colors.lightGray : p.theme.colors.darkContrast};
  ${(p): ReturnType<typeof css> => getShape(p.theme.shape)}
  height: 32px;
  outline: none;
  box-sizing: border-box;
  padding: 7px 28px 7px 15px;
  ${(p): FlattenSimpleInterpolation | TextStyle => textStyle(p.theme, 'body')};
  width: ${(p): string | number => p.width || 'auto'};
  background-color: ${(p): string => p.theme.colors.white};

  [disabled] {
    border-color: ${(p): string => p.theme.colors.lightGray};
    background-color: ${(p): string => p.theme.colors.lightGray};
  }

  &:focus {
    border-color: ${(p): string => p.theme.colors.callToAction};
  }

  &::placeholder {
    color: ${(p): string => p.theme.colors.mediumContrast};
    font-style: oblique;
  }

  ${displayStatus}
`

export const TextInput = styled(TextInputBase)`
  box-sizing: border-box;
  ${margin}
`

// @ts-ignore
TextInput.propTypes = {
  disabled: PropTypes.bool,
  status: StatusPropType,
}

TextInput.defaultProps = {
  disabled: false,
  status: null,
}

export default TextInput
