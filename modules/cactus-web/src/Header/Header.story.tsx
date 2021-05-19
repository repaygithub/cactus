import { ActionsAdd, ActionsCopy, ActionsDelete } from '@repay/cactus-icons'
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
            <Breadcrumb.Item href="/" key={i}>{`label ${i}`}</Breadcrumb.Item>
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

export const WithDescription = (): React.ReactElement => {
  const descriptionText = text('Description Text', 'I am describing something about this page')
  return (
    <Header>
      <Header.Title>I Have a Description</Header.Title>
      <Header.Description text={descriptionText} />
    </Header>
  )
}

export const WithEverything = (): React.ReactElement => {
  const descriptionText = text(
    'Description Text',
    'This story was put here to showcase the header with all sub-components that it offers'
  )
  return (
    <Header>
      <Header.BreadcrumbRow>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Active>Full Header</Breadcrumb.Active>
        </Breadcrumb>
      </Header.BreadcrumbRow>
      <Header.Title>I Am a Jam-Packed Header</Header.Title>
      <Header.Description>{descriptionText}</Header.Description>
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
      <Header.Item>
        <Button variant="danger">
          <ActionsDelete />
        </Button>
      </Header.Item>
    </Header>
  )
}
