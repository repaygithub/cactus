import { boolean } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import React from 'react'

import Tag from './Tag'

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

storiesOf('Tag', module).add(
  'Basic usage',
  (): React.ReactElement => {
    const [values, setValues] = React.useState(options)

    const deleteTag = (id: string) => {
      setValues(values.filter((e) => e.id !== id))
    }
    return (
      <div>
        {values.map((e) => (
          <Tag
            closeOption={boolean('close option', true)}
            id={e.id}
            key={e.id}
            onCloseIconClick={() => deleteTag(e.id)}
          >
            {e.label}
          </Tag>
        ))}
      </div>
    )
  }
)
