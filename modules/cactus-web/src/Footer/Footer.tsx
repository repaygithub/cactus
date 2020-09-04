import PropTypes from 'prop-types'
import React, { createContext, useContext, useEffect, useState } from 'react'
import styled, { DefaultTheme, StyledComponent } from 'styled-components'

import { useSizeRef } from '../helpers/rect'
import { boxShadow, media } from '../helpers/theme'
import useId from '../helpers/useId'
import { useLayout } from '../Layout/Layout'
import Link from '../Link/Link'
import { ScreenSizeContext, Size } from '../ScreenSizeProvider/ScreenSizeProvider'

interface FooterContextType {
  addLink: (key: string, content: React.ReactNode, to: string) => void
}

interface LinkType {
  content: React.ReactNode
  to: string
}

interface LinkColProps {
  maxCols: number
}

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: string | React.ReactElement
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

  ${(p) => media(p.theme, 'small')} {
    flex-direction: row;
    justify-content: flex-start;
  }
`

const LogoWrapper = styled('div')`
  margin-bottom: 16px;

  ${(p) => media(p.theme, 'small')} {
    margin-right: 16px;
    margin-bottom: 0px;
  }
`

const ContentWrapper = styled('div')`
  max-width 100%;
`

const Img = styled('img')`
  max-width: 200px;
  max-height: 80px;
`

const LinksColsContainer = styled('div')`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: 16px 24px 16px 24px;
  background-color: ${(p) => p.theme.colors.white};

  ${(p) => media(p.theme, 'small')} {
    flex-direction: row;
  }
`

const LinkCol = styled('div')<LinkColProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  padding: 0 16px 0 16px;

  ${Link} {
    max-width: 100%;
  }

  ${(p) => media(p.theme, 'small')} {
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
  const { logo, className, children } = props
  const [links, setLinks] = useState(new Map<string, LinkType>())
  const screenSize = useContext(ScreenSizeContext)

  const addLink = (key: string, content: React.ReactNode, to: string) => {
    setLinks((links) => new Map(links.set(key, { content, to })))
  }

  const dividedLinks = divideLinks(Array.from(links.values()), columnsMap[screenSize.size])

  const [footerHeight, setHeight] = React.useState<number>(0)
  const heightCallback = React.useCallback(
    (footerRect: DOMRect) => setHeight(() => footerRect.height),
    [setHeight]
  )
  const sizeRef = useSizeRef<HTMLDivElement>(heightCallback)
  const position = screenSize.size === 'tiny' ? 'flow' : 'fixedBottom'
  useLayout('footer', { position, offset: footerHeight })

  return (
    <div ref={sizeRef} className={className}>
      <LogoAndContentSection>
        {logo && (
          <LogoWrapper>
            {typeof logo === 'string' ? <Img alt="Logo" src={logo} /> : logo}
          </LogoWrapper>
        )}
        <ContentWrapper>
          <FooterContext.Provider value={{ addLink }}>{children}</FooterContext.Provider>
        </ContentWrapper>
      </LogoAndContentSection>

      {links.size > 0 && (
        <LinksColsContainer>
          {dividedLinks.map((links: LinkType[], colIndex: number) => (
            <React.Fragment key={`link-col-${colIndex}`}>
              <LinkCol maxCols={dividedLinks.length}>
                {links.map((link: LinkType, linkIndex: number) => (
                  <Link key={`list-link-${linkIndex}`} to={link.to}>
                    {link.content}
                  </Link>
                ))}
              </LinkCol>
            </React.Fragment>
          ))}
        </LinksColsContainer>
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
  ${(p) => media(p.theme, 'small')} {
    position: fixed;
    left: 0;
    bottom: 0;
  }
`

const DefaultFooter = Footer as any
DefaultFooter.Link = FooterLink

Footer.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

FooterLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

type FooterType = StyledComponent<typeof FooterBase, DefaultTheme, FooterProps> & {
  Link: React.ComponentType<LinkProps>
}

export default DefaultFooter as FooterType
