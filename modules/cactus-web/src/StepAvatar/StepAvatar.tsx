import { colorStyle, fontSize, shadow } from '@repay/cactus-theme'
import { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components'
import { margin, MarginProps } from 'styled-system'

import { withStyles } from '../helpers/styled'

export type AvatarStep = 'notDone' | 'inProcess' | 'done'

interface StepAvatarProps extends MarginProps {
  status?: AvatarStep
}

type StepColor = { [K in AvatarStep]: FlattenInterpolation<ThemeProps<DefaultTheme>> }

const stepColorMap: StepColor = {
  notDone: css`
    ${colorStyle('lightContrast')};
  `,
  inProcess: css`
    ${colorStyle('callToAction')};
    ${shadow(1)};
  `,
  done: css`
    ${colorStyle('base')};
  `,
}

const variant = (
  props: StepAvatarProps
): FlattenInterpolation<ThemeProps<DefaultTheme>> | undefined => {
  const { status: stepType } = props
  //@ts-ignore
  return stepColorMap[stepType]
}

export const StepAvatar = withStyles('div', {
  displayName: 'StepAvatar',
  transitiveProps: ['status'],
  styles: [margin],
})<StepAvatarProps>`
  box-sizing: border-box;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  line-height: 49px;
  ${fontSize('h2')}
  font-weight: 400;
  text-align: center;
  appearance: none;
  padding: 0px;
  border: none;

  ${variant}
`
StepAvatar.defaultProps = {
  status: 'notDone',
}

export default StepAvatar
