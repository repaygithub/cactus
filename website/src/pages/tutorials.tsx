import * as React from 'react'

import Link from '../components/Link'

export default (): React.ReactElement => (
  <>
    <h1>Tutorials</h1>
    <ul>
      <li>
        <Link to="/tutorials/responsive-web-design">Responsive Web Design</Link>
      </li>
    </ul>
  </>
)
