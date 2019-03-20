# Fluent Syntax

Project Fluent designed their own syntax for internationalization purposes. We'll go over some of the basics of the ftl syntax here, and provide a small example.

## Quick Example

The ftl syntax provides translators with a lot of power with the translations. With ftl, not only do you have the power to list simple translations, but you can also define them with certain placeables, attributes, and selectors. Let's check out this quick example showing some of the capabilities of the ftl syntax:

```ftl
# Basic ftl message format
basic = This is a simple, basic message.

# Message using a placeable
placeable = This is a { $messageType } message.

# Multiline message
multi = Messages can span
    multiple lines, as long as new lines
    are indented by at least one space.

# Message using attributes
attribute = This message has a placeholder attribute.
    .placeholder = How useful!

# Message using selectors
selector =
    { $numSelectors ->
        [one] You have one selector.
       *[other] You have { $numSelectors } selectors.
    }
```

These are just a few of the capabilities that Project Fluent's syntax includes. For a much more detailed explanation of everything that this syntax makes possible, we highly recommend that you check out their [syntax guide](https://projectfluent.org/fluent/guide/).
