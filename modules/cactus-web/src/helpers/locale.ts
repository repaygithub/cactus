function getLocale(): string {
  // server-side rendering
  if (typeof window === 'undefined') {
    return 'en-US'
  }
  // fallbacks are for IE11 which of course TS doesn't know about -_-
  // @ts-ignore
  return navigator.language || navigator.userLanguage || navigator.browserLanguage
}

export { getLocale }
export default getLocale
