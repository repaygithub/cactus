import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components'

import { isIE } from '../helpers/constants'
import { styledWithClass } from '../helpers/styled'
import { classes } from '../helpers/styled'
import { boxShadow, textStyle } from '../helpers/theme'
import { useLayout } from '../Layout/Layout'

type FooterVariant = 'white' | 'gray' | 'dark'
interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: string | React.ReactElement
  variant?: FooterVariant
}

const FooterBase: React.FC<FooterProps> = ({ logo, children, variant, ...props }) => {
  const layoutClass = useLayout('footer', { footer: 'min-content' })
  return (
    <footer {...props} className={classes(props.className, layoutClass)}>
      {logo && (
        <LogoWrapper>{typeof logo === 'string' ? <img alt="Logo" src={logo} /> : logo}</LogoWrapper>
      )}
      <ContentWrapper>{children}</ContentWrapper>
    </footer>
  )
}
FooterBase.displayName = 'Footer'

const LogoWrapper = styledWithClass('div', 'footer-logo')`
  margin-bottom: ${(p) => p.theme.space[5]}px;
  ${(p) => p.theme.mediaQueries.small} {
    margin-bottom: 0;
    margin-right: ${(p) => p.theme.space[7]}px;
  }
  &,
  * {
    box-sizing: border-box;
    display: block;
    max-width: 200px;
    max-height: 40px;
  }
`

const ContentWrapper = styledWithClass('div', 'footer-content')`
  min-width: 1px;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  &:empty {
    display: none;
  }
  ${(p) => p.theme.mediaQueries.small} {
    max-width: ${(p) => p.theme.breakpoints[2]};
    margin: 0 auto;
  }
`

const link = css`
  a {
    outline: none;
    :link {
      font-style: italic;
      text-decoration: underline;
      padding: 2px 2px 0 0;
    }
    :hover {
      text-decoration: none;
    }
  }
`
const lightLink = css`
  a {
    :link {
      color: ${(p) => p.theme.colors.callToAction};
    }
    :visited {
      color: ${(p) => p.theme.colors.darkContrast};
    }
  }
`

type VariantMap = { [K in FooterVariant]: ReturnType<typeof css> }
const variants: VariantMap = {
  white: css`
    ${(p) => p.theme.colorStyles.standard};
    ${lightLink};
  `,
  gray: css`
    color: ${(p) => p.theme.colors.darkestContrast};
    background-color: ${(p) => p.theme.colors.lightGray};
    ${lightLink};
  `,
  dark: css`
    background-color: ${(p) => p.theme.colors.darkContrast};
    &,
    a:link,
    a:visited {
      color: ${(p) => p.theme.colors.white};
    }
  `,
}

export const Footer = styled(FooterBase).attrs({ as: FooterBase, role: 'contentinfo' as string })`
  ${(p) => textStyle(p.theme, 'body')};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
  width: 100%;
  padding: ${(p) => p.theme.space[5]}px ${(p) => p.theme.space[7]}px;
  background-color: ${(p) => p.theme.colors.lightContrast};
  ${(p) => boxShadow(p.theme, 1)};

  ${(p) => p.theme.mediaQueries.small} {
    flex-direction: row;
    ${(p) =>
      p.logo
        ? `
      justify-content: space-between;
      text-align: left;
    `
        : isIE &&
          `
      ::before {
        content: '';
      }
    `}
  }

  ${link};
  ${(p) => (p.variant && p.variant in variants ? variants[p.variant] : variants.gray)};
  a:focus {
    color: ${(p) => p.theme.colors.darkContrast};
    background-color: ${(p) => p.theme.colors.lightCallToAction};
  }
` as React.FC<FooterProps>

Footer.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  variant: PropTypes.oneOf(['white', 'gray', 'dark']),
}

Footer.defaultProps = { variant: 'gray' }

export default Footer
