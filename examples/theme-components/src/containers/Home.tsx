import React, { Component } from 'react'

import { Box } from '@repay/cactus-web'
import { RouteComponentProps } from '@reach/router'
import Link from '../components/Link'

class Home extends Component<RouteComponentProps> {
  data = {
    Buttons: '/Buttons/Standard',
    AccessibleField: 'AccessibleField',
    'Inverse Buttons': 'Buttons/Inverse',
    'Form Elements': 'FormElements',
    Icons: 'Icons',
    Modal: 'Modal',
    Breadcrumb: 'Breadcrumb',
    Accordion: 'Accordion',
    Alert: 'Alert',
    Avatar: 'Avatar',
    DateInput: 'DateInput',
    DateInputField: 'DateInputField',
    FieldWrapper: 'FieldWrapper',
    FileInput: 'FileInput',
    FileInputField: 'FileInputField',
    Flex: 'Flex',
    Grid: 'Grid',
    IconButton: 'IconButton',
    MenuButton: 'MenuButton',
    StepAvatar: 'StepAvatar',
  }

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
              {Object.entries(this.data)
                .sort()
                .map(e => (
                  <tr key={e[0]}>
                    <td>{e[0]}</td>
                    <td>
                      <Link to={e[1]}>Go!</Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Box>
        </div>
      </div>
    )
  }
}

export default Home
