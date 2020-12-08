import { action } from '@storybook/addon-actions'
import { boolean, select, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import { Page } from 'puppeteer'
import React, { ReactElement } from 'react'

import MenuButton from './MenuButton'

const stopNav = (e: Event): void => e.preventDefault()

export default {
  title: 'MenuButton',
  component: MenuButton,
} as Meta

export const BasicUsage = (): ReactElement => (
  <div>
    <MenuButton
      label={text('label', 'Demo Actions')}
      variant={select('variant', ['filled', 'unfilled'], 'filled')}
    >
      <MenuButton.Item onSelect={action('Action One')}>Action One</MenuButton.Item>
      <MenuButton.Item onSelect={action('Action Two')}>Action Two</MenuButton.Item>
      <MenuButton.Item onSelect={action('Action Three')}>Action Three</MenuButton.Item>
    </MenuButton>
    <MenuButton
      label={text('label', 'Demo Actions')}
      disabled
      variant={select('variant', ['filled', 'unfilled'], 'filled')}
    >
      <MenuButton.Item onSelect={action('Action One')}>Action One</MenuButton.Item>
      <MenuButton.Item onSelect={action('Action Two')}>Action Two</MenuButton.Item>
      <MenuButton.Item onSelect={action('Action Three')}>Action Three</MenuButton.Item>
    </MenuButton>
  </div>
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
WithLinks.parameters = {
  beforeScreenshot: async (page: Page) => {
    await page.click('button')
  },
}

export const WithCollisions = (): ReactElement => (
  <MenuButton
    label={text('label', 'Demo')}
    disabled={boolean('disabled?', false)}
    variant={select('variant', ['filled', 'unfilled'], 'filled')}
  >
    <MenuButton.Item onSelect={action('Action One')}>
      {text('Action Label', 'Action One')}
    </MenuButton.Item>
    <MenuButton.Item onSelect={action('Action Two')}>Action Two</MenuButton.Item>
    <MenuButton.Item onSelect={action('Action Three')}>Action Three</MenuButton.Item>
  </MenuButton>
)

WithCollisions.storyName = 'with Collisions'
WithCollisions.parameters = {
  cactus: { overrides: { height: '220vh', width: '220vw' } },
  storyshots: false,
}
