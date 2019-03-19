# Internationalization

The Cactus Framework implements i18n using the core technologies developed by Mozilla and [Project Fluent](https://projectfluent.org/). We chose Fluent because of it's design principles, features, and extensibility. You can read more about the choice [below](#comparing-different-solutions).

## How to use

### Standard Example

There is a standard example for using the internationalization framework [here](https://github.com/repaygithub/cactus/tree/master/examples/standard). It provides some context for how the building blocks of this framework should be used. In general, the steps you'll want to follow to integrate with the internationalization tools offered by Cactus Framework are the same ones we followed these steps when configuring the standard example:

- Define a set of translations using the ftl syntax specified by Project Fluent. Documentation on ftl syntax can be found [here](https://projectfluent.org/fluent/guide/).
- Extend the `BaseI18nController` class. You will need to override the `load` method to tell the controller where to get the translations from, and which translations to use. You can load translations using any method you like (from local files, through an API request, etc). The translations must be returned from the function after loading.
- Use the `AppRoot` component at the top level of the application and give the controller object to this component. This will give the application the ability to utilize the controller and the i18n components to achieve internationalization throughout the app.
- Use the provided internationalization components (`I18nSection`, `I18nText`, `I18nElement`, etc) anywhere that translatable text is rendered in the application. This will cause the controller to pull different translations based on the language and section.

Now, that explanation lives at a pretty high level. Let's take a look at each of the i18n building blocks individually to gain a better understanding....

### BaseI18nController

The `BaseI18nController` class is designed to control the internationalization by loading resources for a given language, and utilizing Project Fluent's formatting
capabilities to provide translations for an application.

- This class must be extended and the `load` function should be overridden to handle providing the correct translations to the controller.
    - The developer is responsible for handling failures when loading resources in the load function. (e.g. retry loading languages or loading the fallback languages)
  - The developer is also responsible for handling the case in which all translations fail to load for a given section (e.g. reload browser or redirect to error page)
  - `load` takes a single object argument with the following attributes:
    - `lang`\* - string
    - `section`\* - string
- The `BaseI18nController` constructor accepts an options object with the following attributes:
  - `defaultLang`\* - string
  - `supportedLangs`\* - string[]
  - `lang` - string
  - `global` - string

(\*) - required

#### Example Usage

```js
class I18nController extends BaseI18nController {
  load(args) {
    const { lang, section } = args
    // Load ftl translations from the source
    import(`./locales/${lang}/${section}.js`).then(({ default: ftlTranslations }) => {
      return [{ lang, ftlTranslations }]
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

### AppRoot

The `<AppRoot />` component is a top-level app component that is used to provide i18n context to the rest of an application.

#### Props

| Prop       | Type   | Required | Description                                                                                           |
| ---------- | ------ | -------- | ----------------------------------------------------------------------------------------------------- |
| `withI18n` | String | N        | Used for passing the controller to the `AppRoot`. This prop tells the component to use i18n features. |
| `lang`     | String | N        | Used for setting the current language that should be rendered.                                        |

#### Example Usage

```jsx
import AppRoot from '@repay/cactus-fwk'
import i18nController from './I18nController'
...
return (
  <AppRoot withI18n={i18nController} lang="es">
    ...
  </AppRoot>
)
```

### I18nSection

The `<I18nSection />` component was designed to allow the translations to be broken up into separate sections and loaded only when a specific section is needed. A section component alone will not render anything; it must be used with other internationalization components like `I18nText` or `I18nElement` in order to render any actual translations. This component is really there to tell any of its children i18n components where to look for translated text.

#### Props

| Prop   | Type   | Required | Description                                                  |
| ------ | ------ | -------- | ------------------------------------------------------------ |
| `name` | String | Y        | Used for telling the component which section is to be loaded |

#### Example Usage

```jsx
import { I18nSection } from '@repay/cactus-fwk'
...
const sectionComponent = () => {
  return (
    <I18nSection name="example">
      ...
    </I18nSection>
  )
}
```

### I18nText

The `<I18nText />` component is used for rendering translated text in an application. It's common to use `I18nText` in conjunction with the `I18nSection` component to pull a translation from a certain section. If no section is defined, global translations will be used.

#### Props

| Prop      | Type   | Required | Description                                                                              |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------- |
| `get`     | String | Y        | Tells the component which translation to look for in the loaded section                  |
| `args`    | Object | N        | Provides a key-value mapping for any variables that should be displayed in a translation |
| `section` | String | N        | Used for overriding the current section to load translations from another                |

#### Example Usage

```jsx
import { I18nText, I18nSection } from '@repay/cactus-fwk'
...
// No section provided; global translations will be loaded
const text = () => {
  return (
    <I18nText get="translation-key" args={ groupName: "example" } />
  )
}
// Section provided; translations for the "example" section will be loaded
const section = () => {
  return (
    <I18nSection name="example">
      <I18nText get="translation-key" args={ groupName: "example" } />
    </I18nSection>
  )
}
// Section overridden; translations for "my-section" will be loaded
const override = () => {
  return (
    <I18nSection name="example">
      ...
      <I18nText get="translation-key" section="my-section" args={ groupName: "example" } />
    </I18nSection>
  )
}
```

### I18nElement

The `<I18nElement />` component was created to allow translations to be rendered as dom elements with support for attributes in an ftl translation. It's common to use the `I18nElement` component in conjunction with the `I18nSection` component to pull a translation from a certain section. If no section is defined, global translations will be used.

#### Props

| Prop      | Type   | Required | Description                                                                              |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------- |
| `get`     | String | Y        | Tells the component which translation to look for in the loaded section                  |
| `args`    | Object | N        | Provides a key-value mapping for any variables that should be displayed in a translation |
| `section` | String | N        | Used for overriding the current section to load translations from another                |
| `as`      | String | Y        | Tells the component what type of dom element should be rendered                          |

#### Example Usage

```jsx
import { I18nElement, I18nSection } from '@repay/cactus-fwk'
...
// No section provided; global translations will be loaded
const element = () => {
  return (
    <I18nElement as="div" get="translation-key" args={ groupName: "example" } />
  )
}
// Section provided; translations for the "example" section will be loaded
const section = () => {
  return (
    <I18NSection name="example">
      <I18nElement as="div" get="translation-key" args={ groupName: "example" } />
    </I18NSection>
  )
}
// Section overridden; translations for "my-section" will be loaded
const override = () => {
  return (
    <I18nSection name="example">
      ...
      <I18nElement as="div" get="translation-key" section="my-section" args={ groupName: "example" } />
    </I18nSection>
  )
}
```

### I18nFormatted

The `<I18nFormatted />` component can be used to carry out any custom formatting on the translations by providing a formatter function to the component. You can
write your formatter function such that it returns a formatted string or a dom element.

#### Props

| Prop        | Type     | Required | Description                                                                              |
| ----------- | -------- | -------- | ---------------------------------------------------------------------------------------- |
| `get`       | String   | Y        | Tells the component which translation to look for in the loaded section                  |
| `args`      | Object   | N        | Provides a key-value mapping for any variables that should be displayed in a translation |
| `section`   | String   | N        | Used for overriding the current section to load translations from another                |
| `formatter` | Function | Y        | Function to do any extra formatting                                                      |

#### Example Usage

```jsx
import { I18nFormatted } from '@repay/cactus-fwk'
...
const formatter = text => {
  // Carry out any extra formatting necessary
  return <div>text.split('').reverse().join('')</div>
}
const formatted = () => {
  return (
    <I18nFormatted get="translation-key" formatter={formatter} args={ format: "reversed" } />
  )
}
```

### useI18nText & useI18nResource

`useI18nText` and `useI18nResource` are functions that have been exported to allow you to hook into the internationalization context, and get translations directly, if necessary. They function similarly, but the difference is what gets returned. `useI18nText` will return *only* the text for a given translation, while `useI18nResource` will not only return the text of the translation, but any attributes defined in the ftl for that translation as well. Take the following ftl for instance:

```js
// ftl translation
ftl = `
welcome-message = Welcome, { $user }
  .aria-label = Greetings
`
```

The translation has an `aria-label` attribute associated with it, meaning you could call `useI18nResource` to get the translation *and* the aria-label that goes with it.


#### Parameters

| Param     | Type   | Required | Description                                                                              |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------- |
| `id`      | String | Y        | Tells the component which translation to look for in the loaded section                  |
| `args`    | Object | N        | Provides a key-value mapping for any variables that should be displayed in a translation |
| `section` | String | N        | Used for overriding the current section to load translations from another                |

#### Example Usage

```js
import { useI18nText, useI18nResource } from '@repay/cactus-fwk'
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
```

For more information on these characters and why they are necessary, see Mozilla's explainer on the [Unicode Bidirectional Algorithm](https://developer.mozilla.org/en-US/docs/Web/Localization/Unicode_Bidirectional_Text_Algorithm)

## Why Project Fluent?

|                                           | Project Fluent        | ICU MessageFormat                | GetText        |
| ----------------------------------------- | --------------------- | -------------------------------- | -------------- |
| [API Design Target](#api-design-target)   | Web                   | C++ & Java                       | C-based        |
| [Message Identifier](#message-identifier) | Keyed IDs             | Keyed IDs                        | Source String  |
| [Formatters](#formatters)                 | Built-in & extensible | Built-in & limited extensibility | None           |
| [BiDi Support](#bidirectional-support)    | Supported             | Not supported                    | Not supported  |
| Comments                                  | Supported             | Not supported                    | None or hax 🤬 |

### API Design Target

Because Fluent is designed for UI applications, it provides support for attributes through metadata (e.g. aria-\*, title, etc.). With MessageFormat, you can accomplish this by suffixing message identifiers (e.g. submit-aria-label). GetText would rewuire more messages, which would be prone to more conflicts in the primary language.

### Message Identifier

The key id that differentiates between messages. Fluent and MessageFormat use ids. Gettext uses the default language string as provided and there can only be as many variants as are provided in the default language which limits the existence of multi-variant translations (e.g. pluralizations and grammatical gender)

### Formatters

Fluent has formatters that work out of the box, or you can extend them easily. MessageFormat provides formatters that must be applied by the developer. MessageFormat allows extension but it's discouraged and a poor developer experience. GetText has no formatting support.

Additionally, Fluent allows translators to override formatting arguments when appropriate (e.g. translator can decide to show currency symbol or code).

### Bidirectional Support

Bidirectional support is necessary when text is displayed in one direction, but variables should be displayed in another (e.g. Displaying US currency in Arabic text).

Fluent fully supports bidirectionality in translations. Neither MessageFormat or GetText has the ability to support bidirectional text.

### Comments

Fluent fully supports comments to provide context to translators. MessageFormat does not support comments; you can add limited context via the message identifier (e.g. submit-terms-button). GetText has no support for comments, other than hacky solutions.

## References

[Fluent and ICU MessageFormat](https://github.com/projectfluent/fluent/wiki/Fluent-and-ICU-MessageFormat)

[Fluent vs gettext](https://github.com/projectfluent/fluent/wiki/Fluent-vs-gettext)

[Fluent Design Principles](https://github.com/projectfluent/fluent/wiki/Design-Principles)

[ICU User Guide: Formatting Messages](http://userguide.icu-project.org/formatparse/messages)
