import * as React from 'react'

import { Box, IconButton, StyleProvider } from '@repay/cactus-web'
import { graphql, Link, useStaticQuery, withPrefix } from 'gatsby'
import { Motion, spring } from 'react-motion'
import { useRect } from '@reach/rect'
import Close from '@repay/cactus-icons/i/navigation-close'
import Helmet from 'react-helmet'
import Menu from '@repay/cactus-icons/i/navigation-hamburger'
import storybooks from '../storybook-config.json'
import styled from 'styled-components'

interface MenuGroup {
  title: string
  url: string
  order: number
  items: MenuGroup[]
}

interface MenuItem {
  title: string
  url: string
  order?: number
  routes: string[]
}

function sortGroup(group: MenuGroup) {
  group.items.sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      return a.order - b.order
    } else if (typeof a.order === 'number') {
      return -1
    } else if (typeof b.order === 'number') {
      return 1
    } else if (a.title < b.title) {
      return -1
    } else if (b.title < a.title) {
      return 1
    }
    return 0
  })
  group.items.forEach(sortGroup)
  return group
}

function addNode(group: MenuGroup, node: MenuItem) {
  if (node.routes.length === 1) {
    if (node.routes[0] === '') {
      // skip root
      return
    }
    group.items.push({
      title: node.title,
      url: `${group.url}${node.routes[0]}/`,
      order: node.order || group.items.length + 1,
      items: [],
    })
  } else {
    const route = node.routes.shift() + '/'
    const parent = group.items.find(g => g.url.endsWith(route))
    if (parent !== undefined) {
      addNode(parent, node)
    } else {
      console.error(`Could not find group for: `, node)
      console.log(`${route} not found among:`)
      group.items.forEach(g => console.log('\t' + g.url))
    }
  }
}

function createMenuGroups(pages: Edges<Markdown>) {
  let group: MenuGroup = {
    order: 1,
    title: '',
    url: '/',
    items: [
      {
        title: 'Design System',
        url: '/design-system/',
        order: -1, // always first
        items: [
          { title: 'Language', url: '/design-system/language/', order: 0, items: [] },
          { title: 'Foundation', url: '/design-system/foundation/', order: 10, items: [] },
          { title: 'Color', url: '/design-system/color/', order: 20, items: [] },
          { title: 'Typography', url: '/design-system/typography/', order: 30, items: [] },
          { title: 'Icons', url: '/design-system/icons/', order: 40, items: [] },
          { title: 'Shared Styles', url: '/design-system/shared-styles/', order: 50, items: [] },
        ],
      },
      {
        title: 'Storybooks',
        url: '/stories/',
        order: 1000, // always first
        items: storybooks.map(story => ({
          title: story.name,
          url: withPrefix(`/stories/${story.dirname}/`),
          order: 1,
          items: [],
        })),
      },
    ],
  }
  pages
    .slice()
    .map(
      ({
        node: {
          fields: { title, slug },
        },
      }): MenuItem => ({
        title,
        url: slug,
        routes: slug.replace(/(^\/|\/$)/g, '').split('/'),
      })
    )
    .sort((a, b) => a.routes.length - b.routes.length)
    .forEach(item => {
      addNode(group, item)
    })

  sortGroup(group)

  return group
}

const StyledLink = styled(Link)`
  display: block;
  padding: 8px;
  color: ${p => p.theme.colors.base};
  text-decoration: none;

  &[aria-current='page'] {
    background-color: ${p => p.theme.colors.lightContrast};
  }

  :hover {
    background-color: ${p => p.theme.colors.base};
    color: ${p => p.theme.colors.baseText};
  }
`

const StyledA = StyledLink.withComponent('a')

const isStorybookUrl = (url: string) => url.includes('/stories/')
const forceLocationReload = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
  event.preventDefault()
  const href = event.currentTarget.getAttribute('href')
  global.window && href !== null && href !== '' && (global.window.location.href = href)
}

const BaseMenuList: React.FC<{ menu: MenuGroup; className?: string }> = ({ menu, className }) => (
  <ul className={className}>
    {menu.items.map(item => (
      <li key={item.url}>
        {isStorybookUrl(item.url) ? (
          <StyledA href={item.url} onClick={forceLocationReload}>
            {item.title}
          </StyledA>
        ) : (
          <StyledLink to={item.url}>{item.title}</StyledLink>
        )}
        {item.items.length > 0 && <MenuList menu={item} />}
      </li>
    ))}
  </ul>
)

const MenuList = styled(BaseMenuList)`
  list-style: none;
  padding-left: 0;

  & & ${StyledLink} {
    padding-left: 24px;
  }

  & & & ${StyledLink} {
    padding-left: 48px;
  }

  & & & & ${StyledLink} {
    padding-left: 64px;
  }
`

const PositionableIconButton = Box.withComponent(IconButton)

const InnerSidebar = styled.div`
  float: right;
  min-width: 200px;
  height: 100%;
  padding-top: 8px;
  background-color: ${p => p.theme.colors.background};
  border-right: 2px solid ${p => p.theme.colors.base};
  overflow-y: scroll;
`
const OuterSidebar = styled.div`
  position: fixed;
  height: 100vh;
  top: 0;
  bottom: 0;
  overflow: hidden;
  background-color: ${p => p.theme.colors.background};

  ::after {
    content: '';
    display: table;
    clear: both;
    height: 0px;
  }
`

const springConfig = { stiffness: 220, damping: 26 }

const BaseLayout: React.FC<{ className?: string }> = ({ children, className }) => {
  // TODO default open should depend on window width
  const [isOpen, setOpen] = React.useState(global.window && global.window.innerWidth >= 1024)
  const toggleOpen = React.useCallback(() => setOpen(!isOpen), [isOpen, setOpen])
  const sidebarRef = React.createRef<HTMLDivElement>()
  const rect = useRect(sidebarRef)
  const sidebarWidth = isOpen && rect ? rect.width : 0

  const {
    allMdx: { edges: pages },
  } = useStaticQuery(graphql`
    {
      allMdx {
        edges {
          node {
            id
            parent {
              ... on File {
                name
                sourceInstanceName
              }
            }
            fields {
              title
              slug
            }
            frontmatter {
              order
            }
          }
        }
      }
    }
  `)
  let groups = React.useMemo(() => createMenuGroups(pages), [pages])
  return (
    <React.Fragment>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.00, minimum-scale=1.00, maximum-scale=2.00"
        />
      </Helmet>
      <StyleProvider global>
        <Motion style={{ width: spring(sidebarWidth, springConfig) }}>
          {({ width }) => {
            return (
              <div className={className}>
                <OuterSidebar aria-hidden={isOpen ? 'false' : 'true'} style={{ width }}>
                  <InnerSidebar ref={sidebarRef}>
                    <MenuList menu={groups} />
                  </InnerSidebar>
                </OuterSidebar>
                <PositionableIconButton
                  position="fixed"
                  top="8px"
                  iconSize="medium"
                  onClick={toggleOpen}
                  style={{ left: width + 8 }}
                >
                  {isOpen ? <Close /> : <Menu />}
                </PositionableIconButton>
                <Box maxWidth="2000px" p="16px 40px" style={{ marginLeft: width }}>
                  {children}
                </Box>
              </div>
            )
          }}
        </Motion>
      </StyleProvider>
    </React.Fragment>
  )
}

export default styled(BaseLayout)``
