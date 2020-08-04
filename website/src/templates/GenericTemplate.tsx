import { MDXProvider } from '@mdx-js/react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import * as React from 'react'
import { Helmet } from 'react-helmet'

import Link from '../components/Link'

interface GenericTemplateProps {
  data: {
    mdx: Markdown
    site: Site
  }
}

const components = {
  a: Link,
  table: (props: any): React.ReactElement => (
    <div style={{ overflowX: 'auto' }}>
      <table {...props} />
    </div>
  ),
}

const GenericTemplate = ({ data }: GenericTemplateProps): React.ReactElement => {
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
