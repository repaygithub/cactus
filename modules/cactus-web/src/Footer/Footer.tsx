import PropTypes from 'prop-types'
import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import styled, { DefaultTheme, StyledComponent } from 'styled-components'

import { boxShadow } from '../helpers/theme'
import Link from '../Link/Link'
import { ScreenSizeContext, Size } from '../ScreenSizeProvider/ScreenSizeProvider'

interface FooterContextType {
  setMainContent: (content: React.ReactNode) => void
  addLink: (content: React.ReactNode, to: string) => void
}

interface LinkType {
  content: React.ReactNode
  to: string
}

interface FooterState {
  mainContent: React.ReactNode
  links: LinkType[]
  listView: boolean
  windowWidth: number
}

interface LinkContainerProps {
  isListView: boolean
}

interface LinkColProps {
  numCols: number
}

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
}

const FooterContext = createContext<FooterContextType>({
  setMainContent: (): void => {
    return
  },
  addLink: (): void => {
    return
  },
})

const LogoAndContentSection = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px 24px 16px 24px;

  img {
    margin-right: 16px;
    margin-bottom: 16px;
  }

  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.small} {
    flex-direction: row;
    justify-content: flex-start;

    img {
      margin-bottom: 0px;
    }
  }
`

const LinkSection = styled('div')`
  display: flex;
  justify-content: center;
  padding: 16px 24px 16px 24px;
  background-color: ${(p) => p.theme.colors.white};
`

const LinkContainer = styled('div')<LinkContainerProps>`
  ${(p) =>
    p.isListView &&
    `
  position: absolute;
  top: -9999px;
  left: -9999px;`}
`

const LinksColsContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.small} {
    flex-direction: row;
  }
`

const LinkCol = styled('div')<LinkColProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.small} {
    width: calc(100% / ${(p) => p.numCols});
  }
`

const Divider = styled('span')`
  height: 100%;
  width: 0px;
  border-left: 1px solid ${(p) => p.theme.colors.callToAction};
  margin-left: 16px;
  margin-right: 16px;
`

const NoWrapLink = styled(Link)`
  white-space: nowrap;
`

// Maps the screen size to a max number of columns for the links
const columnsMap: { [K in Size]: number } = {
  tiny: 1,
  small: 3,
  medium: 4,
  large: 6,
  extraLarge: 6,
}

// Divides array of links into smaller arrays of links for splitting them up in the list view
const divideLinks = (links: LinkType[], numCols: number): LinkType[][] => {
  const linksPerCol = Math.ceil(links.length / numCols)
  if (linksPerCol < 2) {
    return divideLinks(links, numCols - 1)
  } else {
    const dividedLinks = []
    while (links.length) {
      dividedLinks.push(links.splice(0, linksPerCol))
    }
    return dividedLinks
  }
}

const FooterBase = (props: FooterProps) => {
  const { src, className, children } = props
  const [state, setState] = useState<FooterState>({
    mainContent: '',
    links: [],
    listView: false,
    windowWidth:
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
  })
  const screenSize = useContext(ScreenSizeContext)

  const linkContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    window.addEventListener('resize', setWindowWidth)

    return () => {
      window.removeEventListener('resize', setWindowWidth)
    }
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (linkContainerRef.current instanceof HTMLElement) {
      const linksWidth = linkContainerRef.current.clientWidth
      const availableWidth = state.windowWidth - 48
      if (!state.listView && linkContainerRef.current instanceof HTMLElement) {
        if (linksWidth > availableWidth) {
          setState((state) => ({ ...state, listView: true }))
        }
      } else if (state.listView && linkContainerRef.current instanceof HTMLElement) {
        if (linksWidth < availableWidth) {
          setState((state) => ({ ...state, listView: false }))
        }
      }
    }
  })

  const setWindowWidth = () => {
    setState((state) => ({
      ...state,
      windowWidth:
        window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    }))
  }

  const setMainContent = (content: React.ReactNode) => {
    setState((state) => ({ ...state, mainContent: content }))
  }

  const addLink = (content: React.ReactNode, to: string) => {
    setState((state) => ({ ...state, links: [...state.links, { content, to }] }))
  }

  let dividedLinks: LinkType[][] | undefined = undefined
  if (state.listView) {
    dividedLinks = divideLinks([...state.links], columnsMap[screenSize.size])
  }

  return (
    <div className={className}>
      <FooterContext.Provider value={{ setMainContent, addLink }}>
        {children}
      </FooterContext.Provider>
      <LogoAndContentSection>
        {src && <img src={src} />}
        {state.mainContent !== '' && <div>{state.mainContent}</div>}
      </LogoAndContentSection>
      {state.links.length > 0 && (
        <LinkSection>
          <LinkContainer ref={linkContainerRef} isListView={state.listView}>
            {state.links.map((link: LinkType, index: number) => (
              <React.Fragment key={`no-list-link-${index}`}>
                <NoWrapLink to={link.to}>{link.content}</NoWrapLink>
                {index !== state.links.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </LinkContainer>
          {state.listView && dividedLinks !== undefined && (
            <LinksColsContainer>
              {dividedLinks.map((links: LinkType[], colIndex: number) => (
                <React.Fragment key={`link-col-${colIndex}`}>
                  <LinkCol numCols={dividedLinks ? dividedLinks.length : 1}>
                    {links.map((link: LinkType, linkIndex: number) => (
                      <Link key={`list-link-${linkIndex}`} to={link.to}>
                        {link.content}
                      </Link>
                    ))}
                  </LinkCol>
                  {dividedLinks !== undefined && colIndex !== dividedLinks.length - 1 && (
                    <Divider />
                  )}
                </React.Fragment>
              ))}
            </LinksColsContainer>
          )}
        </LinkSection>
      )}
    </div>
  )
}

interface MainSectionProps {
  children: React.ReactNode
}

export const MainSection = (props: MainSectionProps): React.ReactNode => {
  const { children } = props
  const { setMainContent } = useContext(FooterContext)
  useEffect(() => {
    setMainContent(children)
  }, [children]) // eslint-disable-line react-hooks/exhaustive-deps
  return <React.Fragment />
}

interface LinkProps {
  children: React.ReactNode
  to: string
}

export const FooterLink = (props: LinkProps): React.ReactNode => {
  const { children, to } = props
  const { addLink } = useContext(FooterContext)
  useEffect(() => {
    addLink(children, to)
  }, [children]) // eslint-disable-line react-hooks/exhaustive-deps
  return <React.Fragment />
}

export const Footer = styled(FooterBase)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  background-color: ${(p) => p.theme.colors.lightContrast};
  ${(p) => boxShadow(p.theme, 1)};
` as any

Footer.propTypes = {
  src: PropTypes.string,
}

MainSection.propTypes = {
  children: PropTypes.node.isRequired,
}

FooterLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

type FooterType = StyledComponent<typeof FooterBase, DefaultTheme, FooterProps> & {
  Main: React.ComponentType<MainSectionProps>
  Link: React.ComponentType<LinkProps>
}

Footer.Main = MainSection
Footer.Link = FooterLink

export default Footer as FooterType
