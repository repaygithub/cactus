import { array, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React, { ReactElement } from 'react'

import Breadcrumb from './Breadcrumb'

storiesOf('Breadcrumb', module).add(
  'Basic Usage',
  (): ReactElement => (
    <Breadcrumb>
      <Breadcrumb.Item linkTo="/">{text('Label 1', 'Account')}</Breadcrumb.Item>
      <Breadcrumb.Item linkTo="/" active>
        <em>{text('Label 2', 'Make a Payment')}</em>
      </Breadcrumb.Item>
    </Breadcrumb>
  )
)

storiesOf('Breadcrumb', module).add(
  'Add more Breadcrumbs',
  (): ReactElement => {
    const values = array('Add new Links', ['Link 1'])

    return (
      <Breadcrumb>
        {values.map(
          (e, i, arr): ReactElement =>
            arr.length - 1 === i ? (
              <Breadcrumb.Item linkTo="/" active key={i}>
                {text(`Label ${i + 1}`, `${e}`)}
              </Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item linkTo="/" key={i}>
                {text(`Label ${i + 1}`, `${e}`)}
              </Breadcrumb.Item>
            )
        )}
      </Breadcrumb>
    )
  }
)
