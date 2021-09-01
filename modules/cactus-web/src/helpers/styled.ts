import React from 'react'
import styled from 'styled-components'

// This works around the `babel-plugin-styled-components` `displayName` setting,
// so we can specify the CSS class of the resulting component.
export const styledWithClass = (
  component: React.ElementType,
  className: string
): ReturnType<typeof styled> => {
  const tag = styled(component)
  return tag.withConfig({ componentId: className } as any)
}

export const classes = (...args: (string | undefined)[]): string => args.filter(Boolean).join(' ')
