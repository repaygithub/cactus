import * as React from 'react'

import { BACKGROUND_CHANGE, DECORATOR_LISTENING, NAME, THEME_CHANGE } from './constants'
import { StyleProvider } from '../src/StyleProvider/StyleProvider'
import addons, { makeDecorator } from '@storybook/addons'
import cactusTheme, { generateTheme } from '@repay/cactus-theme'
import styled from 'styled-components'

interface StyledContainerBaseProps {
  inverse: boolean
  className?: string
}

const StyledContainerBase: React.FC<StyledContainerBaseProps> = ({ className, children }) => (
  <div className={className}>{children}</div>
)

const StyledContainer = styled(StyledContainerBase)`
  position: absolute
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  ${p => (p.inverse ? p.theme.colorStyles.base : p.theme.colorStyles.standard)};
  
  > div {
    padding: 16px;
  }
`

interface ProvideCactusThemeProps {
  channel: any
}

const ProvideCactusTheme: React.FC<ProvideCactusThemeProps> = props => {
  const [theme, setTheme] = React.useState(cactusTheme)
  const [inverse, setInverse] = React.useState(false)

  React.useEffect(() => {
    const updateTheme = (params: any) => {
      setTheme(generateTheme(params))
    }

    const updateBackground = ({ inverse }: any) => {
      setInverse(inverse)
    }

    props.channel.on(THEME_CHANGE, updateTheme)
    props.channel.on(BACKGROUND_CHANGE, updateBackground)

    props.channel.emit(DECORATOR_LISTENING)
    return () => {
      props.channel.removeListener(THEME_CHANGE, updateTheme)
      props.channel.removeListener(BACKGROUND_CHANGE, updateBackground)
    }
  }, [props.channel])

  return (
    <StyleProvider theme={theme} global>
      <StyledContainer inverse={inverse}>{props.children}</StyledContainer>
    </StyleProvider>
  )
}

export default makeDecorator({
  name: NAME,
  wrapper: (getStory, context) => {
    const channel = addons.getChannel()

    return <ProvideCactusTheme channel={channel}>{getStory(context)}</ProvideCactusTheme>
  },
})
