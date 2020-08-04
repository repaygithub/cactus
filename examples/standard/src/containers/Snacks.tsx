import { Link, RouteComponentProps } from '@reach/router'
import { useFeatureFlags } from '@repay/cactus-fwk'
import { I18nSection, I18nText } from '@repay/cactus-i18n'
import React, { ReactElement, useMemo } from 'react'

const snackKeysNoCarrots = ['cookies', 'chips', 'fruit']
const snackKeysWithCarrots = snackKeysNoCarrots.concat('carrots')

function fillSnackList(snackKeys: string[]): string[] {
  const snackKeysLength = snackKeys.length
  const snackList = []
  for (let i = 0; i < 1000; ++i) {
    snackList[i] = snackKeys[Math.floor(Math.random() * snackKeysLength)]
  }
  return snackList
}

const Snacks: React.FC<RouteComponentProps> = (): ReactElement => {
  const [includesCarrots] = useFeatureFlags('include_carrot_snacks')
  const snackKeys = includesCarrots ? snackKeysWithCarrots : snackKeysNoCarrots

  // memoize expensive calculation
  const snackList = useMemo((): string[] => fillSnackList(snackKeys), [snackKeys])
  return (
    <I18nSection name="snacks">
      <h2>
        <I18nText get="snacks-header" />
      </h2>
      <ol>
        {snackKeys.map(
          (k, i): ReactElement => (
            <li key={`${k}-${i}`}>
              <Link to={k}>
                <I18nText get={`go-to-${k}`} />
              </Link>
            </li>
          )
        )}
      </ol>
      <div>
        <I18nText get="snacks-desc" />
      </div>
      <ul>
        {snackList.map(
          (item, ix): ReactElement => {
            return (
              <li key={ix}>
                <I18nText get={item} />
              </li>
            )
          }
        )}
      </ul>
    </I18nSection>
  )
}

export default Snacks
