import {
  breakpoint,
  color,
  colorStyle,
  mediaGTE,
  shadow,
  space,
  textStyle,
} from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import { css } from 'styled-components'
import {
  compose,
  margin,
  MarginProps,
  padding,
  PaddingProps,
  position,
  PositionProps,
} from 'styled-system'

import { isIE } from '../helpers/constants'
import omit, { omitProps } from '../helpers/omit'
import {
  classes,
  flexContainerOption,
  flexItem,
  FlexItemProps,
  FlexOptionProps,
  gapWorkaround,
  sizing,
  SizingProps,
  styledUnpoly,
  styledWithClass,
} from '../helpers/styled'
import { useLayout } from '../Layout/Layout'

type FooterVariant = 'white' | 'gray' | 'dark'
interface FooterProps extends React.HTMLAttributes<HTMLDivElement>, FlexOptionProps, PaddingProps {
  logo?: string | React.ReactElement
  variant?: FooterVariant
}

interface FooterComponent extends React.FC<FooterProps> {
  Logo: typeof FooterLogo
}

type LogoProps = FlexItemProps & MarginProps & PositionProps & SizingProps

const stylePropNames = [
  'variant',
  ...(flexContainerOption.propNames as string[]),
  ...(padding.propNames as string[]),
]

const FooterBase = ({ logo, children, className, ...rest }: FooterProps) => {
  const layoutClass = useLayout('footer', { grid: 'footer' })
  const isCustomFlex = !!rest.flexFlow
  const props = omit(rest, stylePropNames)
  return (
    <footer {...props} role="contentinfo" className={classes(className, layoutClass)}>
      {logo && (
        <FooterLogo>{typeof logo === 'string' ? <img alt="Logo" src={logo} /> : logo}</FooterLogo>
      )}
      {isCustomFlex ? children : <ContentWrapper>{children}</ContentWrapper>}
    </footer>
  )
}
FooterBase.displayName = 'Footer'

const FooterLogo = styledWithClass('div', 'footer-logo').withConfig(
  omitProps<LogoProps>(flexItem, margin, position, sizing)
)`
  margin-bottom: ${space(5)};
  ${mediaGTE('small')} {
    margin-bottom: 0;
    margin-right: ${space(7)};
  }
  &,
  & > * {
    box-sizing: border-box;
    display: block;
    max-width: 200px;
    max-height: 40px;
  }
  &&& {
    ${compose(flexItem, margin, position, sizing)};
  }
`
FooterLogo.displayName = 'Footer.Logo'

const ContentWrapper = styledWithClass('div', 'footer-content')`
  min-width: 1px;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  &:empty {
    display: none;
  }
  ${mediaGTE('small')} {
    max-width: ${breakpoint('large')};
    margin: 0 auto;
  }
`

type VariantMap = { [K in FooterVariant]: ReturnType<typeof css> }
const variants: VariantMap = {
  white: css`
    ${colorStyle('standard')};
  `,
  gray: css`
    ${colorStyle('darkestContrast', 'lightGray')};
  `,
  dark: css`
    ${colorStyle('white', 'darkContrast')};
    a:link,
    a:visited {
      color: ${color('white')};
    }
  `,
}

export const Footer = styledUnpoly(FooterBase as FooterComponent)`
  ${textStyle('body')};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${(p) => !p.flexFlow && 'text-align: center;'}
  box-sizing: border-box;
  width: 100%;
  padding: ${space(5)} ${space(7)};
  ${shadow(1)};

  ${mediaGTE('small')} {
    flex-direction: row;
    ${(p) =>
      p.logo
        ? `
      justify-content: space-between;
      text-align: left;
    `
        : !p.flexFlow &&
          isIE &&
          `
      ::before {
        content: '';
      }
    `}
  }

  a {
    outline: none;
    :link {
      font-style: italic;
      text-decoration: underline;
      padding: 2px 2px 0 0;
      color: ${color('callToAction')};
    }
    :visited {
      color: ${color('darkContrast')};
    }
    :hover {
      text-decoration: none;
    }
  }
  ${(p) => variants[p.variant || 'gray'] || variants.gray};
  a:focus {
    ${colorStyle('darkContrast', 'lightCallToAction')};
  }

  ${gapWorkaround}
  &&& {
    ${compose(flexContainerOption, padding)}
  }
`

Footer.Logo = FooterLogo

Footer.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  variant: PropTypes.oneOf(['white', 'gray', 'dark']),
}

Footer.defaultProps = { variant: 'gray' }

export default Footer
