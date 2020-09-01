import React from 'react'

// This can also be used just to flatten the children, but cloning seems the more likely use case.
export function cloneAll(
  children: React.ReactNode,
  cloneProps?: Record<string, any>
): React.ReactChild[] {
  const hasKeyPrefix = cloneProps && (cloneProps.key || cloneProps.key === 0)
  const childArray = React.Children.toArray(children) as React.ReactChild[]
  return childArray.reduce((children, child) => {
    if (!child || typeof child === 'string' || typeof child === 'number') {
      children.push(child)
    } else {
      const key = hasKeyPrefix ? `${cloneProps?.key}${child.key}` : child.key
      const props: Record<string, any> = cloneProps ? { ...cloneProps, key } : { key }
      if (child.type === React.Fragment) {
        if (child.props.children) {
          children.push(...cloneAll(child.props.children, props))
        }
      } else if (hasKeyPrefix || cloneProps) {
        children.push(React.cloneElement(child, props))
      } else {
        children.push(child)
      }
    }
    return children
  }, [] as React.ReactChild[])
}

type Ref<T> = React.RefCallback<T> | React.MutableRefObject<T> | null | undefined

export function useMergedRefs<T>(...refs: Ref<T>[]): React.RefCallback<T> {
  return React.useCallback(
    (value: T | null) => {
      for (const ref of refs) {
        if (!ref || !value) {
          continue
        } else if (typeof ref === 'function') {
          ref(value)
        } else {
          ref.current = value
        }
      }
    },
    [refs]
  )
}
