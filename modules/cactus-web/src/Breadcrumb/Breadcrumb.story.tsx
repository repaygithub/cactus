import { array, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { ReactElement } from 'react'

import Breadcrumb from './Breadcrumb'

export default {
  title: 'Breadcrumb',
  component: Breadcrumb,
} as Meta

export const BasicUsage = (): ReactElement => (
  <Breadcrumb>
    <Breadcrumb.Item label={text('Label 1', 'Account')} linkTo="/" />
    <Breadcrumb.Item label={<em>{text('Label 2', 'Make a Payment')}</em>} linkTo="/" active />
  </Breadcrumb>
)

export const AddMoreBreadcrumbs = (): ReactElement => {
  const values = array('Add new Links', ['Link 1'])

  return (
    <Breadcrumb>
      {values.map(
        (e, i, arr): ReactElement =>
          arr.length - 1 === i ? (
            <Breadcrumb.Item label={text(`Label ${i + 1}`, `${e}`)} linkTo="/" active key={i} />
          ) : (
            <Breadcrumb.Item label={text(`Label ${i + 1}`, `${e}`)} linkTo="/" key={i} />
          )
      )}
    </Breadcrumb>
  )
}

AddMoreBreadcrumbs.storyName = 'Add more Breadcrumbs'
