# Front End Testing Philosophy

## Why Are Tests Important?

Writing tests is such an important step in the software development process because it increases confidence in your code. We write tests so that we can rest assured that an application will work as intended when it's used.

## What Types of Tests Are There?

Kent C. Dodds lists the types of tests and what they are used for in his article on [types of front end testing](https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests). For the purposes of this discussion, we will be focusing on unit, integration, and end to end tests.

As mentioned Dodds' article linked above, the different types of tests are defined as follows:
  - Unit Tests: Verify that an individual component/function works as intended on its own.
  - Integration Tests: Verify that multiple units work together.
  - End to End Tests: Test behaves like a user and navigates an application in the same way that a normal user would to ensure that the app functions correctly as a whole.

## What Tests Should You Write?

In general, we recommend that you follow Kent C. Dodds' guides on [writing tests](https://kentcdodds.com/blog/write-tests) and [how to know what to test](https://kentcdodds.com/blog/how-to-know-what-to-test).

To summarize, when testing a front end application, you should focus more on covering use cases than increasing code coverage. Your code coverage metric will increase as a by-product of use case testing. When writing a test, you should be thinking of all of the possible ways that a piece of code could respond given its inputs. What will the function return if you pass a certain argument? What happens if you don't pass any arguments at all? What happens if a user clicks on some button, or enters some text in a field? What should a component render given a certain set of props? These are questions that you should be asking yourself when writing tests, and if you are writing your tests to answer these types of questions, then you are focused on the use cases, and this will yield a higher confidence in your code.

### End to End Tests

According to Dodds, you should ask yourself a simple question when determining what code to write tests for: _What part of this app would make me most upset if it were broken?_ He suggests making a list of features that your application supports and to prioritize them. When you have that list, try to write a single E2E test to cover the "happy path" that a user would go through for a given use case. Doing so will often cover many of the features that you listed as the most important. End to end tests can be very lengthy and can take a long time to run, but the tradeoff is that E2E tests will give you the most confidence that your application is behaving as it should. There are several tools to help with writing E2E tests, and we recommend using [TestCafe](https://devexpress.github.io/testcafe/) with [TestCafe Testing Library](https://testing-library.com/docs/testcafe-testing-library/intro). For more info on setting up your E2E tests, check out our [End to End Testing Guide](/how-tos/end-to-end-testing/). You can also find some good examples of E2E tests in the Channels application.

### Integration Tests

After you've set up a couple of end to end tests to cover the most important user paths, you should start looking at writing some integration tests. As Kent C. Dodds points out, _most_ of your tests should be targeting the integration of components. As such, so you should typically mock as little as possible here. You may render a full app in these tests, but you don't have to. Remember to focus on testing use cases over increasing test coverage. We won't dive into the specifics of how to write these tests here, but we recommend using [jest](https://jestjs.io/docs/en/getting-started) with React Testing Library and following along with their [setup docs](https://testing-library.com/docs/react-testing-library/setup/). Feel free to browse our [example apps](https://github.com/repaygithub/cactus/tree/master/examples) to see some examples of good integration tests.

### Unit Tests

Once you have some integration tests in place, it's time to start writing unit tests. A unit test should focus on testing a single piece of code, whether it be a component, a page, or a function. In these tests, you'll want to mock out anything that doesn't pertain to the piece of code you are testing. You should write unit tests for any code that contains complex business logic and, again, you should be focusing on testing the use case over ensuring 100% code coverage. We recommend using [jest](https://jestjs.io/docs/en/getting-started) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit tests. You can find some good examples of unit tests by browsing the components offered through [@repay/cactus-web](https://github.com/repaygithub/cactus/tree/master/modules/cactus-web/src).

## Avoiding Implementation Details

In Kent C Dodds' article on [testing implementation details](https://kentcdodds.com/blog/testing-implementation-details), he points out that you should avoid testing the implementation details of a component because it can yield brittle tests that break when you refactor application code, or it can cause your tests to pass when you break application code.

### What Are Implementation Details?

Dodds' defines implementation details as "things which users of your code will not typically see, or even know about." In a React application, the users are both the end users, who will see and interact with whatever is rendered on the page, and the developers who will have access to the props. With that in mind, your tests should only interact with the props that are passed and the rendered output.

### What's The Solution?

[Testing Library](https://testing-library.com/docs/)! This library provides you with the tools to test your code in the same way that a user would interact with the components in the UI. They offer several different frameworks so that you can use it with TestCafe, React, Puppeteer, and many other front end tools. Though they offer testing libraries that are compatible with many different frameworks, the idea is always the same: Query and interact with DOM nodes so that you can avoid interacting with the code's internal implementation. Using Testing Library, you can query DOM elements that you expect to be rendered, and trigger mouse and keyboard events to better simulate an end user's interaction. Testing Library makes it difficult to test your front end code the wrong way, so we highly recommend that you couple their tools with whatever framework you are working with in order to write meaningful, user-oriented tests.

## Wrap Up

Writing front end tests is important because it increases confidence in your application and helps ensure that your application is performing as you expect it to. It's important to include multiple types of tests, from unit, to integration and all the way up to end to end tests to gain the most confidence in your code. You'll also gain the most benefit from your tests if you focus on making sure that your use cases are covered rather than focusing more heavily on code coverage. When writing tests, use tools like Testing Library to avoid interacting with the internal code and instead simulate a user's actions. If you'd like to learn more about front end testing in general, Kent C. Dodds is a great resource and he frequently posts articles relating to front end testing on his [blog](https://kentcdodds.com/blog/).
