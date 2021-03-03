# How to Implement End-to-End Testing

Unit testing is great, but sometimes you need to test how your page behaves in an actual browser: that's where end-to-end testing comes in. This guide should show you how to use some of our tools to make this task a little easier.

Before starting, you should have an application that you wish to test. The examples used will be based on an app like those created by the [@repay/create-ui](https://github.com/repaygithub/ui-tools/tree/master/modules/create-repay-ui) package; see <a to='/tutorials/responsive-web-design/'>this tutorial</a> for an example with starting a new project.

## Installation & Configuration

First you'll need to add some packages to the `devDependencies` section in your `package.json`. The main test library we use is [testcafe](https://devexpress.github.io/testcafe/documentation/getting-started/). [@repay/testing-tools](https://github.com/repaygithub/ui-tools/tree/master/modules/testing-tools) provides a simple command that abstracts away some of the complexity and configuration of testcafe. Finally, [@testing-library/testcafe](https://testing-library.com/docs/testcafe-testing-library/intro) provides some useful selectors and helper functions for writing tests, so you can choose whether or not you want to use it.

Test configuration for testcafe is done with a [normal config file](https://devexpress.github.io/testcafe/documentation/reference/configuration-file.html). For example, if your project uses Typescript you might want something like this in your config file:

```
"compilerOptions": {
  "typescript": { "configPath": "tsconfig.json" }
}
```

## Writing Tests

Obviously this will vary greatly from project to project, so there's not a lot to say here; the tests are just normal testcafe tests. For example if you had a page like this:

```jsx
import React from 'react'

const TestForm = () => {
  const [text, setText] = React.useState('')
  const onSubmit = () => {
    setText(document.querySelector('#text-input').value)
  }

  return (
    <>
      <div>
        <label for="text-input">Input some text: </label>
        <input id="text-input" />
      </div>
      <div>
        <button id="submit-button" onClick={onSubmit}>Submit</button>
      </div>
      <div>{text} of the ETE variety</div>
    </>
  )
}

export default TestForm
```

You might write a test like this:

```js
import { queryByText } from '@testing-library/testcafe'
import 'testcafe'

// This URL assumes running the app with the `yarn start` command made by `create-repay-ui`;
// you may first need to load it in the browser and bypass the SSL certificate.
fixture('Sample Test')
  .page('https://localhost:3435/testform')


test('Test Submit', async (t) => {
  await t.typeText('#text-input', 'This is a test')
  await t.click('#submit-button')

  await t.expect(queryByText('This is a test of the ETE variety').exists).ok('not found')
})

```

## Running Tests

Before you run the tests you need to make sure the app is running at the URL the tests are expecting. Depending on your setup you may even be able to run the server as part of the test run, like [some of our example apps](https://github.com/repaygithub/cactus/tree/master/examples/standard/tests) (see the `before` function in the test file).

Once you have the app ready, all you need is the command

```
yarn testing-tools run-ete-tests -b firefox
```

The most important option for the `run-ete-tests` is the browser to run tests in; use this command to check which ones you can use on your computer:

```
yarn testcafe --list-browsers
```

If you have both unit and end-to-end tests, you'll probably want to keep them separate, and use the `--src` argument to only run the ETE tests.

```
yarn testing-tools run-ete-tests --src ete-tests/**/*.test.js -b firefox
```

It's also possible to run the tests on other operating systems & browsers using BrowserStack, but that's beyond the scope of this guide.

### Further Reading

- [Testcafe documentation](https://devexpress.github.io/testcafe/documentation/getting-started/)
- [@repay/testing-tools](https://github.com/repaygithub/ui-tools/tree/master/modules/testing-tools)
- [Example app w/ ETE tests](https://github.com/repaygithub/cactus/tree/master/examples/standard)
