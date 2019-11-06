import React from 'react'

import { action } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import MenuButton from './MenuButton'

const stopNav = (e: Event) => e.preventDefault()

storiesOf('MenuButton', module)
  .add('Basic Usage', () => (
    <MenuButton label={text('label', 'Demo Actions')} disabled={boolean('disabled?', false)}>
      <MenuButton.Item onSelect={action('Action One')}>Action One</MenuButton.Item>
      <MenuButton.Item onSelect={action('Action Two')}>Action Two</MenuButton.Item>
      <MenuButton.Item onSelect={action('Action Three')}>Action Three</MenuButton.Item>
    </MenuButton>
  ))
  .add('with Links', () => (
    <MenuButton label={text('label', 'Demo')} disabled={boolean('disabled?', false)}>
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
  ))
  .add(
    'with Collisions',
    () => (
      <MenuButton label={text('label', 'Demo')} disabled={boolean('disabled?', false)}>
        <MenuButton.Item onSelect={action('Action One')}>Action One</MenuButton.Item>
        <MenuButton.Item onSelect={action('Action Two')}>Action Two</MenuButton.Item>
        <MenuButton.Item onSelect={action('Action Three')}>Action Three</MenuButton.Item>
      </MenuButton>
    ),
    { cactus: { overrides: { height: '220vh', width: '220vw' } } }
  )
