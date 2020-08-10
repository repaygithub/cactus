declare interface Site {
  siteMetadata: {
    title: string
    description: string
    author: string
  }
}

declare interface Edge<T> {
  readonly node: T
}

declare type Edges<T> = Edge<T>[]

declare interface Markdown {
  id: string
  excerpt?: string
  body: string
  fields: {
    title: string
    slug: string
  }
  frontmatter: {
    date?: string
    draft?: boolean
    path: string
    tags?: readonly string[]
    title?: string
    order?: number
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

declare interface AllMarkdown {
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

declare module '@mdx-js/react' {
  const MDXProvider: any
  export { MDXProvider }
}

declare const global: { [key: string]: any }
