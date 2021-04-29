import { ActionsAdd, ActionsCopy } from '@repay/cactus-icons'
import { select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { Breadcrumb, Button, Header, Link, Text } from '../'
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

export const WithALotOfBreadCrumbs = (): React.ReactElement => {
  const bgSelection = select('Background-color', bgColorVariants, 'lightContrast')

  return (
    <Header bgColor={bgSelection}>
      <Header.Title>{text('Header Title', 'Header')}</Header.Title>
      <Header.BreadcrumbRow>
        <Breadcrumb>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((i) => (
            <Breadcrumb.Item href="/">{`label ${i}`}</Breadcrumb.Item>
          ))}
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
    </Header>
  )
}

export const WithLongTextItem = (): React.ReactElement => {
  const bgSelection = select('Background-color', bgColorVariants, 'lightContrast')

  return (
    <Header bgColor={bgSelection}>
      <Header.BreadcrumbRow>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Label 1</Breadcrumb.Item>
          <Breadcrumb.Item href="/">Label 2</Breadcrumb.Item>
          <Breadcrumb.Item href="/">Label 3</Breadcrumb.Item>
          <Breadcrumb.Item href="/">Label 4</Breadcrumb.Item>
          <Breadcrumb.Active>
            <em>Active label</em>
          </Breadcrumb.Active>
        </Breadcrumb>
      </Header.BreadcrumbRow>
      <Header.Item>
        <Text>You are configuring Merchant directory from OWE Demo Merchant</Text>
      </Header.Item>
      <Header.Title>{text('Header Title', 'Header')}</Header.Title>
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
    </Header>
  )
}
