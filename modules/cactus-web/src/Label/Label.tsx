import React from 'react'
import styled from 'styled-components'
import { space, SpaceProps } from 'styled-system'
import splitProps from '../helpers/splitProps'
import { Omit } from '../types'

interface LabelProps
  extends Omit<
      React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>,
      'ref'
    >,
    SpaceProps {}

const StyledLabel = styled.label<LabelProps>`
  font-size: 18px;
  height: 28px;
  font-weight: 400;
  color: ${p => p.theme.colors.darkestContrast};

  ${space}
`

const Label = (props: LabelProps) => {
  const [componentProps, marginProps] = splitProps<LabelProps>(props, 'Label')
  return <StyledLabel {...componentProps} {...marginProps} />
}

export default Label
