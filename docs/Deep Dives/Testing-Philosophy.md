## Testing Philosophy

You wouldn't build a house without a good foundation. As a general rule a thumb, we want to shift our testing efforts as left as possible. A bottom up approach to testing is highly effective in reducing development times and decreasing bug escape rates. The reason for this is your testing effort becomes precisely targeted at different levels while also providing overlap through higher-order tests. Unit tests are the fastest form of quality feedback a developer can get, therefore we want to write a lot of these. This document along with the design guidelines presented is intended to demonstrate how we best go about that.


![alt text](https://martinfowler.com/articles/practical-test-pyramid/testPyramid.png)

The above test pyramid, taken from [this]([https://martinfowler.com/articles/practical-test-pyramid.html]) article, is as the author states, overly simplistic. However, it does demonstrate two main ideas.

- Write tests with different granularity
- The more high-level you get the fewer tests you should have

The following will give short explanations to some commonly seen categories of tests that you are probably already familiar with and possible some that are not as common.

### Unit

Volume: High

The smallest possible amount of code. This is one function, one expectation, and is as isolated as possible. If the tests are longer than a few lines of code, then you may either be testing too much, or the source code you are attempting to test may be more coupled than it needs to be. There are all kinds of unit tests that can be run to validate many different aspects of a project.

### Service

Volume: Medium

Begins to exercise a series of functions to produce an output. Often requires more setup, and the amount of mocking varies with how your components interact. Interal components are mocked much less, whereas external components are mocked much more. Multiple expectations are typically written per test.


### UI

Volume: Low

Most UI tests require much more comprehensive setup, full deployments, or generally to be conducted in completely built out environments. They can often involve a lot of pre and post setup/teardown. This type of testing should mock as little as possible. Multiple expectations can be used including compound expectations because these are the most expensive tests that can be run.


### Visual Regression

Volume: Medium

Automated tests that compare either mockups or a previous iteration of a view to new iterations of a view. These are useful in ensuring there are no view component changes that were unintended. They either match or they don't and are often configured across all supported breakpoints.

Can either be conducted as unit tests or alongside UI tests.


### Security

Volume: Low

Evaluations that occurr via static code analysis in sonar or other third party libraries like python's `bandit`. These most often check against open sourced lists of known issues, or other institutions and rules like OWASP, SANS, CWE, etc.

Can typically be conducted via libraries that support scanning for vulnerabilities within other libraries.


### Accessibility

Volume: Low

Evaluations that can be automated to catch simple accessibilty issues. Typically these can only catch about 30% of your total issues, but it does contribute to saving a lot of time in the long run.

These can often be implemented supplemental alongside unit tests.


### Exploratory

Volume: Low

Testing conducted in a very general manner of "exploring" our features. This should be the last step and have the least amount of time spent. It is basically the equivalent of a traditional production like "smoke-test", but it is not thoroughly defined.
