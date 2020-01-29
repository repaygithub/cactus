import React, { useMemo } from 'react'

import { I18nSection, I18nText, useI18nText } from '@repay/cactus-i18n'
import { Link, RouteComponentProps } from '@reach/router'
import { useFeatureFlags } from '@repay/cactus-fwk'

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
              <I18nText get={`go-to-${k}`} />
            </Link>
          </li>
        ))}
      </ol>
      <div>
        <I18nText get="snacks-desc" />
      </div>
      <ul>
        {snackList.map((item, ix) => {
          return (
            <li key={ix}>
              <I18nText get={item} />
            </li>
          )
        })}
      </ul>
    </I18nSection>
  )
}

export default Snacks
