import React from 'react'

import { Button, Flex, Tag } from '../'
import { Action, actions, Story } from '../helpers/storybook'

const options = [
  {
    label: 'this',
    id: 'tag-1',
  },
  {
    label: 'is',
    id: 'tag-2',
  },
  {
    label: 'an',
    id: 'tag-3',
  },
  {
    label: 'example',
    id: 'tag-4',
  },
]

export default {
  title: 'Tag',
  component: Tag,
  argTypes: {
    ...actions('onCloseIconClick'),
    closeOption: { options: ['none', 'button', 'no-button'], mapping: { none: false } },
  },
} as const

type TagStory = Story<typeof Tag, { onCloseIconClick: Action<React.MouseEvent> }>
export const WithCloseOption: TagStory = ({ closeOption, onCloseIconClick }) => {
  const [values, setValues] = React.useState(options)

  const onClose = (event: React.MouseEvent) => {
    const removeId = event.currentTarget.getAttribute('aria-controls')
    setValues(values.filter((v) => v.id !== removeId))
  }
  const deleteTag = closeOption ? onCloseIconClick.wrap(onClose) : undefined
  return (
    <Flex justifyContent="center" alignItems="flex-start" flexDirection="column">
      <div>
        {values.map((e) => (
          <Tag closeOption={closeOption} id={e.id} key={e.id} onCloseIconClick={deleteTag}>
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
WithCloseOption.args = { closeOption: 'button' }
WithCloseOption.storyName = 'With close option'
