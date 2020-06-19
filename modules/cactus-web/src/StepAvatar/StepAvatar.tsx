import { margin, MarginProps } from 'styled-system'
import styled, { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components'

export type AvatarStep = 'notDone' | 'inProcess' | 'done'

interface StepAvatarProps extends MarginProps {
  status?: AvatarStep
}

type StepColor = { [K in AvatarStep]: FlattenInterpolation<ThemeProps<DefaultTheme>> }

const stepColorMap: StepColor = {
  notDone: css`
    background: ${p => p.theme.colors.lightContrast};
    color: ${p => p.theme.colors.darkestContrast};
  `,
  inProcess: css`
    background: ${p => p.theme.colors.callToAction};
    color: ${p => p.theme.colors.white};
    box-shadow: 0px 2px 5px 4px ${p => p.theme.colors.lightContrast};
  `,
  done: css`
    background: ${p => p.theme.colors.base};
    color: ${p => p.theme.colors.white};
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
  font-size: ${p => p.theme.textStyles.h2.fontSize};
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
