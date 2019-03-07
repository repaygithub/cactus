import { BaseI18nController } from '@repay/cactus-fwk'

interface KeyDictionary {
  [k: string]: string
}

class I18nController extends BaseI18nController {
  load(args: { lang: string; section: string }): Promise<KeyDictionary> {
    const [lang] = args.lang.split('-')
    return import(`./locales/${lang}/${args.section}.json`)
      .then(({ default: dict }) => {
        return dict
      })
      .catch(error => {
        console.error(error)
        throw error
      })
  }
}

export default new I18nController({ defaultLang: 'en-US' })
