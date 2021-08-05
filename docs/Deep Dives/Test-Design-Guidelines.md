# Test Design Guidelines

These collections of guidelines are intended to give some structure around writing tests, pitfalls to look out for, and present general ways to optimize how we write tests.

## Do

### Cover all newly introduced code with sufficient tests

This is a really good article explaining how to “count contexts”. The samples are Ruby’s RSpec, but the principle still applies. In general “… we want the number of contexts to match the number of conditional branches within code“. We aren’t using context blocks here, but the idea is still to be mindful on how many arguments can be set, are default, or any conditions that your code has.

In a small example
```python
class Fox(object):
    def speak(self, say="Ring-ding!", loud=False):
        if loud:
            return say.upper()
        else:
            return say
```
You only need two tests to have it marked as 100% covered, but you could write additional tests for setting say and loud to other values like None, blank strings, or just different values entirely. Adding tests like that will point out the conditions that will cause errors in your source code.

### Write in sentences and describe what the test is attempting to prove or disprove

It takes a little bit longer, but you’ll thank yourself when you have to come back to the same test. It also helps in identifying any missed tests.
```
example here
```

### Use describe blocks

Add a describe block and add your validations within. Enabled via pytest-describe

Instead of
```
example here
```

We still keep the test_ prefix so the PyCharm test runner will be able to run individual tests. In general, describe blocks help identify a test suite whereas test methods are intended to test the specifics in behavior. You can use multiple describes one or, whatever makes the test more organized and/or clear in intention.

### Favor mocking external libraries over internal

Be careful what you mock for. If the code you mock is changed, your test may still pass when it should fail. For this reason, prefer mocking external libraries. Don’t mock things that don’t need to be mocked.

```python
class Fox(object):
    def speak(self):
        return "Ring-ding"


def what_did_the_fox_say():
    fox = Fox()
    return fox.speak()


def describe_fox():
    def test_can_speak(mocker):
        mocker.patch.object(Fox, 'speak').return_value = 'Ring-ding!'
        result = what_did_the_fox_say()
        expect(result).to(equal("Ring-ding!"))
```

Now when you change your source method

```python
class Fox(object):
    def speak(self, loud=True):
        if loud:
            return "Ring-ding".upper()
        else:
            return "Ring-ding"
```

It’s a very simple error, but the point is that mocks can hide defects and are more likely to hide them in internal code.

### Limit expectations and assumptions with the scale of the test

#### Unit Tests

Instead of having all your assertions in one test, use the same input data as a common fixture to set the tests up and create different specifications. Assertions are more numerous and can be more comprehensively compound the higher the order of test. 

#### Integration + System Tests

The general rule of thumb here is towards the top end that you do not want to go over. Both types of tests often take considerable setup, systems tests more so, so there isn’t anything particularly wrong with stuff like this…

### Favor the lowest level of test possible

Unit > integration > system > UI > smoke.  At each level, tests become harder to set up, longer to run, and more fragile.  Each level of test should try to validate only elements which can not be validated at a lower level.  This may require careful thought about how to write the feature (separating a view from a view model, fore example), but is always worth the effort in time saved.

### Use a factory to generate data for testing

Use a factory to control generating your data. This example uses faker to randomize data for general testing and you can override attributes for more controlled testing.

```
example here
```

### Prefer positive language in tests over negative

Negatives sometimes make more sense, but always use positives if possible and it keeps the assertion short.
```python
expect(False).to(be_false)
```
#### compared to
```python
expect(False).not_to(be_true)

expect(['a', 'b']).not_to(contain('c'))
```
#### compared to
```python
expect(['a', 'b']).to(contain_only('a', 'b'))
```

### Prefer programmatic creation of test data over static resources

Code usually receives more attention than static resources, and it is often more useful to create the data programatically. In the case of enrollment files, we prepare enrollments and then write them to either a temporary file or a long-lived file.

```
example here
```

### Test behavior, not methods

In general, components are made up of set behaviors. Often times in trying to maximize code coverage, the wrong things will be tested. Behaviors of a component, app, platform, etc, should be identified and most of the testing effort should be around it's behavior.

```
example here
```

### Write tests for every defect

All defects should have corresponding tests added to ensure the system does not regress. These can often give insight into additional tests that were missed and expose gaps.

## Avoid

### Unnecessary abbreviations

Avoid short, cryptic variable naming. It can make understanding tests and identifying additional test cases very difficult. A few exceptions to this rule can be

err for exceptions
i/j/k for iterators
x/y/z within list comprehension
n for amounts or ranges

### Parameterizing tests that have different results

Parameterization can be beneficial, but avoid this in cases where the result is different. Use these only for testing different inputs that result in the same output. Keep in mind that they often lack sufficient detail and are more complicated to understand due to keeping references back to your parameters.

```python
def describe_first_name_validations():
    test_data = [("John", True), ("", False)]
    
    @pytest.mark.parametrize("test_input, expected_output", test_data)
    def test_marks_appropriately_as_valid(test_input, expected_output):
        result = name_is_valid(test_input)
        expect(result).to(equal(expected_output))
```

The above is difficult to understand and further so when one of the cases fails.

### Using source code to prepare test conditions

Tangling your source code into test code means that you will be hiding defects and tests will likely continue to pass under conditions that should have made them fail.

### Iterating in tests

This should be avoided because you may be iterating over a blank collection. It can also be easily rewritten to something else.

```python
for result in results:
    expect(result).to(contain("some_value"))
```

#### compared to

```python
expect(results).to(contain_only("some_value")) 
```

### Sharing the wrong test data

It may be convenient to share data across tests, like a common setup being performed that subsequent tests validate. This is more typically acceptable at a higher scope like system tests running a file and each test validating a different part of the same run. 

#### A few examples of this is

- global variables that are long-lived across entire test runs that are not environment related

- tests that generally depend on the success or values of one another

- fixtures that are improperly scoped, running as a session, module or even configured to autouse=True and pre-configure test data

A good practice is to regenerate test data through the use of isolated fixtures, creating a new instance for every test.