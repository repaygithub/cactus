import { ActionsAdd, ActionsCopy, ActionsDelete } from '@repay/cactus-icons'
import React from 'react'

import { Breadcrumb, Button, Header, Link, Text } from '../'
import { Story } from '../helpers/storybook'

export default {
  title: 'Header',
  component: Header,
  argTypes: {
    bgColor: { name: 'background color' },
  },
  args: {
    title: 'Header',
    bgColor: 'lightContrast',
  },
} as const

type HeaderStory = Story<
  typeof Header,
  {
    title: string
    description: string
  }
>

export const BasicUsage: HeaderStory = ({ title, bgColor }) => {
  return (
    <Header bgColor={bgColor}>
      <Header.Title>{title}</Header.Title>
    </Header>
  )
}

export const WithButton: HeaderStory = ({ title, bgColor }) => {
  return (
    <Header bgColor={bgColor}>
      <Header.Title>{title}</Header.Title>
      <Header.Item>
        <Button variant="action">
          <ActionsAdd /> Add new configuration
        </Button>
      </Header.Item>
    </Header>
  )
}

export const WithBreadcrumbs: HeaderStory = ({ title, bgColor }) => {
  return (
    <Header bgColor={bgColor}>
      <Header.Title>{title}</Header.Title>
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

export const WithALotOfBreadCrumbs: HeaderStory = ({ title, bgColor }) => {
  return (
    <Header bgColor={bgColor}>
      <Header.Title>{title}</Header.Title>
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

export const WithLongTextItem: HeaderStory = ({ title, bgColor }) => {
  return (
    <Header bgColor={bgColor}>
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
      <Header.Title>{title}</Header.Title>
    </Header>
  )
}

export const WithMultipleItems: HeaderStory = ({ title, bgColor }) => {
  return (
    <Header bgColor={bgColor}>
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
      <Header.Title>{title}</Header.Title>
    </Header>
  )
}

export const WithGoBackLink: HeaderStory = ({ title, bgColor }) => {
  return (
    <Header bgColor={bgColor}>
      <Header.BreadcrumbRow>
        <Link to="https://repaygithub.github.io/cactus/">Go back!</Link>
      </Header.BreadcrumbRow>
      <Header.Title>{title}</Header.Title>
      <Header.Item>
        <Button variant="action">
          <ActionsAdd /> Add new configuration
        </Button>
      </Header.Item>
    </Header>
  )
}

export const WithDescription: HeaderStory = ({ title, description, bgColor }) => {
  return (
    <Header bgColor={bgColor}>
      <Header.Title>{title}</Header.Title>
      <Header.Description>{description}</Header.Description>
    </Header>
  )
}
WithDescription.args = {
  title: 'I Have a Description',
  description: 'I am describing something about this page',
}

export const WithEverything: HeaderStory = ({ title, description, bgColor }) => {
  return (
    <Header bgColor={bgColor}>
      <Header.BreadcrumbRow>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Active>Full Header</Breadcrumb.Active>
        </Breadcrumb>
      </Header.BreadcrumbRow>
      <Header.Title>{title}</Header.Title>
      <Header.Description>{description}</Header.Description>
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
WithEverything.args = {
  title: 'I Am a Jam-Packed Header',
  description:
    'This story was put here to showcase the header with all sub-components that it offers',
}
