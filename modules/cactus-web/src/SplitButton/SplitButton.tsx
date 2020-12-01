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
import React from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { positionDropDown, usePositioning } from '../helpers/positionPopover'
import { border, boxShadow, textStyle } from '../helpers/theme'
import variant from '../helpers/variant'

export type SplitButtonVariant = 'standard' | 'danger' | 'success'
export interface IconProps {
  iconSize: 'tiny' | 'small' | 'medium' | 'large'
}

interface IsOpenProp {
  isOpen: boolean
}

interface DropDownProps extends IsOpenProp {
  anchorRef: React.RefObject<HTMLElement | null>
  variant?: SplitButtonVariant
  children?: React.ReactNode
}

interface SplitButtonProps extends React.HTMLAttributes<HTMLDivElement>, MarginProps {
  mainActionLabel: React.ReactNode
  onSelectMainAction: (event: React.MouseEvent<HTMLButtonElement>) => void
  mainActionIcon?: React.FunctionComponent<IconProps>
  disabled?: boolean
  // Aria label for the dropdown trigger. Defaults to "Action List"
  'aria-label'?: string
  variant?: SplitButtonVariant
}

interface SplitButtonActionProps extends Omit<MenuItemImplProps, 'onSelect'> {
  // !important
  onSelect: () => any
  icon?: React.FunctionComponent<IconProps>
}
interface VariantInterface {
  variant?: SplitButtonVariant
}

const mainShapeMap: { [K in Shape]: string } = {
  square: 'border-radius: 1px;',
  intermediate: 'border-radius: 8px 1px 1px 8px;',
  round: 'border-radius: 20px 1px 1px 20px;',
}

const getVariantDark = variant({
  standard: css`
    ${(p): ColorStyle => p.theme.colorStyles.callToAction};
  `,
  danger: css`
    ${(p): ColorStyle => p.theme.colorStyles.errorDark};
  `,
  success: css`
    ${(p): ColorStyle => p.theme.colorStyles.successDark};
  `,
})

