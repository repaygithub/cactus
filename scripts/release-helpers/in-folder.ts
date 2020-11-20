import path from 'path'

export default (parent: string, child: string): boolean => {
  const relative = path.relative(parent, child)

  return Boolean(!relative?.startsWith('..') && !path.isAbsolute(relative))
}
