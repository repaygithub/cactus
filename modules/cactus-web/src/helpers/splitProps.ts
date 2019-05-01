import { SpaceProps, TLengthStyledSystem } from 'styled-system'

type Margin =
  | 'm'
  | 'margin'
  | 'mt'
  | 'marginTop'
  | 'mr'
  | 'marginRight'
  | 'mb'
  | 'marginBottom'
  | 'ml'
  | 'marginLeft'
  | 'mx'
  | 'my'
type MarginProps = {
  [K in Margin]:
    | string
    | number
    | (string | number | null)[]
    | undefined
    | { [key: string]: TLengthStyledSystem }
}

type Padding =
  | 'p'
  | 'padding'
  | 'pt'
  | 'paddingTop'
  | 'pr'
  | 'paddingRight'
  | 'pb'
  | 'paddingBottom'
  | 'pl'
  | 'paddingLeft'
  | 'px'
  | 'py'
type PaddingProps = {
  [K in Padding]:
    | string
    | number
    | (string | number | null)[]
    | undefined
    | { [key: string]: TLengthStyledSystem }
}

function splitProps<ComponentProps extends SpaceProps>(
  props: ComponentProps,
  componentName: string
): [ComponentProps, SpaceProps] {
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
    ...rest
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

  // Destructure any padding space props and create an object out of them
  const {
    p,
    padding,
    pt,
    paddingTop,
    pr,
    paddingRight,
    pb,
    paddingBottom,
    pl,
    paddingLeft,
    px,
    py,
    ...componentProps
  } = rest
  const paddingProps: PaddingProps = {
    p,
    padding,
    pt,
    paddingTop,
    pr,
    paddingRight,
    pb,
    paddingBottom,
    pl,
    paddingLeft,
    px,
    py,
  }

  // Identify and report on any padding props that were passed
  const paddingKeys = Object.keys(paddingProps) as Padding[]
  paddingKeys.forEach((key: Padding) => {
    if (paddingProps[key] !== undefined) {
      console.error(
        `Padding props are not supported! The value ${
          paddingProps[key]
        } for prop ${key} will have no effect on ${componentName}.`
      )
    }
  })

  return [componentProps as ComponentProps, marginProps]
}

export default splitProps
