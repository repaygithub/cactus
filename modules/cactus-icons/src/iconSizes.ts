import { get, system } from 'styled-system'

const iconSizes = system({
  iconSize: {
    property: 'fontSize',
    scale: 'iconSizes',
    transform: (size, scale) => get(scale, size, size),
  },
})

export default iconSizes
