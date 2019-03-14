import React, { Component } from 'react'
import { I18nSection, I18nText } from '@repay/cactus-fwk'
import { Link, RouteComponentProps } from '@reach/router'

const snackKeys = ['cookies', 'chips', 'fruit']
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
          {snackKeys.map(k => (
            <li>
              <Link to={k}>
                <I18nText get="go-to-snack" args={{ snack: k }} />
              </Link>
            </li>
          ))}
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
