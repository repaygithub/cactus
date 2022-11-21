import { addons, types } from '@storybook/addons'
import React, { useEffect } from 'react'

import { Box, StyleProvider } from '../../../modules/cactus-web/src'

const Docs = ({ api, active }) => {
  const [DocsContent, setDocsContent] = React.useState(undefined)
  const storyData = api.getCurrentStoryData()
  const type = storyData?.type
  const docsPath = storyData?.parameters?.docsPath

  useEffect(() => {
    // Docs that aren't associated with a component/story appear to have the docs type somehow
    if (type === 'docs') setDocsContent(undefined)
  }, [type])

  if (!!docsPath) {
    import(`../../../modules/cactus-web/src/${docsPath}`).then((res) => {
      setDocsContent(() => res.default)
    })
  }

  return DocsContent && active ? (
    <StyleProvider global>
      <Box padding={4} backgroundColor="white">
        <DocsContent />
      </Box>
    </StyleProvider>
  ) : null
}

addons.register('addon-docs/tab', async (api) => {
  addons.add('addon-docs/tab', {
    type: types.TAB,
    title: 'Docs',
    //👇 Checks the current route for the story
    route: ({ storyId, refId }) => (refId ? `/docstab/${refId}_${storyId}` : `/docstab/${storyId}`),
    //👇 Shows the Tab UI element in docstab view mode
    match: ({ viewMode }) => {
      return viewMode === 'docstab'
    },
    render: ({ active }) => <Docs api={api} active={active} />,
  })
})
