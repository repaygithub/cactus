import { RouteComponentProps } from '@reach/router'
import { I18nSection, I18nText } from '@repay/cactus-i18n'
import React, { Component } from 'react'

type SnackProps = RouteComponentProps<{ snack: string }>

class Snack extends Component<SnackProps> {
  public render(): React.ReactElement {
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
