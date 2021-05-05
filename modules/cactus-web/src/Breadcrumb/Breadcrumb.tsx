import { NavigationChevronRight } from '@repay/cactus-icons'
import PropTypes from 'prop-types'
import React, { Children, useRef } from 'react'
import styled from 'styled-components'

import FocusLock from '../FocusLock/FocusLock'
import { keyDownAsClick } from '../helpers/a11y'
import { AsProps, GenericComponent } from '../helpers/asProps'
import positionPortal from '../helpers/positionPortal'
import { borderSize, popupBoxShadow, popupShape, textStyle } from '../helpers/theme'
import usePopup from '../helpers/usePopup'
import { SIZES, useScreenSize } from '../ScreenSizeProvider/ScreenSizeProvider'

type BreadcrumbItemProps<C extends GenericComponent> = AsProps<C> & {
  active?: boolean
  mobileListItem?: boolean
  isSelected?: boolean
  handleItemMouseEnter?: () => void
}

interface BreadcrumbProps {
  children?: React.ReactNode
  className?: string
}

interface PopupProps extends React.HTMLAttributes<HTMLDivElement> {
  popupRef: React.RefObject<HTMLDivElement>
  expanded: boolean
}

export const BreadcrumbItem = <C extends GenericComponent = 'a'>(
  props: BreadcrumbItemProps<C>
): React.ReactElement => {
  const { active, handleItemMouseEnter, mobileListItem = false, isSelected, role, ...rest } = props

  // The "as any" with ...rest is necessary because Styled Components' types do not like
  // forcing an aria-current when we're not sure if the element will be an <a>
  // Here, we're just trusting the user to use a Link-ish component for the "as" prop
  return (
    <BreadcrumbListItem data-selected={isSelected} onMouseEnter={handleItemMouseEnter} role={role}>
      <BreadcrumbLink aria-current={active && 'page'} {...(rest as any)} />
      {!mobileListItem && <StyledChevron iconSize="tiny" $active={active} />}
    </BreadcrumbListItem>
  )
}

