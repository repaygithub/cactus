import { Property } from 'csstype'
import React from 'react'
import { ColorProps, ResponsiveValue, SpaceProps, VerticalAlignProps } from 'styled-system'

export type IconSizes = 'tiny' | 'small' | 'medium' | 'large' | Property.FontSize<number>
export interface IconStyleProps extends SpaceProps, ColorProps, VerticalAlignProps {
  iconSize?: ResponsiveValue<IconSizes>
}
export type SVGProps = Omit<React.SVGProps<SVGSVGElement>, 'color' | 'opacity'>
export interface IconProps extends SVGProps, IconStyleProps {}
