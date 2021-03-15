import * as icons from '@repay/cactus-icons'
import { select } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import Breadcrumb from '../Breadcrumb/Breadcrumb'
import Button from '../Button/Button'
import Link from '../Link/Link'
import Header, { BackgroundColorVariants } from './Header'

export default {
  title: 'Header',
  component: Header,
} as Meta

const bgColorVariants: BackgroundColorVariants[] = ['lightContrast', 'white']

export const BasicUsage = (): React.ReactElement => {
  const bgSelection = select('Background-color', bgColorVariants, 'lightContrast')
  return (
    <Header bgColor={bgSelection}>
      <Header.Title>Heading Title</Header.Title>
    </Header>
  )
}

export const WithButton = (): React.ReactElement => {
  const bgSelection = select('Background-color', bgColorVariants, 'lightContrast')
  const Icon = icons['ActionsAdd'] as React.ComponentType<any>

  return (
    <Header bgColor={bgSelection}>
      <Header.Title>Heading Title</Header.Title>
      <Header.Item>
        <Button variant="action">
          <Icon /> Add new configuration
        </Button>
      </Header.Item>
    </Header>
  )
}

export const WithBreadcrumbs = (): React.ReactElement => {
  const Icon = icons['ActionsAdd'] as React.ComponentType<any>
  const bgSelection = select('Background-color', bgColorVariants, 'lightContrast')

  return (
    <Header bgColor={bgSelection}>
      <Header.Title>Heading Title</Header.Title>
      <Header.BreadcrumbRow>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Label</Breadcrumb.Item>
          <Breadcrumb.Item href="/" active>
            <em>Label</em>
          </Breadcrumb.Item>
        </Breadcrumb>
      </Header.BreadcrumbRow>
      <Header.Item>
        <Button variant="action">
          <Icon /> Add new configuration
        </Button>
      </Header.Item>
    </Header>
  )
}
export const WithMultipleItems = (): React.ReactElement => {
  const Icon = icons['ActionsAdd'] as React.ComponentType<any>
  const bgSelection = select('Background-color', bgColorVariants, 'lightContrast')

  return (
    <Header bgColor={bgSelection}>
      <Header.BreadcrumbRow>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Label</Breadcrumb.Item>
          <Breadcrumb.Item href="/" active>
            <em>Label</em>
          </Breadcrumb.Item>
        </Breadcrumb>
      </Header.BreadcrumbRow>
      <Header.Item>
        <Button variant="action">
          <Icon /> Add new configuration
        </Button>
      </Header.Item>
      <Header.Item>Some text because I like crowded UIs</Header.Item>
    </Header>
  )
}

export const WithGoBackLink = (): React.ReactElement => {
  const Icon = icons['ActionsAdd'] as React.ComponentType<any>
  const bgSelection = select('Background-color', bgColorVariants, 'lightContrast')

  return (
    <Header bgColor={bgSelection}>
      <Header.BreadcrumbRow>
        <Link to="https://repaygithub.github.io/cactus/">Go back!</Link>
      </Header.BreadcrumbRow>
      <Header.Title>Heading Title</Header.Title>
      <Header.Item>
        <Button variant="action">
          <Icon /> Add new configuration
        </Button>
      </Header.Item>
      <Header.Item>Some text because I like crowded UIs</Header.Item>
    </Header>
  )
}
