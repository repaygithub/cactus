import React from 'react'

import { Pagination } from '../'
import { Action, actions, HIDE_CONTROL, Story } from '../helpers/storybook'
import { PageLinkProps } from './Pagination'

export default {
  title: 'Pagination',
  component: Pagination,
  argTypes: {
    currentPage: HIDE_CONTROL,
    makeLinkLabel: HIDE_CONTROL,
    disabled: { control: 'boolean' },
    ...actions('onPageChange'),
  },
} as const

const stop = (handler: any) => (e: React.MouseEvent) => {
  e.preventDefault()
  handler()
}
const LinkWithHref = ({ page, disabled, onClick, ...props }: PageLinkProps) => (
  <a aria-disabled={disabled} href={`#${page}`} onClick={stop(onClick)} {...props} />
)

type PStory = Story<typeof Pagination, { onPageChange: Action<number> }>
export const BasicUsage: PStory = ({ onPageChange, ...args }) => {
  const [current, setCurrent] = React.useState(1)
  return <Pagination {...args} currentPage={current} onPageChange={onPageChange.wrap(setCurrent)} />
}
BasicUsage.args = { pageCount: 10, width: 'inherit' }
BasicUsage.argTypes = {
  linkAs: { options: ['link', 'button'], mapping: { link: LinkWithHref } },
}
