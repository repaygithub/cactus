# Standard Usage

Let's get started with a simple example using the internationalization capabilities of this framework. To set up a project with i18n, we'll follow these steps:

  1. Define a set of translations using the ftl syntax specified by Project Fluent. Documentation on ftl syntax can be found [here](https://projectfluent.org/fluent/guide/).
  2. Extend the `BaseI18nController` class. We will need to override the `load` method to tell the controller where to get the translations from, and which translations to use.
  3. Use the `AppRoot` component at the top level of the application and give the controller object to this component. This will give the application the ability to utilize the controller and the i18n components to achieve internationalization throughout the app.
  4. Use the provided internationalization components such as `I18nSection` and `I18nText` to render translatable text in the application. We'll use these components to tell the controller which translations we need and where to pull them from.

## Defining Translations

Project Fluent designed a simple, powerful syntax for writing translations for internationalization. This project makes use of that syntax, and expects translations to use that syntax. Again, if you are not familiar with the ftl syntax, please take the time to read about it [here](https://projectfluent.org/fluent/guide/).

Now, let's put that syntax to use:

```js
// en/global.js
export default `
welcome-message = Welcome, { $user }!`

// en/accounts.js
export default `
welcome-message = Welcome to the accounts page, { $user }!`

// es/global.js
export default `
welcome-message = ¡Bienvenido, { $user }!`

// es/accounts.js
export default `
welcome-message =
¡Bienvenido a la página de cuentas, { $user }!`
```
Notice that we put translations in two separate folders; one for English and one for Spanish. We also made `global.js` and `accounts.js`. This is because of how the i18n framework utilizes sections for organizations and efficiency. We'll discuss that more later. For now, let's move on to extending the `BaseI18nController` class.

## Extending `BaseI18nController`

In order to use the internationalization features offered by Cactus Framework, we'll need to extend the `BaseI18nController` class, so we can override the `load()` method. This method will need to load ftl translations based on language and section and return that content so that it can be used by the controller.

Let's see what this might look like:

```js
// i18nController.js
import { BaseI18nController } from '@repay/cactus-fwk'

class I18nController extends BaseI18nController {
  load(args) {
    const { lang, section } = args
    // load ftl translations from the source
    import(`./locales/${lang}/${section}.js`).then(({ default: ftl }) => {
      return [{ lang, ftl }]
    })
  }
}

const controller = new I18nController({ defaultLang: 'en', supportedLangs: ['en', 'es'] })
export default controller
```
In this example, we assume that the translations are stored locally in a folder called `locales`. We use the language and section to load the translations needed, and then return them. Now that we've extended the `BaseI18nController` class, we can start using `<AppRoot />`.

## Using `<AppRoot />`

The `AppRoot` component is designed to be a top-level wrapper component that can provide all of its children (the rest of the application) with the means to make internationalization happen. Let's see how this would look:

```jsx
// index.js
import AppRoot from '@repay/cactus-fwk'
import i18nController from './i18nController.js'

const mainComponent = () => {
  return (
    <AppRoot withI18n={i18nController} lang="en">
      ...
    </AppRoot>
  )
}
```
Here, we make `<AppRoot />` the top-level component in our app, and we provide it with an instantiated object of the `I18nController` class that we set up earlier. Providing this component with the controller using the `withI18n` prop will tell the wrapper that we are going to want to use i18n features. Now, let's start using some other tools to display some text.

## Using I18n Components

Now that our setup is complete, we can add on to the work we did in the last step to render some translations. We'll use two extra components: `I18nSection` and `I18nText`. `I18nSection` can be used to tell the controller which section to load (In this case, we have either "global" or "accounts"). If you don't use `I18nSection` to specify a section to choose a translation from, the controller will use the "global" translations. Let's add on to what we did in the previous step with some examples.

```jsx
// index.js
...
const mainComponent = () => {
  return (
    <AppRoot withI18n={i18nController} lang="en">
      <I18nText get="welcome-message" args={{ user: "CS Human" }} />
    </AppRoot>
  )
} // Welcome, CS Human!
```
Notice that we told `I18nText` that we wanted to get the `welcome-message` translation, but we didn't use an `I18nSection` component. This means the controller will look for the global translation. We also made use of the `args` prop to pass an object that contains the value for the `user` variable in the translation. But what if we had used a section? Let's check it out:

```jsx
// index.js
...
const mainComponent = () => {
  return (
    <AppRoot withI18n={i18nController} lang="en">
      <I18nSection name="accounts">
        <I18nText get="welcome-message" args={{ user: "CS Human" }} />
      </I18nSection>
    </AppRoot>
  )
} // Welcome to the accounts page, CS Human!
```
Notice that we used the same `get` value on `I18nText`, but by making the `I18nText` component as a child of `I18nSection`, we told the controller that we should be loading translations for the "accounts" section, instead of global. What if we wanted to load translations for a different language, though? To do so, we'll just need to change the `lang` prop on `AppRoot`:

```jsx
// index.js
...
const mainComponent = () => {
  return (
    <AppRoot withI18n={i18nController} lang="es">
      <I18nSection name="accounts">
        <I18nText get="welcome-message" args={{ user: "CS Human" }} />
      </I18nSection>
    </AppRoot>
  )
} // ¡Bienvenido a la página de cuentas, CS Human!
```

At this point, we have successfully set up a small example with the ability to render different translations for different sections. If you want to see a working example, you can check out the standard implementation [here](https://github.com/repaygithub/cactus/tree/master/examples/standard). It uses a lot of these same ideas. Additionally, we have much more detailed API docs on each tool available with internationalization [here](./API%20Documentation.md)
