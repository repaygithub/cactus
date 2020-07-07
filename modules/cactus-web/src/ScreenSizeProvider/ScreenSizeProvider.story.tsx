import React from 'react'

import { storiesOf } from '@storybook/react'
import Box from '../Box/Box'
import cactusTheme from '@repay/cactus-theme'
import ScreenSizeProvider, { ScreenSizeContext } from './ScreenSizeProvider'
import styled from 'styled-components'
import StyleProvider from '../StyleProvider/StyleProvider'

const BreakpointBox = styled(Box)`
  max-width: 320px;
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: 15%;
  ${(p) => p.theme.colorStyles.base};
  text-align: center;

  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.small} {
    max-width: 708px;
    width: 75px;
    height 75px;
    line-height 75px;
    border-radius: 25%;
  }
  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.medium} {
    max-width: 964px;
    width: 100px;
    height: 100px;
    line-height: 100px;
    border-radius: 35%;
  }
  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.large} {
    max-width: 1140px;
    width: 150px;
    height: 150px;
    line-height: 150px;
    border-radius: 45%;
  }
  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.extraLarge} {
    max-width: 1380px;
    width: 200px;
    height: 200px;
    line-height: 200px;
    border-radius: 50%;
  }
`

const ScreenSize = () => {
  const size = React.useContext(ScreenSizeContext)
  return <>{size.size}</>
}

storiesOf('ScreenSize Provider', module).add('Display current screen size', () => {
  return (
    <StyleProvider theme={cactusTheme} global={true}>
      <ScreenSizeProvider>
        <BreakpointBox>
          <ScreenSize />
        </BreakpointBox>
      </ScreenSizeProvider>
    </StyleProvider>
  )
})
