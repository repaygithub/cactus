import React from 'react'
import styled from 'styled-components'

const Label = styled.label<React.HTMLProps<HTMLLabelElement>>`
  font-size: 18px;
  height: 28px;
  font-weight: 400;
  color: ${p => p.theme.colors.darkestContrast};
`

export default Label
