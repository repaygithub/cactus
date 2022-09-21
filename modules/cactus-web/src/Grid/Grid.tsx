import { CactusTheme } from '@repay/cactus-theme'
import { Property } from 'csstype'
import PropTypes from 'prop-types'
import styled, { StyledComponentBase } from 'styled-components'
import * as SS from 'styled-system'

import { getOmittableProps } from '../helpers/omit'
import Flex, { FlexBoxProps } from '../Flex/Flex'

// We're not supporting these props because they're too complicated,
// or their syntax is just plain not compatible with React props:
// - `grid`
// - `grid-template`
// - `grid-template-areas`
// These we're supporting, but there's no IE support and no workaround:
// - `grid-auto-flow`
// - `grid-auto-rows`
// - `grid-auto-columns`
interface GridBoxProps extends FlexBoxProps {
  rows?: SS.ResponsiveValue<Property.GridTemplateRows<string | number>>
  cols?: SS.ResponsiveValue<Property.GridTemplateColumns<string | number>>
  columns?: SS.ResponsiveValue<Property.GridTemplateColumns<string | number>>
  // Backwards compat; I recommend using `justifyItems` for clarity.
  justify?: SS.ResponsiveValue<Property.JustifyItems>
  justifyItems?: SS.ResponsiveValue<Property.JustifyItems>
  autoFlow?: SS.ResponsiveValue<Property.GridAutoFlow>
  autoRows?: SS.ResponsiveValue<Property.GridAutoRows<string | number>>
  autoCols?: SS.ResponsiveValue<Property.GridAutoColumns<string | number>>
  autoColumns?: SS.ResponsiveValue<Property.GridAutoColumns<string | number>>
}

type ColumnNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

interface GridItemProps extends FlexItemProps {
  tiny?: ColumnNum
  small?: ColumnNum
  medium?: ColumnNum
  large?: ColumnNum
  extraLarge?: ColumnNum
  row?: SS.ResponsiveValue<Property.GridRow>
  rowStart?: SS.ResponsiveValue<Property.GridRowStart>
  rowEnd?: SS.ResponsiveValue<Property.GridRowEnd>
  col?: SS.ResponsiveValue<Property.GridColumn>
  column?: SS.ResponsiveValue<Property.GridColumn>
  colStart?: SS.ResponsiveValue<Property.GridColumnStart>
  columnStart?: SS.ResponsiveValue<Property.GridColumnStart>
  colEnd?: SS.ResponsiveValue<Property.GridColumnEnd>
  columnEnd?: SS.ResponsiveValue<Property.GridColumnEnd>
  gridArea?: SS.ResponsiveValue<Property.>
  justifySelf?: SS.ResponsiveValue<Property.>
}

interface GridComponent extends StyledComponentBase<'div', CactusTheme, GridBoxProps> {
  Item: StyledComponentBase<'div', CactusTheme, GridItemProps>
  supportsGrid: boolean
  supportsGap: boolean
}

