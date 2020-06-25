import 'styled-components'
import { CactusTheme } from '@repay/cactus-theme'

declare module 'styled-components' {
  export interface DefaultTheme extends CactusTheme {}

  export type StyledComponentType<P> = StyledComponent<
    React.FunctionComponent<P>,
    DefaultTheme,
    {},
    never
  >
}