const MainActionButton = styled.button<VariantInterface>`
  box-sizing: border-box;
  flex-grow: 1;
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
    border-color: ${p.theme.colors.lightGray};
    cursor: not-allowed;
  `
      : ''}
  ${(p) => p.disabled && p.theme.colorStyles.disable}

    &.dd-closed {
    ${variant({
      standard: css`
        border-color: ${(p): string => p.theme.colors.darkestContrast};
      `,
      danger: css`
        border-color: ${(p): string => p.theme.colors.error};
      `,
      success: css`
        border-color: ${(p): string => p.theme.colors.success};
      `,
    })}

    &:hover,
      &:focus {
      ${variant({
        standard: css`
          border-color: ${(p): string => p.theme.colors.callToAction};
        `,
        danger: css`
          border-color: ${(p): string => p.theme.colors.errorDark};
        `,
        success: css`
          border-color: ${(p): string => p.theme.colors.successDark};
        `,
      })}
    }
  }

  &.dd-open {
    ${variant({
      standard: css`
        border-color: ${(p): string => p.theme.colors.callToAction};
      `,
      danger: css`
        border-color: ${(p): string => p.theme.colors.errorDark};
      `,
      success: css`
        border-color: ${(p): string => p.theme.colors.successDark};
      `,
    })}
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

const SplitButtonList = styled(ReachMenuItems)<VariantInterface>`
  padding: 8px 0;
  outline: none;
  ${(p) => dropdownShapeMap[p.theme.shape]}
  ${(p): string => boxShadow(p.theme, 1)};
  z-index: 1000;
  background-color: ${(p): string => p.theme.colors.white};
  border: ${(p) => (!p.theme.boxShadows ? border(p.theme, 'lightContrast') : '0')};

  [data-reach-menu-item] {
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
      ${getVariantDark}
    }
  }
`

const dropdownButtonShapeMap: { [K in Shape]: string } = {
  square: 'border-radius: 1px;',
  intermediate: 'border-radius: 1px 8px 8px 1px;',
  round: 'border-radius: 1px 20px 20px 1px;',
}

const DropdownButton = styled(ReachMenuButton)<VariantInterface>`
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
  ${(p) =>
    p.disabled
      ? p.theme.colorStyles.disable
      : variant({
          standard: css`
            ${(p): ColorStyle => p.theme.colorStyles.darkestContrast};
          `,
          danger: css`
            ${(p): ColorStyle => p.theme.colorStyles.error};
          `,
          success: css`
            ${(p): ColorStyle => p.theme.colorStyles.success};
          `,
        })};

  ${(p): string =>
    p.disabled
      ? `
  cursor: not-allowed;
  `
      : ''}
  &:hover,
  &:focus {
    ${(p) => !p.disabled && getVariantDark};
  }
  ${NavigationChevronDown} {
    width: 10px;
    height: 10px;
    color: ${(p): string => p.theme.colors.white};
  }
`

type SplitButtonType = React.FC<SplitButtonProps> & {
  Action: React.ComponentType<SplitButtonActionProps>
}

export const SplitButton: SplitButtonType = (props) => {
  const {
    mainActionLabel,
    mainActionIcon: MainActionIcon,
    onSelectMainAction,
    disabled,
    children,
    'aria-label': ariaLabel = 'Action List',
    variant,
    ...rest
  } = props
  const anchorRef = React.useRef<HTMLDivElement>(null)
  return (
    <Wrapper {...rest} ref={anchorRef}>
      <ReachMenu>
        {({ isOpen }: IsOpenProp): React.ReactElement => {
          return (
            <>
              <MainActionButton
                className={isOpen ? 'dd-open' : !disabled ? 'dd-closed' : ''}
                type="button"
                disabled={disabled}
                onClick={onSelectMainAction}
                variant={variant}
              >
                {MainActionIcon && <MainActionIcon iconSize="small" />}
                {mainActionLabel}
              </MainActionButton>
              <SplitButtonStyles />
              <DropdownButton disabled={disabled} aria-label={ariaLabel} variant={variant}>
                <NavigationChevronDown iconSize="tiny" aria-hidden="true" />
              </DropdownButton>
              <DropDown isOpen={isOpen} variant={variant} anchorRef={anchorRef}>
                {children}
              </DropDown>
            </>
          )
        }}
      </ReachMenu>
    </Wrapper>
  )
}

const DropDown: React.FC<DropDownProps> = ({ isOpen, variant, anchorRef, children }) => {
  const ref = React.useRef<HTMLElement>(null)
  usePositioning({
    position: positionDropDown,
    visible: isOpen,
    ref,
    anchorRef,
    updateOnScroll: true,
  })
  return (
    <StyledPopover portal={false} ref={ref}>
      <SplitButtonList variant={variant}>{children}</SplitButtonList>
    </StyledPopover>
  )
}

export const SplitButtonAction: React.FC<SplitButtonActionProps> = (props) => {
  const { children, icon: Icon, ...rest } = props
  return (
    <ReachMenuItem {...rest}>
      {Icon && <StyledIcon as={Icon} iconSize="small" aria-hidden="true" />}
      {children}
    </ReachMenuItem>
  )
}

const StyledIcon = styled.svg`
  margin-right: 4px;
  margin-bottom: 3px;
`

const Wrapper = styled.div<VariantInterface & MarginProps>`
  display: inline-flex;
  max-width: 100%;
  position: relative;
  ${margin}

  ${DropdownButton}[aria-expanded='true'] {
    ${NavigationChevronDown} {
      transform: rotate3d(1, 0, 0, 180deg);
    }
    ${getVariantDark};
  }
`

const StyledPopover = styled(ReachMenuPopover)`
  position: fixed;
  z-index: 500;
`

SplitButton.propTypes = {
  mainActionLabel: PropTypes.node.isRequired,
  onSelectMainAction: PropTypes.func.isRequired,
  mainActionIcon: PropTypes.elementType as any,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['standard', 'danger', 'success']),
}

SplitButton.defaultProps = {
  variant: 'standard',
}

SplitButton.Action = SplitButtonAction

export default SplitButton
