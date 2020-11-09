import { action } from '@storybook/addon-actions'
import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React, { ReactElement } from 'react'

import MenuButton from './MenuButton'

const stopNav = (e: Event): void => e.preventDefault()

export default {
  title: 'MenuButton',
  component: MenuButton,
} as Meta

export const BasicUsage = (): ReactElement => (
  <MenuButton
    label={text('label', 'Demo Actions')}
    disabled={boolean('disabled?', false)}
    variant={select('variant', ['filled', 'unfilled'], 'filled')}
  >
    <MenuButton.Item onSelect={action('Action One')}>Action One</MenuButton.Item>
    <MenuButton.Item onSelect={action('Action Two')}>Action Two</MenuButton.Item>
    <MenuButton.Item onSelect={action('Action Three')}>Action Three</MenuButton.Item>
  </MenuButton>
)

export const WithLinks = (): ReactElement => (
  <MenuButton
    label={text('label', 'Demo')}
    disabled={boolean('disabled?', false)}
    variant={select('variant', ['filled', 'unfilled'], 'filled')}
  >
    <MenuButton.Link href="#" onClick={stopNav}>
      Link One
    </MenuButton.Link>
    <MenuButton.Link href="#" onClick={stopNav}>
      Link Two
    </MenuButton.Link>
    <MenuButton.Link href="#" onClick={stopNav}>
      Link Three
    </MenuButton.Link>
  </MenuButton>
)

WithLinks.storyName = 'with Links'

export const WithCollisions = (): ReactElement => (
  <MenuButton
    label={text('label', 'Demo')}
    disabled={boolean('disabled?', false)}
    variant={select('variant', ['filled', 'unfilled'], 'filled')}
  >
    <MenuButton.Item onSelect={action('Action One')}>Action One</MenuButton.Item>
    <MenuButton.Item onSelect={action('Action Two')}>Action Two</MenuButton.Item>
    <MenuButton.Item onSelect={action('Action Three')}>Action Three</MenuButton.Item>
  </MenuButton>
)

WithCollisions.storyName = 'with Collisions'
WithCollisions.parameters = { cactus: { overrides: { height: '220vh', width: '220vw' } } }
