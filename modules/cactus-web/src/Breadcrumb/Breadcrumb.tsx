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
  itemIndex?: number
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
  const {
    active,
    handleItemMouseEnter,
    itemIndex = 0,
    mobileListItem = false,
    isSelected = false,
    role,
    ...rest
  } = props

  // The "as any" with ...rest is necessary because Styled Components' types do not like
  // forcing an aria-current when we're not sure if the element will be an <a>
  // Here, we're just trusting the user to use a Link-ish component for the "as" prop
  return (
    <BreadcrumbListItem
      id={mobileListItem ? `mobile-list-item-${itemIndex}` : undefined}
      data-selected={isSelected}
      onMouseEnter={handleItemMouseEnter}
      role={role}
    >
      <BreadcrumbLink aria-current={active && 'page'} {...(rest as any)} />
      {!mobileListItem && <StyledChevron iconSize="tiny" $active={active} />}
    </BreadcrumbListItem>
  )
}

export const BreadcrumbActive = (
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement => (
  <li>
    <div aria-current="page" {...props} />
  </li>
)

const BreadcrumbBase = (props: BreadcrumbProps): React.ReactElement => {
  const { children, className } = props
  const childrenCount = Children.count(children)
  const childrenArray = Children.toArray(children)
  const breadcrumbNavId = 'breadcrumb-nav'

  const isTiny = SIZES.tiny === useScreenSize()
  const firstBreadcrumb = useRef<HTMLDivElement | null>(null)
  const ellipsisButton = useRef<HTMLButtonElement | null>(null)
  const popup = useRef<HTMLDivElement | null>(null)
  const mainBreadcrumbList = useRef<HTMLUListElement | null>(null)
  const { expanded, toggle, buttonProps, popupProps, wrapperProps } = usePopup('menu', {
    id: breadcrumbNavId,
    positionPopup: positionPortal,
  })

  const [selectedIndex, setSelectedIndex] = React.useState<number>(0)

  const maxDropdownWidth = mainBreadcrumbList.current?.getBoundingClientRect().width

  const handleTriggerClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      setSelectedIndex(0)
      const popup = document.querySelector('#breadcrumb-nav-popup') as HTMLUListElement
      toggle(undefined, popup)
    },
    [toggle]
  )

  // React.useEffect(() => {
  //   // We can't pass onClick or onKeyDown handlers to BreadcrumbItems directly because they could be using
  //   // custom components. To circumvent this, we can listen for click & keydown events on the document
  //   // and manually trigger the event handlers when necessary.
  //   // const handleBodyClick = (event: MouseEvent): void => {
  //   //   const { target } = event
  //   //   if (target instanceof Node && firstBreadcrumb.current?.contains(target)) {
  //   //     handleTriggerClick((event as any) as React.MouseEvent)
  //   //   }
  //   //   if (
  //   //     !(target instanceof Node) ||
  //   //     (!popup.current?.contains(target) &&
  //   //       !firstBreadcrumb.current?.contains(target) &&
  //   //       !ellipsisButton.current?.contains(target))
  //   //   ) {
  //   //     toggle(false)
  //   //   }
  //   // }

  //   // const handleBodyKeyDown = (event: KeyboardEvent) => {
  //   //   const { target } = event
  //   //   if (target instanceof Node && firstBreadcrumb.current?.contains(target)) {
  //   //     keyDownAsClick(event as React.KeyboardEvent)
  //   //   }
  //   // }

  //   // document.body.addEventListener('click', handleBodyClick)
  //   // document.body.addEventListener('keydown', handleBodyKeyDown)

  //   return () => {
  //     // document.body.removeEventListener('click', handleBodyClick)
  //     // document.body.removeEventListener('keydown', handleBodyKeyDown)
  //   }
  // }, [handleTriggerClick, toggle])

  const handlePopupKeyDown = (event: React.KeyboardEvent) => {
    event.preventDefault()
    const key = event.key
    switch (key) {
      case 'ArrowDown':
        if (selectedIndex < childrenCount - 1) {
          setSelectedIndex((currentSelectedIndex) => currentSelectedIndex + 1)
        } else {
          setSelectedIndex(0)
        }
        break
      case 'ArrowUp':
        if (selectedIndex > 0) {
          setSelectedIndex((currentSelectedIndex) => currentSelectedIndex - 1)
        } else {
          setSelectedIndex(childrenCount - 1)
        }
        break
      case 'Home':
        setSelectedIndex(0)
        break
      case 'End':
        setSelectedIndex(childrenCount - 1)
        break
      case 'Enter':
      case ' ':
        const link = document.querySelector("[data-selected='true'] a") as HTMLAnchorElement | null
        link?.click()
        break
      case 'Escape':
        toggle(false)
        break
    }
  }

  type ChildElement = React.ReactElement<any, React.ComponentType>
  const fullButtonProps = { ...buttonProps, onClick: handleTriggerClick, onKeyDown: keyDownAsClick }
  const { id: buttonId, ...buttonPropsWithoutId } = fullButtonProps
  return (
    <StyledNav id={breadcrumbNavId} aria-label="Breadcrumb" className={className} {...wrapperProps}>
      <ul className="main-breadcrumb-list" ref={mainBreadcrumbList}>
        {isTiny && childrenCount > 2 ? (
          <>
            <div ref={firstBreadcrumb}>
              {React.cloneElement(childrenArray[0] as JSX.Element, {
                ...fullButtonProps,
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
              aria-activedescendant={`mobile-list-item-${selectedIndex}`}
            >
              <BreadcrumbPopupList id="nav-popup-list" $maxWidth={maxDropdownWidth}>
                {Children.map(children, (child, index) => {
                  if ((child as ChildElement)?.type.displayName !== 'Breadcrumb.Active') {
                    const cloneProps: {
                      mobileListItem: boolean
                      handleItemMouseEnter: () => void
                      itemIndex: number
                      isSelected?: boolean
                      role: string
                    } = {
                      mobileListItem: true,
                      itemIndex: index,
                      handleItemMouseEnter: () => setSelectedIndex(index),
                      role: 'menuitem',
                    }
                    if (index === selectedIndex) {
                      cloneProps.isSelected = true
                    }
                    return React.cloneElement(child as JSX.Element, cloneProps)
                  }
                })}
              </BreadcrumbPopupList>
            </BreadcrumbPopup>
          </>
        ) : (
          children
        )}
      </ul>
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
  ${(p) => popupShape(p.theme.shape)}
  ${(p) => popupBoxShadow(p.theme)}
`

const BreadcrumbListItem = styled.li``

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
  padding-top: ${(p) => p.theme.space[4]}px;
  padding-bottom: ${(p) => p.theme.space[4]}px;
  padding-left: 0;
  padding-right: 0;
  list-style: none;
  max-width: ${(p) => (p.$maxWidth ? `${p.$maxWidth}px` : 'unset')};

  ${BreadcrumbListItem} {
    box-sizing: border-box;
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

  ${BreadcrumbLink} {
    [aria-current='page'] {
      color: ${(p) => p.theme.colors.darkestContrast};
      font-style: italic;
    }
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
