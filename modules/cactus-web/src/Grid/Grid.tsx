import { CactusTheme, ScreenSize, screenSizes } from '@repay/cactus-theme'
import { Property } from 'csstype'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { StyledComponentBase } from 'styled-components'
import * as SS from 'styled-system'

import Flex, { FlexBoxProps } from '../Flex/Flex'
import { isIE } from '../helpers/constants'
import { useMergedRefs } from '../helpers/react'
import { FlexItemProps, gapWorkaround, withStyles } from '../helpers/styled'
import { useScreenSize } from '../ScreenSizeProvider/ScreenSizeProvider'

const DEFAULT_GAP = 4
const PSEUDO_FLEX_COLS = 12
const COLUMN_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

// Typescript (rightly) dislikes IE property names, so...
const css = {
  grid: '-ms-grid',
  gridTemplateRows: '-ms-grid-rows' as 'gridTemplateRows',
  gridTemplateColumns: '-ms-grid-columns' as 'gridTemplateColumns',
  gridRowStart: '-ms-grid-row' as 'gridRowStart',
  gridColumnStart: '-ms-grid-column' as 'gridColumnStart',
  // ...not really true, but as close as we can get.
  gridRowEnd: '-ms-grid-row-span' as 'gridRowEnd',
  gridColumnEnd: '-ms-grid-column-span' as 'gridColumnEnd',
  justifySelf: '-ms-grid-column-align' as 'justifySelf',
  alignSelf: '-ms-grid-row-align' as 'alignSelf',
}
if (!isIE) {
  Object.keys(css).forEach((key) => ((css as any)[key] = key))
}

type GridProperty = keyof typeof css
type ColumnNum = typeof COLUMN_NUMS[number]
type PseudoFlexProps = { [K in ScreenSize]?: ColumnNum }

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
  gridAreas?: { [key: string]: SS.ResponsiveValue<Property.GridArea> }
  // I'm supporting these for completeness, but their syntax isn't very React-friendly.
  grid?: SS.ResponsiveValue<Property.Grid>
  gridTemplate?: SS.ResponsiveValue<Property.GridTemplate>
  gridTemplateAreas?: SS.ResponsiveValue<Property.GridTemplateAreas>
}

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