export const BreadcrumbActive = (
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement => (
  <BreadcrumbListItem>
    <div aria-current="page" {...props} />
  </BreadcrumbListItem>
)

const BreadcrumbBase = (props: BreadcrumbProps): React.ReactElement => {
  const { children, className } = props
  const childrenCount = Children.count(children)
  const childrenArray = Children.toArray(children) as ChildElement[]
  const breadcrumbNavId = 'breadcrumb-nav'

  const screenSize = useScreenSize()
  const isTiny = SIZES.tiny === screenSize
  const firstBreadcrumb = useRef<HTMLDivElement | null>(null)
  const ellipsisButton = useRef<HTMLButtonElement | null>(null)
  const popup = useRef<HTMLDivElement | null>(null)
  const mainNavContainer = useRef<HTMLElement | null>(null)
  const mainBreadcrumbList = useRef<HTMLUListElement | null>(null)
  const pivotBreadcrumb = useRef<HTMLUListElement | null>(null)
  const { expanded, toggle, buttonProps, popupProps, wrapperProps, setFocus } = usePopup('menu', {
    id: breadcrumbNavId,
    positionPopup: positionPortal,
  })
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0)
  const [dropdownItems, setDropdownItems] = React.useState<ChildElement[]>([])
  const [ellipsisVersion, setEllipsisVersion] = React.useState<boolean>(false)

  const maxDropdownWidth = mainBreadcrumbList.current?.getBoundingClientRect().width

  const handleTriggerClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      setSelectedIndex(0)
      toggle(undefined)
      setFocus(0)
    },
    [toggle, setFocus]
  )

  React.useLayoutEffect(() => {
    const checkEllipsisVersion = () => {
      const parentWidth = Math.ceil(mainNavContainer.current?.parentElement?.getBoundingClientRect().width!)
      const pivotWidth = Math.ceil(pivotBreadcrumb.current?.getBoundingClientRect().width!)
      const ellipsVersion = (pivotWidth >= parentWidth) || (isTiny && childrenCount > 2)
      setEllipsisVersion(ellipsVersion)
    }
    checkEllipsisVersion()
    window.addEventListener('resize', checkEllipsisVersion)
    return () => {
      window.removeEventListener('resize', checkEllipsisVersion)
    }
  }, [childrenCount, isTiny])

  React.useEffect(() => {
    // We can't pass onClick or onKeyDown handlers to BreadcrumbItems directly because they could be using
    // custom components. To circumvent this, we can listen for click & keydown events on the document
    // and manually trigger the event handlers when necessary.
    const handleBodyClick = (event: MouseEvent): void => {
      const { target } = event
      if (
        target instanceof Node &&
        (firstBreadcrumb.current?.contains(target) || ellipsisButton.current?.contains(target))
      ) {
        handleTriggerClick((event as any) as React.MouseEvent)
      }
    }

    const handleBodyKeyDown = (event: KeyboardEvent) => {
      const { target } = event
      if (
        target instanceof Node &&
        (firstBreadcrumb.current?.contains(target) || ellipsisButton.current?.contains(target))
      ) {
        keyDownAsClick((event as any) as React.KeyboardEvent)
      }
    }

    document.body.addEventListener('click', handleBodyClick)
    document.body.addEventListener('keydown', handleBodyKeyDown)

    return () => {
      document.body.removeEventListener('click', handleBodyClick)
      document.body.removeEventListener('keydown', handleBodyKeyDown)
    }
  }, [handleTriggerClick, toggle])

  React.useEffect(() => {
    const nonActiveLinks = (Children.toArray(children) as ChildElement[]).filter(
      (child) => child?.props.active !== true && child?.type.displayName !== 'Breadcrumb.Active'
    )
    setDropdownItems(nonActiveLinks)
  }, [children])

  const handlePopupKeyDown = (event: React.KeyboardEvent) => {
    const key = event.key
    if (key !== 'Enter') {
      event.preventDefault()
      switch (key) {
        case 'ArrowDown':
          setSelectedIndex((currentSelectedIndex) => {
            return currentSelectedIndex < dropdownItems.length - 1 ? currentSelectedIndex + 1 : 0
          })
          setFocus(1, { shift: true })
          break
        case 'ArrowUp':
          setSelectedIndex((currentSelectedIndex) => {
            return currentSelectedIndex > 0 ? currentSelectedIndex - 1 : dropdownItems.length - 1
          })
          setFocus(-1, { shift: true })
          break
        case 'Home':
          setSelectedIndex(0)
          setFocus(0)
          break
        case 'End':
          setSelectedIndex(dropdownItems.length - 1)
          setFocus(-1)
          break
        case 'Escape':
          toggle(false)
          break
      }
    }
  }

  type ChildElement = React.ReactElement<any, React.ComponentType>

  const { onClick, onKeyDown, ...buttonPropsWithoutHandlers } = buttonProps
  const { id: buttonId, ...buttonPropsWithoutId } = buttonPropsWithoutHandlers

  return (
    <StyledNav
      id={breadcrumbNavId}
      aria-label="Breadcrumb"
      ref={mainNavContainer}
      className={className}
      {...wrapperProps}
    >
      <ul className="main-breadcrumb-list" ref={mainBreadcrumbList}>
        {ellipsisVersion ? (
          <>
            <div ref={firstBreadcrumb} id={buttonId}>
              {React.cloneElement(childrenArray[0] as JSX.Element, {
                ...buttonPropsWithoutHandlers,
              })}
            </div>
            <li>
              <button
                type="button"
                className="ellipsis-button"
                ref={ellipsisButton}
                {...buttonPropsWithoutId}
              >
                ...
              </button>
            </li>
            {childrenArray[childrenCount - 1]}
            <BreadcrumbPopup
              popupRef={popup}
              expanded={expanded}
              {...popupProps}
              onKeyDown={handlePopupKeyDown}
            >
              <BreadcrumbPopupList id="nav-popup-list" $maxWidth={maxDropdownWidth}>
                {dropdownItems.map((child, index) => {
                  const cloneProps: {
                    mobileListItem: boolean
                    handleItemMouseEnter: () => void
                    isSelected?: boolean
                    role: string
                  } = {
                    mobileListItem: true,
                    handleItemMouseEnter: () => setSelectedIndex(index),
                    isSelected: index === selectedIndex,
                    role: 'menuitem',
                  }
                  return React.cloneElement(child as JSX.Element, cloneProps)
                })}
              </BreadcrumbPopupList>
            </BreadcrumbPopup>
          </>
        ) : (
          children
        )}
      </ul>
      <HiddenBreadcrumbList className="main-breadcrumb-list" ref={pivotBreadcrumb}>
        {children}
      </HiddenBreadcrumbList>
    </StyledNav>
  )
}

