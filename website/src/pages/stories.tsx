import * as React from 'react'

import Link from '../components/Link'
import storybookConfig from '../storybook-config.json'

export default (): React.ReactElement => (
  <>
    <h1>Storybooks</h1>
    <p>
      For some libraries, we developed using <Link to="https://storybook.js.org">Storybook</Link>{' '}
      which is an open source tool to help with the development of UI components. Visit one of the
      links below to experiment with the libraries and adjust props.
    </p>
    <ul>
      {storybookConfig.map(
        (story): React.ReactElement => (
          <li key={story.name}>
            <Link to={`https://repaygithub.github.io/cactus/stories/${story.dirname}/`}>
              {story.name}
            </Link>
          </li>
        )
      )}
    </ul>
  </>
)
