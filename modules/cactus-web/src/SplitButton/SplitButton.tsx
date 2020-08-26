import {
  Menu as ReachMenu,
  MenuButton as ReachMenuButton,
  MenuItem as ReachMenuItem,
  MenuItemImplProps,
  MenuItems as ReachMenuItems,
  MenuPopover as ReachMenuPopover,
} from '@reach/menu-button'
import { NavigationChevronDown } from '@repay/cactus-icons'
import { ColorStyle, Shape } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { MutableRefObject, useRef } from 'react'
import styled, { createGlobalStyle, DefaultTheme, StyledComponent } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { getTopPosition } from '../helpers/positionPopover'
import { getScrollX } from '../helpers/scrollOffset'
import { border, boxShadow, textStyle } from '../helpers/theme'

export interface IconProps {
  iconSize: 'tiny' | 'small' | 'medium' | 'large'
}

interface SplitButtonProps extends React.HTMLAttributes<HTMLDivElement>, MarginProps {
  mainActionLabel: React.ReactChild
  onSelectMainAction: (event: React.MouseEvent<HTMLButtonElement>) => void
  mainActionIcon?: React.FunctionComponent<IconProps>
  disabled?: boolean
  // Aria label for the dropdown trigger. Defaults to "Action List"
  'aria-label'?: string
}

interface SplitButtonActionProps extends Omit<MenuItemImplProps, 'onSelect'> {
  // !important
  onSelect: () => any
  icon?: React.FunctionComponent<IconProps>
}

const mainShapeMap: { [K in Shape]: string } = {
  square: 'border-radius: 1px;',
  intermediate: 'border-radius: 8px 1px 1px 8px;',
  round: 'border-radius: 20px 1px 1px 20px;',
}

const MainActionButton = styled.button`
  box-sizing: border-box;
  border: ${(p) => border(p.theme, '')};
  ${(p) => mainShapeMap[p.theme.shape]}
  background-color: ${(p): string => p.theme.colors.white};
  height: 32px;
  outline: none;
  ${(p) => textStyle(p.theme, 'body')};
  font-weight: 400;
  cursor: pointer;
  padding-left: 12px;
  padding-right: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  svg {
    margin-right: 4px;
    margin-bottom: 3px;
  }

  &::-moz-focus-inner {
    border: 0;
  }

  ${(p): string =>
    p.disabled
      ? `
    color: ${p.theme.colors.mediumGray};
    background-color: ${p.theme.colors.lightGray};
    border-color: ${p.theme.colors.lightGray};
    cursor: not-allowed;
  `
      : ''}

  &.dd-closed {
    border-color: ${(p): string => p.theme.colors.darkestContrast};

    &:hover,
    &:focus {
      border-color: ${(p): string => p.theme.colors.callToAction};
    }
  }

  &.dd-open {
    border-color: ${(p): string => p.theme.colors.callToAction};
  }
`

const SplitButtonStyles = createGlobalStyle`
  :root {
    --reach-menu-button: 1;
  }
`

const dropdownShapeMap: { [K in Shape]: string } = {
  square: 'border-radius: 1px;',
  intermediate: 'border-radius: 4px;',
  round: 'border-radius: 8px;',
}

const SplitButtonList = styled(ReachMenuItems)`
  padding: 8px 0;
  margin-top: 8px;
  outline: none;
  ${(p) => dropdownShapeMap[p.theme.shape]}
  ${(p): string => boxShadow(p.theme, 1)};
  z-index: 1000;
  background-color: ${(p): string => p.theme.colors.white};

  border: ${(p) => (!p.theme.boxShadows ? border(p.theme, 'lightContrast') : '0')};

  [data-reach-menu-item] {
    position: relative;
    display: block;
    cursor: pointer;
    text-decoration: none;
    overflow-wrap: break-word;
    ${(p) => textStyle(p.theme, 'small')};
    ${(p): ColorStyle => p.theme.colorStyles.standard};
    outline: none;
    padding: 4px 16px;
    text-align: center;

    &[data-selected] {
      ${(p): ColorStyle => p.theme.colorStyles.callToAction};
    }
  }
`

const dropdownButtonShapeMap: { [K in Shape]: string } = {
  square: 'border-radius: 1px;',
  intermediate: 'border-radius: 1px 8px 8px 1px;',
  round: 'border-radius: 1px 20px 20px 1px;',
}

