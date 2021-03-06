import { CactusTheme } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import styled, { StyledComponentBase } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

const GUTTER_WIDTH = 16

type ColumnNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

interface GridProps extends MarginProps {
  justify?: 'start' | 'center' | 'end' | 'normal'
}

interface ItemProps {
  tiny: ColumnNum
  small?: ColumnNum
  medium?: ColumnNum
  large?: ColumnNum
  extraLarge?: ColumnNum
}

const calculateFlexItemSize = (columnNum: ColumnNum) =>
  `calc(${(columnNum / 12) * 100}% - ${GUTTER_WIDTH}px)`

export const Item = styled.div<ItemProps>`
  box-sizing: border-box;

  margin: ${GUTTER_WIDTH / 2}px ${GUTTER_WIDTH / 2}px;
  width: ${(p) => calculateFlexItemSize(p.tiny)};

  @media (min-width: 769px) {
    width: ${(p) => (p.small ? calculateFlexItemSize(p.small) : undefined)};
  }

  @media (min-width: 1025px) {
    width: ${(p) => (p.medium ? calculateFlexItemSize(p.medium) : undefined)};
  }

  @media (min-width: 1201px) {
    width: ${(p) => (p.large ? calculateFlexItemSize(p.large) : undefined)};
  }

  @media (min-width: 1441px) {
    width: ${(p) => (p.extraLarge ? calculateFlexItemSize(p.extraLarge) : undefined)};
  }

  @supports (display: grid) {
    grid-column: span ${(p): ColumnNum => p.tiny};
    width: auto;
    margin: 0;

    @media (min-width: 769px) {
      grid-column: span ${(p): ColumnNum | undefined => p.small};
    }

    @media (min-width: 1025px) {
      grid-column: span ${(p): ColumnNum | undefined => p.medium};
    }

    @media (min-width: 1201px) {
      grid-column: span ${(p): ColumnNum | undefined => p.large};
    }

    @media (min-width: 1441px) {
      grid-column: span ${(p): ColumnNum | undefined => p.extraLarge};
    }
  }
`

const ColumnPropType = PropTypes.oneOf<ColumnNum>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

Item.propTypes = {
  tiny: ColumnPropType.isRequired,
  small: ColumnPropType,
  medium: ColumnPropType,
  large: ColumnPropType,
  extraLarge: ColumnPropType,
}

const flexJustifyMap = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  normal: 'normal',
}

interface GridComponent extends StyledComponentBase<'div', CactusTheme, GridProps> {
  Item: typeof Item
}

export const Grid = styled.div<GridProps>`
  box-sizing: border-box;
  width: 100%;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  > ${Item} {
    display: flex;
    justify-content: ${(p): string => (p.justify ? flexJustifyMap[p.justify] : 'flex-start')};
  }

  @supports (display: grid) {
    display: grid;
    grid-template-columns: repeat(12, minmax(1px, 1fr));
    grid-gap: ${GUTTER_WIDTH}px;
    justify-items: ${(p): string => (p.justify ? p.justify : 'normal')};

    > ${Item} {
      display: block;
    }
  }

  ${margin}
`

const DefaultGrid = Grid as any
DefaultGrid.Item = Item

Grid.propTypes = {
  justify: PropTypes.oneOf(['start', 'center', 'end', 'normal']),
}

Grid.defaultProps = {
  justify: 'normal',
}

export default DefaultGrid as GridComponent
