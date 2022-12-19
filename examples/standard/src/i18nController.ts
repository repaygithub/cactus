import { BaseI18nController, BundleInfo, LoadResult } from '@repay/cactus-i18n'

class I18nController extends BaseI18nController {
  protected getKey(id: string, section: string) {
    return section === 'global' ? id : `${section}__${id}`
  }

  protected async loadImpl(args: BundleInfo): Promise<LoadResult> {
    const [lang] = args.lang.split('-')
    const { default: ftl } = await import(`./locales/${lang}/${args.section}.js`)
    return { resources: [ftl] }
  }
}

export const supportedLanguages = [
  { code: 'en', label: '🇺🇸 English' },
  { code: 'es', label: '🇲🇽 Español' },
]

export default new I18nController({
  defaultLang: 'en',
  supportedLangs: supportedLanguages.map((l): string => l.code),
})
