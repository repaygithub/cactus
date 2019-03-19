# Why Project Fluent?

There are other tools to aide in solving internationalization problems, so why did we choose Project Fluent? Well, let's compare Fluent to some other similar tools available.

|                                           | Project Fluent        | ICU MessageFormat                | GetText        |
| ----------------------------------------- | --------------------- | -------------------------------- | -------------- |
| [API Design Target](#api-design-target)   | Web                   | C++ & Java                       | C-based        |
| [Message Identifier](#message-identifier) | Keyed IDs             | Keyed IDs                        | Source String  |
| [Formatters](#formatters)                 | Built-in & extensible | Built-in & limited extensibility | None           |
| [BiDi Support](#bidirectional-support)    | Supported             | Not supported                    | Not supported  |
| Comments                                  | Supported             | Not supported                    | None or hax 🤬 |

### API Design Target

Because Fluent is designed for UI applications, it provides support for attributes through metadata (e.g. aria-\*, title, etc.). With MessageFormat, you can accomplish this by suffixing message identifiers (e.g. submit-aria-label). GetText would rewuire more messages, which would be prone to more conflicts in the primary language.

### Message Identifier

The key id that differentiates between messages. Fluent and MessageFormat use ids. Gettext uses the default language string as provided and there can only be as many variants as are provided in the default language which limits the existence of multi-variant translations (e.g. pluralizations and grammatical gender)

### Formatters

Fluent has formatters that work out of the box, or you can extend them easily. MessageFormat provides formatters that must be applied by the developer. MessageFormat allows extension but it's discouraged and a poor developer experience. GetText has no formatting support.

Additionally, Fluent allows translators to override formatting arguments when appropriate (e.g. translator can decide to show currency symbol or code).

### Bidirectional Support

Bidirectional support is necessary when text is displayed in one direction, but variables should be displayed in another (e.g. Displaying US currency in Arabic text).

Fluent fully supports bidirectionality in translations. Neither MessageFormat or GetText has the ability to support bidirectional text.

### Comments

Fluent fully supports comments to provide context to translators. MessageFormat does not support comments; you can add limited context via the message identifier (e.g. submit-terms-button). GetText has no support for comments, other than hacky solutions.

## References

[Fluent and ICU MessageFormat](https://github.com/projectfluent/fluent/wiki/Fluent-and-ICU-MessageFormat)

[Fluent vs gettext](https://github.com/projectfluent/fluent/wiki/Fluent-vs-gettext)

[Fluent Design Principles](https://github.com/projectfluent/fluent/wiki/Design-Principles)

[ICU User Guide: Formatting Messages](http://userguide.icu-project.org/formatparse/messages)
