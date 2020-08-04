import { FluentVariable } from '@fluent/bundle'
import { createContext, useContext } from 'react'

import { I18nContextType } from './types'

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
): [string | null, object] => {
  const context = useContext(I18nContext)
  if (context === null) {
    return [null, {}]
  }
  const { controller, section, lang } = context
  return controller.get({ args, section: sectionOverride || section, id, lang })
}
