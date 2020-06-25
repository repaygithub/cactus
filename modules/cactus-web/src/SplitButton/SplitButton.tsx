import React, { MutableRefObject, useRef, useState } from 'react'

import { BorderSize, CactusTheme, Shape } from '@repay/cactus-theme'
import { getScrollX } from '../helpers/scrollOffset'
import { getTopPosition } from '../helpers/positionPopover'
import { margin, MarginProps } from 'styled-system'
import {
  MenuItemImplProps,
  Menu as ReachMenu,
  MenuButton as ReachMenuButton,
  MenuItem as ReachMenuItem,
  MenuItems as ReachMenuItems,
  MenuPopover as ReachMenuPopover,
} from '@reach/menu-button'
import { NavigationChevronDown } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import styled, {
  createGlobalStyle,
  css,
  FlattenSimpleInterpolation,
  StyledComponent,
} from 'styled-components'

export type IconProps = { iconSize: 'tiny' | 'small' | 'medium' | 'large' }

interface SplitButtonProps
  extends Omit<
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      'aria-label'
    >,
    MarginProps {
  mainActionLabel: string
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

const borderMap: { [K in BorderSize]: ReturnType<typeof css> } = {
  thin: css`
    border: 1px solid;
  `,
  thick: css`
    border: 2px solid;
  `,
}

const mainShapeMap: { [K in Shape]: ReturnType<typeof css> } = {
  square: css`
    border-radius: 1px;
  `,
  intermediate: css`
    border-radius: 8px 1px 1px 8px;
  `,
  round: css`
    border-radius: 20px 1px 1px 20px;
  `,
}

const getBorder = (borderSize: BorderSize) => borderMap[borderSize]
const getMainShape = (shape: Shape) => mainShapeMap[shape]

const MainActionButton = styled.button`
  box-sizing: border-box;
  ${(p) => getBorder(p.theme.border)}
  ${(p) => getMainShape(p.theme.shape)}
  background-color: ${(p) => p.theme.colors.white};
  height: 32px;
  outline: none;
  ${(p) => p.theme.textStyles.body};
  font-weight: 400px;
  cursor: pointer;
  padding-left: 12px;
  padding-right: 12px;

  svg {
    margin-right: 4px;
    margin-bottom: 3px;
  }

  &::-moz-focus-inner {
    border: 0;
  }

  ${(p) =>
    p.disabled &&
    `
  color: ${p.theme.colors.mediumGray};
  background-color: ${p.theme.colors.lightGray};
  border-color: ${p.theme.colors.lightGray};
  cursor: not-allowed;
  `}

  &.dd-closed {
    border-color: ${(p) => p.theme.colors.darkestContrast};

    &:hover,
    &:focus {
      border-color: ${(p) => p.theme.colors.callToAction};
    }
  }

  &.dd-open {
    border-color: ${(p) => p.theme.colors.callToAction};
  }
`

const SplitButtonStyles = createGlobalStyle`
  :root {
    --reach-menu-button: 1;
  }
`

const dropdownShapeMap: { [K in Shape]: FlattenSimpleInterpolation } = {
  square: css`
    border-radius: 1px;
  `,
  intermediate: css`
    border-radius: 4px;
  `,
  round: css`
    border-radius: 8px;
  `,
}

const getDropdownShape = (shape: Shape) => dropdownShapeMap[shape]
const getBoxShadow = (theme: CactusTheme) => {
  return theme.boxShadows ? `0 3px 6px 0 ${theme.colors.callToAction}` : {}
}

const SplitButtonList = styled(ReachMenuItems)`
  padding: 8px 0;
  margin-top: 8px;
  outline: none;
  ${(p) => getDropdownShape(p.theme.shape)}
  box-shadow: ${(p) => getBoxShadow(p.theme)};
  z-index: 1000;
  background-color: ${(p) => p.theme.colors.white};

  ${(p) =>
    !p.theme.boxShadows &&
    `${getBorder(p.theme.border)};
    border-color: ${p.theme.colors.lightContrast};`}

  [data-reach-menu-item] {
    position: relative;
    display: block;
    cursor: pointer;
    text-decoration: none;
    background-color: ${(p) => p.theme.colors.white};
    overflow-wrap: break-word;

    ${(p) => p.theme.textStyles.small};
    color: ${(p) => p.theme.colors.darkestContrast};
    outline: none;
    padding: 4px 16px;
    text-align: center;

    &[data-selected] {
      background-color: ${(p) => p.theme.colors.callToAction};
      color: ${(p) => p.theme.colors.callToActionText};
    }
  }
`

const dropdownButtonShapeMap: { [K in Shape]: FlattenSimpleInterpolation } = {
  square: css`
    border-radius: 1px;
  `,
  intermediate: css`
    border-radius: 1px 8px 8px 1px;
  `,
  round: css`
    border-radius: 1px 20px 20px 1px;
  `,
}

const getDropdownButtonShape = (shape: Shape) => dropdownButtonShapeMap[shape]

const DropdownButton = styled(ReachMenuButton)`
  box-sizing: border-box;
  background-color: ${(p) => p.theme.colors.darkestContrast};
  height: 32px;
  width: 36px;
  ${(p) => getDropdownButtonShape(p.theme.shape)}
  margin-left: 1px;
  border: 0px;
  outline: none;
  cursor: pointer;

  ${(p) =>
    p.disabled &&
    `
  color: ${p.theme.colors.mediumGray};
  background-color: ${p.theme.colors.lightGray};
  cursor: not-allowed;
  `}

  ${NavigationChevronDown} {
    width: 10px;
    height: 10px;
    color: ${(p) => p.theme.colors.white};
  }

  &:hover,
  &:focus {
    background-color: ${(p) => !p.disabled && p.theme.colors.callToAction};
  }

  &[aria-expanded='true'] ~ ${MainActionButton} {
    border-color: ${(p) => p.theme.colors.callToAction};
  }
`

const SplitButtonBase = (props: SplitButtonProps) => {
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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  let mainActionRef: MutableRefObject<null | HTMLButtonElement> = useRef(null)
  return (
    <div className={className} {...rest}>
      <MainActionButton
        className={dropdownOpen ? 'dd-open' : !disabled ? 'dd-closed' : ''}
        ref={mainActionRef}
        type="button"
        disabled={disabled}
        onClick={onSelectMainAction}
      >
        {MainActionIcon && <MainActionIcon iconSize="small" />}
        {mainActionLabel}
      </MainActionButton>
      <ReachMenu>
        {({ isOpen }: { isOpen: boolean }) => {
          setDropdownOpen(isOpen)
          return (
            <React.Fragment>
              <SplitButtonStyles />
              <DropdownButton disabled={disabled} aria-label={ariaLabel}>
                <NavigationChevronDown iconSize="tiny" aria-hidden="true" />
              </DropdownButton>
              <ReachMenuPopover
                position={(targetRect, popoverRect) => {
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
            </React.Fragment>
          )
        }}
      </ReachMenu>
    </div>
  )
}

const SplitButtonActionBase = (props: SplitButtonActionProps) => {
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

type SplitButtonType = StyledComponent<typeof SplitButtonBase, CactusTheme, SplitButtonProps> & {
  Action: React.ComponentType<SplitButtonActionProps>
}

export const SplitButton = styled(SplitButtonBase)`
  display: inline-flex;
  ${margin}

  ${DropdownButton}[aria-expanded='true'] {
    ${NavigationChevronDown} {
      transform: rotate3d(1, 0, 0, 180deg);
    }

    background-color: ${(p) => p.theme.colors.callToAction};
  }

  ${DropdownButton}[aria-expanded='true'] + ${MainActionButton} {
    border-color: ${(p) => p.theme.colors.callToAction};
  }
` as any

SplitButton.propTypes = {
  mainActionLabel: PropTypes.string.isRequired,
  onSelectMainAction: PropTypes.func.isRequired,
  mainActionIcon: PropTypes.elementType,
  disabled: PropTypes.bool,
}

SplitButton.Action = SplitButtonAction

export default SplitButton as SplitButtonType
