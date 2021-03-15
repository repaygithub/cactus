import PropTypes from 'prop-types'
import React, { Children, ReactNode } from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import Text from '../Text/Text'

export type BackgroundColorVariants = 'lightContrast' | 'white'
interface HeaderProps extends MarginProps, React.HTMLAttributes<HTMLDivElement> {
  bgColor?: BackgroundColorVariants
  children?: ReactNode
}

export type HeaderType = React.FC<HeaderProps> & {
  Item: typeof HeaderItem
  BreadcrumbRow: typeof HeaderBreadcrumbRow
  Title: typeof HeaderTitle
}

export const HeaderItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children }) => {
  return <>{children}</>
}

export const HeaderTitle: React.FC = ({ children }) => {
  return (
    <Text as="h1" textStyle="h2" my="0">
      {children}
    </Text>
  )
}

export const HeaderBreadcrumbRow: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => {
  return <>{children}</>
}

export const Header: HeaderType = ({ children, bgColor = 'lightContrast', ...rest }) => {
  const childrens = Children.toArray(children)

  return (
    <StyledHeader bgColor={bgColor} {...rest}>
      <HeaderColumn>
        {childrens.find(
          (child: any) => child.type.displayName === 'HeaderBreadcrumbRow' && <>{child}</>
        )}
        {childrens.find((child: any) => child.type.displayName === 'HeaderTitle' && <>{child}</>)}
      </HeaderColumn>
      {childrens.some((i: any) => i.type.displayName === 'HeaderItem') && (
        <HeaderColumn>
          {childrens.filter(
            (child: any) => child.type.displayName === 'HeaderItem' && <>{child}</>
          )}
        </HeaderColumn>
      )}
    </StyledHeader>
  )
}

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

export const HeaderColumn = styled.div<{ mainColumn?: boolean }>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-top: ${(p) => !p.mainColumn && '24px'};
  ${(p) => `
    ${p.theme.mediaQueries?.small}{
      &:first-child {
        flex-direction: column; 
      }
      &:last-child {
        flex-direction: row; 
      }
      padding-top: 0px;
    }
  `};
`
export const StyledHeader = styled.header<HeaderProps>`
  ${margin}

  align-items: center;
  background-color: ${(p) =>
    p.bgColor ? p.theme.colors[p.bgColor] : p.theme.colors['lightContrast']};
  display: flex;
  flex-direction: column;
  height: auto;
  justify-content: center;
  padding: 8px 0;
  width: 100%;

  ${(p) => `
  ${p.theme.mediaQueries?.small}{
    justify-content: space-between;
    flex-direction: row;
    padding: 8px 40px;
    }
  `}
`

export default Header
