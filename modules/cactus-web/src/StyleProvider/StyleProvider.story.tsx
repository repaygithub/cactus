import cactusTheme from '@repay/cactus-theme'
import React from 'react'
import styled from 'styled-components'

import { Box, Flex, Grid, StyleProvider } from '../'

const backgroundColors = ['springgreen', 'mediumturquoise', 'cornflowerblue', 'thistle', 'pink']

const BreakpointBox = styled(Box)`
  max-width: 320px;
  width: 50px;
  height: 50px;
  border-radius: 15% ${(p): string => p.theme.mediaQueries.small} {
    max-width: 708px;
    width: 75px;
    height: 75px;
    border-radius: 25%;
  }
  ${(p): string => p.theme.mediaQueries.medium} {
    max-width: 964px;
    width: 100px;
    height: 100px;
    border-radius: 35%;
  }
  ${(p): string => p.theme.mediaQueries.large} {
    max-width: 1140px;
    width: 150px;
    height: 150px;
    border-radius: 45%;
  }
  ${(p): string => p.theme.mediaQueries.extraLarge} {
    max-width: 1380px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
`

export default {
  title: 'Style Provider',
  component: StyleProvider,
  parameters: { controls: { disable: true } },
} as const

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

export const StyleReset = (): React.ReactElement => (
  <Flex flexDirection="column">
    <span>Regular Text</span>
    <p>Paragraph</p>
    <a>Anchor</a>
    <a href="#">Link</a>
    <button type="button">A Button</button>
    <input type="button" value="An Input Button" />
    <input type="text" placeholder="An Input" />
    <textarea placeholder="A Textarea" />
    <select placeholder="Select Any">
      <optgroup label="Choose ye this day">
        <option>Four</option>
      </optgroup>
    </select>
  </Flex>
)
