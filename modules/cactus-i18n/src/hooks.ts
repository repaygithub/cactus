import { FluentVariable } from '@fluent/bundle'
import { createContext, useContext } from 'react'

import { I18nContextType, I18nMessage } from './types'

export const I18nContext = createContext<I18nContextType | null>(null)

export const useI18nText = (
  id: string,
  args?: Record<string, FluentVariable>,
  sectionOverride?: string
): string | null => {
  const context = useContext(I18nContext)
  if (context === null) {
    return null
  }
  const { controller, section, lang } = context
  return controller.getText({ args, section: sectionOverride || section, id, lang })
}

export const useI18nResource = (
  id: string,
  args?: Record<string, FluentVariable>,
  sectionOverride?: string
): I18nMessage => {
  const context = useContext(I18nContext)
  if (context === null) {
    return { text: null, attrs: {}, found: false }
  }
  const { controller, section, lang } = context
  return controller.get({ args, section: sectionOverride || section, id, lang })
}
