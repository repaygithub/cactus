module.exports = {
  stories: ['../src/**/*.story.tsx'],
  addons: [
    '@storybook/addon-ie11',
    '@storybook/addon-viewport',
    '@storybook/addon-docs',
    '../cactus-addon/preset.js',
    '@storybook/addon-controls',
    '../cactus-addon/register.jsx',
  ],
}
