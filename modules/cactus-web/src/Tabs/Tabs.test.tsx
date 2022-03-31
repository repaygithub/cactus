import userEvent from '@testing-library/user-event'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import { Tab, TabController, TabList, TabPanel } from './Tabs'

// Tab, TabList, and TabPanel are basically just styled components,
// so there's nothing to test independently of controller.
describe('component: TabController', () => {
  test('switching tabs', () => {
    const { getByText } = renderWithTheme(
      <TabController initialTabId="sorcerer-tab">
        <TabList>
          <Tab name="knight">Alanna</Tab>
          <Tab name="sorcerer">Thom</Tab>
        </TabList>
        <TabPanel tab="knight">The Good Twin</TabPanel>
        <TabPanel tab="sorcerer">The Jerk Twin</TabPanel>
      </TabController>
    )
    const knightTab = getByText('Alanna')
    const knightPanel = getByText('The Good Twin')
    const sorcererTab = getByText('Thom')
    const sorcererPanel = getByText('The Jerk Twin')
    expect(knightTab).toHaveAttribute('role', 'tab')
    expect(knightTab).toHaveAttribute('aria-selected', 'false')
    expect(knightTab).toHaveAttribute('aria-controls', 'knight-panel')
    expect(knightPanel).toHaveAttribute('role', 'tabpanel')
    expect(knightPanel).toHaveAttribute('hidden')
    expect(knightPanel).toHaveAttribute('aria-labelledby', 'knight-tab')
    expect(sorcererTab).toHaveAttribute('role', 'tab')
    expect(sorcererTab).toHaveAttribute('aria-selected', 'true')
    expect(sorcererTab).toHaveAttribute('aria-controls', 'sorcerer-panel')
    expect(sorcererPanel).toHaveAttribute('role', 'tabpanel')
    expect(sorcererPanel).not.toHaveAttribute('hidden')
    expect(sorcererPanel).toHaveAttribute('aria-labelledby', 'sorcerer-tab')
    userEvent.tab()
    expect(knightTab).toHaveFocus()
    userEvent.click(knightTab as any)
    expect(knightTab).toHaveAttribute('aria-selected', 'true')
    expect(knightPanel).not.toHaveAttribute('hidden')
    expect(sorcererTab).toHaveAttribute('aria-selected', 'false')
    expect(sorcererPanel).toHaveAttribute('hidden')
  })
})
