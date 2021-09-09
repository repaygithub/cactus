import React, { ReactElement } from 'react'

import * as icons from '../i'

type IconName = Exclude<keyof typeof icons, 'iconSizes'>
const iconNames = Object.keys(icons).filter((x) => x !== 'iconSizes') as IconName[]

type SizeArg = { iconSize: string }
type Icon = (props: SizeArg & { color: string }) => ReactElement
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
    mapping: iconNames.reduce((mapping, icon) => {
      mapping[icon] = icons[icon]
      return mapping
    }, {} as Record<string, Icon>),
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
