module.exports = convertKebabToPascal

const filterSpecialCharacters = (string) => {
  return string.replace(/[^A-Za-z0-9]/, '')
}

function convertKebabToPascal(string) {
  // split the string into an array of words
  const words = string.split('-' || '_')

  // capitalize the first letter of each word and concatenate them
  const pascalCase = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('')

  const filterSpecialChar = filterSpecialCharacters(pascalCase)

  return filterSpecialChar
}
