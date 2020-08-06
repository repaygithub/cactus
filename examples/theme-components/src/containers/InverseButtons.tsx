import { RouteComponentProps } from '@reach/router'
import { ActionsAdd, NavigationChevronLeft } from '@repay/cactus-icons'
import cactusTheme from '@repay/cactus-theme'
import { Box, Button, Grid, IconButton, TextButton } from '@repay/cactus-web'
import React, { Component } from 'react'

import Link from '../components/Link'

interface InverseButtonsState {
  clickCount: number
}

class InverseButtons extends Component<RouteComponentProps> {
  public constructor(props: RouteComponentProps) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this)
  }

  public state: InverseButtonsState = {
    clickCount: 0,
  }

  private handleOnClick(): void {
    this.setState({
      clickCount: this.state.clickCount + 1,
    })
  }

  public render(): React.ReactElement {
    return (
      <div
        style={{
          backgroundColor: cactusTheme.colors.base,
          color: cactusTheme.colors.white,
          minHeight: '100vh',
        }}
      >
        <Link to="/">
          <NavigationChevronLeft />
          Back
        </Link>
        <div style={{ textAlign: 'center', height: '100%' }}>
          <h2>Inverse Buttons</h2>
          <div style={{ height: '100%' }}>
            <Grid>
              <Grid.Item tiny={4}>
                <strong>Standard</strong>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <strong>Call to Action</strong>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <strong>Disabled</strong>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <Button inverse onClick={this.handleOnClick}>
                  Button
                </Button>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <Button inverse variant="action" onClick={this.handleOnClick}>
                  CTA Button
                </Button>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <Button inverse disabled onClick={this.handleOnClick}>
                  Disabled
                </Button>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <TextButton inverse onClick={this.handleOnClick}>
                  Text Button
                </TextButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <TextButton inverse variant="action" onClick={this.handleOnClick}>
                  CTA Text Button
                </TextButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <TextButton inverse disabled onClick={this.handleOnClick}>
                  Disabled Text Button
                </TextButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <TextButton inverse onClick={this.handleOnClick}>
                  <ActionsAdd />
                  Text+Icon
                </TextButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <TextButton inverse variant="action" onClick={this.handleOnClick}>
                  <ActionsAdd />
                  CTA Text+Icon
                </TextButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <TextButton inverse disabled onClick={this.handleOnClick}>
                  <ActionsAdd />
                  Disabled Text+Icon
                </TextButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <IconButton label="add" inverse onClick={this.handleOnClick}>
                  <ActionsAdd />
                </IconButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <IconButton label="add" inverse variant="action" onClick={this.handleOnClick}>
                  <ActionsAdd />
                </IconButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <IconButton label="add" inverse disabled onClick={this.handleOnClick}>
                  <ActionsAdd />
                </IconButton>
              </Grid.Item>
            </Grid>
            <Box>Clicked {this.state.clickCount} times!</Box>
          </div>
        </div>
      </div>
    )
  }
}

export default InverseButtons
