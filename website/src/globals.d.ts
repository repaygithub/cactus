declare type Site = {
  siteMetadata: {
    title: string
    description: string
    author: string
  }
}

declare type Edge<T> = { readonly node: T }

declare type Edges<T> = Edge<T>[]

declare type Markdown = {
  id: string
  excerpt?: string
  code: {
    body: string
  }
  fields: {
    title: string
    slug: string
  }
  frontmatter: {
    date?: string
    draft?: boolean
    path: string
    tags?: ReadonlyArray<string>
    title?: string
  }
  parent?: {
    absolutePath?: string
    accessTime?: string
    base?: string
    birthTime?: string
    changeTime?: string
    extension?: string
    modifiedTime?: string
    name?: string
    relativeDirectory?: string
    relativePath?: string
    size?: number
    sourceInstanceName?: string
  }
}

declare type AllMarkdown = {
  totalCount: number
  edges: Edges<Markdown>
}

declare module '*.svg' {
  import * as React from 'react'

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>

  const src: string
  export default src
}

declare module '*.png' {
  const source: string
  export default source
}
