import * as React from 'react'

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
import { Span } from './Text'
import Box, { Flex } from './Box'
import cactusTheme, { CactusColor, ColorVariant } from '@repay/cactus-theme'
import Color from 'color'
import StatusCheck from '@repay/cactus-icons/i/status-check'
import StatusX from '@repay/cactus-icons/i/navigation-close'
import styled from 'styled-components'

const upperCaseFirst = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
const extraStyles: React.CSSProperties = { textAlign: 'right' }

type ColorDisplayProps = {
  displayName?: string
  color: CactusColor | string
  textColor?: CactusColor | string
}

function isCactusColor(color: string): color is CactusColor {
  return cactusTheme.colors.hasOwnProperty(color)
}

function ColorDisplay({ displayName, color, textColor }: ColorDisplayProps) {
  const hasDisplayName = Boolean(displayName)
  let hslaStr: string
  if (isCactusColor(color)) {
    hslaStr = cactusTheme.colors[color]
  } else {
    hslaStr = color
  }
  let c = Color(hslaStr)
  let [hue, saturation, luminosity, alpha] = c.array()
  const isWhite = hue === 0 && saturation === 0 && luminosity === 100
  return (
    <Box
      pt={hasDisplayName ? 4 : 3}
      px={3}
      pb={3}
      mb={hasDisplayName ? 0 : '-4px'}
      width="100%"
      color={textColor}
      bg={color}
      borderWidth="1px"
      borderStyle="solid"
      borderColor={isWhite ? cactusTheme.colors.mediumGray : color}
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

type ColorBoxProps = {
  name: ColorVariant
  title?: string
  children?: React.ReactNode
}

export function ColorBox({ name, title, children }: ColorBoxProps) {
  let displayName = title || upperCaseFirst(name)
  let variant = cactusTheme.colorStyles[name]
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
type PaletteItem = {
  bg: CactusColor
  color: CactusColor
}

type PaletteBoxProps = {
  colors: PaletteItem[]
  title: string
  children?: React.ReactNode
}

export function PaletteBox({ colors, title, children }: PaletteBoxProps) {
  return (
    <Box px={4} py={3} width="240px">
      {colors.map((item, index) => (
        <ColorDisplay
          displayName={index === colors.length ? title : undefined}
          color={item.bg}
          textColor={item.color}
        />
      ))}
      {children}
    </Box>
  )
}

const Table = styled.table``

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

const Cell = styled('td')<CellProps>(
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

const HCell = styled(Cell)`
  position: relative;
`

HCell.defaultProps = {
  px: 3,
  pt: 0,
  pb: 2,
}

const whiteColor = new Color(cactusTheme.colors.white)
const darkestContrastColor = new Color(cactusTheme.colors.darkestContrast)

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

function AccessibilityCheck({ contrast, isDark, level, textSize }: AccessibilityCheckProps) {
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
        fontSize="12px"
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

export function AccessibilityBox({ color, title, isDark }: AccessibilityBoxProps) {
  const compareColor: CactusColor = isDark ? 'white' : 'darkestContrast'
  const borderColor = cactusTheme.colors[compareColor]
  const borderStyle = `1px solid ${borderColor}`
  const hslaStr = cactusTheme.colors[color]
  let thisColor = new Color(hslaStr)
  const contrastToWhite = thisColor.contrast(whiteColor)
  const contrastToDarkestContrast = thisColor.contrast(darkestContrastColor)
  return (
    <Flex
      flexWrap="wrap"
      p={4}
      m={4}
      borderRadius="4px"
      bg={color}
      color={compareColor}
      style={color === 'white' ? { border: borderStyle } : {}}
    >
      <Table style={{ borderCollapse: 'collapse', borderSpacing: 0, width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: borderStyle }}>
            <HCell as="th" textAlign="left">
              <Span fontSize="h4" lineHeight="1em" fontWeight={400}>
                {title}
              </Span>
              <Box position="absolute" left="8px" top="-48px">
                <Span color="darkestContrast" fontSize="9.6px" fontWeight={400}>
                  Color
                </Span>
              </Box>
            </HCell>
            <HCell as="th" borderRight={borderStyle}>
              <Span fontWeight={300} fontSize="small" lineHeight="1em">
                Ratio
              </Span>
            </HCell>
            <HCell as="th">
              <Span fontSize="h3" lineHeight="1em" fontWeight={400}>
                Aa
              </Span>
              <Box position="absolute" left="8px" top="-48px" width="150%">
                <Span color="darkestContrast" fontSize="9.6px" fontWeight={400}>
                  AA Levels
                </Span>
              </Box>
            </HCell>
            <HCell as="th" borderRight={borderStyle}>
              <Span fontSize="small" lineHeight="1em" fontWeight={400}>
                Aa
              </Span>
            </HCell>
            <HCell as="th">
              <Span fontSize="h3" lineHeight="1em" fontWeight={400}>
                Aa
              </Span>
              <Box position="absolute" left="8px" top="-48px" width="150%">
                <Span color="darkestContrast" fontSize="9.6px" fontWeight={400}>
                  AAA Levels
                </Span>
              </Box>
            </HCell>
            <HCell as="th" borderRight={borderStyle}>
              <Span fontSize="small" lineHeight="1em" fontWeight={400}>
                Aa
              </Span>
            </HCell>
            <HCell as="th" pl={3}>
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
              <Box position="absolute" left="0" top="-48px" width="100%">
                <Span color="darkestContrast" fontSize="9.6px" fontWeight={400}>
                  Interface
                </Span>
              </Box>
            </HCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Cell textAlign="left">
              <Span color="white" fontSize="small">
                White
              </Span>
            </Cell>
            <Cell borderRight={borderStyle}>{contrastToWhite.toFixed(2)}</Cell>
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
            <Cell textAlign="left">
              <Span color="darkestContrast" fontSize="small">
                DarkestContrast
              </Span>
            </Cell>
            <Cell borderRight={borderStyle}>{contrastToDarkestContrast.toFixed(2)}</Cell>
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
    </Flex>
  )
}
