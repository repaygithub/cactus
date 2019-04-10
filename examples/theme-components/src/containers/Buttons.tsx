import React, { Component, DetailedHTMLProps, TableHTMLAttributes } from 'react'
import { Button, TextButton, IconButton } from '@repay/cactus-web'
import { ActionsAdd, NavigationChevronLeft } from '@repay/cactus-icons'
import { Link, RouteComponentProps } from '@reach/router'

const tableStyle = {
  textAlign: 'center',
  width: '30%',
  marginLeft: '35%',
  marginRight: '35%',
  marginTop: '5px',
} as DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>

interface ButtonsState {
  clickCount: number
}

class Buttons extends Component<RouteComponentProps> {
  constructor(props: any) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this)
  }

  state: ButtonsState = {
    clickCount: 0,
  }

  handleOnClick() {
    this.setState({
      clickCount: this.state.clickCount + 1,
    })
  }

  render() {
    return (
      <div>
        {/*
        // @ts-ignore */}
        <TextButton as={Link} to="/">
          <NavigationChevronLeft />
          Back
        </TextButton>
        <div style={{ textAlign: 'center' }}>
          <h2>Buttons</h2>
          <div>
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
                    <Button onClick={this.handleOnClick}>Button</Button>
                  </td>
                  <td>
                    <Button variant="action" onClick={this.handleOnClick}>
                      CTA Button
                    </Button>
                  </td>
                  <td>
                    <Button disabled onClick={this.handleOnClick}>
                      Disabled
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <TextButton onClick={this.handleOnClick}>Text Button</TextButton>
                  </td>
                  <td>
                    <TextButton variant="action" onClick={this.handleOnClick}>
                      CTA Text Button
                    </TextButton>
                  </td>
                  <td>
                    <TextButton disabled onClick={this.handleOnClick}>
                      Disabled Text Button
                    </TextButton>
                  </td>
                </tr>
                <tr>
                  <td>
                    <TextButton onClick={this.handleOnClick}>
                      <ActionsAdd />
                      Text+Icon
                    </TextButton>
                  </td>
                  <td>
                    <TextButton variant="action" onClick={this.handleOnClick}>
                      <ActionsAdd />
                      CTA Text+Icon
                    </TextButton>
                  </td>
                  <td>
                    <TextButton disabled onClick={this.handleOnClick}>
                      <ActionsAdd />
                      Disabled Text+Icon
                    </TextButton>
                  </td>
                </tr>
                <tr>
                  <td>
                    <IconButton onClick={this.handleOnClick}>
                      <ActionsAdd />
                    </IconButton>
                  </td>
                  <td>
                    <IconButton variant="action" onClick={this.handleOnClick}>
                      <ActionsAdd />
                    </IconButton>
                  </td>
                  <td>
                    <IconButton disabled onClick={this.handleOnClick}>
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

export default Buttons
