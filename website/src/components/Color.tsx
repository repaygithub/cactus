import StatusX from '@repay/cactus-icons/i/navigation-close'
import StatusCheck from '@repay/cactus-icons/i/status-check'
import cactusTheme, { CactusColor, ColorVariant } from '@repay/cactus-theme'
import { Box, Flex } from '@repay/cactus-web'
import Color from 'color'
import * as React from 'react'
import styled from 'styled-components'
import {
  border,
  borderBottom,
  BorderBottomProps,
  borderColor,
  BorderColorProps,
  borderLeft,
  BorderLeftProps,
  BorderProps,
  borderRight,
  BorderRightProps,
  borderStyle,
  BorderStyleProps,
  borderTop,
  BorderTopProps,
  borderWidth,
  BorderWidthProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
} from 'styled-system'

import { useCactusTheme } from './CactusProvider'
import { Span } from './Text'

const upperCaseFirst = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)
const extraStyles: React.CSSProperties = { textAlign: 'right' }

interface ColorDisplayProps {
  displayName?: string
  color: CactusColor | string
  textColor?: CactusColor | string
}

const cactusColors = Object.keys(cactusTheme.colors)
function isCactusColor(color: string): color is CactusColor {
  return cactusColors.includes(color)
}

function ColorDisplay({ displayName, color, textColor }: ColorDisplayProps): React.ReactElement {
  const theme = useCactusTheme()
  const hasDisplayName = Boolean(displayName)
  let hslaStr: string
  if (isCactusColor(color)) {
    hslaStr = theme.colors[color]
  } else {
    hslaStr = color
  }
  const c = Color(hslaStr)
  const [hue, saturation, luminosity, alpha] = c.array()
  const isWhite = hue === 0 && saturation === 0 && luminosity === 100
  return (
    <Box
      pt={hasDisplayName ? 4 : 3}
      px={3}
      pb={3}
      mb={hasDisplayName ? 0 : '-4px'}
      width="105%"
      color={textColor}
      bg={color}
      borderWidth="1px"
      borderStyle="solid"
      borderColor={isWhite ? theme.colors.mediumGray : color}
      borderRadius="4px"
      style={extraStyles}
    >
      {hasDisplayName && (
        <>
          <span>#{displayName}</span>
          <br />
        </>
      )}
      <span>Hex {c.hex().slice(1)}</span>
      <br />
      <span>
        H{hue} S{saturation} L{luminosity} A{alpha}
      </span>
    </Box>
  )
}

interface ColorBoxProps {
  name: ColorVariant
  title?: string
  children?: React.ReactNode
}

export function ColorBox({ name, title, children }: ColorBoxProps): React.ReactElement {
  const theme = useCactusTheme()
  const displayName = title || upperCaseFirst(name)
  const variant = theme.colorStyles[name]
  return (
    <Box px={4} py={3} width="240px">
      <ColorDisplay
        displayName={displayName}
        color={variant.backgroundColor}
        textColor={variant.color}
      />
      {children}
    </Box>
  )
}

interface PaletteItem {
  bg: CactusColor
  color: CactusColor
}

interface PaletteBoxProps {
  colors: PaletteItem[]
  title: string
  children?: React.ReactNode
}

export function PaletteBox({ colors, title, children }: PaletteBoxProps): React.ReactElement {
  return (
    <Box px={4} py={3} width="240px">
      {colors.map(
        (item, index): React.ReactElement => (
          <ColorDisplay
            key={item.bg}
            displayName={index === colors.length ? title : undefined}
            color={item.bg}
            textColor={item.color}
          />
        )
      )}
      {children}
    </Box>
  )
}

interface CellProps
  extends BorderProps,
    BorderTopProps,
    BorderRightProps,
    BorderBottomProps,
    BorderLeftProps,
    BorderWidthProps,
    BorderStyleProps,
    BorderColorProps,
    SpaceProps,
    TextAlignProps {}

let Cell = styled('td')<CellProps>(
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  borderWidth,
  borderStyle,
  borderColor,
  space,
  textAlign
)

Cell.defaultProps = {
  px: 3,
  pt: 3,
}

Cell = styled(Cell)`
  position: relative;
  width: 20%;

  @media only screen and (max-width: 500px) {
    font-size: 16px;
    min-height: 40px;
    padding: 5px 0 5px 25px;
    display: block;
  }
`

