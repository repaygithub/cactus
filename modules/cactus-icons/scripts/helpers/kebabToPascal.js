module.exports = convertKebabToPascal

const nonAlphaNumeric = /[^A-Za-z0-9]/
function convertKebabToPascal(name) {
  let camelName = name.charAt(0).toUpperCase()
  for (let i = 1; i < name.length; ++i) {
    if (nonAlphaNumeric.test(name.charAt(i))) {
      camelName += name.charAt(++i).toUpperCase()
    } else {
      camelName += name.charAt(i)
    }
  }
  return camelName
}