export const Grid: GridComponent = function(): any {
  const repeatText = (count: number, text: string) => {
    const result: string[] = []
    for (let i = 0; i < count; i++) result.push(text)
    return result.join(' ')
  }
  // Shortcut, e.g. so you can just say `cols={4}` and it'll add 4 equal columns.
  const templateTransform = (defaultSize: string) => {
    if (isIE) {
      return function(val: any) {
        return typeof val === 'number' ? repeatText(val, defaultSize) : val
      }
    }
    return (val: any) => typeof val === 'number' ? `repeat(${val}, ${defaultSize})` : val
  }

  const gridStyleConfig: SS.Config = {
    rows: { property: 'grid-template-rows', transform: templateTransform('min-content') },
    cols: { property: 'grid-template-columns', transform: templateTransform('1fr') },
    justifyItems: true,
    justify: { property: 'justifyItems' },
    autoFlow: { property: 'gridAutoFlow' },
    autoRows: { property: 'gridAutoRows' },
    autoCols: { property: 'gridAutoColumns' },
  }
  // Add full "column" variants in case people like that better, or forget the short form.
  gridStyleConfig.columns = gridStyleConfig.cols
  gridStyleConfig.autoColumns = gridStyleConfig.autoCols

  const styleProps = getOmittableProps(Object.keys(gridStyleConfig))
  // Two lines/vars to work around a babel config setting which overrides the
  // `displayName` of any styled component to whatever the variable name is.
  const base = styled(Flex).withConfig({ shouldForwardProp: (p) => !styleProps.has(p) })
  const gridTag = base.withConfig({ displayName: 'Grid' })

  if (isIE) {
    gridStyleConfig.rows.property = '-ms-grid-rows'
    gridStyleConfig.cols.property = '-ms-grid-columns'
    function applyJustifyToChildren(value: any) {
      if (value) return { '& > *': { '-ms-grid-column-align': value } }
    }
    // Keeping this separate in case we implement inline styles, see CACTUS-975.
    const justifyWorkaround = SS.system({
      justify: applyJustifyToChildren,
      justifyItems: applyJustifyToChildren,
      alignItems: function(value: any) {
        if (value) return { '& > *': { '-ms-grid-row-align': value } }
      }
    })
    const gridStyles = SS.system(gridStyleConfig)
    const flexJustifyMap = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      normal: 'normal',
    }
    return gridTag(function(props: GridBoxProps) {
      const styles = {
        width: '100%',
        ...justifyWorkaround(props),
        '&&': gridStyles(props),
      }
      if (!props.rows && !props.cols && !props.columns) {
        // This is the backwards compat "why the heck aren't you using flex" mode.
        styles[`& > ${GridItem}`] = {
          display: 'flex',
          justifyContent: flexJustifyMap[props.justify || 'start'] : 'flex-start',
        }
      } else {
        styles.display = '-ms-grid'
        styles['-ms-grid-columns'] = repeatText(12, 'minmax(1px, 1fr)')
      }
      return styles
    })
  }
  return gridTag`
    display: grid;
    width: 100%;
    grid-template-columns: repeat(12, minmax(1px, 1fr));
    justify-items: normal;
    && {
      ${SS.system(gridStyleConfig)}
    }
  `
}()

Grid.defaultProps = { gap: 4 }

Grid.Item = GridItem
Grid.supportsGap = Flex.supportsGap
Grid.supportsGrid = typeof CSS !== 'undefined' && CSS.supports?.('display', 'grid')

export default Grid

// IE notes:
// - does not support negative numbers
// - everything defaults to 1 in `getComputedStyle`, so we can't use that to see if it's unset.
const getStartEndComposite = (value, dim) => {
  // The real spec is insanely complicated, allowing the `span` keyword in all
  // sorts of places that just don't make sense to me. I'll support the basic
  // `2 / span 4` syntax, but beyond that just don't use it if you need IE.
  // But seriously, can anyone actually understand `5 area-one span / span area-two`?
  if (value) {
    if (typeof value !== 'string') value = String(value)
    const [start, end] = value.split(/\s*\/\s*/, 2)
    if (start) {
      const styles: any = { [`-ms-grid-${dim}`]: start }
      if (end) {
        if (end.startsWith('span')) {
          styles[`-ms-grid-${dim}-span`] = end.slice(5)
        } else {
          styles[`-ms-grid-${dim}-span`] = String(parseInt(end) - parseInt(start))
        }
      }
      return styles
    }
  }
}

// NOTE React's auto number-to-px conversion WILL work on these, so I'll
// need to make sure to convert them to strings.
const gridItemStyles = system(
  // TODO IE supports start and span, normal browsers support start and end
  // (note that end can include the "span" keyword").
  isIE ? {
    row: (value) => getStartEndComposite(value, 'row'),
    rowStart: { property: '-ms-grid-row' },
    rowSpan: { property: '-ms-grid-row-span' },
    // I think this actually gets more complicated sometimes, e.g. with languages
    // that have different text directions, but I'm not spending THAT much effort on IE.
    justifySelf: { property: '-ms-grid-column-align' },
    alignSelf: { property: '-ms-grid-row-align' },
  } : {
    row: { property: 'grid-row' },
    rowStart: { property: 'grid-row-start' },
    rowEnd: { property: 'grid-row-end' },
    col: { property: 'grid-column' },
    colStart: { property: 'grid-column-start' },
    colEnd: { property: 'grid-column-end' },
    gridArea: { property: 'grid-area' },
    justifySelf: true,
  }
)

const GUTTER_WIDTH = 16


interface GridProps extends MarginProps {
  justify?: 'start' | 'center' | 'end' | 'normal'
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

interface GridComponent extends StyledComponentBase<'div', CactusTheme, GridProps> {
  Item: typeof Item
}

const styleProps = getOmittableProps(margin, 'justify')
export const Grid = styled.div.withConfig({
  shouldForwardProp: (p) => !styleProps.has(p),
})<GridProps>`
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
