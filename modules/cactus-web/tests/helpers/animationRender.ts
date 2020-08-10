import { act } from '@testing-library/react'

export default function animationRender(): Promise<void> {
  return act(
    async (): Promise<void> =>
      new Promise<void>((resolve): void => {
        setTimeout((): void => {
          window.requestAnimationFrame((): void => resolve())
        }, 0)
      })
  )
}
