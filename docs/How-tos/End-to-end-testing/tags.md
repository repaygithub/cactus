## Tags

Tags can control and categorize test suites as well as individual tests. You can combine many different combinations of tags: single, multiple, unique, and as well use conditional logic to skip certain tests.

### Feature Tags

Tags that can relate to an entire feature.
```gherkin
@google-search
Feature: Google search
  Users can perform searches and recieve search results

```

### Scenario Tags

Scenario tags uniquely label tests so we can relate them back to whatever requirement they spawned from or a test case id we can use later for reporting test metrics.

This test relates to some story/ticket/task `ID5671`.

You can hook into specific scenarios to perform special actions from within `environment.py`

```
@ID5671
Scenario: Simple google search
    Given I am on the search page
    When I search for "behave bdd"
    Then "Welcome to behave!" can be seen in the search results

```
