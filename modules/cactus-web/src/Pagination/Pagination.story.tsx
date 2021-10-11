import React from 'react'

import { Pagination } from '../'
import { Action, actions, HIDE_CONTROL, Story } from '../helpers/storybook'

export default {
  title: 'Pagination',
  component: Pagination,
  argTypes: {
    currentPage: HIDE_CONTROL,
    linkAs: HIDE_CONTROL,
    makeLinkLabel: HIDE_CONTROL,
    ...actions('onPageChange'),
  },
} as const

type PStory = Story<typeof Pagination, { onPageChange: Action<number> }>
export const BasicUsage: PStory = ({ onPageChange, ...args }) => {
  const [current, setCurrent] = React.useState(1)
  return <Pagination {...args} currentPage={current} onPageChange={onPageChange.wrap(setCurrent)} />
}
BasicUsage.args = { pageCount: 10 }
