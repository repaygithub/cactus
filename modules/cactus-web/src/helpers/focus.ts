const FOCUS_SELECTOR =
  'a[href]:not([href=""]):not([rel="ignore"]):not(:disabled),' +
  'input:not([hidden]):not([type="hidden"]):not([type="file"]):not(:disabled),' +
  'button:not(:disabled),' +
  'select:not(:disabled),' +
  'textarea:not(:disabled)' +
  '[tabindex]'

export function getFocusable(root?: any) {
  let searchFrom: Element | Document
  if (root && root instanceof Element) {
    searchFrom = root
  } else {
    searchFrom = document
  }
  let result = Array.from(searchFrom.querySelectorAll(FOCUS_SELECTOR))
  return result.filter(el => {
    // @ts-ignore
    if (el.hasAttribute('tabindex') && el.tabIndex < 0) {
      return false
    }
    return true
  })
}
