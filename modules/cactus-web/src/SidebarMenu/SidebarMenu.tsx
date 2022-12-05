import { NavigationArrowDown } from '@repay/cactus-icons'
import { textStyle } from '@repay/cactus-theme'
import styled from 'styled-components'

import { border, borderSize } from '../helpers/theme'

const listStyle = `
  list-style: none;
  padding: 0;
  margin: 0;
`

export const SidebarMenu = styled.ul`
  ${(p) => p.theme.colorStyles.standard}
  ${textStyle('small')};
  ${listStyle}

  && [role='menuitem'] {
    padding: 18px 16px;
    border-bottom: ${(p) => border(p.theme, 'lightContrast')};
    ${NavigationArrowDown} {
      transform: rotateZ(-90deg);
    }
    &[aria-expanded='true'] {
      color: ${(p) => p.theme.colors.callToAction};
      ${NavigationArrowDown} {
        transform: rotateZ(90deg);
      }
    }
    &:hover {
      color: ${(p) => p.theme.colors.callToAction};
      border-bottom-color: ${(p) => p.theme.colors.callToAction};
    }
    position: relative;
    overflow: visible;
    &:focus::after {
      border: ${(p) => border(p.theme, 'callToAction')};
      background-color: transparent;
      box-sizing: border-box;
      width: 100%;
      height: calc(100% + ${borderSize});
      content: '';
      position: absolute;
      left: 0;
      top: 0;
    }
    &[aria-current='true'],
    &[aria-expanded='true'] {
      font-weight: 600;
    }
  }
`
