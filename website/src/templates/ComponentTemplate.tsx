import * as React from 'react'

import { graphql } from 'gatsby'
import DocgenProvider, { DocItem } from '../components/DocgenProvider'
import Helmet from 'react-helmet'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'

type ComponentTemplateProps = {
  data: {
    docgenDb: {
      id: string
      db: string
    }
    mdx: Markdown
  }
}

const ComponentTemplate = ({ data }: ComponentTemplateProps) => {
  const {
    docgenDb: { db },
    mdx: { code, fields },
  } = data

  let database: DocItem[] = []
  try {
    database = JSON.parse(db)
  } catch (e) {
    console.error(e)
  }

  return (
    <>
      <Helmet title={`${fields.title}`} />
      <DocgenProvider docs={database}>
        <>
          <MDXRenderer>{code.body}</MDXRenderer>
        </>
      </DocgenProvider>
    </>
  )
}

export default ComponentTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    docgenDb {
      id
      db
    }
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
