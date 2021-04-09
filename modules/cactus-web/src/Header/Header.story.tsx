import { ActionsAdd, ActionsCopy } from '@repay/cactus-icons'
import { select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { Breadcrumb, Button, Header, Link } from '../'
import { BackgroundColorVariants } from './Header'

export default {
  title: 'Header',
  component: Header,
} as Meta

const bgColorVariants: BackgroundColorVariants[] = ['lightContrast', 'white']

export const BasicUsage = (): React.ReactElement => {
  const bgSelection = select('Background-color', bgColorVariants, 'lightContrast')
  return (
    <Header bgColor={bgSelection}>
      <Header.Title>{text('Header Title', 'Header')}</Header.Title>
    </Header>
  )
}

export const WithButton = (): React.ReactElement => {
  const bgSelection = select('Background-color', bgColorVariants, 'lightContrast')

  return (
    <Header bgColor={bgSelection}>
      <Header.Title>{text('Header Title', 'Header')}</Header.Title>
      <Header.Item>
        <Button variant="action">
          <ActionsAdd /> Add new configuration
        </Button>
      </Header.Item>
    </Header>
  )
}

export const WithBreadcrumbs = (): React.ReactElement => {
  const bgSelection = select('Background-color', bgColorVariants, 'lightContrast')

  return (
    <Header bgColor={bgSelection}>
      <Header.Title>{text('Header Title', 'Header')}</Header.Title>
      <Header.BreadcrumbRow>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Label</Breadcrumb.Item>
          <Breadcrumb.Active>
            <em>Label</em>
          </Breadcrumb.Active>
        </Breadcrumb>
      </Header.BreadcrumbRow>
      <Header.Item>
        <Button variant="action">
          <ActionsAdd /> Add new configuration
        </Button>
      </Header.Item>
    </Header>
  )
}
export const WithMultipleItems = (): React.ReactElement => {
  const bgSelection = select('Background-color', bgColorVariants, 'lightContrast')

  return (
    <Header bgColor={bgSelection}>
      <Header.BreadcrumbRow>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Label</Breadcrumb.Item>
          <Breadcrumb.Active>
            <em>Label</em>
          </Breadcrumb.Active>
        </Breadcrumb>
      </Header.BreadcrumbRow>
      <Header.Item>
        <Button variant="action">
          <ActionsAdd /> Add new configuration
        </Button>
      </Header.Item>
      <Header.Item>
        <Button variant="success">
          <ActionsCopy />
        </Button>
      </Header.Item>
      <Header.Item> Some text because I like crowded UIs </Header.Item>
      <Header.Title>{text('Header Title', 'Header')}</Header.Title>
    </Header>
  )
}

export const WithGoBackLink = (): React.ReactElement => {
  const bgSelection = select('Background-color', bgColorVariants, 'lightContrast')

  return (
    <Header bgColor={bgSelection}>
      <Header.BreadcrumbRow>
        <Link to="https://repaygithub.github.io/cactus/">Go back!</Link>
      </Header.BreadcrumbRow>
      <Header.Title>{text('Header Title', 'Header')}</Header.Title>
      <Header.Item>
        <Button variant="action">
          <ActionsAdd /> Add new configuration
        </Button>
      </Header.Item>
      <Header.Item>Some text because I like crowded UIs</Header.Item>
    </Header>
  )
}
