import cactusTheme from '@repay/cactus-theme'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'
import styled from 'styled-components'

import Box from '../Box/Box'
import Grid from '../Grid/Grid'
import StyleProvider from './StyleProvider'

const backgroundColors = ['springgreen', 'mediumturquoise', 'cornflowerblue', 'thistle', 'pink']

const BreakpointBox = styled(Box)`
  max-width: 320px;
  width: 50px;
  height: 50px;
  border-radius: 15%
    ${(p): string | undefined => p.theme.mediaQueries && p.theme.mediaQueries.small} {
    max-width: 708px;
    width: 75px;
    height: 75px;
    border-radius: 25%;
  }
  ${(p): string | undefined => p.theme.mediaQueries && p.theme.mediaQueries.medium} {
    max-width: 964px;
    width: 100px;
    height: 100px;
    border-radius: 35%;
  }
  ${(p): string | undefined => p.theme.mediaQueries && p.theme.mediaQueries.large} {
    max-width: 1140px;
    width: 150px;
    height: 150px;
    border-radius: 45%;
  }
  ${(p): string | undefined => p.theme.mediaQueries && p.theme.mediaQueries.extraLarge} {
    max-width: 1380px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
`

export default {
  title: 'Style Provider',
  component: StyleProvider,
} as Meta

export const ComponentAdjusmentsBasedOnMediaQueries = (): React.ReactElement => {
  return (
    <StyleProvider theme={cactusTheme} global={true}>
      <Grid justify="center">
        <Grid.Item tiny={4}>
          <BreakpointBox backgroundColor={backgroundColors} />
        </Grid.Item>
        <Grid.Item tiny={4}>
          <BreakpointBox backgroundColor={backgroundColors} />
        </Grid.Item>
        <Grid.Item tiny={4}>
          <BreakpointBox backgroundColor={backgroundColors} />
        </Grid.Item>
        <Grid.Item tiny={2}>
          <BreakpointBox backgroundColor={backgroundColors} />
        </Grid.Item>
        <Grid.Item tiny={2}>
          <BreakpointBox backgroundColor={backgroundColors} />
        </Grid.Item>
        <Grid.Item tiny={2}>
          <BreakpointBox backgroundColor={backgroundColors} />
        </Grid.Item>
        <Grid.Item tiny={2}>
          <BreakpointBox backgroundColor={backgroundColors} />
        </Grid.Item>
        <Grid.Item tiny={2}>
          <BreakpointBox backgroundColor={backgroundColors} />
        </Grid.Item>
        <Grid.Item tiny={2}>
          <BreakpointBox backgroundColor={backgroundColors} />
        </Grid.Item>
      </Grid>
    </StyleProvider>
  )
}

ComponentAdjusmentsBasedOnMediaQueries.storyName = 'Component Adjusments based on Media Queries'
