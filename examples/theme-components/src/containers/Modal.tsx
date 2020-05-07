import React, { useState } from 'react'

import * as icons from '@repay/cactus-icons/i'
import { Button, Flex, Modal, SelectField, Text, TextInput } from '@repay/cactus-web'
import { ModalType } from '@repay/cactus-web/dist/Modal/Modal'
import { RouteComponentProps } from '@reach/router'
import Link from '../components/Link'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'

const ModalComponent: React.FC<RouteComponentProps> = () => {
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [icon, setIcon] = useState<IconName>('DescriptiveEnvelope')
  const [variant, setVariant] = useState<ModalType>('action')

  type IconName = keyof typeof icons
  const iconNames: IconName[] = Object.keys(icons).filter(e => e !== 'iconSizes') as IconName[]
  const Icon = icons[icon] as React.FunctionComponent
  const setIconName = (value: any) => {
    const name: IconName = value
    setIcon(name)
  }

  const setVariantName = (value: any) => {
    const name: ModalType = value
    setVariant(name)
  }

  return (
    <div>
      <Link to="/">
        <NavigationChevronLeft />
        Back
      </Link>
      <Text as="h1" textAlign="center">
        Modal
      </Text>
      <Flex justifyContent="center" margin="auto" mt="50px" width="30%">
        <Button onClick={() => setOpen1(true)} mr="5px">
          Simple
        </Button>
        {variant !== 'danger' && <Button onClick={() => setOpen2(true)}>With Text Input</Button>}
      </Flex>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexDirection="column"
        width="fit-content"
        margin="auto"
        mt="10px"
      >
        <SelectField
          label="Select variant"
          options={['action', 'danger']}
          name="variant"
          value={variant}
          onChange={(_, value) => setVariantName(value)}
          margin="0"
        />
        <SelectField
          label="Select Icon"
          options={iconNames}
          name="icons"
          value={icon}
          onChange={(_, value) => setIconName(value)}
        />
      </Flex>
      <Modal
        modalTitle="Modal Title"
        description="Modal Description"
        variant={variant}
        isOpen={open1}
        closeModal={() => setOpen1(false)}
        buttonText="Confirm Button"
        icon={Icon}
        modalLabel="Modal Label"
        closeLabel="Close Label"
        onClick={() => setOpen1(false)}
      />
      <Modal
        modalTitle="Modal Title"
        description="Modal Description"
        variant={variant}
        isOpen={open2}
        closeModal={() => setOpen2(false)}
        buttonText="Confirm Button"
        icon={Icon}
        modalLabel="Modal Label"
        closeLabel="Close Label"
        onClick={() => setOpen2(false)}
      >
        <TextInput width="70%" placeholder="placeholder" />
      </Modal>
    </div>
  )
}
export default ModalComponent
