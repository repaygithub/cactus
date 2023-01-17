import { createContext, useContext } from 'react'

import { DataGridContext } from './types'

const DGContext = createContext<DataGridContext | null>(null)

export const DataGridContextProvider = DGContext.Provider

export const useDataGridContext = (name: string): DataGridContext => {
  const context = useContext(DGContext)
  if (!context) {
    throw new Error('`' + name + '` can only be used within the `DataGrid` component.')
  }
  return context
}
