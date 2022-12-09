module.exports = {
  stories: [
    '../../docs/**/*.story.mdx',
    '../../modules/**/*.story.@(js|jsx|ts|tsx)',
    '../../modules/cactus-form/**/Form.story.mdx',
    '../../modules/cactus-form/**/OtherTools.story.mdx',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-viewport',
    '@storybook/addon-controls',
  ],
  framework: '@storybook/react',
  features: {
    // This supposedly improves load times, but probably breaks storyshots.
    //storyStoreV7: true,
  },
  core: {
    disableTelemetry: true,
  },
}
