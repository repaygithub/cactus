import * as React from 'react'

import Link from '../components/Link'

export default (): React.ReactElement => (
  <>
    <h1>Deep Dives</h1>
    <ul>
      <li>
        <Link to="/deep-dives/front-end-testing-philosophy/">Front End Testing Philosophy</Link>
      </li>
    </ul>
  </>
)
