import * as iconsList from '@repay/cactus-icons'

interface IconObject {
  name: string
  fullName: string
  path: string
  category: string
  Icon: React.ComponentType<any>
}

const iconsCategoryMap: { [key: string]: IconObject[] } = {}

const icons = Object.entries(iconsList).filter(([name]): boolean => name !== 'iconSizes')

for (const [fullName, Icon] of icons) {
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
