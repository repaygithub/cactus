import PropTypes from 'prop-types'
import React, { Children, ComponentType, FC, HTMLAttributes, ReactElement } from 'react'
import styled from 'styled-components'
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

export const HeaderItem: FC = ({ children }) => <>{children}</>

export const HeaderTitle: FC = ({ children }) => {
  return (
    <Text as="h2" my="0">
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
      <HeaderColumn mainColumn>
        {childrens.find(
          (child) =>
            (child as ChildElement).type.displayName === 'HeaderBreadcrumbRow' && <>{child}</>
        )}
        {childrens.find(
          (child) => (child as ChildElement).type.displayName === 'HeaderTitle' && <>{child}</>
        )}
      </HeaderColumn>
      {childrens.some((i) => (i as ChildElement).type.displayName === 'HeaderItem') && (
        <HeaderColumn>
          {childrens.filter(
            (child) => (child as ChildElement).type.displayName === 'HeaderItem' && <>{child}</>
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
  align-items: center;

  ${(p) => `
    ${p.theme.mediaQueries?.small}{
      flex-direction: ${!p.mainColumn ? 'row' : ''};
      align-items: ${!p.mainColumn ? 'center' : 'flex-start'};
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
  box-sizing: border-box;

  ${(p) => `
  ${p.theme.mediaQueries?.small}{
    justify-content: space-between;
    flex-direction: row;
    padding: 8px 40px;
    }
  `}
`

export default Header
