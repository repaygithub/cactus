import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { Grid } from '../index'
import Avatar from './Avatar'

export default {
  title: 'Avatar',
  component: Avatar,
} as Meta

export const BasicUsage = (): React.ReactElement => {
  return (
    <Grid justify="center">
      <Grid.Item tiny={3} medium={1}>
        <Avatar type="feedback" status="error" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Avatar type="feedback" status="warning" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Avatar type="feedback" status="info" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Avatar type="feedback" status="success" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Avatar type="alert" status="error" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Avatar type="alert" status="warning" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Avatar type="alert" status="info" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Avatar type="alert" status="success" />
      </Grid.Item>
      <Grid.Item tiny={3} medium={1}>
        <Avatar type="alert" status="info" disabled />
      </Grid.Item>
    </Grid>
  )
}
