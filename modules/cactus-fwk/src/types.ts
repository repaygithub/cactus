// TS Types only, allows for re-export
// see: https://github.com/babel/babel/issues/8361#issuecomment-435623593
export interface FeatureFlagsObject {
  [k: string]: boolean
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
