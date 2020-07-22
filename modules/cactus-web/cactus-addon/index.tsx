import cactusTheme, { generateTheme } from '@repay/cactus-theme'
import addons, { makeDecorator } from '@storybook/addons'
import * as React from 'react'
import styled, { CSSObject } from 'styled-components'

import { StyleProvider } from '../src/StyleProvider/StyleProvider'
import { BACKGROUND_CHANGE, DECORATOR_LISTENING, NAME, PROP_NAME, THEME_CHANGE } from './constants'

type AlignmentTypes = 'center' | 'left' | 'right' | 'bottom' | 'top'

interface StyledContainerBaseProps {
  inverse: boolean
  className?: string
  align?: AlignmentTypes
  overrides?: CSSObject
}

const StyledContainerBase: React.FC<StyledContainerBaseProps> = ({
  className,
  children,
  ...rest
}) => <div className={className}>{children}</div>

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
  ${(p) => (p.inverse ? p.theme.colorStyles.base : p.theme.colorStyles.standard)};
  ${(p) => alignmentMap[p.align]};
  ${(p) => p.overrides}
`

StyledContainer.defaultProps = {
  align: 'center',
}

interface ProvideCactusThemeProps {
  channel: any
}

const ProvideCactusTheme: React.FC<ProvideCactusThemeProps> = ({ channel, ...props }) => {
  const [theme, setTheme] = React.useState(cactusTheme)
  const [inverse, setInverse] = React.useState(false)

  React.useEffect(() => {
    const updateTheme = (params: any) => {
      setTheme(generateTheme(params))
    }

    const updateBackground = ({ inverse }: any) => {
      setInverse(inverse)
    }

    channel.on(THEME_CHANGE, updateTheme)
    channel.on(BACKGROUND_CHANGE, updateBackground)

    channel.emit(DECORATOR_LISTENING)
    return () => {
      channel.removeListener(THEME_CHANGE, updateTheme)
      channel.removeListener(BACKGROUND_CHANGE, updateBackground)
    }
  }, [channel])

  return (
    <StyleProvider theme={theme} global>
      <StyledContainer {...props} inverse={inverse} />
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
  ) => {
    const channel = addons.getChannel()
    parameters = { ...options, ...parameters }

    return (
      <ProvideCactusTheme {...parameters} channel={channel}>
        {getStory(context)}
      </ProvideCactusTheme>
    )
  },
})
