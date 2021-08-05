## Gherkin and Step Definitions

Step definitions connect your Gherkin `Given / When / Then` to code that executes class methods.

### Naming

Step defintions will follow a naming convention of `<name>_steps.py`

### Known State

Each test will start with the same gherkin. This is referred to as the Known State. This tells us that our application under test opens properly to the expected destination before we begin testing.

`Gherkin`
```gherkin
Given I am on the search page
```

`Step Definition`
```python
@given('I am on the search page')
def step_impl(context):
    context.search_page.navigate()
```

Error on the side of _not_ passing variables into step definitions right away, especially if they are environment dependent. This lets us specify variables and data from other areas and load it on a per test or environment basis.

### Inline Variables

This is a step that uploads a document that is specified in the scenario. It shows that the filename is being passed to the step from the scenario as a variable.

`Gherkin`
```gherkin
When I search for "behave bdd"
```

`Step Definition`
```python
@when('I perform a search for "{text}"')
@when('I search for "{text}"')
def step_impl(context, text):
    context.search_page.perform_search(text)
```

Notice how there are two `When` bindings. Multiple Gherkin statements in your `feature` can execute the same step definition. This lets us attempt to be more readable.


### Simple Assertions

It's easy to make assertions within either the step or in a page object. This is just a simple example of asserting text is being displayed on the page in general. This could instead be a page function that further narrows or defines how to expect the result

`Gherkin`
```gherkin
Then "Welcome to behave!" can be seen in the search results
```

`Step Definition`
```python
@then('"{text}" can be seen in the search results')
def step_impl(context, text):
    expect(context.driver.page_source).to(contain(text))
```

Here you can see that the context variable being passed to the steps has access to the entire test runtime. In this case there was both a page and the driver attached.

This is how the steps get driven from the environment setup.
