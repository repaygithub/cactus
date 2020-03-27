# Contributing to Cactus

🖖 Thanks for coming to contribute! 💯

This is a set of guidelines (not rules) for contributing to Cactus and the libraries herein.

#### Table of Contents

[Code of Conduct](#code-of-conduct)

[Styleguides](#styleguides)

- [JavaScript / TypeScript](#javascript-typescript)
- [Markdown](#markdown)
- [Git Commit Messages](#git-commit-messages)

Also see the documentation for [Coding Best Practices](./docs/Coding%20Best%20Practices/README.md).

## Code of Conduct

This project and everyone participating in it is governed by the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to @JamesNimlos.

## Styleguides

### JavaScript / TypeScript

We use Prettier for formatting and ESLint for all other style recommendations. See the [config file](./eslintrc). This is validated in the continuous integration and the `yarn test:ci` command.

### Markdown

We use the Prettier defaults for this, but there is no validation and will not break a build.

### Git Commit Messages

The style is based on the [Angular Repository](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits) to improve readability and for changelog maintanance.

#### Message Format

```
<type>([scope]): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

- `type` must be one of:
  - **feat**: A new feature
  - **fix**: A bug fix
  - **docs**: Documentation only changes
  - **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  - **refactor**: A code change that neither fixes a bug nor adds a feature
  - **perf**: A code change that improves performance
  - **test**: Adding missing or correcting existing tests
  - **chore**: Changes to the build process or maintanance changes like publishing
- `scope` should be one of:
  - library folder (e.g. `cactus-web`)
  - `website` for changes or updates to the documentation site
  - `examples` for changes to an example web app
  - _blank_ for anything else
- `subject` is the title of the commit
- `body` contains:
  - additional information that doesn't fit nicely in the `subject`
  - Jira tags (e.g. `[CACTUS-#]`)
- `footer`
  - add `BREAKING:` and then the rest of the message is used to describe the break.

##### Example commit

You've written a new Modal component for @repay/cactus-web and now you would like commit your code. Here is an example commit message.

```bash
feat(cactus-web): added Modal component #type, package name, subject of commit

# Additional information about commit
Added a Modal component which can be used to render
information to users which we want them to focus on.

[CACTUS-240] # JIRA story code
```
