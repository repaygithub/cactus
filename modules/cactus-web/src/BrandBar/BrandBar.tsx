import {
  Menu,
  MenuButton as ReachMenuButton,
  MenuItem,
  MenuItems as ReachMenuList,
  MenuItemsProps,
  MenuPopover,
} from '@reach/menu-button'
import { DescriptiveProfile, NavigationChevronDown } from '@repay/cactus-icons'
import { CactusTheme, ColorStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'

import { getTopPosition } from '../helpers/positionPopover'
import { getScrollX } from '../helpers/scrollOffset'
import { border, boxShadow, fontSize, media, textStyle } from '../helpers/theme'

interface BrandBarProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: string | React.ReactElement
  usernameText: string
  onProfilePage?: boolean
}

type ThemeProps = { theme: CactusTheme }

const dropShapeMap = {
  square: 'border-radius:1px;',
  intermediate: 'border-radius: 4px;',
  round: 'border-radius:8px 8px;',
}

const getDropShape = ({ theme }: ThemeProps) => dropShapeMap[theme.shape]

const MenuButtonStyles = createGlobalStyle`
  :root {
    --reach-menu-button: 1;
  }
`
const getDropDownBorder = ({ theme }: ThemeProps) => {
  if (!theme.boxShadows) {
    return css`
      border: ${border(theme, 'lightContrast')};
      ${getDropShape};
    `
  } else {
    return css(getDropShape)
  }
}

const BrandBarBase = (props: BrandBarProps): React.ReactElement => {
  const { logo, className, usernameText, children } = props

  return (
    <div className={className}>
      <LogoWrapper>{typeof logo === 'string' ? <Img alt="Logo" src={logo} /> : logo}</LogoWrapper>
      <Menu>
        <MenuButtonStyles />
        <MenuButton>
          <DescriptiveProfile mr="8px" />
          <span>{usernameText}</span>
          <NavigationChevronDown aria-hidden="true" ml="8px" />
        </MenuButton>
        <MenuPopover
          position={(
            targetRect,
            popoverRect
          ): { minWidth?: number; maxWidth?: number; left?: number; top?: string } => {
            if (!targetRect || !popoverRect) {
              return {}
            }

            const scrollX = getScrollX()

            return {
              minWidth: targetRect.width,
              maxWidth: Math.max(targetRect.width, Math.min(targetRect.width * 1.5, 300)),
              left: targetRect.left + scrollX,
              ...getTopPosition(targetRect, popoverRect),
            }
          }}
        >
          <MenuList>{children}</MenuList>
        </MenuPopover>
      </Menu>
    </div>
  )
}
BrandBarBase.Item = MenuItem

export const BrandBar = styled(BrandBarBase)`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  border-bottom: ${(p): string => border(p.theme, 'lightContrast')};
  ${(p) =>
    p.onProfilePage &&
    `
    & svg, & button{
      color: ${p.theme.colors.callToAction}
    }
    & button{
      border-bottom: ${border(p.theme, 'callToAction')};
    }
  `}
  ${(p) => media(p.theme, 'small')} {
    justify-content: space-between;
  }
`
const LogoWrapper = styled.div`
  padding: 16px;
`
const Img = styled('img')`
  max-width: 200px;
  max-height: 80px;
`

const MenuButton = styled(ReachMenuButton)<MenuItemsProps>`
  ${(p) => media(p.theme, 'small')} {
    margin-right: 5px;
    background-color: transparent;
    border: 0;
    display: flex;
    align-items: center;
    padding: 16px;
    border: ${(p) => border(p.theme, 'transparent')};
    cursor: pointer;
    &:focus {
      border-color: ${(p): string => p.theme.colors.callToAction};
      outline: none;
    }
    &[aria-expanded='true'] {
      border-bottom-color: ${(p): string => p.theme.colors.callToAction};
      color: ${(p): string => p.theme.colors.callToAction};

      ${NavigationChevronDown} {
        transform: rotate3d(1, 0, 0, 180deg);
      }
    }
    &:hover svg,
    &:hover span {
      color: ${(p): string => p.theme.colors.callToAction};
    }

    & svg {
      font-size: 12px;
    }
    & span {
      font-weight: 600;
      ${(p): string => fontSize(p.theme, 'p')}
    }
  }
  display: none;
`

const MenuList = styled(ReachMenuList)`
  padding: 8px 0;
  margin-top: 8px;
  outline: none;
  ${getDropDownBorder};
  ${(p) => boxShadow(p.theme, 1)};
  background-color: ${(p) => p.theme.colors.white};

  [data-reach-menu-item] {
    box-sizing: border-box;
    position: relative;
    display: block;
    cursor: pointer;
    text-decoration: none;
    overflow-wrap: break-word;
    ${(p) => textStyle(p.theme, 'small')};
    ${(p) => p.theme.colorStyles.standard};
    outline: none;
    padding: 4px 16px;
    text-align: center;
    &[data-selected] {
      ${(p): ColorStyle => p.theme.colorStyles.callToAction};
    }
  }
`
BrandBar.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  usernameText: PropTypes.string.isRequired,
  onProfilePage: PropTypes.bool,
}

BrandBar.defaultProps = {
  onProfilePage: false,
}

export default BrandBar
