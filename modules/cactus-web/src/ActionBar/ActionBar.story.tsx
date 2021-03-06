import { ActionsGear, ActionsRedo, ActionsRefresh, ActionsUndo } from '@repay/cactus-icons'
import { boolean } from '@storybook/addon-knobs'
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { ActionBar, Flex, Layout, Link, Text } from '../'

function action(msg: string) {
  return () => console.log('ITEM CLICKED:', msg)
}

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
} as Meta

export const BasicUsage = (): React.ReactElement => {
  const hasItems = boolean('Has Items', true)
  return (
    <ActionBar>
      {hasItems && (
        <>
          <ActionBar.Item icon={<ActionsRedo />} aria-label="Redo" onClick={action('redo')} />
          <ActionBar.Item icon={<Undo />} aria-label="Undo" onClick={action('undo')} />
        </>
      )}
    </ActionBar>
  )
}

export const WithProvider = (): React.ReactElement => {
  const hasActionBar = boolean('Has ActionBar', true)
  return (
    <Layout>
      {hasActionBar && (
        <ActionBar>
          <ActionBar.Item
            id="gear"
            icon={<ActionsGear />}
            onClick={action('gear')}
            aria-label="Gear up"
          />
        </ActionBar>
      )}
      <Layout.Content>
        <SimpleRouter />
      </Layout.Content>
    </Layout>
  )
}
