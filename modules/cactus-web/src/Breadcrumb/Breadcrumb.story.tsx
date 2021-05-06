import { array, text } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import { Page } from 'puppeteer'
import React, { ReactElement } from 'react'

import { Breadcrumb, Link } from '../'

export default {
  title: 'Breadcrumb',
  component: Breadcrumb,
} as Meta

export const BasicUsage = (): ReactElement => (
  <Breadcrumb>
    <Breadcrumb.Item href="/">{text('Label 1', 'Account')}</Breadcrumb.Item>
    <Breadcrumb.Active>{text('Label 2', 'Make a Payment')}</Breadcrumb.Active>
  </Breadcrumb>
)

const CustomLink: React.FC<{ className?: string; children: React.ReactNode; customTo: string }> = ({
  children,
  className,
  customTo,
}) => (
  <a style={{ color: 'pink' }} className={className} href={customTo}>
    {children}
  </a>
)

export const CustomItemElements = (): ReactElement => (
  <Breadcrumb>
    <Breadcrumb.Item as={CustomLink} customTo="/">
      {text('Label 1', 'Accounts')}
    </Breadcrumb.Item>
    <Breadcrumb.Item as={CustomLink} customTo="/">
      {text('Label 2', 'Account Details')}
    </Breadcrumb.Item>
    <Breadcrumb.Item as={CustomLink} customTo="/" active>
      {text('Label 3', 'Make a Payment')}
    </Breadcrumb.Item>
  </Breadcrumb>
)

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
    <Breadcrumb.Item as={Link} to="/">
      Make a Payment
    </Breadcrumb.Item>
  </Breadcrumb>
)
HugeListOfBreadcrumbs.storyName = 'A huge list of Breadcrumbs'

export const AddMoreBreadcrumbs = (): ReactElement => {
  const values = array('Add new Links', ['Link 1', 'Link 2', 'Link 3'])

  return (
    <Breadcrumb>
      {values.map(
        (e, i, arr): ReactElement =>
          arr.length - 1 === i ? (
            <Breadcrumb.Item href="/" active key={i}>
              {text(`Label ${i + 1}`, `${e}`)}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item href="/" key={i}>
              {text(`Label ${i + 1}`, `${e}`)}
            </Breadcrumb.Item>
          )
      )}
    </Breadcrumb>
  )
}

AddMoreBreadcrumbs.storyName = 'Add more Breadcrumbs'
AddMoreBreadcrumbs.parameters = { storyshots: false }
