import React, { Component, CSSProperties } from 'react'
import { Link, RouteComponentProps } from '@reach/router'
import { TextButton } from '@repay/cactus-web'

const tableStyle: CSSProperties = {
  border: '1px solid black',
  textAlign: 'center',
  width: '30%',
  marginLeft: '35%',
  marginRight: '35%',
  marginTop: '5px',
}

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
          <table style={tableStyle}>
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
          </table>
        </div>
      </div>
    )
  }
}

export default Home
