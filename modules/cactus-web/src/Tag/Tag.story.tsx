import { boolean } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { Button, Flex, Tag } from '../'

const options = [
  {
    label: 'this',
    id: '1',
  },
  {
    label: 'is',
    id: '2',
  },
  {
    label: 'an',
    id: '3',
  },
  {
    label: 'example',
    id: '4',
  },
]

export default {
  title: 'Tag',
  component: Tag,
} as Meta

export const WithCloseOption = (): React.ReactElement => {
  const [values, setValues] = React.useState(options)

  const deleteTag = (id: string) => {
    setValues(values.filter((e) => e.id !== id))
  }
  const closeOption = boolean('close option', true)
  return (
    <Flex justifyContent="center" flexDirection="column">
      <div>
        {values.map((e) => (
          <Tag
            closeOption={closeOption}
            id={e.id}
            key={e.id}
            onCloseIconClick={closeOption ? () => deleteTag(e.id) : undefined}
          >
            {e.label}
          </Tag>
        ))}
      </div>
      {closeOption && (
        <Button variant="action" onClick={() => setValues(options)} mt="50px">
          Reset Tags
        </Button>
      )}
    </Flex>
  )
}

WithCloseOption.storyName = 'With close option'
