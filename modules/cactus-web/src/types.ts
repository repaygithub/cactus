export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type FieldOnChangeHandler<ValueType> = (fieldName: string, fieldValue: ValueType) => void

export type FieldOnFocusHandler = (fieldName: string) => void

export type FieldOnBlurHandler = (fieldName: string) => void
