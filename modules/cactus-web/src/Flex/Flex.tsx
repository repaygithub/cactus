import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { flexbox, FlexboxProps } from 'styled-system'

import { Box, BoxProps } from '../Box/Box'
import { isIE } from '../helpers/constants'
import { getOmittableProps } from '../helpers/omit'

interface FlexBoxProps extends BoxProps, Omit<FlexboxProps, 'justifySelf'> {}

export const justifyOptions = [
  'unset',
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
  'stretch',
] as const
export type JustifyContent = typeof justifyOptions[number]

const styleProps = getOmittableProps(flexbox)
export const Flex = styled(Box).withConfig({
  shouldForwardProp: (p) => !styleProps.has(p),
})<FlexBoxProps>`
  display: flex;
  ${flexbox}

  ${(p) => {
    if (isIE && p.justifyContent === 'space-evenly') {
      return css`
        justify-content: space-between;
        &:before,
        &:after {
          content: '';
          display: block;
        }
      `
    }
  }}
`

Flex.defaultProps = {
  flexWrap: 'wrap',
}

function styledProp<T>(...allowed: T[]) {
  const propType = PropTypes.oneOf<T>(allowed).isRequired
  return PropTypes.oneOfType([propType, PropTypes.arrayOf(propType)])
}

Flex.propTypes = {
  justifyContent: PropTypes.oneOf(justifyOptions),
  alignItems: styledProp('unset', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'),
  alignSelf: styledProp('unset', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'),
  flexWrap: styledProp('unset', 'inherit', 'wrap', 'nowrap', 'wrap-reverse'),
  flexDirection: styledProp('unset', 'inherit', 'row', 'row-reverse', 'column', 'column-reverse'),
}

export default Flex
