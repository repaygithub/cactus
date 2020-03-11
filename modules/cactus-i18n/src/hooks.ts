import { createContext, useContext } from 'react'

import { I18nContextType } from './types'

export const I18nContext = createContext<I18nContextType | null>(null)

export const useI18nText = (id: string, args?: object, sectionOverride?: string) => {
  const context = useContext(I18nContext)
  if (context === null) {
    return null
  }
  const { controller, section, lang } = context
  return controller.getText({ args, section: sectionOverride || section, id, lang })
}

export const useI18nResource = (
  id: string,
  args?: object,
  sectionOverride?: string
): [string | null, object] => {
  const context = useContext(I18nContext)
  if (context === null) {
    return [null, {}]
  }
  const { controller, section, lang } = context
  return controller.get({ args, section: sectionOverride || section, id, lang })
}
