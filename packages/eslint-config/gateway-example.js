import React, { Component } from 'react'
import { getStatus } from '../resources/statusResource'
import { reverse } from 'lodash'
import moment from 'moment'

class StatusForm extends Component {
  constructor(props) {
    super(props)
    this.getStatus = this.getStatus.bind(this)
    this.state = {
      repayStatus: {
        incidents: [],
        maintenance: {
          active: [],
          upcoming: [],
        },
        status: [],
        statusOverall: {},
      },
    }
  }

  componentDidMount() {
    this.getStatus()
  }

  getStatus() {
    getStatus().then(response => {
      if (response.statusCode == 200) {
        this.setState({
          repayStatus: response.result,
        })
      }
    })
  }

  render() {
    let maintenance = this.state.repayStatus.maintenance
    let upcomingOrdered = reverse(maintenance.upcoming)
    let messageId = 0
    return (
      <div>
        <h2>Scheduled Maintenance</h2>
        {upcomingOrdered
          ? upcomingOrdered.map(item => {
              return (
                <div className="panel" style={{ width: '800px' }} key={`parent-${item.id}`}>
                  <div className="panel-heading">{item.name}</div>
                  <div className="panel-body">
                    <div className="flex items-center mb2">
                      <table>
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: 'bold' }}>Schedule</td>
                            <td>
                              <div>{moment(item.datetimePlannedStart).toString()}</div>
                              <div>{moment(item.datetimePlannedEnd).toString()}</div>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 'bold' }}>Components</td>
                            <td>
                              {item.componentsAffected.map(component => {
                                return <div key={`component-${component.id}`}>{component.name}</div>
                              })}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 'bold' }}>Locations</td>
                            <td>
                              {item.containersAffected.map(location => {
                                return <div key={`location-${location.id}`}>{location.name}</div>
                              })}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 'bold' }}>Description</td>
                            <td>
                              {item.messages.map(message => {
                                return <div key={`message-${messageId++}`}>{message.details}</div>
                              })}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            })
          : null}
      </div>
    )
  }
}

export default StatusForm
