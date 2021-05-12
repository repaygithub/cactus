module.exports = {
  stories: ['../src/**/*.story.tsx'],
  addons: [
    '@storybook/addon-knobs/register',
    '../cactus-addon/register.jsx',
    '@storybook/addon-actions/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-docs',
  ],
}
