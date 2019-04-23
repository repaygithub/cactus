import * as React from 'react'
import storybookConfig from '../storybook-config.json'

export default () => (
  <>
    <h1>Storybooks</h1>
    <p>
      For some libraries, we developed using <a href="https://storybook.js.org">Storybook</a> which
      is an open source tool to help with the development of UI components. Visit one of the links
      below to experiment with the libraries and adjust props.
    </p>
    <ul>
      {storybookConfig.map(story => (
        <li key={story.name}>
          {/** needs to be anchor, not Link because the stories are not part of gatsby */}
          <a href={`/stories/${story.dirname}/`}>{story.name}</a>
        </li>
      ))}
    </ul>
  </>
)
