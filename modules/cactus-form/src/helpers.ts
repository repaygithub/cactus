

export const popAttr = (obj: UnknownProps, attr: string) => {
  const val = obj[attr]
  delete obj[attr]
  return val
}

export const getFieldConfig = <C>(keys: (keyof C)[], props: UnknownProps, component?: React.ElementType<any>): C => {
  const fieldConfig: any = { component }
  for (const key of keys) {
    if (key in props) {
      fieldConfig[key] = popAttr(props, key)
    } else if (component && component[key]) {
      // For setting component defaults, useful for `format`/`parse`/`validate`.
      fieldConfig[key] = component[key]
    }
  }
  return fieldConfig
}

const pathRegex = /[^\\]]?[^.[]*|\\[[^\\]]]/g

var charCodeOfDot = ".".charCodeAt(0);
var reEscapeChar = /\\(\\)?/g;
var rePropName = RegExp( // Match anything that isn't a dot or bracket.
"[^.[\\]]+" + "|" + // Or match property names within brackets.
"\\[(?:" + // Match a non-string expression.
"([^\"'][^[]*)" + "|" + // Or match strings (supports escaping characters).
"([\"'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2" + ")\\]" + "|" + // Or match "" as the space between consecutive dots or empty brackets.
"(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))", "g");

var stringToPath = function stringToPath(string) {
  var result = [];

  if (string.charCodeAt(0) === charCodeOfDot) {
    result.push("");
  }

  string.replace(rePropName, function (match, expression, quote, subString) {
    var key = match;

    if (quote) {
      key = subString.replace(reEscapeChar, "$1");
    } else if (expression) {
      key = expression.trim();
    }

    result.push(key);
  });
  return result;
};

var keysCache = {};

var toPath = function toPath(key) {
  if (key === null || key === undefined || !key.length) {
    return [];
  }

  if (typeof key !== "string") {
    throw new Error("toPath() expects a string");
  }

  if (keysCache[key] == null) {
    keysCache[key] = stringToPath(key);
  }

  return keysCache[key];
};
