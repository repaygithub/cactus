import React from 'react'
import styled, { FlattenInterpolation, ThemeProps, css } from 'styled-components'
import { CactusTheme } from '@repay/cactus-theme'
import { space, SpaceProps } from 'styled-system'
import splitProps from '../helpers/splitProps'
import { Omit } from '../types'

export type TextButtonVariants = 'standard' | 'action' | 'danger'

interface TextButtonProps
  extends Omit<
      React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
      'ref'
    >,
    SpaceProps {
  variant?: TextButtonVariants
  disabled?: boolean
  // No inverse danger variant
  inverse?: boolean
}

type VariantMap = { [K in TextButtonVariants]: FlattenInterpolation<ThemeProps<CactusTheme>> }

const variantMap: VariantMap = {
  action: css`
    color: ${p => p.theme.colors.callToAction};
  `,
  standard: css`
    color: ${p => p.theme.colors.base};
  `,
  danger: css`
    color: ${p => p.theme.colors.error};
  `,
}

const inverseVariantMap: VariantMap = {
  action: css`
    font-weight: 700;
    color: ${p => p.theme.colors.callToAction};
  `,
  standard: css`
    color: ${p => p.theme.colors.white};
  `,
  danger: css``,
}

const disabled: FlattenInterpolation<ThemeProps<CactusTheme>> = css`
  color: ${p => p.theme.colors.mediumGray};
  cursor: not-allowed;
`

const variantOrDisabled = (
  props: TextButtonProps
): FlattenInterpolation<ThemeProps<CactusTheme>> | undefined => {
  const { variant, inverse } = props
  if (variant === 'danger' && inverse) {
    throw new Error('A danger variant does not exist for an inverse TextButton.')
  }
  const map = inverse ? inverseVariantMap : variantMap
  if (props.disabled) {
    return disabled
  } else if (variant !== undefined) {
    return map[variant]
  }
}

const StyledTextButton = styled.button<TextButtonProps>`
  font-size: 18px;
  border: none;
  padding: 2px 0;
  line-height: 1.5em;
  outline: none;
  background-color: transparent;
  text-decoration: none;
  cursor: pointer;

  :hover {
    text-decoration: ${p => !p.disabled && 'underline'};
  }

  :focus {
    text-decoration: ${p => !p.disabled && 'underline'};
  }

  svg {
    display: inline-block;
    margin-top: -4px;
  }

  ${space}
  ${variantOrDisabled}
`

const TextButton = (props: TextButtonProps) => {
  const [componentProps, marginProps] = splitProps<TextButtonProps>(props, 'TextButton')
  return <StyledTextButton {...componentProps} {...marginProps} />
}

TextButton.defaultProps = {
  variant: 'standard',
  disabled: false,
  inverse: false,
}

export default TextButton
