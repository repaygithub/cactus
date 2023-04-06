module.exports = convertKebabToPascal

function convertKebabToPascal(string) {
  // split the string into an array of words
  const words = string.split('-')

  // capitalize the first letter of each word and concatenate them
  const pascalCase = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('')

  return pascalCase
}