const DropdownButton = styled(ReachMenuButton)`
  box-sizing: border-box;
  background-color: ${(p): string => p.theme.colors.darkestContrast};
  height: 32px;
  width: 36px;
  ${(p) => dropdownButtonShapeMap[p.theme.shape]}
  margin-left: 1px;
  border: 0px;
  outline: none;
  cursor: pointer;
  flex-grow: 0;

  ${(p): string =>
    p.disabled
      ? `
  color: ${p.theme.colors.mediumGray};
  background-color: ${p.theme.colors.lightGray};
  cursor: not-allowed;
  `
      : ''}

  ${NavigationChevronDown} {
    width: 10px;
    height: 10px;
    color: ${(p): string => p.theme.colors.white};
  }

  &:hover,
  &:focus {
    background-color: ${(p): string => (!p.disabled ? p.theme.colors.callToAction : '')};
  }

  &[aria-expanded='true'] ~ ${MainActionButton} {
    border-color: ${(p): string => p.theme.colors.callToAction};
  }
`

const SplitButtonBase = (props: SplitButtonProps): React.ReactElement => {
  const {
    className,
    mainActionLabel,
    mainActionIcon: MainActionIcon,
    onSelectMainAction,
    disabled,
    children,
    'aria-label': ariaLabel = 'Action List',
    ...rest
  } = props
  const mainActionRef: MutableRefObject<null | HTMLButtonElement> = useRef(null)
  return (
    <div className={className} {...rest}>
      <ReachMenu>
        {({ isOpen }: { isOpen: boolean }): React.ReactElement => {
          return (
            <>
              <MainActionButton
                className={isOpen ? 'dd-open' : !disabled ? 'dd-closed' : ''}
                ref={mainActionRef}
                type="button"
                disabled={disabled}
                onClick={onSelectMainAction}
              >
                {MainActionIcon && <MainActionIcon iconSize="small" />}
                {mainActionLabel}
              </MainActionButton>
              <SplitButtonStyles />
              <DropdownButton disabled={disabled} aria-label={ariaLabel}>
                <NavigationChevronDown iconSize="tiny" aria-hidden="true" />
              </DropdownButton>
              <ReachMenuPopover
                position={(
                  targetRect,
                  popoverRect
                ): { width?: number; left?: number; top?: string } => {
                  if (!targetRect || !popoverRect || !mainActionRef.current) {
                    return {}
                  }

                  const mainActionButtonWidth = mainActionRef.current.clientWidth
                  const splitButtonWidth = mainActionButtonWidth + targetRect.width + 5
                  const scrollX = getScrollX()

                  return {
                    width: splitButtonWidth,
                    left: targetRect.left - mainActionButtonWidth + scrollX - 6,
                    ...getTopPosition(targetRect, popoverRect),
                  }
                }}
              >
                <SplitButtonList>{children}</SplitButtonList>
              </ReachMenuPopover>
            </>
          )
        }}
      </ReachMenu>
    </div>
  )
}

const SplitButtonActionBase = (props: SplitButtonActionProps): React.ReactElement => {
  const { children, icon: Icon, ...rest } = props
  return (
    <ReachMenuItem {...rest}>
      {Icon && <Icon iconSize="small" aria-hidden="true" />}
      {children}
    </ReachMenuItem>
  )
}

export const SplitButtonAction = styled(SplitButtonActionBase)`
  svg {
    margin-right: 4px;
    margin-bottom: 3px;
  }
`

type SplitButtonType = StyledComponent<typeof SplitButtonBase, DefaultTheme, SplitButtonProps> & {
  Action: React.ComponentType<SplitButtonActionProps>
}

export const SplitButton = styled(SplitButtonBase)`
  display: flex;
  ${margin}

  ${DropdownButton}[aria-expanded='true'] {
    ${NavigationChevronDown} {
      transform: rotate3d(1, 0, 0, 180deg);
    }

    background-color: ${(p): string => p.theme.colors.callToAction};
  }

  ${DropdownButton}[aria-expanded='true'] + ${MainActionButton} {
    border-color: ${(p): string => p.theme.colors.callToAction};
  }
` as any

SplitButton.propTypes = {
  mainActionLabel: PropTypes.node.isRequired,
  onSelectMainAction: PropTypes.func.isRequired,
  mainActionIcon: PropTypes.elementType,
  disabled: PropTypes.bool,
}

SplitButton.Action = SplitButtonAction

export default SplitButton as SplitButtonType
