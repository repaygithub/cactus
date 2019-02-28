# `@repay/eslint-config`

## Usage

To use this configuration you will need to follow three steps:

1. install this package via your package manager of choice
   `yarn add -D @repay/eslint-config eslint`
1. install the peer dependencies and configurations
   `yarn repay-eslint install`

To run the linter you should add a "script" to the root `package.json` such as:

```
{
  "scripts": {
    "lint": "eslint \"**/*.{js,jsx}\""
  }
}
```

You will then be able to run the linter using the command: `yarn lint`. Adding the `--fix` argument will auto fix any issues which can be: `yarn lint --fix`
