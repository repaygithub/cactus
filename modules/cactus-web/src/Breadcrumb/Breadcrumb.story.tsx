import { array, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Breadcrumb from './Breadcrumb'

storiesOf('Breadcrumb', module).add('Basic Usage', () => (
  <Breadcrumb>
    <Breadcrumb.Item label={text('Label 1', 'Account')} linkTo="/" />
    <Breadcrumb.Item label={text('Label 2', 'Make a Payment')} linkTo="/" active />
  </Breadcrumb>
))

storiesOf('Breadcrumb', module).add('Add more Breadcrumbs', () => {
  const values = array('Add new Links', ['Link 1'])

  return (
    <Breadcrumb>
      {values.map((e, i, arr) =>
        arr.length - 1 === i ? (
          <Breadcrumb.Item label={text(`Label ${i + 1}`, `${e}`)} linkTo="/" active key={i} />
        ) : (
          <Breadcrumb.Item label={text(`Label ${i + 1}`, `${e}`)} linkTo="/" key={i} />
        )
      )}
    </Breadcrumb>
  )
})
