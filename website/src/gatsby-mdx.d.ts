declare module 'gatsby-mdx/mdx-renderer' {
  import * as React from 'react'

  function MdxRenderer(props: { children: string }): React.ReactElement

  export default MdxRenderer
}
