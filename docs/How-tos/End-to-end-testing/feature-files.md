## Feature Files

Feature Files align with a feature in the Application Under Test. They provide a connection between business, technology, and the overall User experience. Each feature file starts with `Feature`, and it will closely resemble the intention of the business requirement and then be broken down further by requirements that match up to `Scenarios`.

### Naming

Feature files will follow a naming scheme of `<name>.feature`

### Features

`Feature:` Matches a User Story representing new development of features. A short description of what the feature validates will suffice
```gherkin
Feature: Google search
  Users can perform searches and recieve search results
```

### Scenarios

`Scenario:` Represents a test for a requirement specified when planning how a feature of an application works. A scenario should be written in a manner that is understandable and reusable. The first step, `Given`, will always correlate to the `known state` of your application before testing begins. Each scenario must run independently of the other. There should be no test data requirements between tests.

```gherkin
Feature: Google search
  Users can perform searches and recieve search results

  Scenario: Simple google search
      Given I am on the search page
      When I search for "behave bdd"
      Then "Welcome to behave!" can be seen in the search results

```