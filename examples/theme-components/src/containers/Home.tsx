import React, { Component } from 'react'

import { Box } from '@repay/cactus-web'
import { RouteComponentProps } from '@reach/router'
import Link from '../components/Link'

class Home extends Component<RouteComponentProps> {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>
          Welcome to the example web application showcasing @repay/cactus-web and
          @repay/cactus-theme!
        </h2>
        <div>
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
                  <Link to="/Buttons/Standard">Go!</Link>
                </td>
              </tr>
              <tr>
                <td>Inverse Buttons</td>
                <td>
                  <Link to="/Buttons/Inverse">Go!</Link>
                </td>
              </tr>
              <tr>
                <td>Form Elements</td>
                <td>
                  <Link to="/FormElements">Go!</Link>
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
