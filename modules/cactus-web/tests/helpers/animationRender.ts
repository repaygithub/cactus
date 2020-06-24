import { act } from '@testing-library/react'

export default function animationRender() {
  return act(
    async () =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          window.requestAnimationFrame(() => resolve())
        }, 0)
      })
  )
}
