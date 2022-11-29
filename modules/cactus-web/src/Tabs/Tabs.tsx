import { NavigationChevronLeft, NavigationChevronRight } from '@repay/cactus-icons'
import { mediaGTE, textStyle } from '@repay/cactus-theme'
import React from 'react'
import styled, { ThemeContext } from 'styled-components'

import Box, { BoxProps } from '../Box/Box'
import Flex, { JustifyContent } from '../Flex/Flex'
import { keyDownAsClick, preventAction } from '../helpers/a11y'
import { AsProps, GenericComponent } from '../helpers/asProps'
import { flexItem, FlexItemProps } from '../helpers/flexItem'
import { FocusSetter, useFocusControl } from '../helpers/focus'
import { omitProps } from '../helpers/omit'
import { useValue } from '../helpers/react'
import { BUTTON_WIDTH, GetScrollInfo, ScrollButton, useScroll } from '../helpers/scroll'
import { border, insetBorder, isResponsiveTouchDevice } from '../helpers/theme'

interface TabListProps extends Omit<React.HTMLAttributes<HTMLElement>, 'role'> {
  fullWidth?: boolean
  justifyContent?: JustifyContent
  fillGaps?: boolean
}

interface TabProps extends FlexItemProps {
  /** Name of the tab, used by the controller to auto-generate `id` and `panelId` */
  name?: string
  /** ID of the panel this tab controls; directly mapped to `aria-controls` */
  panelId?: string
  children?: React.ReactNode
}

interface TabPanelProps extends BoxProps, Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  /** Name of the tab, used by the controller to auto-generate `id` and `tabId` */
  tab?: string
  /** ID of the tab that controls this panel; directly mapped to `aria-labelledby` */
  tabId?: string
}

interface TabControllerProps {
  children?: React.ReactNode
  id?: string
  initialTabId?: string
}

interface TabContextType {
  id?: string
  currentTab: string | null
  setCurrent: React.MouseEventHandler<HTMLElement>
}

const TabContext = React.createContext<TabContextType | undefined>(undefined)

export const TabList: React.FC<TabListProps> = ({
  fullWidth = true,
  fillGaps = false,
  onFocus,
  onBlur,
  ...props
}) => {
  const id = React.useContext(TabContext)?.id
  const theme = React.useContext(ThemeContext)
  const orientation = props['aria-orientation'] || 'horizontal'
  const [listRef, scroll] = useScroll<HTMLDivElement>(orientation, true, getScrollInfo)
  const [setFocus, rootRef] = useFocusControl(getTabs)
  // Other values may center things strangely resulting in inaccessible tabs.
  if (scroll.showScroll) {
    props.justifyContent = 'flex-start'
  }
  const showScroll = scroll.showScroll && !isResponsiveTouchDevice(theme.breakpoints)
  const keyHandler = useKeyHandler(setFocus)
  const focusHandler = useFocusHandler(setFocus, onFocus)
  const blurHandler = React.useCallback<FocusHandler>(
    (e) => {
      e.currentTarget.tabIndex = 0
      onBlur?.(e)
    },
    [onBlur]
  )
  return (
    <ScrollWrapper
      ref={rootRef as any}
      tabIndex={-1}
      onKeyDown={keyHandler}
      $fullWidth={fullWidth}
      $isVertical={orientation === 'vertical'}
      $grow={fillGaps}
    >
      <ScrollButton hidden={!showScroll} onClick={scroll.clickBack}>
        <NavigationChevronLeft />
      </ScrollButton>
      <StyledTabList
        id={id}
        {...props}
        tabIndex={0}
        ref={listRef}
        role="tablist"
        onFocus={focusHandler}
        onBlur={blurHandler}
      />
      <ScrollButton hidden={!showScroll} onClick={scroll.clickFore}>
        <NavigationChevronRight />
      </ScrollButton>
    </ScrollWrapper>
  )
}

TabList.defaultProps = {
  fullWidth: true,
  fillGaps: false,
  justifyContent: 'flex-start',
  'aria-orientation': 'horizontal',
}

function TabFunc<E, C extends GenericComponent = 'div'>(
  { name, panelId, ...props }: TabProps & AsProps<C>,
  ref: React.Ref<E>
) {
  const ctx = React.useContext(TabContext)
  if (ctx && name) {
    props.id = props.id || generateId(ctx.id, name, 'tab')
    panelId = panelId || generateId(ctx.id, name, 'panel')
  }
  return (
    <StyledTab
      onKeyDown={keyDownAsClick}
      onKeyUp={preventAction}
      onClick={ctx?.setCurrent}
      aria-selected={!!props.id && props.id === ctx?.currentTab}
      aria-controls={panelId}
      ref={ref as any}
      {...(props as any)}
      tabIndex={-1}
      role="tab"
    />
  )
}
const TabFR = React.forwardRef(TabFunc) as any
export const Tab = TabFR as typeof TabFunc
TabFR.displayName = 'Tab'

export const TabPanel: React.FC<TabPanelProps> = ({ tab, tabId, ...props }) => {
  const ctx = React.useContext(TabContext)
  if (ctx && tab) {
    props.id = props.id || generateId(ctx.id, tab, 'panel')
    tabId = tabId || generateId(ctx.id, tab, 'tab')
  }
  return (
    // @ts-ignore Says the type of `color` is wrong, can't figure out why.
    <Box
      aria-labelledby={tabId}
      hidden={!!tabId && tabId !== ctx?.currentTab}
      {...props}
      role="tabpanel"
    />
  )
}

