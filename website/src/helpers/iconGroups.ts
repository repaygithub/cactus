import * as icons from '@repay/cactus-icons'

type IconObject = {
  name: string
  fullName: string
  path: string
  category: string
  Icon: React.ComponentType<any>
}

const iconsCategoryMap: { [key: string]: IconObject[] } = {}

for (const [fullName, Icon] of Object.entries(icons)) {
  const path = fullName.replace(/(.)([A-Z])/, '$1-$2').toLowerCase()
  const [category, ...nameArr] = path.split('-')
  const name = nameArr.join(' ')
  if (!iconsCategoryMap.hasOwnProperty(category)) {
    iconsCategoryMap[category] = []
  }
  iconsCategoryMap[category].push({
    name,
    fullName,
    path,
    category,
    Icon,
  })
}

const categories = Object.keys(iconsCategoryMap).sort()

export { iconsCategoryMap, categories }
