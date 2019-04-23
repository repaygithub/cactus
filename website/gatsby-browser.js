import 'normalize.css'
import 'prismjs/themes/prism.css'
import React from 'react'
import Layout from './src/components/Layout'

export const wrapPageElement = ({ element, props }) => <Layout {...props}>{element}</Layout>
