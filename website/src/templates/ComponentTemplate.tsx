import { MDXProvider } from '@mdx-js/react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import * as React from 'react'
import { Helmet } from 'react-helmet'

import DocgenProvider, { DocItem } from '../components/DocgenProvider'
import Link from '../components/Link'

interface ComponentTemplateProps {
  data: {
    docgenDb: {
      id: string
      db: string
    }
    mdx: Markdown
  }
}

const components = {
  a: Link,
}

const ComponentTemplate = ({ data }: ComponentTemplateProps): React.ReactElement => {
  const {
    docgenDb: { db },
    mdx: { body, fields },
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
          <MDXProvider components={components}>
            <MDXRenderer>{body}</MDXRenderer>
          </MDXProvider>
        </>
      </DocgenProvider>
    </>
  )
}

export default ComponentTemplate

export const query = graphql`
  query ($slug: String!) {
    docgenDb {
      id
      db
    }
    mdx(fields: { slug: { eq: $slug } }) {
      body
      fields {
        title
        slug
      }
    }
  }
`
