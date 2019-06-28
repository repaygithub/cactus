import { BaseI18nController } from '@repay/cactus-i18n'

interface ResourceDefinition {
  lang: string
  ftl: string
}

class I18nController extends BaseI18nController {
  load(args: { lang: string; section: string }): Promise<ResourceDefinition[]> {
    const [lang] = args.lang.split('-')
    return import(`./locales/${lang}/${args.section}.js`).then(({ default: ftl }) => {
      return [{ lang, ftl }]
    })
  }
}

export const supportedLanguages = [
  { code: 'en', label: '🇺🇸 English' },
  { code: 'es', label: '🇲🇽 Español' },
]

export default new I18nController({
  defaultLang: 'en',
  supportedLangs: supportedLanguages.map(l => l.code),
})
