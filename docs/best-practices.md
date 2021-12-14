# Coding Best Practices

## Coding for Accessibility

Coding for accessibility is a legal requirement as well as a morally good thing to do. Therefore it's necessary that features are tested using accessibility software and following best practices. The W3C working group dedicates an ever expanding portion of their website to [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices/)

### Understanding Accessibility

Web accessibility is a broad term covering a variety of solutions for people with disabilities to enable using the web to the same level as someone without any disabilities. The most obvious example is a person who is blind or has other vision impairments may use a screenreader to navigate websites. To ensure the screenreading programs correctly represent the content, developers should write their [HTML _semantically_](https://www.thoughtco.com/why-use-semantic-html-3468271) so that when you read the actual html elements, it describes the website and associate labels with relative input fields. An example of semantic HTML is if you are writing a list of items, you should use a `ul` or `ol` tag and then each item should be an `li`.

Following semantic HTML best practices is relatively sufficient for static websites, but as developers added more functionality through scripting they could no longer properly describe the application with just basic html elements. This is where the WAI-ARIA (pronounced way-ar-ee-ah) which stands for Web Accessibility Initiative - Accessible Rich Internet Applications (a little redundant of a title). But this is where aira-\* html attributes come from.

MDN has published a great resource to [learn web accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility). The next level of understanding comes from the [WAI-ARIA specification](https://www.w3.org/TR/wai-aria/), but the [_WAI-ARIA Authoring Practices_](https://www.w3.org/TR/wai-aria-practices/) document is generally more useful because they have working examples of how things should work and then you can explore the [published code on Github](https://github.com/w3c/aria-practices).

## Upgrading Dependencies

Upgrading dependencies in JavaScript is important due to the massive ecosystem and continual improvements we see both in performance and security. This is especially important when working with open source to ensure we don't ship easily exploitable code.

### Recommendations

1. Review and upgrade dependencies regularly (at least every 3 months)
2. Remove unused dependencies
3. Run security audits through an outside vendor or using `yarn audit` in the command line

The article [_How to efficiently update your npm dependencies?_](https://code-trotter.com/web/how-to-efficiently-update-your-npm-dependencies/) is a great resource that walks through the same steps I regularly use when trying to upgrade dependencies. A quick flow of my normal steps are:

1. Run `yarn outdated` to review outdated dependencies
2. Use `yarn update-interactive --latest` to try and upgrade to the latest versions of dependencies
   - upgrade 1-2 dependencies per pass and then re-run a build-test cycle in between each round of upgrades
3. Commit upgrades on a _per module_ basis so that the scope is specific to each publishable library and will be included in the changelog as expected.