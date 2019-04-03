# `@repay/cactus-icons`

Cactus design-system icons as React elements for web.

## Usage

For usage, see the documentation for the [Cactus Design System Icons](../../docs/Icons/README.md).

## Contributing

Building the repository

```
yarn build
```

Testing the build

```
yarn test
```

You must build before the tests will pass.

### Publishing

In order to provide easily accessible imports and maintain a clean repository, this module is actually published from the completed `dist` folder instead of this root. During the build process, the svgs are converted to TypeScript files in the `built` folder, and then everything is run through babel into the `dist` folder.

This will also affect linking because you will need to link this component from inside there or copy the contents into the root module folder.

The list of currently available icons will be automatically edited on build in the `docs` folder at the repository root.
