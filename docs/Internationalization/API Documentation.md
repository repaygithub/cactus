---
title: API Docs
order: 3
---

# Internationalization API Documentation

## BaseI18nController

The `BaseI18nController` class is designed to control the internationalization by loading resources for a given language, and utilizing Project Fluent's formatting
capabilities to provide translations for an application. There are a few pieces of the `BaseI18nController` class to take note of here:

### Load

The `_load` function is what will load your translations into the controller. You must extend `BaseI18nController` in order to provide an implementation of the `_load` function.

- The developer is responsible for handling failures when loading resources in the `_load` function. (e.g. retry loading, or loading from an alternate source)
  - You can either handle the error within the `_load` method, or return a rejected Promise and handle the error in the `onLoad` method or an error listener.
- The return value is a Promise that resolves to an object with one required and one optional property:
  - `resources` is an array of Fluent translation strings; you can also put instances of the `FluentResource` class, or the return value of the `loadRef` method (more below). The array is combined such that if the same Fluent translation key exists in two of the resources, the later resource will override the earlier one.
  - `version` if present should be a number indicating the version of the translations. This is tracked per section, and if (when reloading a section) the returned version is less than the current version, the translations will not be updated.
- The `_load` function accepts two arguments: an object that represents the section being loaded, and an options object. The section info argument has following properties:

| Property  | Type   | Required | Description                                                                   |
| --------- | ------ | -------- | ----------------------------------------------------------------------------- |
| `lang`    | String | Y        | The language that should be loaded                                            |
| `section` | String | Y        | The section of the app that the controller should be loading translations for |

