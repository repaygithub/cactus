## Fixtures

These are a collection of functions that will typically load resources or perform repetitive behavior that is needed throughout the lifecycle of the tests themselves rather than being used directly in the tests.

```python
from behave import fixture
from selenium import webdriver
from pages.search_page import SearchPage
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

# demonstrates a single browser
@fixture
def selenium_browser_chrome(context):
    context.driver = webdriver.Remote(command_executor='http://127.0.0.1:4444/wd/hub', desired_capabilities=DesiredCapabilities.CHROME)
    yield context.driver
    # will shut the driver down after all tests have run on that browser instance
    context.driver.quit()


# loading up a single page
@fixture
def search_page(context):
    context.search_page = SearchPage(context.driver)
```