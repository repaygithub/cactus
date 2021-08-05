# UI Automation Standards


- Reference of web elements by unique id (data-testid) and with meaningful name attributes to reduce long term maintenance cost.

- Avoid the use of hard delay such as Thread.sleep() as this will prolong the overall test execution time. Instead, use implicit or explicit waits features to avoid unnecessary wait time and also making the tests more robust.

- Test cases should be independent of each other as this will cause issue during test execution. For example, if the dependency test case failed, it will cause the actual test to fail as well. Besides that, this approach will cause issues if we were to execute our tests in parallel.

- Adopt data driven testing approach when performing multiple test data combinations. 

- The usage of multiple assertions or similar assertion engine during testing. This approach will test all asserts in a test before providing a final assert result. For example, a test case has five asserts and the second assert failed. With the use of regular assertion method, it will throw the error on the second assert and stop the test without testing the subsequent asserts. With multiple asserts, it will test all five asserts before throwing the error on the second assertion, hence saving us time in the long run.

- Adopt Page Object Model (POM) design pattern to simplify test case creation and avoid code redundancies.

- Test data should be unique to avoid false negative during validation. For example, avoid using the keyword “test” in the name or address field. These fields should be randomized.

- Capture screenshots and upload to a centralize storage location/test management system tool when a test case fails to analyze cause.
