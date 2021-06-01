import { FlexboxProps, system } from 'styled-system'

export type FlexItemProps = Pick<FlexboxProps, 'flex' | 'flexBasis' | 'flexGrow' | 'flexShrink'>

export const flexItem = system({ flex: true, flexBasis: true, flexGrow: true, flexShrink: true })
