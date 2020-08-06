import * as React from 'react'
import { ComponentDoc } from 'react-docgen-typescript'

export interface DocItem {
  key: string
  value: ComponentDoc[]
}

export const Context = React.createContext<DocItem[]>([])
export const useDocgen = (): DocItem[] => React.useContext(Context)

export default (props: React.PropsWithChildren<{ docs: DocItem[] }>): React.ReactElement => {
  return (
    <Context.Provider value={props.docs}>
      <React.Fragment>{props.children}</React.Fragment>
    </Context.Provider>
  )
}
