import styled, { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { boxShadow, fontSize } from '../helpers/theme'

export type AvatarStep = 'notDone' | 'inProcess' | 'done'

interface StepAvatarProps extends MarginProps {
  status?: AvatarStep
}

type StepColor = { [K in AvatarStep]: FlattenInterpolation<ThemeProps<DefaultTheme>> }

const stepColorMap: StepColor = {
  notDone: css`
    ${(p) => p.theme.colorStyles.lightContrast};
  `,
  inProcess: css`
    ${(p) => p.theme.colorStyles.callToAction};
    ${(p) => boxShadow(p.theme, 1)};
  `,
  done: css`
    ${(p) => p.theme.colorStyles.base};
  `,
}

const variant = (
  props: StepAvatarProps
): FlattenInterpolation<ThemeProps<DefaultTheme>> | undefined => {
  const { status: stepType } = props
  //@ts-ignore
  return stepColorMap[stepType]
}

export const StepAvatar = styled.div<StepAvatarProps>`
  box-sizing: border-box;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  line-height: 49px;
  ${(p) => fontSize(p.theme, 'h2')}
  font-weight: 400;
  text-align: center;
  appearance: none;
  padding: 0px;
  border: none;

  ${margin}
  ${variant}
`
StepAvatar.defaultProps = {
  status: 'notDone',
}

export default StepAvatar
