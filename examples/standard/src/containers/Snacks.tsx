import React from 'react'
import { I18nSection, I18nText, useI18nText } from '@repay/cactus-i18n'
import { Link, RouteComponentProps } from '@reach/router'

const snackKeys = ['cookies', 'chips', 'fruit']
const list = Array(10000).fill(0)
const snackList = list.map(() => {
  return snackKeys[Math.floor(Math.random() * 3)]
})

const Snacks: React.FC<RouteComponentProps> = () => {
  const snackTranslationMap: { [k: string]: string | null } = {}
  for (const key of snackKeys) {
    // Never use a hook in a loop unless you know the array is a constant and it
    // will loop the same values every render
    // eslint-disable-next-line react-hooks/rules-of-hooks
    snackTranslationMap[key] = useI18nText(key, undefined, 'snacks')
  }
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
