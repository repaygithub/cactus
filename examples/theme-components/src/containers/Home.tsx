import React, { Component } from 'react'

import { Box, TextButton, ToggleField } from '@repay/cactus-web'
import { Link, RouteComponentProps } from '@reach/router'

class Home extends Component<RouteComponentProps> {
  state = { enabled: false }

  handleChange = (name: string, value: boolean) => this.setState({ [name]: value })

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>
          Welcome to the example web application showcasing @repay/cactus-web and
          @repay/cactus-theme!
        </h2>
        <div>
          <ToggleField
            label="Is Enabled"
            name="enabled"
            value={this.state.enabled}
            onChange={this.handleChange}
          />
          <span>Use the table below to navigate to different components.</span>
          <Box
            as="table"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="darkestContrast"
            width="30%"
            marginLeft="35%"
            marginRight="35%"
            marginTop="5px"
          >
            <tbody>
              <tr>
                <td>
                  <strong>Component</strong>
                </td>
                <td>
                  <strong>Navigate</strong>
                </td>
              </tr>
              <tr>
                <td>Buttons</td>
                <td>
                  {/*
                  // @ts-ignore */}
                  <TextButton as={Link} to="/Buttons/Standard">
                    Go!
                  </TextButton>
                </td>
              </tr>
              <tr>
                <td>Inverse Buttons</td>
                <td>
                  {/*
                  // @ts-ignore */}
                  <TextButton as={Link} to="/Buttons/Inverse">
                    Go!
                  </TextButton>
                </td>
              </tr>
            </tbody>
          </Box>
        </div>
      </div>
    )
  }
}

export default Home
