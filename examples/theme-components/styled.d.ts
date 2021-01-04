import 'styled-components'

import { CactusTheme } from '@repay/cactus-theme'

declare module 'styled-components' {
  export interface DefaultTheme extends CactusTheme {} // eslint-disable-line @typescript-eslint/no-empty-interface
}
