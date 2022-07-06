import React, { ReactElement } from 'react'

import icons, { IconProps } from '../i'

type IconName = keyof typeof icons
const iconNames = Object.keys(icons) as IconName[]

type SizeArg = { iconSize: string }
type Icon = (props: IconProps) => ReactElement
type IconArg = { Icon: Icon }

export default {
  title: 'Icons',
  component: icons as any,
  args: { hue: 210, iconSize: 'large' },
  argTypes: {
    hue: { control: { type: 'range', min: 0, max: 360, step: 1 } },
  },
}

const FLEX = {
  display: 'flex',
  justifyContent: 'center',
  height: '100vh',
  alignItems: 'center',
} as const
export const One = ({ Icon, iconSize }: SizeArg & IconArg): ReactElement => (
  <div style={FLEX}>
    <Icon iconSize={iconSize} color="callToAction" />
  </div>
)
One.args = { Icon: 'ActionsAdd' }
One.argTypes = {
  Icon: {
    name: 'icon',
    control: { type: 'select' },
    options: iconNames,
    mapping: icons,
  },
}

const GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gap: '16px',
  padding: '24px',
  justifyItems: 'center',
} as const
export const All = ({ iconSize }: SizeArg): ReactElement => (
  <div style={GRID}>
    {iconNames.map((key) =>
      React.createElement(icons[key], { key, iconSize, color: 'callToAction' })
    )}
  </div>
)
