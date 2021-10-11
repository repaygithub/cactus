import React from 'react'

import { Box, Grid } from '../'

export default {
  title: 'Grid',
  component: Grid,
  parameters: { controls: { disable: true } },
} as const

export const BasicUsage = (): React.ReactElement => (
  <Grid>
    <Grid.Item tiny={3} medium={1}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={1}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={1}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={1}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={1}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={1}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={1}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={1}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={1}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={1}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={1}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={1}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>

    <Grid.Item tiny={4} medium={2}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={4} medium={2}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={4} medium={2}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={4} medium={2}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={4} medium={2}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={4} medium={2}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>

    <Grid.Item tiny={3} medium={3}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={3}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={3}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={3}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>

    <Grid.Item tiny={4} medium={4}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={4} medium={4}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={4} medium={4}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>

    <Grid.Item tiny={6} medium={5}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={4}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={3}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>

    <Grid.Item tiny={6} medium={6}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={6} medium={6}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>

    <Grid.Item tiny={6} medium={7}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={3}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={2}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>

    <Grid.Item tiny={8} medium={8}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={4} medium={4}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>

    <Grid.Item tiny={9} medium={9}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={3}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>

    <Grid.Item tiny={9} medium={10}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={2}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>

    <Grid.Item tiny={9} medium={11}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
    <Grid.Item tiny={3} medium={1}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>

    <Grid.Item tiny={12} medium={12}>
      <Box height="25px" width="100%" backgroundColor="pink" />
    </Grid.Item>
  </Grid>
)

export const PreventGridBlowout = (): React.ReactElement => {
  const LONG_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut viverra diam sed consequat
  auctor. Cras interdum vel tortor eget consequat. Aliquam id accumsan eros, a condimentum
  neque. Cras nibh leo, pulvinar eu enim at, sodales molestie enim. Cras a lacinia nunc.
  Nunc rutrum ut leo sed elementum.`
  return (
    <Grid>
      <Grid.Item tiny={3} medium={1}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <p style={{ overflow: 'hidden', height: 'auto', margin: '0' }}>
          {LONG_TEXT.replace(/\s/g, '')}
        </p>
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>

      <Grid.Item tiny={3} medium={3}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={3}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={3}>
        <p style={{ overflow: 'hidden', height: 'auto', margin: '0' }}>
          {LONG_TEXT.replace(/\s/g, '')}
        </p>
      </Grid.Item>
      <Grid.Item tiny={3} medium={3}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>

      <Grid.Item tiny={10} medium={9}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
      <Grid.Item tiny={2} medium={3}>
        <p style={{ overflow: 'hidden', height: 'auto', margin: '0' }}>
          {LONG_TEXT.replace(/\s/g, '')}
        </p>
      </Grid.Item>

      <Grid.Item tiny={9} medium={4}>
        <p style={{ overflow: 'hidden', height: 'auto', margin: '0' }}>
          {LONG_TEXT.replace(/\s/g, '')}
        </p>
      </Grid.Item>
      <Grid.Item tiny={3} medium={8}>
        <Box height="25px" width="100%" backgroundColor="pink" />
      </Grid.Item>
    </Grid>
  )
}
