import React from 'react'

import { Avatar, Grid, Label, Text } from '@repay/cactus-web'
import { AvatarStatus, AvatarType } from '@repay/cactus-web/src/Avatar/Avatar'
import { RouteComponentProps } from '@reach/router'
import Link from '../components/Link'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'

const types: AvatarType[] = ['alert', 'feedback']
const status: AvatarStatus[] = ['error', 'warning', 'info', 'success']

const AvatarComponent: React.FC<RouteComponentProps> = () => {
  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center">
        Avatar
      </Text>
      <Grid ml="40px" mt="50px">
        {types.map((t) =>
          status.map((s) => (
            <Grid.Item tiny={3} key={`${t}${s}`}>
              <Label>{`${t} ${s}`}</Label>
              <Avatar type={t} status={s} />
            </Grid.Item>
          ))
        )}
      </Grid>
    </div>
  )
}

export default AvatarComponent
