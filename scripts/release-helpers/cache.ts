const cache: Record<string, any> = {}

export const getCached = async <T>(key: string, getter: () => T | Promise<T>): Promise<T> => {
  if (cache[key]) {
    return cache[key]
  }

  const val = getter()
  cache[key] = val
  return val
}
