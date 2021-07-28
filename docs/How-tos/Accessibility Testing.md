#### Component Accessibility

In our efforts for our front-ends to meet accessibility requirements of <INSERT_REQUIRED_LEVEL>, we implement supplemental automated accessibility testing via `jest-axe`, a custom jest matcher for testing accessibility. Since it is a jest plugin, this allows us to write tests for components where we would be conerned about any accessibility requirements being met. These sort of tests can be placed right alongside existing unit tests, and they can be parameterized to run the same test over our provided screen sizes by using the `jest-each` plugin, which in general enables parameterized tests.

Automated accessibility provide a safeguard around common issues and can catch ~30% of issues.

Packages
- jest-axe
- jest-each

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
import each from 'jest-each';
expect.extend(toHaveNoViolations)


describe('component: MenuBar', () => {
    
    // ... other tests

    describe("accessibility", () => {
        each([
            ["tiny", SIZES.tiny],
            ["small", SIZES.small],
            ["medium", SIZES.medium],
            ["large", SIZES.large],
            ["extraLarge", SIZES.extraLarge]
        ]).test("has no violations on screen size '%s'", async (text, screen_size) => {
            const { container } = render(
                <StyleProvider>
                    <ScreenSizeContext.Provider value={screen_size}>
                        <Menu />
                    </ScreenSizeContext.Provider>
                </StyleProvider>
            );

            const results = await axe(container);

            expect(results).toHaveNoViolations();
        });
    });
});

```

You will get output
```bash
component: MenuBar
    ...
    accessibility
      ✕ has no violations on 'tiny' (667 ms)
      ✕ has no violations on 'small' (715 ms)
      ✕ has no violations on 'medium' (723 ms)
      ✕ has no violations on 'large' (655 ms)
      ✕ has no violations on 'extraLarge' (692 ms)

  ● component: MenuBar › accessibility › is accessible on 'tiny'

    expect(received).toHaveNoViolations(expected)

    Expected the HTML found at $('#mb-button') to have no violations:

    <button id="mb-button" role="button" aria-haspopup="menu" aria-controls="mb-popup" type="button" class="sc-gyUeRy fUyNFh">

    Received:

    "Buttons must have discernible text (button-name)"

    Fix any of the following:
      Element does not have inner text that is visible to screen readers
      aria-label attribute does not exist or is empty
      aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
      Element has no title attribute
      Element's default semantics were not overridden with role="none" or role="presentation"

    You can find more information on this issue here: 
    https://dequeuniversity.com/rules/axe/4.2/button-name?application=axeAPI

      202 |       const results = await axe(container);
      203 |
    > 204 |       expect(results).toHaveNoViolations();
          |                       ^
      205 |     })
      206 |
      207 |   });

      at src/MenuBar/MenuBar.test.tsx:204:23


    ...
```

Which gives a good indication on first steps to improving accessibility.

Basically, we want to put some components together, audit them, and fix as necessary. Improving this process will help mitigate issues as the framework itself is adopted across the organization.

One more example but with specifically the MenuButton component,
```typescript
describe('component: MenuButton', (): void => {
  
  // ... other tests

  describe("accessibility", () => {
    each([
      ["tiny", SIZES.tiny],
      ["small", SIZES.small],
      ["medium", SIZES.medium],
      ["large", SIZES.large],
      ["extraLarge", SIZES.extraLarge]
    ]).test("is accessible on '%s'", async (text, screen_size) => {
      const actionOne = jest.fn()
      const actionTwo = jest.fn()

      const { container} = render(
        <StyleProvider>
          <ScreenSizeContext.Provider value={screen_size}>
          <MenuButton>
            <MenuButton.Item onSelect={actionOne}>Action One</MenuButton.Item>
            <MenuButton.Item onSelect={actionTwo}>Action Two</MenuButton.Item>
            <MenuButton.Link href="#">Action Three</MenuButton.Link>
          </MenuButton>
          </ScreenSizeContext.Provider>
        </StyleProvider>
      )

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    })

  });
})

```

With output (which is condensed to two of the failures, which show different issues on screen size)
```bash
  component: MenuButton
    ...
    accessibility
      ✕ is accessible on 'tiny' (206 ms)
      ✕ is accessible on 'small' (158 ms)
      ✕ is accessible on 'medium' (134 ms)
      ✕ is accessible on 'large' (154 ms)
      ✕ is accessible on 'extraLarge' (144 ms)

   ● With theme changes  › accessibility › is accessible on 'tiny'

    expect(received).toHaveNoViolations(expected)

    Expected the HTML found at $('#menu-button--menu--38') to have no violations:

    <button aria-haspopup="true" aria-controls="menu--38" variant="filled" class="sc-fHYxKZ itpwSe" data-reach-menu-button="" type="button" id="menu-button--menu--38">

    Received:

    "Buttons must have discernible text (button-name)"

    Fix any of the following:
      Element does not have inner text that is visible to screen readers
      aria-label attribute does not exist or is empty
      aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
      Element has no title attribute
      Element's default semantics were not overridden with role="none" or role="presentation"

    You can find more information on this issue here: 
    https://dequeuniversity.com/rules/axe/4.2/button-name?application=axeAPI

    ────────

    Expected the HTML found at $('div[role="none"]') to have no violations:

    <div role="none" tabindex="-1"><a role="menuitem" tabindex="-1" href="#" data-reach-menu-link="" data-reach-menu-item="" data-valuetext="Action Three" id="option-2--menu--38">Action Three</a></div>

    Received:

    "Elements of role none or presentation should be flagged (presentation-role-conflict)"

    Fix all of the following:
      Element is not focusable.

    You can find more information on this issue here: 
    https://dequeuniversity.com/rules/axe/4.2/presentation-role-conflict?application=axeAPI

      184 |       const results = await axe(container);
      185 |
    > 186 |       expect(results).toHaveNoViolations();
          |                       ^
      187 |     })
      188 |
      189 |   });

      at src/MenuButton/MenuButton.test.tsx:186:23
```
