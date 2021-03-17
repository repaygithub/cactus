import { select } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import { Page } from 'puppeteer'
import React from 'react'

import Alert from '../Alert/Alert'
import Button from '../Button/Button'
import Notification from './Notification'

export default {
  title: 'Notification',
  component: Notification,
} as Meta

export const BasicUsage = (): React.ReactElement => {
  const [open, setOpen] = React.useState<boolean>(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const vertical: 'top' | 'bottom' = select('vertical', ['top', 'bottom'], 'bottom')
  const horizontal: 'left' | 'center' | 'right' = select(
    'horizontal',
    ['left', 'center', 'right'],
    'right'
  )

  return (
    <>
      <Button id="open-notification" onClick={handleOpen}>
        Open Notification
      </Button>
      <Notification open={open} vertical={vertical} horizontal={horizontal}>
        <Alert status="error" onClose={handleClose}>
          Message
        </Alert>
      </Notification>
    </>
  )
}

BasicUsage.parameters = {
  beforeScreenshot: async (page: Page) => {
    await page.click('#open-notification')
  },
}

export const TopLeft = (): React.ReactElement => {
  return (
    <Notification open vertical="top" horizontal="left">
      <Alert status="error">Message</Alert>
    </Notification>
  )
}

export const TopCenter = (): React.ReactElement => {
  return (
    <Notification open vertical="top" horizontal="center">
      <Alert status="error">Message</Alert>
    </Notification>
  )
}

export const TopRight = (): React.ReactElement => {
  return (
    <Notification open vertical="top" horizontal="right">
      <Alert status="error">Message</Alert>
    </Notification>
  )
}

export const BottomLeft = (): React.ReactElement => {
  return (
    <Notification open vertical="bottom" horizontal="left">
      <Alert status="error">Message</Alert>
    </Notification>
  )
}

export const BottomCenter = (): React.ReactElement => {
  return (
    <Notification open vertical="bottom" horizontal="center">
      <Alert status="error">Message</Alert>
    </Notification>
  )
}
