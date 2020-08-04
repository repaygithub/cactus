import { MDXProvider } from '@mdx-js/react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import * as React from 'react'
import { Helmet } from 'react-helmet'

import Link from '../components/Link'

type GenericTemplateProps = {
  data: {
    mdx: Markdown
    site: Site
  }
}

const components = {
  a: Link,
  table: (props: any) => (
    <div style={{ overflowX: 'auto' }}>
      <table {...props} />
    </div>
  ),
}

const GenericTemplate = ({ data }: GenericTemplateProps) => {
  const {
    mdx: { fields, body },
  } = data

  return (
    <>
      <Helmet title={`${fields.title}`} />
      <MDXProvider components={components}>
        <MDXRenderer>{body}</MDXRenderer>
      </MDXProvider>
    </>
  )
}

export default GenericTemplate

export const query = graphql`
  query($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      fields {
        title
        slug
      }
    }
  }
`
