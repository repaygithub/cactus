import {
  margin,
  marginTop,
  marginBottom,
  marginRight,
  marginLeft,
  mapProps,
  compose,
  is,
  TLengthStyledSystem,
  ResponsiveValue,
} from 'styled-system'
import * as CSS from 'csstype'
import { Omit } from '../types'

export interface MarginProps<TLength = TLengthStyledSystem> {
  /** Margin on top, left, bottom and right */
  m?: ResponsiveValue<CSS.MarginProperty<TLength>>
  /** Margin on top, left, bottom and right */
  margin?: ResponsiveValue<CSS.MarginProperty<TLength>>
  /** Margin on top */
  mt?: ResponsiveValue<CSS.MarginTopProperty<TLength>>
  /** Margin on top */
  marginTop?: ResponsiveValue<CSS.MarginTopProperty<TLength>>
  /** Margin on right */
  mr?: ResponsiveValue<CSS.MarginRightProperty<TLength>>
  /** Margin on right */
  marginRight?: ResponsiveValue<CSS.MarginRightProperty<TLength>>
  /** Margin on bottom */
  mb?: ResponsiveValue<CSS.MarginBottomProperty<TLength>>
  /** Margin on bottom */
  marginBottom?: ResponsiveValue<CSS.MarginBottomProperty<TLength>>
  /** Margin on left */
  ml?: ResponsiveValue<CSS.MarginLeftProperty<TLength>>
  /** Margin on left */
  marginLeft?: ResponsiveValue<CSS.MarginLeftProperty<TLength>>
  /** Margin on left and right */
  mx?: ResponsiveValue<CSS.PaddingProperty<TLength>>
  /** Margin on top and bottom */
  my?: ResponsiveValue<CSS.PaddingProperty<TLength>>
}

export const margins = mapProps(props => ({
  ...props,
  mt: is(props.my) ? props.my : props.mt,
  mb: is(props.my) ? props.my : props.mb,
  ml: is(props.mx) ? props.mx : props.ml,
  mr: is(props.mx) ? props.mx : props.mr,
}))(
  compose(
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight
  )
)

export function splitProps<ComponentProps extends MarginProps>(
  props: ComponentProps
): [Omit<ComponentProps, keyof MarginProps>, MarginProps] {
  // Destructure any margin space props and create an object out of them
  const {
    m,
    margin,
    mt,
    marginTop,
    mr,
    marginRight,
    mb,
    marginBottom,
    ml,
    marginLeft,
    mx,
    my,
    ...componentProps
  } = props
  const marginProps: MarginProps = {
    m,
    margin,
    mt,
    marginTop,
    mr,
    marginRight,
    mb,
    marginBottom,
    ml,
    marginLeft,
    mx,
    my,
  }

  return [componentProps as Omit<ComponentProps, keyof MarginProps>, marginProps]
}