const HCell = styled(Cell)`
  position: relative;
  width: 20%;

  @media only screen and (max-width: 500px) {
    font-size: 16px;
    display: block;
    padding: 3px;
    width: 85px;
    height: 50px;
  }
`
HCell.defaultProps = {
  px: 2,
  pt: 3,
  pb: 3,
}

const VertHCell = styled(Cell)`
  position: relative;
  width: 20%;

  @media only screen and (max-width: 500px) {
    text-align: left;
    display: block;
    width: 100%;
    height: 50px;
  }
`

const AccessibilityFlex = styled(Flex)`
  max-width: 500px;
  margin: 16px;

  @media only screen and (max-width: 500px) {
    max-width: 95%;
  }
`

const SmallTitle = styled(Span)`
  @media only screen and (max-width: 500px) {
    font-size: 18px;
    padding: 0 5px 0 0;
  }
`

const Table = styled.table`
  width: 100%;

  tr:first-child {
    border-bottom: 1px solid;
  }

  @media only screen and (max-width: 500px) {
    th,
    td {
      border: none;
    }
    table,
    tbody {
      display: grid;
      border: none;
    }
    tbody {
      grid-row-gap: 20%;
      grid-template-columns: 85px 85px 85px;
    }

    tr {
      text-align: center;
      border-left: 1px solid;
      &:nth-child(1) {
        border-left: none;
      }
    }

    th:first-child {
      border-bottom: 1px solid;
    }
    td:first-child {
      border-bottom: 1px solid;
    }
    tr:first-child {
      border-bottom: none;
    }
  }
`

const whiteColor = new Color(cactusTheme.colors.white)

type AccessibilityLevel = 'AA' | 'AAA' | 'interface'
type AccessibilityTextSize = 'normal' | 'large'

function checkAccessibility(
  contrast: number,
  level: AccessibilityLevel,
  textSize?: AccessibilityTextSize
): boolean {
  if (level === 'AA') {
    if (textSize === 'normal') {
      return contrast > 4.5
    } else {
      return contrast > 3
    }
  } else if (level === 'AAA') {
    if (textSize === 'normal') {
      return contrast > 7
    } else {
      return contrast > 4.5
    }
  } else {
    return contrast > 3
  }
}

interface AccessibilityCheckProps {
  contrast: number
  isDark: boolean
  level: AccessibilityLevel
  textSize?: AccessibilityTextSize
}

function AccessibilityCheck({
  contrast,
  isDark,
  level,
  textSize,
}: AccessibilityCheckProps): React.ReactElement {
  const isAccessible = checkAccessibility(contrast, level, textSize)
  let bg: CactusColor | null = null
  let iconColor: CactusColor | null = null
  if (isDark) {
    bg = 'white'
    iconColor = isAccessible ? 'success' : 'error'
  } else {
    bg = isAccessible ? 'success' : 'error'
    iconColor = 'white'
  }
  return (
    <>
      <Box
        display="inline-block"
        borderRadius="50%"
        width="24px"
        height="24px"
        p={1}
        bg={bg}
        color={iconColor}
        style={{ lineHeight: '1em', fontSize: '16px', textAlign: 'center' }}
      >
        {isAccessible ? <StatusCheck /> : <StatusX />}
      </Box>
      <br />
      <Span
        color={isDark ? 'white' : 'darkestContrast'}
        fontSize="small"
        lineHeight="1em"
        fontWeight={300}
      >
        {isAccessible ? 'Pass' : 'Fail'}
      </Span>
    </>
  )
}

interface AccessibilityBoxProps {
  color: CactusColor
  title: string
  isDark: boolean
}

