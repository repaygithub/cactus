import { CactusTheme } from '@repay/cactus-theme'
import { Property } from 'csstype'
import PropTypes from 'prop-types'
import styled, { StyledComponentBase } from 'styled-components'
import * as SS from 'styled-system'

import { getOmittableProps } from '../helpers/omit'
import Flex, { FlexBoxProps } from '../Flex/Flex'
import { FlexItemProps } from '..helpers/styled'
import { screenSizes } from '../ScreenSizeProvider/ScreenSizeProvider'

const DEFAULT_GAP = 4


// Technically both start and end can have span, but span is only useful in the start
// position when using named areas, which IE doesn't support; assume the dev won't do
// that if they're trying to be IE compatible (and if it breaks, it's their own fault).
// IE notes:
// - does not support negative numbers
// - `gridArea`: spec allows blank column start, but not in IE.
// - can't use named grid areas (except using CSS class version)
// - can't use `span` keyword in both start AND end grid lines.
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
  gridAreas?: Record<string, SS.ResponsiveValue<Property.GridArea>>
  // I'm supporting these for completeness, but their syntax isn't very React-friendly.
  grid?: SS.ResponsiveValue<Property.Grid>
  gridTemplate?: SS.ResponsiveValue<Property.GridTemplate>
  gridTemplateAreas?: SS.ResponsiveValue<Property.GridTemplateAreas>
}

type ColumnNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type PseudoFlexProps = { [K in typeof screenSizes[number]]?: ColumnNum }

interface GridItemProps extends FlexItemProps, PseudoFlexProps {
  row?: SS.ResponsiveValue<Property.GridRow>
  rowStart?: SS.ResponsiveValue<Property.GridRowStart>
  rowEnd?: SS.ResponsiveValue<Property.GridRowEnd>
  col?: SS.ResponsiveValue<Property.GridColumn>
  column?: SS.ResponsiveValue<Property.GridColumn>
  colStart?: SS.ResponsiveValue<Property.GridColumnStart>
  columnStart?: SS.ResponsiveValue<Property.GridColumnStart>
  colEnd?: SS.ResponsiveValue<Property.GridColumnEnd>
  columnEnd?: SS.ResponsiveValue<Property.GridColumnEnd>
  gridArea?: SS.ResponsiveValue<Property.GridArea>
  justifySelf?: SS.ResponsiveValue<Property.JustifySelf>
}

interface GridComponent extends StyledComponentBase<'div', CactusTheme, GridBoxProps> {
  Item: StyledComponentBase<'div', CactusTheme, GridItemProps>
  supportsGrid: boolean
  supportsGap: boolean
}

type Dimension = 'row' | 'column'

const gridItemStyles = function() {
  let itemStyleConfig: SS.Config
  if (isIE) {
    const delimiter = /\s*\/\s*/
    const spanRegex = /span/i
    const getStartSpan = (dim: Dimension, start: string, end?: string) => {
      const styles: Record<string, string> = {}
      if (end) {
        if (spanRegex.test(end)) {
          styles[`-ms-grid-${dim}-span`] = String(parseInt(end.replace(spanRegex, '')))
        } else if (spanRegex.test(start)) {
          const span = parseInt(start.replace(spanRegex, ''))
          start = String(parseInt(end) - span)
          styles[`-ms-grid-${dim}-span`] = String(span)
        } else {
          styles[`-ms-grid-${dim}-span`] = String(parseInt(end) - parseInt(start))
        }
      }
      styles[`-ms-grid-${dim}`] = start
      return styles
    }

    const getCombinedStartEndParser = (dim: Dimension): SS.ConfigFunction => (spec) => {
      if (spec) {
        if (typeof spec === 'number') {
          return getStartSpan(dim, String(spec))
        } else if (typeof spec === 'string') {
          return getStartSpan(dim, ...spec.split(delimiter))
        }
      }
    }

    const getStartParser = (dim: Dimension): SS.ConfigFunction => (start, _, props) => {
      if (start) {
        if (typeof start === 'string' && spanRegex.test(start)) {
          const end = dim === 'row' ? props.rowEnd : (props.colEnd || props.columnEnd)
          start = parseInt(end) - parseInt(start.replace(spanRegex, ''))
        }
        return { [`-ms-grid-${dim}`]: String(start) }
      }
    }

    const getEndParser = (dim: Dimension): SS.ConfigFunction => (span, _, props) => {
      if (span) {
        let end = span
        if (typeof span === 'string') {
          if (spanRegex.test(span)) {
            span = span.replace(spanRegex, '')
          } else {
            end = parseInt(span)
          }
        }
        if (typeof end === 'number') {
          const start = dim === 'row' ? props.rowStart : (props.colStart || props.columnStart)
          span = end - parseInt(start || 1)
        }
        return { [`-ms-grid-${dim}-span`]: String(span) }
      }
    }

    itemStyleConfig = {
      row: getCombinedStartEndParser('row'),
      rowStart: getStartParser('row'),
      rowEnd: getEndParser('row'),
      col: getCombinedStartEndParser('column'),
      colStart: getStartParser('column'),
      colEnd: getEndParser('column'),
      gridArea: (areaSpec: any) => {
        if (areaSpec && typeof areaSpec === 'string') {
          const [rowStart, colStart, rowEnd, colEnd] = areaSpec.split(delimiter)
          const styles = getStartSpan('row', rowStart, rowEnd)
          Object.assign(styles, getStartSpan('column', colStart, colEnd))
          return styles
        }
      },
      justifySelf: { property: '-ms-grid-column-align' },
      alignSelf: { property: '-ms-grid-row-align' },
    }
  } else {
    // Stringify to ensure grid lines won't be treated like CSS <length> values.
    const transform = (val: any) => typeof val === 'number' ? String(val) : val
    itemStyleConfig = {
    row: { property: 'gridRow', transform },
    rowStart: { property: 'gridRowStart', transform },
    rowEnd: { property: 'gridRowEnd', transform },
    col: { property: 'gridColumn', transform },
    colStart: { property: 'gridColumnStart', transform },
    colEnd: { property: 'gridColumnEnd', transform },
    gridArea: { property: 'gridArea', transform },
    justifySelf: true,
  }
  }
  itemStyleConfig.column = itemStyleConfig.col
  itemStyleConfig.columnStart = itemStyleConfig.colStart
  itemStyleConfig.columnEnd = itemStyleConfig.colEnd
  return SS.system(itemStyleConfig)
}()

