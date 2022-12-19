import { FluentVariable } from '@fluent/bundle'
import { createContext, useContext, useEffect } from 'react'

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

interface SectionOptions {
  section: string
  [key: string]: any
}

export const useI18nSection = (...sections: Array<string | SectionOptions>): boolean => {
  const context = useContext(I18nContext)
  const controller = context?.controller
  const lang = controller?.negotiateLang(context?.lang, true)[0]
  useEffect(() => {
    if (lang && context !== null) {
      for (const section of sections) {
        if (!section) continue
        if (typeof section === 'string') {
          controller.load({ lang, section })
        } else {
          controller.load({ lang, ...section })
        }
      }
    }
  })
  return sections.every((section) => {
    section = typeof section === 'string' ? section : section.section
    return controller?.hasLoaded(section, lang)
  })
}
