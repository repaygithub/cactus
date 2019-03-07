import React, { Component } from 'react'
import { I18nSection, I18nText } from '@repay/cactus-fwk'
import { Link, RouteComponentProps } from '@reach/router'

const snackKeys = ['cookies', 'chips', 'crackers']
const list = Array(10000).fill(0)
const snackList = list.map(() => {
  return snackKeys[Math.floor(Math.random() * 3)]
})

class Snacks extends Component<RouteComponentProps> {
  render() {
    return (
      <I18nSection name="snacks">
        <h2>
          <I18nText get="snacks-header" />
        </h2>
        <ol>
          <li>
            <Link to="cookies">
              <I18nText get="cookies" />
            </Link>
          </li>
          <li>
            <Link to="chips">
              <I18nText get="chips" />
            </Link>
          </li>
          <li>
            <Link to="crackers">
              <I18nText get="crackers" />
            </Link>
          </li>
        </ol>
        <div>
          <I18nText get="snacks-desc" />
        </div>
        <ul>
          {snackList.map((item, ix) => {
            return (
              <li key={ix}>
                <I18nText get={item} />
              </li>
            )
          })}
        </ul>
      </I18nSection>
    )
  }
}

export default Snacks
