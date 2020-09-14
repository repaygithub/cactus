import cactusTheme, { ColorStyle, generateTheme } from '@repay/cactus-theme'
import addons, { makeDecorator } from '@storybook/addons'
import * as React from 'react'
import styled, { CSSObject } from 'styled-components'

import { StyleProvider } from '../src/StyleProvider/StyleProvider'
import {
  BACKGROUND_CHANGE,
  BORDER_BOX_CHANGE,
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

const StyledContainer = styled(StyledContainerBase)`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow-y: auto;
  ${(p): ColorStyle => (p.inverse ? p.theme.colorStyles.base : p.theme.colorStyles.standard)};
  ${(p): CSSObject => alignmentMap[p.align]};
  ${(p): CSSObject => p.overrides}

  ${(p): string => p.borderBox && '* { box-sizing: border-box; }'}
`

StyledContainer.defaultProps = {
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

  React.useEffect((): (() => void) => {
    const updateTheme = (params: any): void => {
      setTheme(generateTheme(params))
    }

    const updateBackground = ({ inverse }: any): void => {
      setInverse(inverse)
    }

    const updateBorderBox = ({ borderBox }: any): void => {
      setBorderBox(borderBox)
    }

    channel.on(THEME_CHANGE, updateTheme)
    channel.on(BACKGROUND_CHANGE, updateBackground)
    channel.on(BORDER_BOX_CHANGE, updateBorderBox)

    channel.emit(DECORATOR_LISTENING)
    return (): void => {
      channel.removeListener(THEME_CHANGE, updateTheme)
      channel.removeListener(BACKGROUND_CHANGE, updateBackground)
      channel.removeListener(BORDER_BOX_CHANGE, updateBorderBox)
    }
  }, [channel])

  return (
    <StyleProvider theme={theme} global>
      <StyledContainer {...props} inverse={inverse} borderBox={borderBox} />
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
    getStory: any,
    context: any,
    { parameters, options }: { parameters?: CactusAddonsOptions; options?: CactusAddonsOptions }
  ): React.ReactElement => {
    const channel = addons.getChannel()
    parameters = { ...options, ...parameters }

    return (
      <ProvideCactusTheme {...parameters} channel={channel}>
        {getStory(context)}
      </ProvideCactusTheme>
    )
  },
})
