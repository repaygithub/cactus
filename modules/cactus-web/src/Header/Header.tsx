import { mediaGTE } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React, { Children, ComponentType, FC, HTMLAttributes, ReactElement } from 'react'
import styled, { css } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { withStyles } from '../helpers/styled'
import Text from '../Text/Text'

export type BackgroundColorVariants = 'lightContrast' | 'white'
interface HeaderProps extends MarginProps, HTMLAttributes<HTMLDivElement> {
  bgColor?: BackgroundColorVariants
}

export type HeaderType = FC<HeaderProps> & {
  Item: typeof HeaderItem
  BreadcrumbRow: typeof HeaderBreadcrumbRow
  Title: typeof HeaderTitle
  Description: typeof HeaderDescription
}

export const HeaderItem: FC<HTMLAttributes<HTMLDivElement>> = (props) => <div {...props} />

export const HeaderTitle: FC<React.ComponentProps<typeof Text>> = ({ children, ...props }) => (
  <Text as="h1" textStyle="h2" {...props}>
    {children}
  </Text>
)

export const HeaderBreadcrumbRow: FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>{children}</>
)

export const HeaderDescription: FC<HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => (
  <StyledDescription {...rest}>{children}</StyledDescription>
)

export const Header: HeaderType = ({ children, bgColor = 'lightContrast', ...rest }) => {
  const childrenArray = Children.toArray(children)
  type ChildElement = ReactElement<any, ComponentType>
  const headerDescription = childrenArray.find(
    (child) => (child as ChildElement).type.displayName === 'HeaderDescription'
  )
  const hasDescription = headerDescription !== undefined

  return (
    <StyledHeader bgColor={bgColor} $hasDescription={hasDescription} {...rest}>
      <MainColumn>
        {childrenArray.find(
          (child) =>
            (child as ChildElement).type.displayName === 'HeaderBreadcrumbRow' && <>{child}</>
        )}
        {childrenArray.find(
          (child) => (child as ChildElement).type.displayName === 'HeaderTitle' && <>{child}</>
        )}
        {headerDescription}
      </MainColumn>
      {childrenArray.some((i) => (i as ChildElement).type.displayName === 'HeaderItem') && (
        <ItemsColumn>
          {childrenArray.filter(
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
  ${mediaGTE('small')} {
    padding-top: 0;
    min-width: 40%;
    > div:not(:first-child) {
      margin-left: 0;
    }
    align-items: flex-start;
  }
  flex: 1 1;
  > * {
    max-width: 100%;
    flex-shrink: 0;
  }
`

const ItemsColumn = styled.div`
  ${columnStyles}
  padding-top: 24px;
  > div:not(:first-child) {
    margin-top: 8px;
  }

  ${mediaGTE('small')} {
    align-items: flex-end;
    flex: 1 1 0;
    hyphens: auto;
    overflow-wrap: break-word;
    padding-top: 0;
    max-width: 100%;
    word-wrap: break-word;
    > div {
      margin-top: 0;
      margin-left: 8px;
      word-wrap: break-word;
      max-width: 100%;
      hyphens: auto;
    }
  }

  ${mediaGTE('medium')} {
    flex-direction: row;
    align-items: center;
    flex: 0 1 auto;
    > div:not(:first-child) {
      margin-top: 0;
    }
  }
`

const StyledDescription = styled.div`
  margin-top: ${(p) => `${p.theme.space[3]}px`};
  ${mediaGTE('small')} {
    margin-top: 0;
  }
`

Header.displayName = 'Header'
HeaderBreadcrumbRow.displayName = 'HeaderBreadcrumbRow'
HeaderTitle.displayName = 'HeaderTitle'
HeaderItem.displayName = 'HeaderItem'
HeaderDescription.displayName = 'HeaderDescription'

Header.BreadcrumbRow = HeaderBreadcrumbRow
Header.Title = HeaderTitle
Header.Item = HeaderItem
Header.Description = HeaderDescription

Header.propTypes = {
  bgColor: PropTypes.oneOf(['white', 'lightContrast']),
}

export const StyledHeader = withStyles('header', {
  displayName: 'Header',
  styles: [margin],
  transitiveProps: ['bgColor'],
})<HeaderProps & { $hasDescription: boolean }>`
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

  ${mediaGTE('small')} {
    text-align: left;
    justify-content: space-between;
    flex-direction: row;
    padding: ${(p) => (p.$hasDescription ? '8px 40px 16px 40px' : '8px 40px')};
  }
`

export default Header
