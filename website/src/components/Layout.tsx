import * as React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Motion, spring } from 'react-motion'
import { useRect } from '@reach/rect'
import cactusTheme from '@repay/cactus-theme'
import { IconButton } from '@repay/cactus-web'
import GlobalStyles from './GlobalStyles'
import Box from './Box'
import Menu from '@repay/cactus-icons/i/navigation-menu-lines'
import Close from '@repay/cactus-icons/i/navigation-close'
import { useStaticQuery, graphql, Link } from 'gatsby'
import storybooks from '../storybook-config.json'

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
        ],
      },
      {
        title: 'Storybooks',
        url: '/stories/',
        order: 1000, // always first
        items: storybooks.map(story => ({
          title: story.name,
          url: `/stories/${story.dirname}/`,
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
  console.log(group)

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

const BaseMenuList: React.FC<{ menu: MenuGroup; className?: string }> = ({ menu, className }) => (
  <ul className={className}>
    {menu.items.map(item => (
      <li key={item.url}>
        {isStorybookUrl(item.url) ? (
          <StyledA as="a" href={item.url}>
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
  const [isOpen, setOpen] = React.useState(false)
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
    <ThemeProvider theme={cactusTheme}>
      <>
        <GlobalStyles />
        <Motion style={{ width: spring(sidebarWidth, springConfig) }}>
          {({ width }) => {
            return (
              <div className={className}>
                <OuterSidebar aria-hidden={isOpen ? 'false' : 'true'} style={{ width }}>
                  <InnerSidebar ref={sidebarRef}>
                    <MenuList menu={groups} />
                  </InnerSidebar>
                </OuterSidebar>
                <Box
                  as={IconButton}
                  position="fixed"
                  top="8px"
                  fontSize="24px"
                  onClick={toggleOpen}
                  style={{ left: width + 8 }}
                >
                  {isOpen ? <Close /> : <Menu />}
                </Box>
                <Box p="16px 40px" style={{ marginLeft: width }}>
                  {children}
                </Box>
              </div>
            )
          }}
        </Motion>
      </>
    </ThemeProvider>
  )
}

export default styled(BaseLayout)``
