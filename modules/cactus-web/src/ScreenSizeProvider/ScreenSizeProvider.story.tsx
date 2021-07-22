import cactusTheme, { ColorStyle } from '@repay/cactus-theme'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'
import styled from 'styled-components'

import { Box, ScreenSizeContext, ScreenSizeProvider, StyleProvider } from '../'

const BreakpointBox = styled(Box)`
  max-width: 320px;
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: 15%;
  ${(p): ColorStyle => p.theme.colorStyles.base};
  text-align: center;

  ${(p): string => p.theme.mediaQueries.small} {
    max-width: 708px;
    width: 75px;
    height: 75px;
    line-height: 75px;
    border-radius: 25%;
  }
  ${(p): string => p.theme.mediaQueries.medium} {
    max-width: 964px;
    width: 100px;
    height: 100px;
    line-height: 100px;
    border-radius: 35%;
  }
  ${(p): string => p.theme.mediaQueries.large} {
    max-width: 1140px;
    width: 150px;
    height: 150px;
    line-height: 150px;
    border-radius: 45%;
  }
  ${(p): string => p.theme.mediaQueries.extraLarge} {
    max-width: 1380px;
    width: 200px;
    height: 200px;
    line-height: 200px;
    border-radius: 50%;
  }
`

const ScreenSize = (): React.ReactElement => {
  const size = React.useContext(ScreenSizeContext)
  return <>{size.size}</>
}

export default {
  title: 'ScreenSize Provider',
  component: ScreenSizeProvider,
} as Meta

export const DisplayCurrentScreenSize = (): React.ReactElement => {
  return (
    <StyleProvider theme={cactusTheme} global={true}>
      <BreakpointBox>
        <ScreenSize />
      </BreakpointBox>
    </StyleProvider>
  )
}

DisplayCurrentScreenSize.storyName = 'Display current screen size'
