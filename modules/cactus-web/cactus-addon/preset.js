// The main Cactus addon is still in index.tsx/register.jsx;
// this addon is to fix some issues with the controls addon
// & add dynamic mapping to args/argTypes.
function config(entry = []) {
  return [...entry, require.resolve('./controls.js')]
}
module.exports = { config }
