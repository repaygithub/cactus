export default function animationRender() {
  return new Promise(resolve => {
    setTimeout(() => {
      window.requestAnimationFrame(resolve)
    }, 0)
  })
}