- The options object is completely customizable for your use case: for instance, if you have a mix of hard-coded and stored-in-database translations, you might set `options.dynamic = true` to tell the loader it should look in the DB for a particular section.
- There are two "built-in" options that are useless in `_load` but can be passed to `load` or `I18nSection`:
  - `loader` is a function that replaces the `_load` method; it can be used if you have a section with a very different loading mechanism than the rest, and you don't want to special case it in your controller class.
  - `onLoad` is a function that is called once the section is loaded (or an error occurred while loading). It takes three arguments: the section info object, the state the section was in before loading (usually "new", but could be "error" if you're retrying), and the error (if there was one). The default `onLoad` behavior is to call any listeners that have been set on the controller.
  - Both functions bind `this` to the controller when called, which can enable you to keep the default behavior and just do something custom on the side:

```js
// Add an extra translation source on top of the normal ones:
const loader = async (sectionInfo, opts) => {
  const { resources } = await this._load(sectionInfo, opts)
  const ftl = getSuperSpecialTranslations(sectionInfo)
  return { resources: [...resources, ftl] }
}

// Do some custom onLoad logic, but still call the controller's listeners:
const onLoad = (sectionInfo, prevState, error) => {
  doCustomLogic()
  this.onLoad(sectionInfo, prevState, error)
}
```

### LoadRef

The `loadRef` function is meant as a supplement to `_load` for specific use cases. Say you have some common translations that appear on multiple pages. They're not quite global enough to wrap the entire app in an `I18nSection`, but it's also inconvenient to put a section everyplace they're used; instead, you can include those translations as a reference. The "common" section will only be loaded once, but can be referenced by as many other sections as needed:

```
_load(sectionInfo, opts) {
  const resources = []
  if (needsCommonTranslations(sectionInfo.section)) {
    resources.push(this.loadRef(sectionInfo, 'common', opts))
  }
  resources.push(getTranslations(sectionInfo.section, sectionInfo.lang))
  return Promise.resolve({ resources })
}
```

Another use case could be if you have two languages that are mostly the same with only a few differences, like en-US and en-GB: one language can include a ref to the other, and only the Fluent keys that are actually different need to be overridden.

| Argument   | Required | Description                                                          |
| ---------- | -------- | -------------------------------------------------------------------- |
| `referrer` | Y        | The object that was received as the first argument to `_load`        |
| `section`  | Y        | The section to be included as a reference                            |
| `loadOpts` | Y        | The options that were passed as the second argument to `_load`       |
| `lang`     | N        | The language of the reference section (defaults to same as referrer) |

#### Example

All values in a section's resource array are combined into a single Fluent bundle; this not only serves as a lookup fallback mechanism (where you can have a section with default values, and then override them), but also allows referencing messages in other sections. For example, a greeting lookup:

```
// Section "user", generated dynamically from user preferences
-title = mister
-title-short = Mr.

// Section "welcome"/en-US, references section "user"
-color = color
welcome = Welcome, { -title-short } { $name }! Pick a { -color } for your background:

// Section "welcome"/en-GB, references "welcome"/en-US
-color = colour
```

Rendering the `welcome` message in British English with `$name=John` would yield "Welcome, Mr. John! Pick a colour for your background:".

### Get

The `get` function will search for the requested translation. It searches through all matching languages (see [language matching](https://www.projectfluent.org/fluent.js/langneg/#matching)), plus the `defaultLang` if there is one. It accepts a single object argument with the following properties:

| Property  | Type   | Required | Description                                   |
| --------- | ------ | -------- | --------------------------------------------- |
| `lang`    | String | N        | Override the controller's current language    |
| `section` | String | Y        | The section to search in                      |
| `id`      | String | Y        | ID of the message (see `getKey` method)       |
| `args`    | Object | N        | Used to resolve variables in the translations |

The return value is always an object with three properties:

| Property | Type     | Description                                                                      |
| -------- | -------- | -------------------------------------------------------------------------------- |
| `text`   | Str/null | The main line from the Fluent translation, null if empty or no translation found |
| `attrs`  | Object   | Any attrs included with the translation                                          |
| `found`  | Boolean  | Indicates if a translation was found or not                                      |

### getKey

In some cases the `id` you pass into `get` may not be the same as the Fluent translation key. In that case, you can override the `getKey` method to transform the `id` into the correct format. This mostly exists for backwards compatibility, because in previous versions the key format was hardcoded:

```
// Implementation to maintain the old key format.
getKey(id, section, lang) {
  return section === 'global' ? id : `${section}__${id}`
}
```

Other use cases might be if you use IDs that contain invalid Fluent characters like "." and you need to sanitize the ID before passing it to Fluent.

### GetText

The `getText` has the same purpose and arguments as `get`, but only returns the main message (or null).

### HasText

The `hasText` returns the same as the `get` method's `found` property. It has the same arguments, except it doesn't take the `args` variables (because it doesn't actually do any translating).

### Constructor

The `BaseI18nController` constructor accepts a single options object with the following properties:

| Property         | Type     | Required | Description                                                                                     |
| ---------------- | -------- | -------- | ----------------------------------------------------------------------------------------------- |
| `supportedLangs` | String[] | Y        | A list of all languages the application supports                                                |
| `defaultLang`    | String   | N        | The default & fallback language; if not given, then `lang` becomes a required argument          |
| `lang`           | String   | N        | The current language that should be rendered; defaults to `defaultLang`                         |
| `debugMode`      | Boolean  | N        | A flag to indicate whether or not certain console warnings should be displayed; default `false` |
| `useIsolating`   | Boolean  | N        | Passed directly to `FluentBundle` class; default `true` for using bidi isolation marks          |
| `functions`      | Object   | N        | Passed directly to `FluentBundle` class; provide custom functions to use in Fluent translations |

### Extending The Base

```js
class I18nController extends BaseI18nController {
  // Minimum implementation with required _load() method
  _load(sectionInfo) {
    const { lang, section } = sectionInfo
    // Load ftl translations from the source
    return import(`./locales/${lang}/${section}.js`).then(({ default: ftl }) => ({
      resources: [ftl],
    }))
  }
}

const controller = new I18nController({
  defaultLang: 'en',
  supportedLangs: ['en', 'es'],
  useIsolating: false,
})
export default controller
```

You may also want to extend other functions based on your needs. This can be done by also using the `super` keyword to refer to the original method.

```js
export const missingKeys = new Set()

class I18nController extends BaseI18nController {
  _load(args) {
    // code to load translations
  }

  get(args) {
    const result = super.get(args)
    if (!result.found) {
      const key = this.getKey(args.id, args.section, args.lang)
      if (!missingKeys.has(key)) {
        missingKeys.add(key)
      }
    }
    return result
  }
}
```

## I18nProvider

The `<I18nProvider />` component is a top-level component that is used to provide i18n context to the rest of an application.

### Props

| Prop         | Type   | Required | Description                                                   |
| ------------ | ------ | -------- | ------------------------------------------------------------- |
| `controller` | String | Y        | Used for passing the controller to the `I18nProvider`         |
| `lang`       | String | N        | Used for setting the current language that should be rendered |
| `section`    | String | N        | Sets a default section for the entire app; default "global"   |

Unlike `I18nSection`, `I18nProvider` doesn't accept any extra section load arguments, so if you need those (or just don't need a default section) you should set `section=""`.

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
      <select name="lang" onChange={(event) => setLang(event.currentTarget.value)}>
        ...
        <option value="es">Español</option>
      </select>
      ...
    </I18nProvider>
  )
}
```

## I18nSection

The `<I18nSection />` component was designed to allow the translations to be broken up into separate sections and loaded only when a specific section is needed. A section component alone will not render anything; it must be used with other internationalization components like `I18nText` or `I18nElement` in order to render any actual translations. This component is really there to tell any of its children i18n components where to look for translated text. It can also be used to locally change the rendered language, for example in cases where a user wants to present information to another person in the second person's language.

### Props

| Prop      | Type   | Required | Description                                                                 |
| --------- | ------ | -------- | --------------------------------------------------------------------------- |
| `section` | String | Y        | Name of the section to load and use as the default in descendant components |
| `lang`    | String | N        | Used to override the globally selected language                             |

Any additional props will be passed as part of the `loadOpts` argument to the `_load` function.

### Example Usage

```jsx
import { I18nSection } from '@repay/cactus-i18n'
...
const sectionComponent = () => {
  return (
    <I18nSection section="example">
      ...
    </I18nSection>
  )
}
```

#### Example with additional section props:

```jsx
import { I18nSection } from '@repay/cactus-i18n'
...
const Page = () => {
  return (
    <I18nSection section="pageSpecificTranslations" dependencies={['someExtraGlobalTranslations']}>
      ...
    </I18nSection>
  )
}
```

When passing additional arbitrary props to `I18nSection` like in the above example, you'll want to handle that within your loader. For example:

```jsx
import { BaseI18nController } from '@repay/cactus-i18n'

class I18nController extends BaseI18nController {

  protected async _load(bundleInfo, extra): Promise<LoadResult> {
    const [lang] = bundleInfo.lang.split('-')
    const { default: ftl } = await import(`./locales/${lang}/${bundleInfo.section}.js`)
    const resources = [ftl]
    const dependencies = extra.dependencies
    if (Array.isArray(dependencies)) {
      for (const dep of dependencies) {
        if (!dep) continue
        else if (typeof dep === 'string') {
          this.load({ lang, section: dep })
        } else {
          this.load({ lang, ...dep })
        }
      }
    }
    return { resources }
  }
}
```

## I18nText

The `<I18nText />` component is used for rendering translated text in an application. It's common to use `I18nText` in conjunction with the `I18nSection` component to pull a translation from a certain section. If no section is defined, the default section from `I18nProvider` will be used.

### Props

| Prop      | Type   | Required | Description                                                                              |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------- |
| `get`     | String | Y        | Equivalent to the `id` arg to the controller's `get` method                              |
| `args`    | Object | N        | Provides a key-value mapping for any variables that should be displayed in a translation |
| `section` | String | N        | Used for overriding the current section to load translations from another                |

### Example Usage

```jsx
import { I18nText, I18nSection } from '@repay/cactus-i18n'
...
// No section provided; default section will be used
const text = () => {
  return (
    <I18nText get="translation-key" args={{ groupName: "example" }} />
  )
}
// Section provided; translations for the "example" section will be loaded
const section = () => {
  return (
    <I18nSection section="example">
      <I18nText get="translation-key" args={{ groupName: "example" }} />
    </I18nSection>
  )
}
// Section overridden; translation for "translation-key" from "my-section" will be rendered instead
// NOTE: the "my-section" should be loaded separately because the text element will not trigger a load
const override = () => {
  return (
    <I18nSection section="example">
      ...
      <I18nText get="translation-key" section="my-section" args={{ groupName: "example" }} />
    </I18nSection>
  )
}
```

## I18nElement

The `<I18nElement />` component was created to allow translations to be rendered as DOM elements with support for attributes in an ftl translation. It's common to use the `I18nElement` component in conjunction with the `I18nSection` component to pull a translation from a certain section. If no section is defined, the default section from `I18nProvider` will be used.

### Props

| Prop      | Type   | Required | Description                                                                              |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------- |
| `get`     | String | Y        | Equivalent to the `id` arg to the controller's `get` method                              |
| `args`    | Object | N        | Provides a key-value mapping for any variables that should be displayed in a translation |
| `section` | String | N        | Used for overriding the current section to load translations from another                |
| `as`      | String | Y        | Tells the component what type of dom element should be rendered                          |

### Example Usage

```jsx
import { I18nElement, I18nSection } from '@repay/cactus-i18n'
...
// No section provided; default section will be used
const element = () => {
  return (
    <I18nElement as="div" get="translation-key" args={{ groupName: "example" }} />
  )
}
// Section provided; translations for the "example" section will be loaded
const section = () => {
  return (
    <I18NSection section="example">
      <I18nElement as={Text} get="translation-key" args={{ groupName: "example" }} />
    </I18NSection>
  )
}
// Section overridden; translations for "my-section" will be used
const override = () => {
  return (
    <I18nSection section="example">
      ...
      <I18nElement as="div" get="translation-key" section="my-section" args={{ groupName: "example" }} />
    </I18nSection>
  )
}
```

## I18nFormatted

The `<I18nFormatted />` component can be used to carry out any custom formatting on the translations by providing a formatter function to the component. You can
write your formatter function such that it returns a formatted string or a DOM element.

### Props

| Prop        | Type     | Required | Description                                                                              |
| ----------- | -------- | -------- | ---------------------------------------------------------------------------------------- |
| `get`       | String   | Y        | Equivalent to the `id` arg to the controller's `get` method                              |
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
| `get`      | String     | Y        | Equivalent to the `id` arg to the controller's `get` method                              |
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

## useI18nSection

`useI18nSection` is a hook that can be used to load one or more sections. It's used within the `<I18nSection />` component, but it does not block rendering while it loads the section. It will return a boolean indicating whether or not the section or sections are loaded. You can pass a simple string indicating the name of the section you wish to load, or you can pass an object with a `section` key and any additional arbitrary data you want. Any extra data will be passed to the second argument of your controller's `_load` function.

### Parameters

`useI18nSection` accepts as many section arguments as you want to pass. Argument can be a string or an object with the following form:

| Key       | Type   | Required | Description                              |
| --------- | ------ | -------- | ---------------------------------------- |
| `section` | String | Y        | The name of the section you want to load |

- Any other keys passed in this object will be passed to the second argument of the `_load` function for you to process in whatever way is necessary for your application.

### Example Usage

```jsx
import { useI18nSection, I18nText } from '@repay/cactus-i18n'

const Component = () => {
  const hasLoaded = useI18nSection('my-section')

  return hasLoaded ? <I18nText section="my-section" get="my-key" /> : null
}
```

Note that you can omit the `hasLoaded` logic in the example above.

### Example with Objects

If you need to process more data in your `_load` function, you can do so by passing objects to `useI18nSection`:

```jsx
import { useI18nSection, I18nText } from '@repay/cactus-i18n'

const Component = () => {
  // _load() will be called twice; once for each section. An object containing the `dynamic` value will be passed to the second argument.
  useI18nSection(
    { section: 'local-section', dynamic: false },
    { section: 'remote-section', dynamic: true }
  )
  return (
    <>
      <I18nText section="local-section" get="local-message" />
      <I18nText section="remote-section" get="remote-message" />
    </>
  )
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
// "Welcome, CS Human"
const message = useI18nText('welcome-message', { user: 'CS Human' })
// { text: "Welcome, CS Human", attrs: { aria-label: "Greetings" }, found: true }
const { text, attrs, found } = useI18nResource('welcome-message', { user: 'CS Human' })
```

## Testing

Fluent supports BiDi text by default by wrapping provided values (placeables) in bi-directional unicode characters, specifically the _First Strong Isolate_ and _Pop Directional Isolate_ characters. To test exact text matches you must account for these extra characters.

```js
// Assume the following global section:
`
key-for-the-group= We are the { $groupName }!
`
...
const translatedText = controller.get({ section: 'global', id: 'key-for-the-group', args: { groupName: 'people' } })
expect(translatedText).toBe('We are the \u2068people\u2069!')
expect(translatedText).toMatch(/We are the .people.!/)
```

For more information on these characters and why they are necessary, see Mozilla's explainer on the [Unicode Bidirectional Algorithm](https://developer.mozilla.org/en-US/docs/Web/Localization/Unicode_Bidirectional_Text_Algorithm)
