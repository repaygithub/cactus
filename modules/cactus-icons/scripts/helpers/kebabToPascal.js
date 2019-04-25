module.exports = convertKebabToPascal

const nonAlphaNumeric = /[^A-Za-z0-9]/
function convertKebabToPascal(name) {
  let pascalName = name.charAt(0).toUpperCase()
  for (let i = 1; i < name.length; ++i) {
    if (nonAlphaNumeric.test(name.charAt(i))) {
      pascalName += name.charAt(++i).toUpperCase()
    } else {
      pascalName += name.charAt(i)
    }
  }
  return pascalName
}
