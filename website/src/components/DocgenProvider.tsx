import * as React from 'react'
import { ComponentDoc } from 'react-docgen-typescript'

export type DocItem = {
  key: string
  value: ComponentDoc[]
}

export const Context = React.createContext<DocItem[]>([])
export const useDocgen = () => React.useContext(Context)

export default (props: React.PropsWithChildren<{ docs: DocItem[] }>) => {
  return (
    <Context.Provider value={props.docs}>
      <React.Fragment>{props.children}</React.Fragment>
    </Context.Provider>
  )
}
