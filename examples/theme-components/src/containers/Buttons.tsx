import { RouteComponentProps } from '@reach/router'
import { ActionsAdd, NavigationChevronLeft } from '@repay/cactus-icons'
import { Box, Button, Grid, IconButton, TextButton } from '@repay/cactus-web'
import React, { Component } from 'react'

import Link from '../components/Link'

interface ButtonsState {
  clickCount: number
}

class Buttons extends Component<RouteComponentProps> {
  public constructor(props: RouteComponentProps) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this)
  }

  public state: ButtonsState = {
    clickCount: 0,
  }

  private handleOnClick(): void {
    this.setState({
      clickCount: this.state.clickCount + 1,
    })
  }

  public render(): React.ReactElement {
    return (
      <div>
        <Link to="/">
          <NavigationChevronLeft />
          Back
        </Link>
        <div style={{ textAlign: 'center' }}>
          <h2>Buttons</h2>
          <div>
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
                <Button onClick={this.handleOnClick}>Button</Button>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <Button variant="action" onClick={this.handleOnClick}>
                  CTA Button
                </Button>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <Button disabled onClick={this.handleOnClick}>
                  Disabled
                </Button>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <TextButton onClick={this.handleOnClick}>Text Button</TextButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <TextButton variant="action" onClick={this.handleOnClick}>
                  CTA Text Button
                </TextButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <TextButton disabled onClick={this.handleOnClick}>
                  Disabled Text Button
                </TextButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <TextButton onClick={this.handleOnClick}>
                  <ActionsAdd />
                  Text+Icon
                </TextButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <TextButton variant="action" onClick={this.handleOnClick}>
                  <ActionsAdd />
                  CTA Text+Icon
                </TextButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <TextButton disabled onClick={this.handleOnClick}>
                  <ActionsAdd />
                  Disabled Text+Icon
                </TextButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <IconButton label="add" onClick={this.handleOnClick}>
                  <ActionsAdd />
                </IconButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <IconButton label="add" variant="action" onClick={this.handleOnClick}>
                  <ActionsAdd />
                </IconButton>
              </Grid.Item>
              <Grid.Item tiny={4}>
                <IconButton label="add" disabled onClick={this.handleOnClick}>
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

export default Buttons
