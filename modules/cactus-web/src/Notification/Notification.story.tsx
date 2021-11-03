import { Page } from 'puppeteer'
import React from 'react'

import { Alert, Button, Notification } from '../'
import { HIDE_CONTROL, Story } from '../helpers/storybook'

export default {
  title: 'Notification',
  component: Notification,
  parameters: { controls: { disable: true } },
} as const

export const BasicUsage: Story<typeof Notification, { closeTimeout: number }> = ({
  closeTimeout,
  ...args
}) => {
  const [open, setOpen] = React.useState<boolean>(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button id="open-notification" onClick={handleOpen}>
        Open Notification
      </Button>
      <Notification {...args} open={open}>
        <Alert status="error" onClose={handleClose} closeTimeout={closeTimeout}>
          Message
        </Alert>
      </Notification>
    </>
  )
}
BasicUsage.argTypes = {
  open: HIDE_CONTROL,
  closeTimeout: { name: 'Alert timeout (ms)' },
}
BasicUsage.args = {
  closeTimeout: 3000,
}
BasicUsage.parameters = {
  controls: { disable: false },
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
