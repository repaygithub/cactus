import {
  Menu,
  MenuButton as ReachMenuButton,
  MenuItem as ReachMenuItem,
  MenuItems as ReachMenuList,
  MenuItemsProps,
  MenuPopover,
} from '@reach/menu-button'
import { DescriptiveProfile, NavigationChevronDown } from '@repay/cactus-icons'
import { CactusTheme, ColorStyle } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { MutableRefObject, useRef } from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'

import { getTopPosition } from '../helpers/positionPopover'
import { outsetBorder } from '../helpers/theme'
import { border, boxShadow, fontSize, media, textStyle } from '../helpers/theme'

interface BrandBarProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: string | React.ReactElement
  userMenuText: string
  isProfilePage?: boolean
}
interface MenuItemProps {
  children?: React.ReactNode
  onSelect: () => any
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

const BrandBar = (props: BrandBarProps): React.ReactElement => {
  const { logo, className, userMenuText, children } = props
  const buttonRef: MutableRefObject<null | HTMLButtonElement> = useRef(null)

  return (
    <StyledBrandBar className={className} {...props}>
      <LogoWrapper>{typeof logo === 'string' ? <img alt="Logo" src={logo} /> : logo}</LogoWrapper>
      <Menu>
        <MenuButtonStyles />
        <MenuButton ref={buttonRef}>
          <DescriptiveProfile mr="8px" />
          <span>{userMenuText}</span>
          <NavigationChevronDown aria-hidden="true" ml="8px" />
        </MenuButton>
        <MenuPopover
          position={(
            targetRect,
            popoverRect
          ): {
            minWidth?: number
            maxWidth?: number
            right?: number
            left?: number
            top?: string
          } => {
            if (!targetRect || !popoverRect || !buttonRef.current) {
              return {}
            }
            const buttonWidth = buttonRef.current.clientWidth

            return {
              minWidth: targetRect.width + 21,
              maxWidth: Math.max(buttonWidth, Math.min(buttonWidth * 2, 400)),
              right: targetRect.right,
              left: targetRect.left - 21,
              ...getTopPosition(targetRect, popoverRect),
            }
          }}
        >
          <MenuList>{children}</MenuList>
        </MenuPopover>
      </Menu>
    </StyledBrandBar>
  )
}

const MenuItem = (props: MenuItemProps) => {
  const { children, onSelect } = props
  return <ReachMenuItem onSelect={onSelect}>{children}</ReachMenuItem>
}

BrandBar.UserMenuItem = MenuItem

export const StyledBrandBar = styled.div<BrandBarProps>`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  border-bottom: ${(p): string => border(p.theme, 'lightContrast')};
  ${(p) =>
    p.isProfilePage &&
    `
    & svg, & button{
      color: ${p.theme.colors.callToAction}
    }
    & button{
      ${outsetBorder(p.theme, 'callToAction', 'bottom')};
    }
  `}
  ${(p) => media(p.theme, 'small')} {
    justify-content: space-between;
  }
`
const LogoWrapper = styled.div`
  padding: 16px;
  max-width: 200px;
  max-height: 80px;
  & > * {
    max-width: 100%;
    max-height: 100%;
  }
`

const MenuButton = styled(ReachMenuButton)<MenuItemsProps>`
  ${(p) => media(p.theme, 'small')} {
    margin-right: 5px;
    background-color: transparent;
    border: 0;
    display: flex;
    align-items: center;
    padding: 16px;
    cursor: pointer;
    &:focus {
      ${(p) => outsetBorder(p.theme, 'callToAction')};
      outline: none;
    }
    &[aria-expanded='true'] {
      ${(p) => outsetBorder(p.theme, 'callToAction', 'bottom')};
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
  userMenuText: PropTypes.string.isRequired,
  isProfilePage: PropTypes.bool,
}

BrandBar.defaultProps = {
  isProfilePage: false,
}

export default BrandBar
