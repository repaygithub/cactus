// IE only implemented pageYOffset and pageXOffset
// in IE, when the offset is zero it returns undefined so we default to 0
export const getScrollY = () => window.scrollY || window.pageYOffset || 0
export const getScrollX = () => window.scrollX || window.pageXOffset || 0
