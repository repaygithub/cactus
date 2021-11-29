import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { flexbox, FlexboxProps } from 'styled-system'

import { Box, BoxProps } from '../Box/Box'

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

export const Flex = styled(Box)<FlexBoxProps>`
  display: flex;
  ${flexbox}

  ${(p): ReturnType<typeof css> | undefined => {
    if (p.justifyContent === 'space-evenly' && /MSIE|Trident/.test(window.navigator.userAgent)) {
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

Flex.propTypes = {
  justifyContent: PropTypes.oneOf(justifyOptions),
  alignItems: PropTypes.oneOf(['unset', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch']),
  alignSelf: PropTypes.oneOf(['unset', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch']),
  flexWrap: PropTypes.oneOf(['unset', 'inherit', 'wrap', 'nowrap', 'wrap-reverse']),
  flexDirection: PropTypes.oneOf([
    'unset',
    'inherit',
    'row',
    'row-reverse',
    'column',
    'column-reverse',
  ]),
}

export default Flex