export function AccessibilityBox({
  color,
  title,
  isDark,
}: AccessibilityBoxProps): React.ReactElement {
  const theme = useCactusTheme()
  const compareColor: CactusColor = isDark ? 'white' : 'darkestContrast'
  const borderColor = theme.colors[compareColor]
  const borderStyle = `1px solid ${borderColor}`
  const hslaStr = theme.colors[color]
  const thisColor = new Color(hslaStr)
  const contrastToWhite = thisColor.contrast(whiteColor)
  const contrastToDarkestContrast = thisColor.contrast(new Color(theme.colors.darkestContrast))
  return (
    <AccessibilityFlex
      p={4}
      m={4}
      borderRadius="2px"
      bg={color}
      color={compareColor}
      style={color === 'white' ? { border: borderStyle } : {}}
    >
      <Table style={{ borderCollapse: 'collapse', borderColor }}>
        <tbody>
          <tr>
            <HCell as="th" textAlign="left">
              <SmallTitle fontSize="h4" fontWeight={400}>
                {title}
              </SmallTitle>
            </HCell>
            <VertHCell as="th" borderRight={borderStyle}>
              <Span fontWeight={300} fontSize="small">
                Ratio
              </Span>
            </VertHCell>
            <VertHCell as="th">
              <Span fontSize="h3" fontWeight={400}>
                Aa
              </Span>
            </VertHCell>
            <VertHCell as="th" borderRight={borderStyle}>
              <Span fontSize="small" fontWeight={400}>
                Aa
              </Span>
            </VertHCell>
            <VertHCell as="th">
              <Span fontSize="h3" fontWeight={400}>
                Aa
              </Span>
            </VertHCell>
            <VertHCell as="th" borderRight={borderStyle}>
              <Span fontSize="small" fontWeight={400}>
                Aa
              </Span>
            </VertHCell>
            <VertHCell as="th" pl={3}>
              <Box
                display="inline-block"
                width="20px"
                height="20px"
                borderRadius="3px"
                borderWidth="1px"
                borderStyle="solid"
                borderColor={compareColor}
                bg="transparent"
              />
            </VertHCell>
          </tr>

          <tr>
            <HCell>
              <Span color="white" fontSize="small">
                White
              </Span>
            </HCell>
            <Cell borderRight={borderStyle} textAlign="center">
              <Span> {contrastToWhite.toFixed(2)}</Span>
            </Cell>
            <Cell textAlign="center">
              <AccessibilityCheck
                isDark={isDark}
                contrast={contrastToWhite}
                level="AA"
                textSize="large"
              />
            </Cell>
            <Cell textAlign="center" borderRight={borderStyle}>
              <AccessibilityCheck
                isDark={isDark}
                contrast={contrastToWhite}
                level="AA"
                textSize="normal"
              />
            </Cell>
            <Cell textAlign="center">
              <AccessibilityCheck
                isDark={isDark}
                contrast={contrastToWhite}
                level="AAA"
                textSize="large"
              />
            </Cell>
            <Cell textAlign="center" borderRight={borderStyle}>
              <AccessibilityCheck
                isDark={isDark}
                contrast={contrastToWhite}
                level="AAA"
                textSize="normal"
              />
            </Cell>
            <Cell textAlign="center">
              <AccessibilityCheck isDark={isDark} contrast={contrastToWhite} level="interface" />
            </Cell>
          </tr>
          <tr>
            <HCell data-name={title}>
              <Span color="darkestContrast" fontSize="small">
                Darkest Contrast
              </Span>
            </HCell>
            <Cell borderRight={borderStyle} textAlign="center">
              <Span>{contrastToDarkestContrast.toFixed(2)} </Span>
            </Cell>
            <Cell textAlign="center">
              <AccessibilityCheck
                isDark={isDark}
                contrast={contrastToDarkestContrast}
                level="AA"
                textSize="large"
              />
            </Cell>
            <Cell textAlign="center" borderRight={borderStyle}>
              <AccessibilityCheck
                isDark={isDark}
                contrast={contrastToDarkestContrast}
                level="AA"
                textSize="normal"
              />
            </Cell>
            <Cell textAlign="center">
              <AccessibilityCheck
                isDark={isDark}
                contrast={contrastToDarkestContrast}
                level="AAA"
                textSize="large"
              />
            </Cell>
            <Cell textAlign="center" borderRight={borderStyle}>
              <AccessibilityCheck
                isDark={isDark}
                contrast={contrastToDarkestContrast}
                level="AAA"
                textSize="normal"
              />
            </Cell>
            <Cell textAlign="center">
              <AccessibilityCheck
                isDark={isDark}
                contrast={contrastToDarkestContrast}
                level="interface"
              />
            </Cell>
          </tr>
        </tbody>
      </Table>
    </AccessibilityFlex>
  )
}
