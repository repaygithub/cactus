import { boolean, number, select } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import { Page } from 'puppeteer'
import React from 'react'

import { justifyOptions } from '../Flex/Flex'
import { Tab, TabController, TabList, TabPanel } from './Tabs'

const LABELS = [
  'Ready!',
  'And...action!',
  'Cookies',
  'Crumble',
  'There was an old lady',
  'Who swallowed a fly',
  "I don't know why",
  'She swallowed a fly',
  "Perhaps she'll die",
  'A life lived in fear is a life half-lived',
  'I should probably have more than one',
  'Menu item that is quite long',
  'But I',
  'Also need',
  'Some short ones',
  'Ein',
  'Zwei',
  'Drei',
  'Uno',
  'Dos',
  'Tres',
]

export default {
  title: 'Tabs',
  component: TabList,
} as Meta

export const BasicUsage = (): React.ReactElement => {
  const breadth = number('Tab Count', 6)
  const fullWidth = boolean('Full Width', true)
  const justify = select('Justify Content', justifyOptions, 'space-evenly')
  const fillGaps = boolean('Fill Gaps', false)
  const [active, setActive] = React.useState(-1)

  const tabs = []
  for (let i = 1; i < breadth; i++) {
    const label = LABELS[i % LABELS.length]
    tabs.push(
      <Tab key={i} aria-selected={i === active} onClick={() => setActive(i)} children={label} />
    )
  }

  return (
    <TabList fullWidth={fullWidth} justifyContent={justify} fillGaps={fillGaps}>
      {breadth > 0 && (
        <Tab
          as="a"
          href="#"
          aria-selected={0 === active}
          onClick={(e: any) => {
            e.preventDefault()
            setActive(0)
          }}
          children={LABELS[0]}
        />
      )}
      {tabs}
    </TabList>
  )
}

export const WithController = (): React.ReactElement => {
  const justify = select('Justify Content', justifyOptions, 'space-evenly')
  return (
    <TabController id="the-tabs" initialTabId="the-tabs-name-tab">
      <TabList justifyContent={justify}>
        <Tab name="name">Name</Tab>
        <Tab name="rank">Rank</Tab>
        <Tab id="serial-num" panelId="serial-box">
          Serial #
        </Tab>
      </TabList>
      <TabPanel tab="name" mx={5} my={4}>
        <h1>Nebby Nebulous</h1>
      </TabPanel>
      <TabPanel id="the-tabs-rank-panel" tabId="the-tabs-rank-tab" mx={5} my={4}>
        <h2>Cloudy Nebula</h2>
      </TabPanel>
      <TabPanel id="serial-box" tabId="serial-num" mx={5} my={4}>
        <p>N3BU14</p>
      </TabPanel>
    </TabController>
  )
}

WithController.parameters = {
  beforeScreenshot: async (page: Page) => {
    await page.focus('#serial-num')
  },
  cactus: { overrides: { display: 'block' } },
}