const pseudoFlexStyles = function(): SS.styleFn {
  const parser: SS.styleFn = isIE ? (props: any) => {
      // NOTE: If using a non-default gap this algorithm may or may not work.
      const gap = props.theme.space[DEFAULT_GAP]
      const width = screenSizes.map((size) => {
        if (props[size]) {
          return `calc(${props[size] / 12 * 100}% - ${gap}px)`
        }
      })
      return SS.width({ width })
  } : (props: any) => {
    const gridColumn = screenSizes.map((size) => {
      if (props[size]) {
        return `span ${props[size]}`
      }
    })
    return gridItemStyles({ gridColumn })
  }
  parser.propNames = screenSizes
  return parser
}()

const itemStyleProps = getOmittableProps(gridItemStyles, pseudoFlexStyles)

export const GridItem = styled(Flex.Item).withConfig({
  shouldForwardProp: (p) => !itemStyleProps.has(p),
})`
  ${pseudoFlexStyles}
  && {
    ${gridItemStyles}
  }
`
GridItem.displayName = 'Grid.Item'

const ColumnPropType = PropTypes.oneOf<ColumnNum>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

GridItem.propTypes = {
  tiny: ColumnPropType,
  small: ColumnPropType,
  medium: ColumnPropType,
  large: ColumnPropType,
  extraLarge: ColumnPropType,
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
      return (val: any) => typeof val === 'number' ? repeatText(val, defaultSize) : val
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
  gridStyleConfig.columns = gridStyleConfig.cols
  gridStyleConfig.autoColumns = gridStyleConfig.autoCols

  const parseGridAreas = ({ gridAreas }: GridBoxProps) => {
    if (gridAreas) {
      const areaDefinitions: Record<string, any> = {}
      for (const className of Object.keys(gridAreas)) {
        areaDefinitions[`.${className}`] = gridItemStyles({ gridArea: gridAreas[className] })
      }
      return areaDefinitions
    }
  }

  const styleProps = getOmittableProps(Object.keys(gridStyleConfig))
  const gridTag = styled(Flex).withConfig({ displayName: 'Grid', shouldForwardProp: (p) => !styleProps.has(p) })

  if (isIE) {
    gridStyleConfig.rows.property = '-ms-grid-rows'
    gridStyleConfig.cols.property = '-ms-grid-columns'
    const applyJustifyToChildren = (value: any) => {
      if (value) return { '& > *': { '-ms-grid-column-align': value } }
    }
    // Keeping this separate in case we implement inline styles, see CACTUS-975.
    const justifyWorkaround = SS.system({
      justify: applyJustifyToChildren,
      justifyItems: applyJustifyToChildren,
      alignItems: (value: any) => {
        if (value) return { '& > *': { '-ms-grid-row-align': value } }
      },
    })
    const gridStyles = SS.system(gridStyleConfig)
    const flexJustifyMap = {
      start: 'flex-start',
      end: 'flex-end',
      center: 'center',
      normal: 'normal',
    }
    return gridTag((props: GridBoxProps) => {
      const styles = {
        width: '100%',
        ...justifyWorkaround(props),
        ...parseGridAreas(props),
        '&&': gridStyles(props),
      }
      if (!props.rows && !props.cols && !props.columns && !props.gridAreas) {
        // This is the backwards compat "why the heck aren't you using flex" mode.
        styles[`& > ${GridItem}`] = {
          display: 'flex',
          justifyContent: flexJustifyMap[props.justify || 'start'] || 'flex-start',
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
    ${parseGridAreas}
    && {
      ${SS.system(gridStyleConfig)}
    }
  `
}()

Grid.defaultProps = { gap: DEFAULT_GAP }

Grid.Item = GridItem
Grid.supportsGap = Flex.supportsGap
Grid.supportsGrid = typeof CSS !== 'undefined' && CSS.supports?.('display', 'grid')

export default Grid
