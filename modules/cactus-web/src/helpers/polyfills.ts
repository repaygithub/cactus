if (typeof window !== 'undefined' && !(window as any).Element.prototype.matches) {
  // @ts-ignore
  Element.prototype.matches = Element.prototype.msMatchesSelector
}

if (typeof window !== 'undefined' && !(window as any).Element.prototype.closest) {
  Element.prototype.closest = function (s: string): Element | null {
    let el: Element | (Node & ParentNode) | null = this //eslint-disable-line @typescript-eslint/no-this-alias

    do {
      if ((el as Element).matches(s)) return el as Element
      el = el.parentElement || el.parentNode
    } while (el !== null && el.nodeType === 1)
    return null
  }
}
