import { Page } from 'puppeteer'
import React, { ReactElement } from 'react'

import { Breadcrumb, Link } from '../'
import { HIDE_CONTROL, Story } from '../helpers/storybook'

export default {
  title: 'Breadcrumb',
  component: Breadcrumb,
  argTypes: { className: HIDE_CONTROL },
} as const

interface Args {
  items: string[]
  activeItem: string
}
export const BasicUsage: Story<Args> = ({ items, activeItem }) => (
  <Breadcrumb>
    {items.map((item, ix) => (
      <Breadcrumb.Item key={ix} href="/">
        {item}
      </Breadcrumb.Item>
    ))}
    <Breadcrumb.Active>{activeItem}</Breadcrumb.Active>
  </Breadcrumb>
)
BasicUsage.args = { items: ['Account'], activeItem: 'Make a Payment' }

const CustomLink: React.FC<{ className?: string; children: React.ReactNode; customTo: string }> = ({
  children,
  className,
  customTo,
}) => (
  <a style={{ color: 'pink' }} className={className} href={customTo}>
    {children}
  </a>
)

export const CustomItemElements: Story<Args> = ({ items, activeItem }) => (
  <Breadcrumb>
    {items.map((item, ix) => (
      <Breadcrumb.Item key={ix} as={CustomLink} customTo="/">
        {item}
      </Breadcrumb.Item>
    ))}
    <Breadcrumb.Item as={CustomLink} customTo="/" active>
      {activeItem}
    </Breadcrumb.Item>
  </Breadcrumb>
)
CustomItemElements.args = { items: ['Accounts', 'Account Details'], activeItem: 'Make a Payment' }

CustomItemElements.parameters = {
  beforeScreenshot: async (page: Page) => {
    const innerWidth = await page.evaluate(() => window.innerWidth)
    if (innerWidth <= 375) {
      const [button] = await page.$x("//button[contains(., '...')]")
      if (button) {
        await button.click()
      }
    }
  },
}

export const HugeListOfBreadcrumbs = (): ReactElement => (
  <Breadcrumb>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => (
      <Breadcrumb.Item key={i} href="/">{`label ${i}`}</Breadcrumb.Item>
    ))}
    <Breadcrumb.Item as={Link} href="/">
      Make a Payment
    </Breadcrumb.Item>
  </Breadcrumb>
)
HugeListOfBreadcrumbs.storyName = 'A huge list of Breadcrumbs'
HugeListOfBreadcrumbs.parameters = { controls: { disable: true } }
