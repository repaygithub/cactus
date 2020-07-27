import * as React from 'react'
import Helmet from 'react-helmet'

import decisionTree from './decision-tree.png'

export default () => {
  return (
    <>
      <Helmet title="Hierarchy Decision Tree" />
      <h1>Hierarchy Decision Tree</h1>
      <img src={decisionTree} />
    </>
  )
}
