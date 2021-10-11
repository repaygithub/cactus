import { ActionsGear, ActionsRedo, ActionsRefresh, ActionsUndo } from '@repay/cactus-icons'
import React from 'react'

import { ActionBar, Flex, Layout, Link, Text } from '../'
import { actions, ActionWrap, Story } from '../helpers/storybook'

const Undo = () => (
  <Flex flexDirection="column" alignItems="center">
    <ActionsUndo />
    <Text as="span" textStyle="tiny">
      Undo
    </Text>
  </Flex>
)

const SimpleRouter = () => {
  const [page, setPage] = React.useState<1 | 2>(1)
  const [refreshCount, setCount] = React.useState<number>(0)
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setPage((p) => (p === 1 ? 2 : 1))
  }
  if (page === 1) {
    return (
      <Flex alignItems="center" justifyContent="center">
        <Link to="#page2" onClick={onClick}>
          Go to page 2
        </Link>
      </Flex>
    )
  }
  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column">
      <ActionBar.Item
        id="refresh"
        icon={<ActionsRefresh />}
        aria-label="Refresh"
        orderHint="high"
        onClick={() => setCount((c) => c + 1)}
      />
      <Link to="#page1" onClick={onClick}>
        Go to page 1
      </Link>
      <Text>Page refreshed {refreshCount} times.</Text>
    </Flex>
  )
}

export default {
  title: 'ActionBar',
  component: ActionBar,
  argTypes: actions({ name: 'onClick', wrapper: true }),
} as const

type ClickArg = { onClick: ActionWrap<React.MouseEvent> }
export const BasicUsage: Story<ClickArg & { hasItems: boolean }> = ({ hasItems, onClick }) => (
  <ActionBar>
    {hasItems && (
      <>
        <ActionBar.Item icon={<ActionsRedo />} aria-label="Redo" onClick={onClick('redo')} />
        <ActionBar.Item icon={<Undo />} aria-label="Undo" onClick={onClick('undo')} />
      </>
    )}
  </ActionBar>
)
BasicUsage.argTypes = { hasItems: { name: 'Has Items' } }
BasicUsage.args = { hasItems: true }

export const WithProvider: Story<ClickArg & { hasActionBar: boolean }> = ({
  hasActionBar,
  onClick,
}) => (
  <Layout>
    {hasActionBar && (
      <ActionBar>
        <ActionBar.Item
          id="gear"
          icon={<ActionsGear />}
          onClick={onClick('gear')}
          aria-label="Gear up"
        />
      </ActionBar>
    )}
    <Layout.Content>
      <SimpleRouter />
    </Layout.Content>
  </Layout>
)
WithProvider.argTypes = { hasActionBar: { name: 'Has ActionBar' } }
WithProvider.args = { hasActionBar: true }
