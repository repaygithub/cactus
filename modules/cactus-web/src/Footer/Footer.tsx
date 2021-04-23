import PropTypes from 'prop-types'
import React, { createContext, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { boxShadow, textStyle } from '../helpers/theme'
import useId from '../helpers/useId'
import { useLayout } from '../Layout/Layout'
import Link from '../Link/Link'
import { ScreenSizeContext, Size, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'

type LinkMap = Map<string, typeof Link>
type FooterContextType = (u: (s: LinkMap) => LinkMap) => void

interface LinkColProps {
  maxCols: number
}

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: string | React.ReactElement
}

const FooterContext = createContext<FooterContextType | undefined>(undefined)

const LogoWrapper = styled('div')`
  padding: 16px 24px;
  -ms-grid-column: 1;
  -ms-grid-row: 1;
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 2;
  &,
  * {
    display: block;
    max-width: 200px;
    max-height: 40px;
  }
`

const gridCell2 = `
  -ms-grid-row-align: center;
  -ms-grid-column: 2;
  -ms-grid-row: 1;
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
`

const ContentWrapper = styled('div')`
  box-sizing: border-box;
  max-width: 100%;
  padding: 16px 24px;
  &:empty {
    display: none;
  }
  &:not(:empty) {
    ${gridCell2}
  }
  ${LogoWrapper} + & {
    padding-left: 0;
  }
`

const LinksColsContainer = styled('div')`
  box-sizing: border-box;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  padding: 16px 24px;
  background-color: ${(p) => p.theme.colors.white};
  -ms-grid-column: 1;
  -ms-grid-column-span: 2;
  -ms-grid-row: 2;
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 3;
  ${LogoWrapper} + ${ContentWrapper}:empty + & {
    padding-left: 0;
  }
  ${ContentWrapper}:empty + & {
    background-color: transparent;
    -ms-grid-column-span: 1;
    ${gridCell2}
  }
`

const LinkCol = styled('div')<LinkColProps>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  padding: 0 16px 0 16px;
  max-width: calc(100% / ${(p) => p.maxCols});
  border-right: 1px solid ${(p) => p.theme.colors.base};

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
const divideLinks = (links: typeof Link[], maxCols: number) => {
  const divided: typeof Link[][] = []
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

type FooterType = React.FC<FooterProps> & { Link: typeof Link }

export const Footer: FooterType = (props) => {
  const { logo, className, children } = props
  const [links, setLinks] = useState(new Map<string, typeof Link>())
  const [maxCols, setMaxCols] = useState<number>(1)
  const screenSize = useContext(ScreenSizeContext)

  const dividedLinks = divideLinks(Array.from(links.values()), maxCols)

  const ref = React.useRef<HTMLElement>(null)
  useLayout('footer', { position: 'flow', offset: 0 })

  React.useEffect(() => {
    let newMaxCols = columnsMap[screenSize.size]
    // If the links are next to the logo, not as many can fit on one line.
    if (newMaxCols > 1 && logo && ref.current?.querySelector?.(`${ContentWrapper}:empty`)) {
      newMaxCols -= 1
    }
    setMaxCols(() => newMaxCols)
  }, [logo, screenSize, ref])

  return (
    <StyledFooter ref={ref} className={className} isGrid={screenSize > SIZES.tiny}>
      {logo && (
        <LogoWrapper>{typeof logo === 'string' ? <img alt="Logo" src={logo} /> : logo}</LogoWrapper>
      )}
      <ContentWrapper>
        <FooterContext.Provider value={setLinks}>{children}</FooterContext.Provider>
      </ContentWrapper>

      {links.size > 0 && (
        <LinksColsContainer>
          {dividedLinks.map((linkGroup, colIndex) => (
            <LinkCol key={colIndex} maxCols={dividedLinks.length}>
              {linkGroup.map((link, i) => (
                <StyledLink key={i} {...(link as any)}/>
              ))}
            </LinkCol>
          ))}
        </LinksColsContainer>
      )}
    </StyledFooter>
  )
}

export const FLink: any = (props: any) => {
  const {id, children, to} = props
  const setLinks = useContext(FooterContext)
  const key = useId(id)
  useEffect(() => {
    setLinks?.((links) => new Map(links.set(key, props)))
  }, [key, children, id, to, setLinks])
  useEffect(
    () => () =>
      setLinks?.((links) => {
        const newLinks = new Map(links)
        newLinks.delete(key)
        return newLinks
      }),
    [key, setLinks]
  )
  return null
}

const FooterLink = FLink as typeof Link

const StyledFooter = styled.footer.attrs({ role: 'contentinfo' as string })<{ isGrid: boolean }>`
  ${(p) => textStyle(p.theme, 'small')};
  word-wrap: break-word;
  overflow-wrap: anywhere;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: ${(p) => p.theme.colors.lightContrast};
  ${(p) => boxShadow(p.theme, 1)};
  ${(p) =>
    p.isGrid
      ? `
    height: auto;
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: min-content 1fr;
    grid-template-columns: min-content 1fr;
    -ms-grid-rows: min-content min-content;
    grid-template-rows: min-content min-content;
    `
      : `
    ${LogoWrapper} + ${ContentWrapper}:empty + ${LinksColsContainer},
    ${LogoWrapper} + ${ContentWrapper}:not(:empty) {
      padding-top: 0;
      padding-left: 24px;
    }
    ${LinksColsContainer} {
      width: 100%;
    }
    && > * {
      padding-left: 24px;
    }`}
`

Footer.Link = FooterLink

Footer.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

FooterLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default Footer

const StyledLink = styled(Link)`
  max-width: 100%;
  margin-top: 4px;

  :first-child {
    margin-top: 0px;
  }

  :link,
  :visited,
  :hover {
    color: ${(p) => p.theme.colors.darkContrast};
  }

  :hover {
    text-decoration: none;
  }

  :focus {
    background-color: ${(p) => p.theme.colors.transparentCTA};
  }
`
