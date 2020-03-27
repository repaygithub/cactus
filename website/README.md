# Website

The living style guide and documentation website for Cactus DS

## Commands

These commands can also be called from the root of the repository using `yarn docs <cmd>` where `<cmd>` is replaced with the desired command.

### `yarn start`

Alias to `yarn dev`

### `yarn dev`

Starts up and runs the website locally with normal debugging features enabled. This is useful for normal development of the website with features like hot-reloading.

### `yarn debug`

Starts the development server for the Gatsby site but with node _also_ in debug mode. Use this command if you need to inspect and freeze execution in the `gatsby-node.js` file.

## Pages

### `src/pages`

By default, Gatsby creates pages for every file defined in `src/pages` and uses the file path to define the route.

### `../docs`

All markdown files in `../docs` are scanned and loaded as pages following the same folder structure they are in currently. The README in that folder is converted to the root index page on the website.

### `../modules/cactus-web/src/*/*.mdx`

All component markdown files are loaded and converted to Component documentation pages. These pages then use the extracted information about prop-types from `react-docgen-ts` to render Props tables.
