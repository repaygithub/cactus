import React from 'react'

import { Avatar, Flex, Grid, Text } from '../'
import { AvatarStatus, AvatarType } from './Avatar'
export default {
  title: 'Avatar',
  component: Avatar,
  parameters: { controls: { disable: true } },
} as const

const dictionary: AvatarStatus[] = ['error', 'warning', 'info', 'success']

const AvatarGenerator = ({
  status,
  type,
  disabled,
}: {
  status: AvatarStatus
  type: AvatarType
  disabled?: boolean
}) => {
  return (
    <Grid.Item tiny={3} medium={1}>
      <Flex flexDirection="column" alignItems="center" width="99%">
        <Text textStyle="tiny" textAlign="center">
          {disabled ? 'disabled' : `${type} ${status}`}
        </Text>
        <Avatar status={status} type={type} disabled={disabled} />
      </Flex>
    </Grid.Item>
  )
}

export const BasicUsage = (): React.ReactElement => {
  return (
    <Grid justify="center">
      {dictionary.map((status) => (
        <AvatarGenerator key={status} type="feedback" status={status} />
      ))}
      {dictionary.map((status) => (
        <AvatarGenerator key={status} type="alert" status={status} />
      ))}
      <AvatarGenerator type="feedback" status="info" disabled />
    </Grid>
  )
}
