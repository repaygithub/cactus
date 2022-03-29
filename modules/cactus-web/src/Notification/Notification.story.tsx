import { Page } from 'puppeteer'
import React from 'react'

import {
  Alert,
  Box,
  Button,
  Notification,
  NotificationProvider,
  RadioGroup,
  TextAreaField,
  TextInputField,
  ToggleField,
  useNotifications,
} from '../'
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

const FIELDS = ['message', 'status', 'vertical', 'horizontal', 'closeTimeout']

const AddNotificationForm = () => {
  const { setNotification, clearNotification } = useNotifications()
  const keysRef = React.useRef<React.Key[]>([])

  const addNotification = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const args: any = { canClose: event.currentTarget['canClose'].checked }
    for (const field of FIELDS) {
      const element = event.currentTarget[field]
      if (element.value) {
        args[field] = element.value
      }
    }
    if (args.closeTimeout) args.closeTimeout = parseInt(args.closeTimeout) * 1000
    keysRef.current.push(setNotification(args))
  }

  const clearAll = () => {
    keysRef.current.forEach(clearNotification)
    keysRef.current = []
  }
  return (
    <Box as="form" maxWidth="300px" onSubmit={addNotification}>
      <TextAreaField name="message" label="Notification Content" />
      <RadioGroup name="status" label="Status" defaultValue="info">
        <RadioGroup.Button label="Info" value="info" />
        <RadioGroup.Button label="Error" value="error" />
        <RadioGroup.Button label="Warning" value="warning" />
        <RadioGroup.Button label="Success" value="success" />
      </RadioGroup>
      <RadioGroup name="vertical" label="Vertical Position" defaultValue="">
        <RadioGroup.Button label="(default)" value="" />
        <RadioGroup.Button label="Top" value="top" />
        <RadioGroup.Button label="Bottom" value="bottom" />
      </RadioGroup>
      <RadioGroup name="horizontal" label="Horizontal Position" defaultValue="">
        <RadioGroup.Button label="(default)" value="" />
        <RadioGroup.Button label="Left" value="left" />
        <RadioGroup.Button label="Center" value="center" />
        <RadioGroup.Button label="Right" value="right" />
      </RadioGroup>
      <ToggleField name="canClose" label="Can Close Notification" defaultChecked />
      <TextInputField name="closeTimeout" type="number" step="1" label="Auto-close Timeout (s)" />
      <Box my={4}>
        <Button type="reset">Reset Form</Button>
        <Button type="submit" variant="action">
          Create
        </Button>
      </Box>
      <Button onClick={clearAll}>Clear Notifications</Button>
    </Box>
  )
}

export const WithProvider = (): React.ReactElement => (
  <NotificationProvider>
    <AddNotificationForm />
  </NotificationProvider>
)
