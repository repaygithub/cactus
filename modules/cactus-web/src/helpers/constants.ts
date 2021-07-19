export const livePreviewStyle = {
  border: '1px solid red',
  marginBottom: '10px',
}

export const isIE: boolean =
  typeof window !== 'undefined' && /MSIE|Trident/.test(window.navigator.userAgent)

export const supportsScopeQuery: boolean = (function () {
  try {
    document.querySelector(':scope')
  } catch {
    return false
  }
  return true
})()
