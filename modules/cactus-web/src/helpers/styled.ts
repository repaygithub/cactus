import { CactusTheme } from '@repay/cactus-theme'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { StyledComponent, ThemedStyledFunction } from 'styled-components'
import { compose, flexbox, FlexboxProps, ResponsiveValue, styleFn, system } from 'styled-system'

// This file exists, in part, because styled-components types are a PAIN.
export type Styled<P> = StyledComponent<React.FC<P>, CactusTheme>

// This works around the `babel-plugin-styled-components` `displayName` setting,
// so we can specify the CSS class of the resulting component.
export const styledWithClass = <C extends React.ElementType>(
  component: C,
  className: string
): ThemedStyledFunction<C, CactusTheme> => {
  const tag: any = styled(component)
  return tag.withConfig({ componentId: className })
}

// This gives us a styled component without the polymorphic behavior: the `as`
// attr overrides any `as` prop passed in. Unfortunately I can't think of a way
// to make Typescript consider it an invalid prop as well.
export const styledUnpoly = <C extends React.ElementType, F extends React.ElementType = C>(
  component: C,
  fixed: F = component as any
): ThemedStyledFunction<F, CactusTheme> => {
  let tag: any = styled(component).attrs({ as: fixed } as any)
  if ('displayName' in fixed) {
    tag = tag.withConfig({ displayName: (fixed as any).displayName })
  }
  return tag
}

const cssVal = PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
export const styledProp = PropTypes.oneOfType([cssVal, PropTypes.arrayOf(cssVal)])

export const classes = (...args: (string | undefined)[]): string => args.filter(Boolean).join(' ')

export const pickStyles = (styles: styleFn, ...keys: string[]): styleFn => {
  const picked: styleFn[] = []
  for (const key of keys) {
    const maybeFn = (styles as any)[key]
    if (maybeFn) picked.push(maybeFn)
  }
  return compose(...picked)
}

export const omitStyles = (styles: styleFn, ...keys: string[]): styleFn => {
  const picked: styleFn[] = []
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  for (const key of Object.keys(styles.config!)) {
    if (!keys.includes(key)) {
      picked.push((styles as any)[key])
    }
  }
  return compose(...picked)
}

// Not exhaustive, but all possible values include at least one of these words.
const isFlexKey = RegExp.prototype.test.bind(/row|column|reverse|wrap/)

// Gives a shortcut to common flex props, e.g. `<C flexFlow="row wrap">`
// is equivalent to `<C display="flex" flexDirection="row" flexWrap="wrap">`.
// Depending on where it's used, the `display` part could be redundant;
// keep that in mind if you need a different `display` value (e.g. 'inline-flex').
export const flexFlow = system({
  flexFlow: (value: any) => {
    if (typeof value === 'boolean') {
      return value ? { display: 'flex' } : undefined
    } else if (isFlexKey(value)) {
      return { display: 'flex', flexFlow: value }
    }
  },
})

const flexKeys = [
  'alignItems',
  'alignContent',
  'justifyItems',
  'justifyContent',
  'flexWrap',
  'flexDirection',
] as const
const itemKeys = [
  'flex',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'justifySelf',
  'alignSelf',
  'order',
] as const

export interface FlexProps extends Pick<FlexboxProps, typeof flexKeys[number]> {
  flexFlow?: ResponsiveValue<boolean | string>
}
export type FlexItemProps = Pick<FlexboxProps, typeof itemKeys[number]>
;(flexbox as any).flexFlow = flexFlow
export const flexContainer = pickStyles(flexbox, 'flexFlow', ...flexKeys)
export const flexItem = pickStyles(flexbox, ...itemKeys)