export const TabController: React.FC<TabControllerProps> = ({
  id,
  initialTabId = null,
  children,
}) => {
  const [currentTab, setSelected] = React.useState<string | null>(initialTabId)
  const setCurrent = React.useCallback<React.MouseEventHandler>((e) => {
    setSelected(e.currentTarget.id)
  }, [])
  const ctx = useValue({ id, setCurrent, currentTab }, [currentTab])
  return <TabContext.Provider value={ctx}>{children}</TabContext.Provider>
}

const generateId = (...parts: (string | undefined)[]): string => parts.filter(Boolean).join('-')

const getTabs = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>('[role="tab"]'))

const getScrollInfo: GetScrollInfo = (list) => ({
  listWrapper: list.parentElement as HTMLElement,
  buttonWidth: BUTTON_WIDTH,
  listItems: getTabs(list),
})

const IS_CHAR = /^\S$/

// Copied from MenuBar/scroll, different enough that it didn't seem worth refactoring at this time.
const useKeyHandler = (setFocus: FocusSetter) =>
  React.useCallback<React.KeyboardEventHandler<HTMLElement>>(
    (event) => {
      const list = event.currentTarget.querySelector('tablist')
      const orientation = list?.getAttribute?.('aria-orientation')
      const scrollForward = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
      const scrollBack = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
      switch (event.key) {
        case scrollForward:
          setFocus(1, { shift: true })
          break
        case scrollBack:
          setFocus(-1, { shift: true })
          break
        case 'Home':
        case 'PageUp':
          setFocus(0)
          break
        case 'End':
        case 'PageDown':
          setFocus(-1)
          break
        default:
          // Search for the closest menu item that starts with the typed letter.
          if (IS_CHAR.test(event.key)) {
            setFocus(event.key)
            break
          }
          return // If unhandled at this point, we'll allow propagation.
      }
      event.preventDefault()
      event.stopPropagation()
    },
    [setFocus]
  )

type FocusHandler = React.FocusEventHandler<HTMLElement>

const useFocusHandler = (setFocus: FocusSetter, onFocus?: FocusHandler) =>
  React.useCallback<FocusHandler>(
    (e) => {
      const target = e.target
      const list = e.currentTarget
      // Prevent getting trapped when pressing tab while focus is within the list.
      list.tabIndex = -1
      if (list === target) {
        // Refocus on whatever the last focused tab was.
        setFocus(0, { shift: true })
      } else {
        const index = getTabs(list).indexOf(target)
        if (index >= 0) {
          // Keep the focusIndex accurate.
          setFocus(index)
        }
      }
      onFocus?.(e)
    },
    [onFocus, setFocus]
  )

interface TransientProps {
  $fullWidth: boolean
  $isVertical: boolean
  $grow: boolean
}

const ScrollWrapper = styled.div<TransientProps>`
  ${(p) => p.theme.colorStyles.standard};
  ${textStyle('small')};
  display: flex;
  align-items: stretch;
  outline: none;
  max-width: 100%;
  max-height: 100%;
  ${(p) => `
    flex-direction: ${p.$isVertical ? 'column' : 'row'};
    ${p.$fullWidth ? (p.$isVertical ? 'height: 100%' : 'width: 100%') : ''};
    ${insetBorder(p.theme, 'lightContrast', p.$isVertical ? 'right' : 'bottom')};
    [role='tab'] {
      flex-grow: ${p.$grow ? '1' : '0'};
    }
  `}
`

const StyledTabList = styled(Flex)`
  flex-grow: 1;
  align-items: stretch;
  flex-flow: row nowrap;
  outline: none;
  white-space: nowrap;
  ${(p) =>
    isResponsiveTouchDevice(p.theme.breakpoints) ? 'overflow-x: scroll' : 'overflow: hidden'};

  &[aria-orientation='vertical'] {
    white-space: normal;
    flex-direction: column;
  }
`

const StyledTab = styled.div.withConfig(omitProps<TabProps>(flexItem))`
  display: block;
  position: relative;
  padding: 8px 16px;
  && {
    ${flexItem}
  }

  &:focus::after {
    content: '';
    position: absolute;
    left: 14px;
    right: 14px;
    top: 8px;
    bottom: 8px;
    background-color: transparent;
    outline: ${(p) => border(p.theme, 'callToAction')};
  }

  &:focus:not(:focus-visible)::after {
    outline: none;
  }

  ${mediaGTE('small')} {
    padding: 16px;
    &:focus::after {
      top: 16px;
      bottom: 16px;
    }
  }

  &[aria-selected='true'] {
    box-shadow: inset 0 -2px 0 0 ${(p) => p.theme.colors.callToAction};
    color: ${(p) => p.theme.colors.callToAction};
    font-weight: 600;
  }
  [aria-orientation='vertical'] &[aria-selected='true'] {
    box-shadow: inset -2px 0 0 0 ${(p) => p.theme.colors.callToAction};
  }

  :hover {
    color: ${(p) => p.theme.colors.callToAction};
  }

  /* <button>/<a> style overrides */
  cursor: pointer;
  border: none;
  border-radius: 0;
  outline: none;
  text-decoration: none;
  text-align: center;
  font: inherit;
  color: inherit;
  background-color: transparent;
  box-sizing: border-box;

  &:active,
  &:focus {
    outline: none;
  }

  &::-moz-focus-inner {
    border: none;
  }
`
