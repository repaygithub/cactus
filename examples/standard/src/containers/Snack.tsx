import React, { Component } from 'react'

import { I18nSection, I18nText } from '@repay/cactus-i18n'
import { RouteComponentProps } from '@reach/router'

type SnackProps = RouteComponentProps<{ snack: string }>

class Snack extends Component<SnackProps> {
  render() {
    return (
      <I18nSection name={this.props.snack || ''}>
        <h2>
          <I18nText get="header" />
        </h2>
        <div>
          <I18nText get="description" />
        </div>
      </I18nSection>
    )
  }
}

export default Snack
