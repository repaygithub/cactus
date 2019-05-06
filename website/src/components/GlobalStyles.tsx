import * as styledComponents from 'styled-components'
import { CactusTheme } from '@repay/cactus-theme'

const { createGlobalStyle } = styledComponents as styledComponents.ThemedStyledComponentsModule<
  CactusTheme
>

const CactusGlobalStyles = createGlobalStyle`
html,
body {
  font-family: Helvetica, Arial, sans-serif;
  font-size: ${p => p.theme.fontSizes.body};
  font-weight: 400;
  color: ${p => p.theme.colors.darkestContrast};
  font-style: normal;
  font-stretch: normal;
  line-height: 1.56;
  letter-spacing: normal;
}
`

export default CactusGlobalStyles
