import { Button, Flex, Modal, SelectField, Text } from '@repay/cactus-web'
import { ModalType } from '@repay/cactus-web/dist/Modal/Modal'
import { RouteComponentProps } from '@reach/router'
import Link from '../components/Link'
import NavigationChevronLeft from '@repay/cactus-icons/i/navigation-chevron-left'
import React, { useState } from 'react'

const ModalComponent: React.FC<RouteComponentProps> = () => {
  const [open, setOpen] = useState(false)
  const [variant, setVariant] = useState<ModalType>('default')

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
        <Button onClick={() => setOpen(true)} mr="5px">
          Simple
        </Button>
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
          options={['default', 'danger', 'warning', 'success']}
          name="variant"
          value={variant}
          onChange={(_, value) => setVariantName(value)}
          margin="0"
        />
      </Flex>
      <Modal
        variant={variant}
        isOpen={open}
        onClose={() => setOpen(false)}
        modalLabel="Modal Label"
        closeLabel="Close Label"
      >
        <Text>This is a Modal</Text>
      </Modal>
    </div>
  )
}
export default ModalComponent
