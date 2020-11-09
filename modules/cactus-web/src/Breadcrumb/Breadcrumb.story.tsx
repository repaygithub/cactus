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
    <Breadcrumb.Item href="/">{text('Label 1', 'Account')}</Breadcrumb.Item>
    <Breadcrumb.Item href="/" active>
      <em>{text('Label 2', 'Make a Payment')}</em>
    </Breadcrumb.Item>
  </Breadcrumb>
)

const CustomLink: React.FC<{ className?: string; children: React.ReactNode; customTo: string }> = ({
  children,
  className,
  customTo,
}) => (
  <a style={{ color: 'pink' }} className={className} href={customTo}>
    {children}
  </a>
)

export const CustomItemElements = (): ReactElement => (
  <Breadcrumb>
    <Breadcrumb.Item as={CustomLink} customTo="/">
      {text('Label 1', 'Account')}
    </Breadcrumb.Item>
    <Breadcrumb.Item as={CustomLink} customTo="/" active>
      <em>{text('Label 2', 'Make a Payment')}</em>
    </Breadcrumb.Item>
  </Breadcrumb>
)

export const AddMoreBreadcrumbs = (): ReactElement => {
  const values = array('Add new Links', ['Link 1'])

  return (
    <Breadcrumb>
      {values.map(
        (e, i, arr): ReactElement =>
          arr.length - 1 === i ? (
            <Breadcrumb.Item href="/" active key={i}>
              {text(`Label ${i + 1}`, `${e}`)}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item href="/" key={i}>
              {text(`Label ${i + 1}`, `${e}`)}
            </Breadcrumb.Item>
          )
      )}
    </Breadcrumb>
  )
}

AddMoreBreadcrumbs.storyName = 'Add more Breadcrumbs'
