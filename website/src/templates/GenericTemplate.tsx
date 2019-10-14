import * as React from 'react'
import { graphql } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Helmet from 'react-helmet'
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

export const pageQuery = graphql`
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
