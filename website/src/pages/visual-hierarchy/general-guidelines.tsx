import * as React from 'react'
import { Helmet } from 'react-helmet'

export default (): React.ReactElement => {
  return (
    <>
      <Helmet title="General Hierarchy Guidelines" />
      <h1>General Hierarchy Guidelines</h1>
      <ul>
        <li>
          If you are creating a small, simple form, it's okay to put it inside a single card.
          Otherwise:
        </li>
        <li>Try to avoid exceeding 3 levels of nested cards/accordions if possible</li>
        <li>No need for cards/segments at the top level</li>
        <li>
          Use proper header tags (h1 -&gt; h2 -&gt; h3 -&gt; h4) and don't skip any header sizes.
        </li>
        <li>
          Use more margin on top of section headers than on bottom. This creates a distinction
          between content above and associates content below with the header.
          <ul>
            <li>h2: 32px on top, 8px on bottom</li>
            <li>h3: 24px on top, 8px on bottom</li>
            <li>h4: 16px on top, 8px on bottom</li>
          </ul>
        </li>
        <li>Use cards/accordions only when absolutely necessary for grouping content together.</li>
        <li>
          Thematic breaks (horizontal rules) can be a useful replacement for cards/accordions to
          separate sections.
        </li>
      </ul>
    </>
  )
}
