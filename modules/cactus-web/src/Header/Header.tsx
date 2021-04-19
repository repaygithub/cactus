import PropTypes from 'prop-types'
import React, { Children, ComponentType, FC, HTMLAttributes, ReactElement } from 'react'
import styled, { css } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import Text from '../Text/Text'

export type BackgroundColorVariants = 'lightContrast' | 'white'
interface HeaderProps extends MarginProps, HTMLAttributes<HTMLDivElement> {
  bgColor?: BackgroundColorVariants
}

export type HeaderType = FC<HeaderProps> & {
  Item: typeof HeaderItem
  BreadcrumbRow: typeof HeaderBreadcrumbRow
  Title: typeof HeaderTitle
}

export const HeaderItem: FC = (props) => <div {...props} />

export const HeaderTitle: FC = ({ children, ...props }) => {
  return (
    <Text as="h2" my="0" {...props}>
      {children}
    </Text>
  )
}

export const HeaderBreadcrumbRow: FC = ({ children }) => <>{children}</>

export const Header: HeaderType = ({ children, bgColor = 'lightContrast', ...rest }) => {
  const childrens = Children.toArray(children)
  type ChildElement = ReactElement<any, ComponentType>

  return (
    <StyledHeader bgColor={bgColor} {...rest}>
      <MainColumn>
        {childrens.find(
          (child) =>
            (child as ChildElement).type.displayName === 'HeaderBreadcrumbRow' && <>{child}</>
        )}
        {childrens.find(
          (child) => (child as ChildElement).type.displayName === 'HeaderTitle' && <>{child}</>
        )}
      </MainColumn>
      {childrens.some((i) => (i as ChildElement).type.displayName === 'HeaderItem') && (
        <ItemsColumn>
          {childrens.filter(
            (child) => (child as ChildElement).type.displayName === 'HeaderItem' && <>{child}</>
          )}
        </ItemsColumn>
      )}
    </StyledHeader>
  )
}

const columnStyles = css`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`

const MainColumn = styled.div`
  ${columnStyles}
  ${(p) => `
    ${p.theme.mediaQueries?.small}{
      padding-top: 0px;
      min-width: 40%;
      > div:not(:first-child) {
        margin-left: 0px;
      }
      align-items: flex-start;
    }
    flex: 1 1;
    > h2 {
      max-width: 100%;
      flex-shrink: 0;
    }
  `}
`

const ItemsColumn = styled.div`
  ${columnStyles}
  padding-top: 24px;
  > div:not(:first-child) {
    margin-top: 8px;
  }

  ${(p) => `
    ${p.theme.mediaQueries?.small}{
      align-items: flex-end;
      flex: 1 1 0px;
      hyphens: auto;
      overflow-wrap: break-word;
      padding-top: 0px;
      width: 100%;
      word-wrap: break-word;
      > div {
        margin-top: 0px;
        margin-left: 8px;
        word-wrap: break-word;
        max-width: 100%;
        hyphens: auto;
      }
    }

    ${p.theme.mediaQueries?.medium}{
      flex-direction: row;
      align-items: center;
    }
  `}
`

Header.displayName = 'Header'
HeaderBreadcrumbRow.displayName = 'HeaderBreadcrumbRow'
HeaderTitle.displayName = 'HeaderTitle'
HeaderItem.displayName = 'HeaderItem'

Header.BreadcrumbRow = HeaderBreadcrumbRow
Header.Title = HeaderTitle
Header.Item = HeaderItem

Header.propTypes = {
  bgColor: PropTypes.oneOf(['white', 'lightContrast']),
}

export const StyledHeader = styled.header<HeaderProps>`
  ${margin}

  align-items: center;
  background-color: ${(p) =>
    p.bgColor ? p.theme.colors[p.bgColor] : p.theme.colors['lightContrast']};
  display: flex;
  flex-direction: column;
  height: auto;
  justify-content: center;
  padding: 8px 16px;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;

  ${(p) => `
  ${p.theme.mediaQueries?.small}{
    text-align: left;
    justify-content: space-between;
    flex-direction: row;
    padding: 8px 40px;
    }
  `}
`

export default Header
