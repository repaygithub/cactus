import * as React from 'react'
import { graphql } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import Helmet from 'react-helmet'
import Link from '../components/Link'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'

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
    mdx: { fields, code },
  } = data

  return (
    <>
      <Helmet title={`${fields.title}`} />
      <MDXProvider components={components}>
        <MDXRenderer>{code.body}</MDXRenderer>
      </MDXProvider>
    </>
  )
}

export default GenericTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      code {
        body
      }
      fields {
        title
        slug
      }
    }
  }
`
