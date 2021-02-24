import * as React from 'react'

import Link from '../components/Link'

export default (): React.ReactElement => (
  <>
    <h1>How-to Guides</h1>
    <ul>
      <li>
        <Link to="/how-tos/end-to-end-testing/">End-to-End Testing</Link>
      </li>
      <li>
        <Link to="/how-tos/forms/">Making Forms with Formik</Link>
      </li>
    </ul>
  </>
)
