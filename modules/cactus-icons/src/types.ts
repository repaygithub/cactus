export type IconSizes = 'tiny' | 'small' | 'medium' | 'large'
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
