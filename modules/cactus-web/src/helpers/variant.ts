// This is heavily based on `@styled-system/variant`; their version only supported
// objects as possible variant values, but I needed something that would allow the
// full range of values supported by `styled-components`. By the time I trimmed
// all the stuff I didn't need from their implementation, it was vastly simpler...

export function variant(variants: any, prop: string = 'variant'): (props: any) => any {
  return (props: any): any => variants[props[prop]]
}

export default variant