const gridItemStyles = (function () {
  let itemStyleConfig: SS.Config
  if (isIE) {
    const delimiter = /\s*\/\s*/
    const spanRegex = /span/i
    const getStartSpan = (
      startProp: GridProperty,
      spanProp: GridProperty,
      start: string,
      end?: string
    ) => {
      const styles: { [K in GridProperty]?: string } = {}
      if (end) {
        if (spanRegex.test(end)) {
          styles[spanProp] = String(parseInt(end.replace(spanRegex, '')))
        } else {
          styles[spanProp] = String(parseInt(end) - parseInt(start))
        }
      }
      styles[startProp] = start
      return styles
    }

    const getCombinedStartEndParser =
      (startProp: GridProperty, spanProp: GridProperty): SS.ConfigFunction =>
      (spec) => {
        if (spec) {
          if (typeof spec === 'number') {
            return getStartSpan(startProp, spanProp, String(spec))
          } else if (typeof spec === 'string') {
            const [start, end] = spec.split(delimiter)
            return getStartSpan(startProp, spanProp, start, end)
          }
        }
      }

    const getStartParser =
      (startProp: GridProperty): SS.ConfigFunction =>
      (start) => {
        if (start) {
          return { [startProp]: String(start) }
        }
      }

    const getEndParser =
      (spanProp: GridProperty): SS.ConfigFunction =>
      (span, _, props) => {
        if (span) {
          let end = span
          if (typeof span === 'string') {
            if (spanRegex.test(span)) {
              span = span.replace(spanRegex, '').trim()
            } else {
              end = parseInt(span)
            }
          }
          if (typeof end === 'number') {
            const start =
              spanProp === css.gridRowEnd ? props.rowStart : props.colStart || props.columnStart
            span = end - (parseInt(start) || 1)
          }
          return { [spanProp]: String(span) }
        }
      }

    itemStyleConfig = {
      row: getCombinedStartEndParser(css.gridRowStart, css.gridRowEnd),
      rowStart: getStartParser(css.gridRowStart),
      rowEnd: getEndParser(css.gridRowEnd),
      col: getCombinedStartEndParser(css.gridColumnStart, css.gridColumnEnd),
      colStart: getStartParser(css.gridColumnStart),
      colEnd: getEndParser(css.gridColumnEnd),
      gridArea: (areaSpec: unknown) => {
        if (areaSpec && typeof areaSpec === 'string') {
          const [rowStart, colStart, rowEnd, colEnd] = areaSpec.split(delimiter)
          const rowStyles = getStartSpan(css.gridRowStart, css.gridRowEnd, rowStart, rowEnd)
          const colStyles = getStartSpan(css.gridColumnStart, css.gridColumnEnd, colStart, colEnd)
          return Object.assign(rowStyles, colStyles)
        }
      },
      justifySelf: { property: css.justifySelf },
      alignSelf: { property: css.alignSelf },
    }
  } else {
    // Stringify to ensure grid lines won't be treated like CSS <length> values.
    const transform = (val: unknown) => (typeof val === 'number' ? String(val) : val)
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
})()

const pseudoFlexStyles = (props: GridItemProps) => {
  if (!props.colEnd && !props.columnEnd) {
    const spans = screenSizes.map((size) => props[size] && `span ${props[size]}`)
    if (spans.some(Boolean)) {
      return { ...props, colEnd: spans }
    }
  }
}

export const GridItem = withStyles(Flex.Item, {
  displayName: 'Grid.Item',
  styles: [gridItemStyles],
  transitiveProps: screenSizes,
  extraAttrs: pseudoFlexStyles,
})`` as GridComponent['Item']

const ColumnPropType = PropTypes.oneOf<ColumnNum>(COLUMN_NUMS)
GridItem.propTypes = {
  tiny: ColumnPropType,
  small: ColumnPropType,
  medium: ColumnPropType,
  large: ColumnPropType,
  extraLarge: ColumnPropType,
}

export const Grid: GridComponent = (function (): any {
  const repeat = (count: number, text: string) => {
    if (!isIE) return `repeat(${count},${text})`
    const result: string[] = []
    for (let i = 0; i < count; i++) result.push(text)
    return result.join(' ')
  }
  // Shortcut, e.g. so you can just say `cols={4}` and it'll add 4 equal columns.
  const templateTransform = (defaultSize: string) => (val: unknown) =>
    typeof val === 'number' ? repeat(val, defaultSize) : val

  const gridStyleConfig: SS.Config = {
    rows: { property: css.gridTemplateRows, transform: templateTransform('min-content') },
    cols: { property: css.gridTemplateColumns, transform: templateTransform('1fr') },
    justifyItems: { property: 'justifyItems' },
    autoFlow: { property: 'gridAutoFlow' },
    autoRows: { property: 'gridAutoRows' },
    autoCols: { property: 'gridAutoColumns' },
    grid: true,
    gridTemplate: true,
    gridTemplateAreas: true,
  }
  gridStyleConfig.justify = gridStyleConfig.justifyItems
  gridStyleConfig.columns = gridStyleConfig.cols
  gridStyleConfig.autoColumns = gridStyleConfig.autoCols

  let GridBase: React.ComponentType = Flex
  let justifyStyles: SS.styleFn

  if (isIE) {
    // Technically there are other indicator props, but none are supported in any
    // way by IE, so if going for IE-compatible they won't be using those anyway.
    const isPseudoFlexMode = (props: GridBoxProps) => ({
      isPseudoFlex: !(props.rows || props.cols || props.columns || props.gridAreas),
    })

    const gridBase = React.forwardRef<HTMLDivElement, { isPseudoFlex: boolean }>(
      ({ isPseudoFlex, ...props }, inRef) => {
        // Make sure we re-run the effect when screen size changes.
        useScreenSize()
        const ref = useMergedRefs(inRef)
        React.useLayoutEffect(() => {
          // IE doesn't auto-fill grids, so we have to do it ourselves.
          if (ref.current && isPseudoFlex) {
            let column = 0 // The math's a bit easier starting from zero.
            let row = 1
            const gridItems = ref.current.children
            for (let i = 0; i < gridItems.length; i++) {
              const item = gridItems[i] as HTMLElement
              const span = parseInt(getComputedStyle(item)[css.gridColumnEnd])
              if (span + column > PSEUDO_FLEX_COLS) {
                row += 1
                column = 0
              }
              item.style[css.gridRowStart] = String(row)
              item.style[css.gridColumnStart] = String(column + 1)
              column += span
            }
            ref.current.style[css.gridTemplateRows] = repeat(row, 'min-content')
          }
        })
        return <Flex {...props} ref={ref} />
      }
    )

    const applyJustifyToChildren = (value: unknown) => {
      if (value) return { '& > *': { [css.justifySelf]: value } }
    }
    // Keeping this separate from the inline styles because it applies to children.
    justifyStyles = SS.system({
      justify: applyJustifyToChildren,
      justifyItems: applyJustifyToChildren,
      alignItems: (value: unknown) => {
        // Note the key is slightly different to prevent overwriting
        // if both `alignItems` & `justifyItems` are passed.
        if (value) return { '&>*': { [css.alignSelf]: value } }
      },
    })
    GridBase = styled(gridBase).attrs(isPseudoFlexMode)``
  } else {
    // Could be a constant, but it makes things more symmetrical with the IE code.
    justifyStyles = () => ({ justifyItems: 'normal' })
  }

  const pseudoFlexColumns = repeat(PSEUDO_FLEX_COLS, 'minmax(1px, 1fr)')
  const gridStyles = (props: GridBoxProps & { theme: CactusTheme }) => {
    const styles = justifyStyles(props)
    styles.width = '100%'
    styles.display = css.grid
    styles[css.gridTemplateColumns] = pseudoFlexColumns
    if (gapWorkaround) {
      Object.assign(styles, gapWorkaround({ gap: DEFAULT_GAP, theme: props.theme }))
    } else {
      styles.gap = props.theme.space[DEFAULT_GAP]
    }

    const { gridAreas } = props
    if (gridAreas) {
      for (const className of Object.keys(gridAreas)) {
        styles[`.${className}`] = gridItemStyles({
          gridArea: gridAreas[className],
          theme: props.theme,
        })
      }
    }
    return styles
  }
  return withStyles(GridBase, {
    displayName: 'Grid',
    transitiveProps: ['gridAreas'],
    styles: [SS.system(gridStyleConfig)],
  })(gridStyles)
})()

Grid.Item = GridItem
Grid.supportsGap = Flex.supportsGap
Grid.supportsGrid = typeof CSS !== 'undefined' && CSS.supports?.('display', 'grid')

export default Grid
