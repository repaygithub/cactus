import cactusTheme, { generateTheme } from '@repay/cactus-theme'
import addons, { makeDecorator } from '@storybook/addons'
import * as React from 'react'
import styled, { CSSObject } from 'styled-components'

import { ScreenSizeProvider } from '../src/ScreenSizeProvider/ScreenSizeProvider'
import { StyleProvider } from '../src/StyleProvider/StyleProvider'
import {
  BACKGROUND_CHANGE,
  BORDER_BOX_CHANGE,
  CONTAINER_CHANGE,
  DECORATOR_LISTENING,
  NAME,
  PROP_NAME,
  THEME_CHANGE,
} from './constants'

type AlignmentTypes = 'center' | 'left' | 'right' | 'bottom' | 'top'

interface StyledContainerBaseProps {
  inverse: boolean
  className?: string
  align?: AlignmentTypes
  overrides?: CSSObject
  borderBox?: boolean
}

const StyledContainerBase: React.FC<StyledContainerBaseProps> = ({
  className,
  children,
}): React.ReactElement => <div className={className}>{children}</div>

const alignmentMap: { [k in AlignmentTypes]: CSSObject } = {
  center: { justifyContent: 'center', alignItems: 'center' },
  left: { justifyContent: 'start', alignItems: 'center' },
  right: { justifyContent: 'end', alignItems: 'center' },
  bottom: { justifyContent: 'center', alignItems: 'end' },
  top: { justifyContent: 'center', alignItems: 'start' },
}

const DefaultContainer = styled(StyledContainerBase)`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  ${(p) => (p.inverse ? p.theme.colorStyles.base : p.theme.colorStyles.standard)};
  ${(p) => p.overrides}
  ${(p) => p.borderBox && '* { box-sizing: border-box; }'}
`

const FlexContainer = styled(DefaultContainer)`
  width: 100vw;
  display: flex;
  ${(p) => alignmentMap[p.align]};
`

FlexContainer.defaultProps = {
  align: 'center',
}

interface ProvideCactusThemeProps {
  channel: any
}

const ProvideCactusTheme: React.FC<ProvideCactusThemeProps> = ({
  channel,
  ...props
}): React.ReactElement => {
  const [theme, setTheme] = React.useState(cactusTheme)
  const [inverse, setInverse] = React.useState(false)
  const [borderBox, setBorderBox] = React.useState(false)
  const [flexContainer, setFlexContainer] = React.useState(false)

  const Container = flexContainer ? FlexContainer : DefaultContainer

  React.useEffect((): (() => void) => {
    const updateTheme = (params: any): void => {
      setTheme(generateTheme(params))
    }

    const updateBackground = ({ inverse: newInverse }: any) => {
      setInverse(newInverse)
    }

    const updateBorderBox = ({ borderBox: newBorderBox }: any) => {
      setBorderBox(newBorderBox)
    }

    const updateContainerType = ({ isFlexContainer }: any) => {
      setFlexContainer(isFlexContainer)
    }

    channel.on(THEME_CHANGE, updateTheme)
    channel.on(BACKGROUND_CHANGE, updateBackground)
    channel.on(BORDER_BOX_CHANGE, updateBorderBox)
    channel.on(CONTAINER_CHANGE, updateContainerType)

    channel.emit(DECORATOR_LISTENING)
    return (): void => {
      channel.removeListener(THEME_CHANGE, updateTheme)
      channel.removeListener(BACKGROUND_CHANGE, updateBackground)
      channel.removeListener(BORDER_BOX_CHANGE, updateBorderBox)
      channel.removeListener(CONTAINER_CHANGE, updateContainerType)
    }
  }, [channel])

  return (
    <StyleProvider theme={theme} global>
      <ScreenSizeProvider>
        <Container {...props} inverse={inverse} borderBox={borderBox} />
      </ScreenSizeProvider>
    </StyleProvider>
  )
}

export interface CactusAddonsOptions {
  align?: AlignmentTypes
  overrides?: CSSObject
}

export default makeDecorator({
  name: NAME,
  parameterName: PROP_NAME,
  wrapper: (
    Story: any,
    context: any,
    { parameters, options }: { parameters?: CactusAddonsOptions; options?: CactusAddonsOptions }
  ): React.ReactElement => {
    const channel = addons.getChannel()
    parameters = { ...options, ...parameters }

    return (
      <ProvideCactusTheme {...parameters} channel={channel}>
        <Story />
      </ProvideCactusTheme>
    )
  },
})
