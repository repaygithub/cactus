import React, { Component, CSSProperties } from 'react'

import { ActionsAdd, NavigationChevronLeft } from '@repay/cactus-icons'
import { Box, Button, Grid, IconButton, TextButton } from '@repay/cactus-web'
import { RouteComponentProps } from '@reach/router'
import cactusTheme from '@repay/cactus-theme'
import Link from '../components/Link'

const tableStyle: CSSProperties = {
  textAlign: 'center',
  width: '30%',
  marginLeft: '35%',
  marginRight: '35%',
  marginTop: '5px',
}

interface InverseButtonsState {
  clickCount: number
}

class InverseButtons extends Component<RouteComponentProps> {
  constructor(props: any) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this)
  }

  state: InverseButtonsState = {
    clickCount: 0,
  }

  handleOnClick() {
    this.setState({
      clickCount: this.state.clickCount + 1,
    })
  }

  render() {
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
