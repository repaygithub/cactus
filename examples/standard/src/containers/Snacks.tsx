import React, { useMemo } from 'react'
import { I18nSection, I18nText, useI18nText } from '@repay/cactus-i18n'
import { useFeatureFlags } from '@repay/cactus-fwk'
import { Link, RouteComponentProps } from '@reach/router'

const snackKeysNoCarrots = ['cookies', 'chips', 'fruit']
const snackKeysWithCarrots = snackKeysNoCarrots.concat('carrots')

function fillSnackList(snackKeys: string[]) {
  const snackKeysLength = snackKeys.length
  const snackList = []
  for (let i = 0; i < 1000; ++i) {
    snackList[i] = snackKeys[Math.floor(Math.random() * snackKeysLength)]
  }
  return snackList
}

const Snacks: React.FC<RouteComponentProps> = () => {
  const [includesCarrots] = useFeatureFlags('include_carrot_snacks')
  const snackKeys = includesCarrots ? snackKeysWithCarrots : snackKeysNoCarrots

  // We always get all translations to ensure hooks order
  const snackTranslationMap: { [k: string]: string | null } = {
    cookies: useI18nText('cookies', undefined, 'snacks'),
    chips: useI18nText('chips', undefined, 'snacks'),
    fruit: useI18nText('fruit', undefined, 'snacks'),
    carrots: useI18nText('carrots', undefined, 'snacks'),
  }
  // memoize expensive calculation
  const snackList = useMemo(() => fillSnackList(snackKeys), [snackKeys])
  return (
    <I18nSection name="snacks">
      <h2>
        <I18nText get="snacks-header" />
      </h2>
      <ol>
        {snackKeys.map((k, i) => (
          <li key={`${k}-${i}`}>
            <Link to={k}>
              <I18nText get="go-to-snack" args={{ snack: snackTranslationMap[k] }} />
            </Link>
          </li>
        ))}
      </ol>
      <div>
        <I18nText get="snacks-desc" />
      </div>
      <ul>
        {snackList.map((item, ix) => {
          return <li key={ix}>{snackTranslationMap[item]}</li>
        })}
      </ul>
    </I18nSection>
  )
}

export default Snacks
