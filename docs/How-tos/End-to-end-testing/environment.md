## Environment

`Environment` gives general control to the test process. It's where you have pre/post test setups occurr and typically load any fixtures. You can inject dependencies to the step definitions through the `context` object, take screenshots on failed tests, and much more.

These are contained within `environment.py`
```python
from features.fixtures import selenium_browser_chrome, search_page
from behave import use_fixture

# Occurrs before any tests run.
def before_all(context):
    # this runs a fixture to load a chrome browser on the selenium hub
    use_fixture(selenium_browser_chrome, context)

    # this loads the search page fixture for access throughout tests
    use_fixture(search_page, context)

# A special kind of fixture to run specific actions when finding certain tags
def before_tag(context, tag):
    if tag == "ID5671":
        pass

# These left to demonstrate other hooks
def before_scenario(context, scenario):
    pass

def after_scenario(context, scenario):
    pass

def before_feature(context, feature):
    pass

def after_feature(context, feature):
    pass

def after_all(context):
    pass
```