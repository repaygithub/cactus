import * as React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'

type GenericTemplateProps = {
  data: {
    mdx: Markdown
    site: Site
  }
}

const GenericTemplate = ({ data }: GenericTemplateProps) => {
  const {
    mdx: { fields, code },
  } = data

  return (
    <>
      <Helmet title={`${fields.title}`} />
      <MDXRenderer>{code.body}</MDXRenderer>
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
