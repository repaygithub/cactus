---
title: API Docs
order: 3
---

# Internationalization API Documentation

## BaseI18nController

The `BaseI18nController` class is designed to control the internationalization by loading resources for a given language, and utilizing Project Fluent's formatting
capabilities to provide translations for an application. There are a few pieces of the `BaseI18nController` class to take note of here:

- The [load](#Load) function
- The [setDict](#SetDict) function
- The [constructor](#Constructor)

### Load

The `load` function is what will load your translations into the controller. You must extend this class because the `load` function should be overridden to provide the correct translations.

- The developer is responsible for handling failures when loading resources in the load function. (e.g. retry loading languages or loading the fallback languages)
- The developer is also responsible for handling the case in which all translations fail to load for a given section (e.g. reload browser or redirect to error page)
- The `load` function accepts a single object argument with the following attributes:

| Attr      | Type   | Required | Description                                                                   |
| --------- | ------ | -------- | ----------------------------------------------------------------------------- |
| `lang`    | String | Y        | The language that should be loaded                                            |
| `section` | String | Y        | The section of the app that the controller should be loading translations for |

### SetDict

The `setDict` function can be used to load a specific translation resource into the controller manually. This function accepts three arguments:

| Arg       | Type   | Required | Description                                                     |
| --------- | ------ | -------- | --------------------------------------------------------------- |
| `lang`    | String | Y        | The language that is being loaded                               |
| `section` | String | Y        | The section of the app that the translation is being loaded for |
| `ftl`     | String | Y        | The actual ftl-formatted translation                            |

### Constructor

The `BaseI18nController` constructor accepts a single options object with the following attributes:

| Attr             | Type     | Required | Description                                                                                                   |
| ---------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `defaultLang`    | String   | Y        | The default language                                                                                          |
| `supportedLangs` | String[] | Y        | A list of all languages the application supports                                                              |
| `lang`           | String   | N        | The current language that should be rendered                                                                  |
| `global`         | String   | N        | A global ftl translation, used for loading the initial global dictionary at time of instantiation             |
| `debugMode`      | Boolean  | N        | A flag to indicate whether or not certain console warnings should be displayed. This flag defaults to `false` |

### Extending The Base

```js
class I18nController extends BaseI18nController {
  load(args) {
    const { lang, section } = args
    // Load ftl translations from the source
    import(`./locales/${lang}/${section}.js`).then(({ default: ftl }) => {
      return [{ lang, ftl }]
    })
  }
}

const enGlobalFTL = 'greeting = Hello and welcome'
const controller = new I18nController({
  defaultLang: 'en',
  supportedLangs: ['en', 'es'],
  lang: 'en',
  global: enGlobalFTL,
})
export default controller
```

## I18nProvider

The `<I18nProvider />` component is a top-level component that is used to provide i18n context to the rest of an application.

### Props

| Prop         | Type   | Required | Description                                                    |
| ------------ | ------ | -------- | -------------------------------------------------------------- |
| `controller` | String | Y        | Used for passing the controller to the `I18nProvider`.         |
| `lang`       | String | N        | Used for setting the current language that should be rendered. |

### Example Usage

```jsx
import I18nProvider from '@repay/cactus-i18n'
import i18nController from './I18nController'
...
return (
  <I18nProvider controller={i18nController} lang="es">
    ...
  </I18nProvider>
)
```

In the browser, it is recommended to use the user provided language by default but also allow the user to change as desired.

```jsx
// App.js
import React, { useState } from 'react'
import I18nProvider from '@repay/cactus-i18n'
import i18nController from './I18nController'

function App(props) {
  const [lang, setLang] = useState(navigator.language)

  return (
    <I18nProvider controller={i18nController} lang={lang}>
      <select name="lang" onChange={event => setLang(event.currentTarget.value)}>
        ...
        <option value="es">Español</option>
      </select>
      ...
    </I18nProvider>
  )
}
```

## I18nSection

The `<I18nSection />` component was designed to allow the translations to be broken up into separate sections and loaded only when a specific section is needed. A section component alone will not render anything; it must be used with other internationalization components like `I18nText` or `I18nElement` in order to render any actual translations. This component is really there to tell any of its children i18n components where to look for translated text. It can also be used to manually change the rendered language in cases where a user wants to present information to another person.

### Props

| Prop   | Type   | Required | Description                                                  |
| ------ | ------ | -------- | ------------------------------------------------------------ |
| `name` | String | Y        | Used for telling the component which section is to be loaded |
| `lang` | String | N        | Used to override the globally selected language              |

### Example Usage

```jsx
import { I18nSection } from '@repay/cactus-i18n'
...
const sectionComponent = () => {
  return (
    <I18nSection name="example">
      ...
    </I18nSection>
  )
}
```

## I18nText

The `<I18nText />` component is used for rendering translated text in an application. It's common to use `I18nText` in conjunction with the `I18nSection` component to pull a translation from a certain section. If no section is defined, global translations will be used.

### Props

| Prop      | Type   | Required | Description                                                                              |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------- |
| `get`     | String | Y        | Tells the component which translation to look for in the loaded section                  |
| `args`    | Object | N        | Provides a key-value mapping for any variables that should be displayed in a translation |
| `section` | String | N        | Used for overriding the current section to load translations from another                |

### Example Usage

```jsx
import { I18nText, I18nSection } from '@repay/cactus-i18n'
...
// No section provided; global translations will be loaded
const text = () => {
  return (
    <I18nText get="translation-key" args={{ groupName: "example" }} />
  )
}
// Section provided; translations for the "example" section will be loaded
const section = () => {
  return (
    <I18nSection name="example">
      <I18nText get="translation-key" args={{ groupName: "example" }} />
    </I18nSection>
  )
}
// Section overridden; translation for "my-section__translation-key" will be rendered instead
// NOTE: the "my-section" should be loaded separately because the text element will not trigger a load
const override = () => {
  return (
    <I18nSection name="example">
      ...
      <I18nText get="translation-key" section="my-section" args={{ groupName: "example" }} />
    </I18nSection>
  )
}

// The developer may also write the entire key out while providing the section as "global"
const alsoOverride = () => {
  return (
    <I18nSection name="example">
      ...
      <I18nText get="my-section__translation-key" section="global" args={{ groupName: "example" }} />
    </I18nSection>
  )
}
```

## I18nElement

The `<I18nElement />` component was created to allow translations to be rendered as dom elements with support for attributes in an ftl translation. It's common to use the `I18nElement` component in conjunction with the `I18nSection` component to pull a translation from a certain section. If no section is defined, global translations will be used.

### Props

| Prop      | Type   | Required | Description                                                                              |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------- |
| `get`     | String | Y        | Tells the component which translation to look for in the loaded section                  |
| `args`    | Object | N        | Provides a key-value mapping for any variables that should be displayed in a translation |
| `section` | String | N        | Used for overriding the current section to load translations from another                |
| `as`      | String | Y        | Tells the component what type of dom element should be rendered                          |

### Example Usage

```jsx
import { I18nElement, I18nSection } from '@repay/cactus-i18n'
...
// No section provided; global translations will be loaded
const element = () => {
  return (
    <I18nElement as="div" get="translation-key" args={{ groupName: "example" }} />
  )
}
// Section provided; translations for the "example" section will be loaded
const section = () => {
  return (
    <I18NSection name="example">
      <I18nElement as={Text} get="translation-key" args={{ groupName: "example" }} />
    </I18NSection>
  )
}
// Section overridden; translations for "my-section" will be loaded
const override = () => {
  return (
    <I18nSection name="example">
      ...
      <I18nElement as="div" get="translation-key" section="my-section" args={{ groupName: "example" }} />
    </I18nSection>
  )
}
```

## I18nFormatted

The `<I18nFormatted />` component can be used to carry out any custom formatting on the translations by providing a formatter function to the component. You can
write your formatter function such that it returns a formatted string or a dom element.

### Props

| Prop        | Type     | Required | Description                                                                              |
| ----------- | -------- | -------- | ---------------------------------------------------------------------------------------- |
| `get`       | String   | Y        | Tells the component which translation to look for in the loaded section                  |
| `args`      | Object   | N        | Provides a key-value mapping for any variables that should be displayed in a translation |
| `section`   | String   | N        | Used for overriding the current section to load translations from another                |
| `formatter` | Function | Y        | Function to do any extra formatting                                                      |

### Example Usage

```jsx
import { I18nFormatted } from '@repay/cactus-i18n'
...
const formatter = text => {
  // Carry out any extra formatting necessary
  return <div>text.split('').reverse().join('')</div>
}
const formatted = () => {
  return (
    <I18nFormatted get="translation-key" formatter={formatter} args={{ format: "reversed" }} />
  )
}
```

## I18nResource

The `<I18nResource />` component is used to access the message and attributes when inside the render function of a class component. It can also allow using translated text as arguments for other messages.

### Props

| Prop       | Type       | Required | Description                                                                              |
| ---------- | ---------- | -------- | ---------------------------------------------------------------------------------------- |
| `get`      | String     | Y        | Tells the component which translation to look for in the loaded section                  |
| `args`     | Object     | N        | Provides a key-value mapping for any variables that should be displayed in a translation |
| `section`  | String     | N        | Used for overriding the current section to load translations from another                |
| `children` | RenderFunc | N        | A function that receives message and attributes and returns React elements               |
| `render`   | RenderFunc | N        | A function that receives message and attributes and returns React elements               |

Either `children` or `render` must be provided to the element or it will render `null`.

```ts
type RenderFunc = (message: string, attributes?: object | null) => React.ReactNode
```

### Example Usage

```jsx
import * as React from 'react'
import { I18nResource } from '@repay/cactus-i18n'

class BigComponent extends React.Component {
  // state management functions
  render() {
    // some calculations
    return (
      <div>
        {/* Other react elements */}
        <I18nResource get="translation-key">
          {(message, attrs) => <h1 {...attrs}>{message}</h1>}
        </I18nResource>
      </div>
    )
  }
}
```

## useI18nText & useI18nResource

`useI18nText` and `useI18nResource` are functions that have been exported to allow you to hook into the internationalization context, and get translations directly, if necessary. They function similarly, but the difference is what gets returned. `useI18nText` will return _only_ the text for a given translation, while `useI18nResource` will not only return the text of the translation, but any attributes defined in the ftl for that translation as well. Take the following ftl for instance:

```js
// ftl translation
ftl = `
welcome-message = Welcome, { $user }
  .aria-label = Greetings
`
```

The translation has an `aria-label` attribute associated with it, meaning you could call `useI18nResource` to get the translation _and_ the aria-label that goes with it.

### Parameters

| Param     | Type   | Required | Description                                                                              |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------- |
| `id`      | String | Y        | Tells the component which translation to look for in the loaded section                  |
| `args`    | Object | N        | Provides a key-value mapping for any variables that should be displayed in a translation |
| `section` | String | N        | Used for overriding the current section to load translations from another                |

### Example Usage

```js
import { useI18nText, useI18nResource } from '@repay/cactus-i18n'
...
const message = useI18nText('welcome-message', { user: 'CS Human' }) // "Welcome, CS Human"
const [message, attrs] = useI18nResource('welcome-message', { user: 'CS Human' }) // ["Welcome, CS Human", { aria-label: "Greetings" }]
```

## Testing

Fluent supports BiDi text by default by wrapping provided values (placeables) in bi-directional unicode characters, specifically the _First Strong Isolate_ and _Pop Directional Isolate_ characters. To test exact text matches you must account for these extra characters.

```js
const global = `key-for-the-group= We are the { $groupName }!`
const controller = new I18nController({
  defaultLang: 'en-US',
  supportedLangs: ['en-US'],
  global,
})
const translatedText = controller.get({ id: 'key-for-the-group', args: { groupName: 'people' } })
expect(translatedText).toBe('We are the \u2068people\u2069!')
expect(translatedText).toMatch(/We are the .people.!/)
```

For more information on these characters and why they are necessary, see Mozilla's explainer on the [Unicode Bidirectional Algorithm](https://developer.mozilla.org/en-US/docs/Web/Localization/Unicode_Bidirectional_Text_Algorithm)
