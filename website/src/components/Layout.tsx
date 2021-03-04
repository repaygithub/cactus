import { Rect } from '@reach/rect'
import { Location, WindowLocation } from '@reach/router'
import { NavigationChevronLeft } from '@repay/cactus-icons'
import Close from '@repay/cactus-icons/i/navigation-close'
import Menu from '@repay/cactus-icons/i/navigation-hamburger'
import { Box, IconButton } from '@repay/cactus-web'
import { graphql, Link, useStaticQuery } from 'gatsby'
import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Motion, spring } from 'react-motion'
import styled, { css, FlattenInterpolation, ThemeProps } from 'styled-components'

import { ReactComponent as Cactus } from '../assets/cactus.svg'
import debounce from '../helpers/debounce'
import storybooks from '../storybook-config.json'
import { CactusProvider, CactusThemeWidget } from './CactusProvider'

interface MenuGroup {
  title: string
  url: string
  order?: number
  items: MenuGroup[]
}

interface MenuItem {
  title: string
  url: string
  order?: number
  routes: string[]
}

function sortGroup(group: MenuGroup): MenuGroup {
  group.items.sort((a, b): number => {
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

function addNode(group: MenuGroup, node: MenuItem): void {
  if (node.routes.length === 1) {
    if (node.routes[0] === '') {
      // skip root
      return
    }
    group.items.push({
      title: node.title,
      url: `${group.url}${node.routes[0]}/`,
      order: node.order || undefined,
      items: [],
    })
  } else {
    const route = node.routes.shift() + '/'
    const parent = group.items.find((g): boolean => g.url.endsWith(route))
    if (parent !== undefined) {
      addNode(parent, node)
    } else {
      console.error(`Could not find group for: `, node)
      console.log(`${route} not found among:`)
      group.items.forEach((g): void => console.log('\t' + g.url))
    }
  }
}

function createMenuGroups(pages: Edges<Markdown>): MenuGroup {
  const group: MenuGroup = {
    order: 1,
    title: '',
    url: '/',
    items: [
      {
        title: 'Style Guide',
        url: 'https://www.figma.com/proto/J9TeJ5homSkfSwV1sCFLoF/REPAY-STYLEGUIDE-V-1',
        // always first
        order: -1,
        items: [],
      },
      {
        title: 'Visual Hierarchy',
        url: '/visual-hierarchy/general-guidelines',
        order: 60,
        items: [
          {
            title: 'General Guidelines',
            url: '/visual-hierarchy/general-guidelines/',
            order: 70,
            items: [],
          },
          {
            title: 'Decision Tree',
            url: '/visual-hierarchy/decision-tree/',
            order: 80,
            items: [],
          },
          {
            title: 'Channels Case Study',
            url: '/visual-hierarchy/channels-case-study/',
            order: 90,
            items: [],
          },
        ],
      },
      {
        title: 'Storybooks',
        url: '/stories/',
        // always last
        order: 1000,
        items: storybooks.map((story): {
          title: string
          url: string
          order: number
          items: []
        } => ({
          title: story.name,
          // withPrefix because it's not a gatsby link
          url: `https://repaygithub.github.io/cactus/stories/${story.dirname}/`,
          order: 1,
          items: [],
        })),
      },
      {
        title: 'Tutorials',
        url: '/tutorials/',
        order: 100,
        items: [],
      },
      {
        title: 'How-to Guides',
        url: '/how-tos/',
        order: 101,
        items: [],
      },
      {
        title: 'Deep Dives',
        url: '/deep-dives/',
        order: 102,
        items: [],
      },
    ],
  }
  pages
    .slice()
    .map(
      ({
        node: {
          fields: { title, slug },
          frontmatter: { order },
        },
      }): MenuItem => ({
        title,
        url: slug,
        order,
        routes: slug.replace(/(^\/|\/$)/g, '').split('/'),
      })
    )
    .sort((a, b): number => a.routes.length - b.routes.length)
    .forEach((item): void => {
      addNode(group, item)
    })

  sortGroup(group)

  return group
}

interface MenuContextType {
  state: string[]
  open: (path: string) => void
  close: (path: string) => void
}
const MenuContext = React.createContext<MenuContextType>({
  state: [],
  open: (): void => {
    return
  },
  close: (): void => {
    return
  },
})

const initialize = (location: WindowLocation): (() => string[]) => (): string[] => {
  const state: string[] = []
  const split = location.pathname.split('/').filter(Boolean)
  for (let i = 0; i < split.length; ++i) {
    state.push('/' + split.slice(0, i).join('/') + '/')
  }
  return state
}

const MenuController: React.FC<{ location: WindowLocation }> = ({
  children,
  location,
}): React.ReactElement => {
  const [state, setState] = React.useState(initialize(location))
  const open = React.useCallback(
    (path): void => {
      setState((s): string[] => [...s, path])
    },
    [setState]
  )
  const close = React.useCallback(
    (path): void => {
      setState((s): string[] => s.filter((p): boolean => p !== path))
    },
    [setState]
  )

  return (
    <MenuContext.Provider value={{ state, open, close }}>
      <>{children}</>
    </MenuContext.Provider>
  )
}

const useMenu = (path: string): { isOpen: boolean; toggle: () => void } => {
  const context = React.useContext(MenuContext)
  const isOpen = context.state.includes(path)
  return {
    isOpen,
    toggle: (): void => (isOpen ? context.close(path) : context.open(path)),
  }
}

const StyledLink = styled(Link)`
  display: block;
  padding: 8px;
  color: ${(p): string => p.theme.colors.base};
  text-decoration: none;

  &[aria-current='page'] {
    background-color: ${(p): string => p.theme.colors.mediumContrast};
    color: ${(p): string => p.theme.colors.white};
  }

  &:hover {
    background-color: ${(p): string => p.theme.colors.base};
    color: ${(p): string => p.theme.colors.baseText};

    ~ ${IconButton} {
      color: ${(p): string => p.theme.colors.baseText};
    }
  }
`

const StyledA = StyledLink.withComponent('a')

const isStorybookUrl = (url: string): boolean => /stories\/[a-zA-Z]/.test(url)

const NavToggle = ({ toggle, ...rest }: any): React.ReactElement => (
  <IconButton {...rest} onClick={toggle} label="open section" iconSize="small">
    <NavigationChevronLeft />
  </IconButton>
)

const MenuItem: React.FC<{ item: MenuGroup }> = ({ item }): React.ReactElement => {
  const { isOpen, toggle } = useMenu(item.url)
  const hasChildren = item.items.length > 0

  return (
    <li>
      {isStorybookUrl(item.url) ? (
        <StyledA href={item.url}>{item.title}</StyledA>
      ) : (
        <StyledLink to={item.url} onClick={toggle}>
          {item.title}
        </StyledLink>
      )}
      {hasChildren && (
        <>
          <NavToggle aria-expanded={isOpen ? 'true' : 'false'} toggle={toggle} />
          {isOpen && (
            <MenuList>
              {item.items.map(
                (item): React.ReactElement => (
                  <MenuItem item={item} key={item.url} />
                )
              )}
            </MenuList>
          )}
        </>
      )}
    </li>
  )
}

const MenuList = styled('ul')`
  list-style: none;
  padding-left: 0;
  margin: 0;

  li {
    position: relative;
  }

  ${IconButton} {
    position: absolute;
    right: 12px;
    padding-left: 4px;
    padding-right: 4px;
    top: 0;
    height: 41px;

    &[aria-expanded='true'] {
      transform: rotate(-90deg);
    }
  }

  ${StyledLink} {
    padding-right: 28px;
  }

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

const Scrollable = styled.div`
  box-sizing: border-box;
  overflow-y: scroll;
  max-height: 100vh;
  margin-top: 43px;
`

const InnerSidebar = styled.nav`
  position: relative;
  float: right;
  min-width: 200px;
  height: 100%;
  background-color: ${(p): string => p.theme.colors.lightContrast};
  border-right: 2px solid ${(p): string => p.theme.colors.base};
`
const OuterSidebar = styled.div`
  position: fixed;
  height: 100vh;
  z-index: 52;
  top: 0;
  bottom: 0;
  overflow: hidden;
  background-color: ${(p): string => p.theme.colors.white};

  ::after {
    content: '';
    display: table;
    clear: both;
    height: 0px;
  }
`

const WindowBox = styled(Box)`
  max-width: 2000px;
  padding: 16px 40px;
  @media only screen and (max-width: 400px) {
    padding: 16px 10px;
  }
`

const RootLink = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: block;
  padding: ${(p): number => p.theme.space[3]}px;
  text-decoration: none;
  color: ${(p): string => p.theme.colors.base};
  background-color: ${(p): string => p.theme.colors.base};
  color: ${(p): string => p.theme.colors.baseText};
  font-weight: 600;

  &:hover,
  &:focus {
    color: ${(p): string => p.theme.colors.lightContrast};
  }
`

const CactusIcon = styled(Cactus).attrs({
  fill: 'currentColor',
})`
  height: 1em;
  vertical-align: -1px;
`

const Header = styled(Box)<{ isOverlayed?: boolean }>`
  position: fixed;

  ${(p: any): FlattenInterpolation<ThemeProps<any>> =>
    p.isOverlayed &&
    css`
      ${IconButton} {
        color: white;
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: ${(p): string => p.theme.colors.base};
        opacity: 0.5;
      }
    `}

  ${IconButton} {
    position: relative;
    z-index: 1;
  }
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: ${(p): string => p.theme.colors.base};
    opacity: 0.5;
  }
`

// defines spring for react-motion
const springConfig = { stiffness: 220, damping: 26 }
const checkShouldHaveOverlay = (): boolean => global.window && window.innerWidth < 1024

const BaseLayout: React.FC<{ className?: string; location: WindowLocation }> = ({
  children,
  className,
  location,
}): React.ReactElement => {
  const [isOpen, setOpen] = React.useState(global.window && global.window.innerWidth >= 1024)
  const toggleOpen = React.useCallback((): void => setOpen(!isOpen), [isOpen, setOpen])

  const [hasOverlay, setHasOverlay] = React.useState(checkShouldHaveOverlay)
  React.useEffect((): (() => void) => {
    const handleResize = debounce((): void => {
      setHasOverlay(checkShouldHaveOverlay())
    }, 200)
    window.addEventListener('resize', handleResize, false)
    return (): void => window.removeEventListener('resize', handleResize)
  }, [])

  React.useEffect((): void => {
    if (hasOverlay) {
      setOpen(false)
    }
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

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
  const groups = React.useMemo((): MenuGroup => createMenuGroups(pages), [pages])

  return (
    <React.Fragment>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=2.00"
        />
      </Helmet>
      <CactusProvider>
        <Rect observe={isOpen}>
          {({ rect, ref: sidebarRef }) => {
            const sidebarWidth = isOpen && rect ? rect.width : 0
            return (
              <Motion style={{ width: spring(sidebarWidth, springConfig) }}>
                {({ width }): React.ReactElement => {
                  return (
                    <div className={className}>
                      <Header
                        isOverlayed={isOpen && hasOverlay}
                        position="fixed"
                        top={0}
                        paddingTop={3}
                        zIndex={51}
                        width="100%"
                        backgroundColor="white"
                        style={{ paddingLeft: width + 8 }}
                      >
                        <IconButton
                          iconSize="medium"
                          onClick={toggleOpen}
                          label={isOpen ? 'close navigation menu' : 'open navigation menu'}
                        >
                          {isOpen ? <Close /> : <Menu />}
                        </IconButton>
                      </Header>
                      <OuterSidebar aria-hidden={isOpen ? 'false' : 'true'} style={{ width }}>
                        <InnerSidebar ref={sidebarRef}>
                          <RootLink to="/">
                            <CactusIcon /> Cactus DS
                          </RootLink>
                          <Scrollable>
                            <MenuController location={location}>
                              <MenuList>
                                {groups.items.map(
                                  (item): React.ReactElement => (
                                    <MenuItem key={item.url} item={item} />
                                  )
                                )}
                              </MenuList>
                            </MenuController>
                          </Scrollable>
                        </InnerSidebar>
                      </OuterSidebar>
                      <WindowBox style={{ marginLeft: hasOverlay ? 0 : width }}>
                        {children}
                      </WindowBox>
                      <CactusThemeWidget />
                      {hasOverlay && isOpen && <Overlay onClick={toggleOpen} />}
                    </div>
                  )
                }}
              </Motion>
            )
          }}
        </Rect>
      </CactusProvider>
    </React.Fragment>
  )
}

export default styled(
  (props): React.ReactElement => (
    <Location>
      {({ location }): React.ReactElement => <BaseLayout {...props} location={location} />}
    </Location>
  )
)``