const BasePopup: React.FC<PopupProps> = ({ popupRef, expanded, ...props }) => {
  return <FocusLock ref={popupRef} {...props} />
}

const BreadcrumbPopup = styled(BasePopup)`
  display: ${(p) => (p.expanded ? 'block' : 'none')};
  position: fixed;
  outline: none;
  background-color: ${(p): string => p.theme.colors.white};
  z-index: 1000;
  box-sizing: border-box;
  ${(p) => popupShape('menu', p.theme.shape)}
  ${(p) => popupBoxShadow(p.theme)}
`

const HiddenBreadcrumbList = styled.ul`
  position: absolute;
  visibility: hidden;
  left: -100000px;
`

const BreadcrumbListItem = styled.li`
  box-sizing: border-box;
  overflow: visible;
  white-space: nowrap;
`

const BreadcrumbLink = styled.a`
  color: black;
  font-style: normal;
  outline: none;
  &:visited,
  &:link {
    color: ${(p) => p.theme.colors.darkContrast};
    font-style: normal;
  }
  &:hover {
    color: ${(p) => p.theme.colors.callToAction};
  }
  &:focus {
    outline: ${(p) => `${p.theme.colors.callToAction} solid ${borderSize(p)}`};
  }
`

const StyledChevron = styled(NavigationChevronRight)<{ $active?: boolean }>`
  color: ${(p): string =>
    p.$active ? p.theme.colors.darkestContrast : p.theme.colors.mediumContrast};
  margin: 0 3px;
  font-size: 10px;
`

const BreadcrumbPopupList = styled.ul<{ $maxWidth?: number }>`
  box-sizing: border-box;
  margin: 0;
  padding-top: ${(p) => p.theme.space[3]}px;
  padding-bottom: ${(p) => p.theme.space[3]}px;
  padding-left: 0;
  padding-right: 0;
  list-style: none;
  max-width: ${(p) => (p.$maxWidth ? `${p.$maxWidth}px` : 'unset')};

  ${BreadcrumbListItem} {
    width: 100%;
    border-radius: 0;
    outline: none;
    padding-left: ${(p) => p.theme.space[4]}px;
    padding-right: ${(p) => p.theme.space[4]}px;
    padding-top: ${(p) => p.theme.space[2]}px;
    padding-bottom: ${(p) => p.theme.space[2]}px;

    &[data-selected='true'] {
      background-color: ${(p) => p.theme.colors.callToAction};

      & * {
        color: ${(p) => p.theme.colors.white};

        &[style] {
          // Used for overriding inline styles for custom components
          color: ${(p) => p.theme.colors.white} !important;
        }
      }
    }

    & * {
      text-decoration: none;
      font-style: normal;
      outline: none;
    }
  }
`

const StyledNav = styled.nav`
  ${(p) => textStyle(p.theme, 'small')}

  .main-breadcrumb-list {
    display: flex;
    flex-direction: row;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .ellipsis-button {
    border: none;
    background: none;
    padding: 0;
    outline: none;
    cursor: pointer;

    margin-right: ${(p) => p.theme.space[3]}px;

    &:hover {
      color: ${(p) => p.theme.colors.callToAction};
    }

    &:focus {
      outline: ${(p) => `${p.theme.colors.callToAction} solid ${borderSize(p)}`};
    }
  }

  [aria-current='page'] {
    color: ${(p) => p.theme.colors.darkestContrast};
    font-style: italic;
  }
`

type BreadcrumbComponent = typeof BreadcrumbBase & {
  Item: typeof BreadcrumbItem
  Active: typeof BreadcrumbActive
}

BreadcrumbBase.displayName = 'Breadcrumb'
BreadcrumbItem.displayName = 'Breadcrumb.Item'
BreadcrumbActive.displayName = 'Breadcrumb.Active'

BreadcrumbItem.propTypes = {
  active: PropTypes.bool,
}

export const Breadcrumb = BreadcrumbBase as BreadcrumbComponent
Breadcrumb.Item = BreadcrumbItem
Breadcrumb.Active = BreadcrumbActive

export default Breadcrumb
