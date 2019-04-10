import React, { Component, CSSProperties } from 'react'
import { Button, TextButton, IconButton } from '@repay/cactus-web'
import { ActionsAdd, NavigationChevronLeft } from '@repay/cactus-icons'
import { Link, RouteComponentProps } from '@reach/router'
import cactusTheme from '@repay/cactus-theme'

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
          backgroundColor: cactusTheme.colors.darkContrast,
          color: cactusTheme.colors.white,
          height: '100%',
        }}
      >
        {/*
        // @ts-ignore */}
        <TextButton inverse as={Link} to="/">
          <NavigationChevronLeft />
          Back
        </TextButton>
        <div style={{ textAlign: 'center', height: '100%' }}>
          <h2>Inverse Buttons</h2>
          <div style={{ height: '100%' }}>
            <table style={tableStyle} cellPadding="10">
              <tbody>
                <tr>
                  <td>
                    <strong>Standard</strong>
                  </td>
                  <td>
                    <strong>Call to Action</strong>
                  </td>
                  <td>
                    <strong>Disabled</strong>
                  </td>
                </tr>
                <tr>
                  <td>
                    <Button inverse onClick={this.handleOnClick}>
                      Button
                    </Button>
                  </td>
                  <td>
                    <Button inverse variant="action" onClick={this.handleOnClick}>
                      CTA Button
                    </Button>
                  </td>
                  <td>
                    <Button inverse disabled onClick={this.handleOnClick}>
                      Disabled
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <TextButton inverse onClick={this.handleOnClick}>
                      Text Button
                    </TextButton>
                  </td>
                  <td>
                    <TextButton inverse variant="action" onClick={this.handleOnClick}>
                      CTA Text Button
                    </TextButton>
                  </td>
                  <td>
                    <TextButton inverse disabled onClick={this.handleOnClick}>
                      Disabled Text Button
                    </TextButton>
                  </td>
                </tr>
                <tr>
                  <td>
                    <TextButton inverse onClick={this.handleOnClick}>
                      <ActionsAdd />
                      Text+Icon
                    </TextButton>
                  </td>
                  <td>
                    <TextButton inverse variant="action" onClick={this.handleOnClick}>
                      <ActionsAdd />
                      CTA Text+Icon
                    </TextButton>
                  </td>
                  <td>
                    <TextButton inverse disabled onClick={this.handleOnClick}>
                      <ActionsAdd />
                      Disabled Text+Icon
                    </TextButton>
                  </td>
                </tr>
                <tr>
                  <td>
                    <IconButton inverse onClick={this.handleOnClick}>
                      <ActionsAdd />
                    </IconButton>
                  </td>
                  <td>
                    <IconButton inverse variant="action" onClick={this.handleOnClick}>
                      <ActionsAdd />
                    </IconButton>
                  </td>
                  <td>
                    <IconButton inverse disabled onClick={this.handleOnClick}>
                      <ActionsAdd />
                    </IconButton>
                  </td>
                </tr>
              </tbody>
            </table>
            <span>Clicked {this.state.clickCount} times!</span>
          </div>
        </div>
      </div>
    )
  }
}

export default InverseButtons
