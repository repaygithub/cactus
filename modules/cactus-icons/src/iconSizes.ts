import { get, system } from 'styled-system'

const iconSizes = system({
  iconSize: {
    property: 'fontSize',
    scale: 'iconSizes',
    transform: (size, scale) => {
      let iconSize: string | number = get(scale, size, size)
      iconSize = iconSize.toString()
      if (/^[0-9]+$/.test(iconSize)) {
        iconSize += 'px'
      }
      return iconSize
    },
  },
})

export default iconSizes
