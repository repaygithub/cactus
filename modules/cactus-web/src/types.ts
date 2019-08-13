export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type FieldEventHandler<ValueType> = (fieldName: string, fieldValue: ValueType) => void
