import { Property } from 'csstype'

export type IconSizes = 'tiny' | 'small' | 'medium' | 'large' | Property.FontSize<number>
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
