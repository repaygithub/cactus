import * as React from 'react'

import decisionTree from './decision-tree.png'
import Helmet from 'react-helmet'

export default () => {
  return (
    <>
      <Helmet title="Hierarchy Decision Tree" />
      <h1>Hierarchy Decision Tree</h1>
      <img src={decisionTree} />
    </>
  )
}
