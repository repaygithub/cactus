## Page Objects

Martin Fowler, [Page Objects](https://martinfowler.com/bliki/PageObject.html)
> The basic rule of thumb for a page object is that it should allow a software client to do anything and see anything that a human can.

Page objects are the test code representation of your domain.

### Naming

We will follow a naming scheme of `<name>_page.py`

### Pages

Pages are designed in a style that makes their intention clear. Each page contains the elements as well as specific functionality relevant to that page or group of pages.

This is a basic google search page.

```python
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys


class SearchPage:
    def __init__(self, driver):  
        self.driver = driver

    # Hardcoded but the purpose of being in the object is that the url could instead be loaded from the environment
    # URL = os.getenv("URL")


    URL = "https://www.google.com"


    @property
    def search_box(self):
        return self.driver.find_element(By.NAME, 'q')


    def navigate(self):
        self.driver.get(self.URL)


    def perform_search(self, term):
        self.search_box.clear()
        self.search_box.send_keys(term)
        self.search_box.send_keys(Keys.RETURN)
```
