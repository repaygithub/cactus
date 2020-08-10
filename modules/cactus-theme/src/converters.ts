/**
 * Converts a hex string to an array representing the hsl values of the color
 */
export function rgbToHsl(red: number, green: number, blue: number): [number, number, number] {
  red /= 255
  green /= 255
  blue /= 255

  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  let hue: number
  let saturation: number
  let lightness = (max + min) / 2

  if (max === min) {
    // achromatic
    hue = saturation = 0
  } else {
    const difference = max - min
    saturation = lightness > 0.5 ? difference / (2 - max - min) : difference / (max + min)

    switch (max) {
      case red:
        hue = (green - blue) / difference + (green < blue ? 6 : 0)
        break
      case green:
        hue = (blue - red) / difference + 2
        break
      case blue:
        hue = (red - green) / difference + 4
        break
    }
    hue = hue / 6
  }

  saturation = saturation * 100
  saturation = Math.round(saturation)
  lightness = lightness * 100
  lightness = Math.round(lightness)
  hue = Math.round(360 * hue)

  return [hue, saturation, lightness]
}

export function hexToRgb(hex: string): [number, number, number] {
  if (/^#?([a-f\d]{3}){1,2}$/i.test(hex)) {
    let result
    if (hex.length < 6) {
      result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex)
      result[1] += result[1]
      result[2] += result[2]
      result[3] += result[3]
    } else {
      result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    }
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
  } else {
    return [255, 255, 255]
  }
}

// Calculating YIQ for easy contrast comparisons based on https://24ways.org/2010/calculating-color-contrast
export function yiq(red: number, green: number, blue: number): number {
  return (red * 299 + green * 587 + blue * 114) / 1000
}

export function isDark(red: number, green: number, blue: number): boolean {
  return yiq(red, green, blue) < 128
}
