import { mediaGTE } from '@repay/cactus-theme'
import React from 'react'
import styled from 'styled-components'

import { Box, ScreenSizeProvider, useScreenSize } from '../'

const BreakpointBox = styled(Box)`
  max-width: 320px;
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: 15%;
  ${(p) => p.theme.colorStyles.base};
  text-align: center;

  ${mediaGTE('small')} {
    max-width: 708px;
    width: 75px;
    height: 75px;
    line-height: 75px;
    border-radius: 25%;
  }
  ${mediaGTE('medium')} {
    max-width: 964px;
    width: 100px;
    height: 100px;
    line-height: 100px;
    border-radius: 35%;
  }
  ${mediaGTE('large')} {
    max-width: 1140px;
    width: 150px;
    height: 150px;
    line-height: 150px;
    border-radius: 45%;
  }
  ${mediaGTE('extraLarge')} {
    max-width: 1380px;
    width: 200px;
    height: 200px;
    line-height: 200px;
    border-radius: 50%;
  }
`

const ScreenSize = (): React.ReactElement => {
  const size = useScreenSize()
  return <>{size.size}</>
}

export default {
  title: 'ScreenSize Provider',
  component: ScreenSizeProvider,
  parameters: { controls: { disable: true } },
} as const

export const DisplayCurrentScreenSize = (): React.ReactElement => {
  return (
    <BreakpointBox>
      <ScreenSize />
    </BreakpointBox>
  )
}

DisplayCurrentScreenSize.storyName = 'Display current screen size'
