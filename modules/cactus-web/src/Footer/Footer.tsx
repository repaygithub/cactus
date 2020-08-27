import PropTypes from 'prop-types'
import React, { createContext, useContext, useEffect, useState } from 'react'
import styled, { DefaultTheme, StyledComponent } from 'styled-components'

import { boxShadow } from '../helpers/theme'
import useId from '../helpers/useId'
import Link from '../Link/Link'
import { ScreenSizeContext, Size } from '../ScreenSizeProvider/ScreenSizeProvider'

interface FooterContextType {
  addLink: (key: string, content: React.ReactNode, to: string) => void
}

interface LinkType {
  content: React.ReactNode
  to: string
}

interface FooterState {
  links: LinkType[]
}

interface LinkColProps {
  maxCols: number
}

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: string | React.ComponentType<any>
}

const FooterContext = createContext<FooterContextType>({
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

  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.small} {
    flex-direction: row;
    justify-content: flex-start;
  }
`

const LogoWrapper = styled('div')`
  margin-bottom: 16px;

  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.small} {
    margin-right: 16px;
    margin-bottom: 0px;
  }
`

const Img = styled('img')`
  width: 138px;
  height: 40px;
`

const LinkSection = styled('div')`
  display: flex;
  justify-content: center;
  padding: 16px 24px 16px 24px;
  background-color: ${(p) => p.theme.colors.white};
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
  justify-content: center;
  height: 100%;
  flex-grow: 1;

  ${(p) => p.theme.mediaQueries && p.theme.mediaQueries.small} {
    max-width: calc(100% / ${(p) => p.maxCols});
  }

  border-right: 1px solid ${(p) => p.theme.colors.callToAction};

  &:last-of-type {
    border-right: none;
  }
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
const divideLinks = (links: LinkType[], maxCols: number): LinkType[][] => {
  const divided = []
  const numPerCol = Math.floor(links.length / maxCols)
  const extra = links.length % maxCols
  for (let i = 0, linkIndex = 0; i < maxCols && linkIndex < links.length; i++) {
    const start = linkIndex
    linkIndex += numPerCol
    divided[i] = links.slice(start, linkIndex)
    if (i < extra) {
      divided[i].push(links[linkIndex++])
    }
  }
  return divided
}

const FooterBase = (props: FooterProps) => {
  const { logo: Logo, className, children } = props
  const [links, setLinks] = useState(new Map<string, LinkType>())
  const screenSize = useContext(ScreenSizeContext)

  const addLink = (key: string, content: React.ReactNode, to: string) => {
    setLinks((links) => new Map(links.set(key, { content, to })))
  }

  const dividedLinks = divideLinks(Array.from(links.values()), columnsMap[screenSize.size])

  return (
    <div className={className}>
      <LogoAndContentSection>
        {Logo && (
          <LogoWrapper>{typeof Logo === 'string' ? <Img src={Logo} /> : <Logo />}</LogoWrapper>
        )}
        <div>
          <FooterContext.Provider value={{ addLink }}>{children}</FooterContext.Provider>
        </div>
      </LogoAndContentSection>

      {links.size > 0 && (
        <LinkSection>
          <LinksColsContainer>
            {dividedLinks.map((links: LinkType[], colIndex: number) => (
              <React.Fragment key={`link-col-${colIndex}`}>
                <LinkCol maxCols={columnsMap[screenSize.size]}>
                  {links.map((link: LinkType, linkIndex: number) => (
                    <Link key={`list-link-${linkIndex}`} to={link.to}>
                      {link.content}
                    </Link>
                  ))}
                </LinkCol>
              </React.Fragment>
            ))}
          </LinksColsContainer>
        </LinkSection>
      )}
    </div>
  )
}

interface LinkProps {
  children: React.ReactNode
  to: string
}

export const FooterLink = (props: LinkProps): React.ReactNode => {
  const { children, to } = props
  const { addLink } = useContext(FooterContext)
  const key = useId()
  useEffect(() => {
    addLink(key, children, to)
  }, [children, to]) // eslint-disable-line react-hooks/exhaustive-deps
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

FooterLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

type FooterType = StyledComponent<typeof FooterBase, DefaultTheme, FooterProps> & {
  Link: React.ComponentType<LinkProps>
}

Footer.Link = FooterLink

export default Footer as FooterType
