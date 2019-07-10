# `@repay/cactus-icons`

Cactus design-system icons as React elements for web.

## Usage

For usage, see the documentation for the [Cactus Design System Icons](../../docs/Icons/README.md).

## Contributing

### Commands

> All of these commands can be run from the root of the repository using the `web` shortcut. (e.g. `yarn web start`)

Running Storybook

```
yarn start
```

Testing the build

```
yarn test
```

Building the repository

```
yarn build
```

Running build in watch mode

> Does not currently watch for svg changes to rebuild the TypeScript files. (TODO)

```
yarn dev
```

You must build before the tests will pass.

### Publishing

During the build process, the svgs are converted to TypeScript files in a `ts` folder, and then everything is run through babel into the `i` folder.

The list of currently available icons will be automatically edited on build in the `docs/Icons` folder at the repository root.
