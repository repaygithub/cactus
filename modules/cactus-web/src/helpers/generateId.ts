let i = 0

const generateId = (prefix: string): string => {
  const randomId = (Math.random() * 100000).toString(32).replace('.', '') + i++
  return `${prefix}-${randomId}`
}

export default generateId
