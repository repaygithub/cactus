import React from 'react'

import { Button, Flex, Tag } from '../'
import { Action, actions, Story } from '../helpers/storybook'

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
  argTypes: actions('onCloseIconClick'),
} as const

type TagStory = Story<typeof Tag, { onCloseIconClick: Action<void> }>
export const WithCloseOption: TagStory = ({ closeOption, onCloseIconClick }) => {
  const [values, setValues] = React.useState(options)

  const deleteTag = (id: string) =>
    closeOption
      ? onCloseIconClick.wrap(() => setValues(values.filter((e) => e.id !== id)))
      : undefined
  return (
    <Flex justifyContent="center" alignItems="flex-start" flexDirection="column">
      <div>
        {values.map((e) => (
          <Tag closeOption={closeOption} id={e.id} key={e.id} onCloseIconClick={deleteTag(e.id)}>
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
WithCloseOption.args = { closeOption: true }
WithCloseOption.storyName = 'With close option'
