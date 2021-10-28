import { Property } from 'csstype'
import { SVGProps } from 'react'
import { ColorProps, ResponsiveValue, SpaceProps, VerticalAlignProps } from 'styled-system'

export type IconSizes = 'tiny' | 'small' | 'medium' | 'large' | Property.FontSize<number>
export interface IconProps
  extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'color' | 'opacity'>,
    SpaceProps,
    ColorProps,
    VerticalAlignProps {
  iconSize?: ResponsiveValue<IconSizes>
}
