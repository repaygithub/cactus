import React, { useState } from 'react'

import * as icons from '@repay/cactus-icons/i'
import { actions } from '@storybook/addon-actions'
import { select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import Button from '../Button/Button'
import Modal, { ModalType } from './Modal'
import TextInput from '../TextInput/TextInput'

const modalSotries = storiesOf('Modal', module)
const eventLoggers = actions('onChange')

type StatusOptions = { [k in ModalType]: ModalType }
type IconName = keyof typeof icons
const iconNames: IconName[] = Object.keys(icons) as IconName[]

const statusOptions: StatusOptions = {
  action: 'action',
  danger: 'danger',
}

const ModalWithState = () => {
  const [open, setOpen] = useState(true)

  const iconName: IconName = select('icon', iconNames, 'DescriptiveEnvelope')
  const Icon = icons[iconName] as React.FunctionComponent
  const title = text('title', 'Modal Title')
  const description = text('description', 'Modal Description')
  const variant = select('variant', statusOptions, statusOptions.action)
  const buttonText = text('Button Text', 'Confirm')
  const width = text('Width', '30%')
  const height = text('Height', '')
  const modalLabel = text('Modal Label', 'Modal Label')
  const closeLabel = text('Close icon label', 'Close Label')

  return open ? (
    <Modal
      modalTitle={title}
      description={description}
      variant={variant}
      isOpen={open}
      closeModal={() => setOpen(false)}
      buttonText={buttonText}
      icon={Icon}
      width={width}
      height={height}
      modalLabel={modalLabel}
      closeLabel={closeLabel}
    />
  ) : (
    <Button variant="action" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  )
}
const ModalWithTextInput = () => {
  const [open, setOpen] = useState(true)
  const iconName: IconName = select('icon', iconNames, 'DescriptiveEnvelope')
  const Icon = icons[iconName] as React.FunctionComponent
  const title = text('title', 'Modal Title')
  const description = text('description', 'Modal Description')
  const variant = select('variant', statusOptions, statusOptions.action)
  const buttonText = text('Button Text', 'Confirm')
  const width = text('Width', '30%')
  const height = text('Height', '')
  const modalLabel = text('Modal Label', 'Modal Label')
  const closeLabel = text('Close icon label', 'Close Label')

  return open ? (
    <Modal
      modalTitle={title}
      description={description}
      variant={variant}
      isOpen={open}
      closeModal={() => setOpen(false)}
      buttonText={buttonText}
      icon={Icon}
      width={width}
      height={height}
      modalLabel={modalLabel}
      closeLabel={closeLabel}
    >
      <TextInput width="70%" placeholder={text('placeholder', 'Placeholder')} {...eventLoggers} />
    </Modal>
  ) : (
    <Button variant="action" onClick={() => setOpen(true)}>
      Open Modal
    </Button>
  )
}
modalSotries.add('Basic Usage', () => <ModalWithState />)

modalSotries.add('With TextInput', () => <ModalWithTextInput />)
