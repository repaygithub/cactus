module.exports = {
  stories: ['../src/**/*.story.tsx'],
  addons: [
    '@storybook/addon-knobs',
    '../cactus-addon/register.jsx',
    '@storybook/addon-actions',
    '@storybook/addon-viewport',
    '@storybook/addon-docs',
  ],
  core: {
    builder: 'webpack5',
  },
}
