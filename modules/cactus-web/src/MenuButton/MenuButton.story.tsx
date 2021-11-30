import { Page } from 'puppeteer'
import React from 'react'

import { MenuButton } from '../'
import { HIDE_CONTROL, Story, STRING } from '../helpers/storybook'

const stopNav = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => e.preventDefault()
const action = (msg: string) => () => console.log(msg)

export default {
  title: 'MenuButton',
  component: MenuButton,
  argTypes: {
    label: STRING,
    menuActions: { control: 'array' },
    children: HIDE_CONTROL,
  },
  args: { menuActions: ['Action One', 'Action Two', 'Action Three'] },
} as const

type ActionArg = { menuActions: string[] }
export const BasicUsage: Story<
  typeof MenuButton,
  ActionArg & {
    labelFilled: string
    labelUnfilled: string
    labelDisabled: string
  }
> = ({ labelFilled, labelUnfilled, labelDisabled, menuActions }) => {
  const children = menuActions.map((a, i) => (
    <MenuButton.Item key={i} onSelect={action(a)}>
      {a}
    </MenuButton.Item>
  ))
  return (
    <div>
      <MenuButton label={labelFilled} variant="filled" marginRight="5px">
        {children}
      </MenuButton>
      <MenuButton label={labelUnfilled} variant="unfilled" marginRight="5px">
        {children}
      </MenuButton>
      <MenuButton label={labelDisabled} disabled>
        {children}
      </MenuButton>
    </div>
  )
}
BasicUsage.argTypes = { label: HIDE_CONTROL, disabled: HIDE_CONTROL, variant: HIDE_CONTROL }
BasicUsage.args = { labelFilled: 'Filled', labelUnfilled: 'Unfilled', labelDisabled: 'Disabled' }

export const WithLinks: Story<typeof MenuButton, ActionArg> = ({ menuActions, ...args }) => (
  <MenuButton {...args}>
    {menuActions.map((a, i) => (
      <MenuButton.Link key={i} href="#" onClick={stopNav} children={a} />
    ))}
  </MenuButton>
)
WithLinks.args = { label: 'Demo', menuActions: ['Link One', 'Link Two', 'Link Three'] }

WithLinks.storyName = 'with Links'
WithLinks.parameters = {
  beforeScreenshot: async (page: Page) => {
    await page.click('button')
  },
}

export const WithCollisions: Story<typeof MenuButton, ActionArg> = ({ menuActions, ...args }) => (
  <MenuButton {...args}>
    {menuActions.map((a, i) => (
      <MenuButton.Item key={i} onSelect={action(a)} children={a} />
    ))}
  </MenuButton>
)
WithCollisions.args = { label: 'Demo' }
WithCollisions.storyName = 'with Collisions'
WithCollisions.parameters = {
  cactus: {
    overrides: {
      height: '220vh',
      width: '220vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  storyshots: false,
}
