import React from 'react'

import { number, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import Accordion from './Accordion'

storiesOf('Accordion', module)
  .add('Basic Usage', () => (
    <div style={{ width: '312px' }}>
      <Accordion>
        <Accordion.Header>{text('header', 'Accordion')}</Accordion.Header>
        <Accordion.Body>{text('content', 'Some Accordion Content')}</Accordion.Body>
      </Accordion>
    </div>
  ))
  .add('Long', () => (
    <div style={{ width: '960px' }}>
      <Accordion>
        <Accordion.Header>{text('header', 'Accordion')}</Accordion.Header>
        <Accordion.Body>{text('content', 'Some Accordion Content')}</Accordion.Body>
      </Accordion>
    </div>
  ))
  .add('Provider', () => (
    <div style={{ width: '312px' }}>
      <Accordion.Provider maxOpen={number('maxOpen', 1)}>
        <Accordion>
          <Accordion.Header>{text('header 1', 'Accordion 1')}</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
            tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
            lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex, nec
            euismod augue aliquam vel.
          </Accordion.Body>
        </Accordion>
        <Accordion>
          <Accordion.Header>{text('header 2', 'Accordion 2')}</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
            tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
            lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex, nec
            euismod augue aliquam vel.
          </Accordion.Body>
        </Accordion>
        <Accordion>
          <Accordion.Header>{text('header 3', 'Accordion 3')}</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
            tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
            lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex, nec
            euismod augue aliquam vel.
          </Accordion.Body>
        </Accordion>
        <Accordion>
          <Accordion.Header>{text('header 4', 'Accordion 4')}</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar, mauris eu
            tempor accumsan, arcu nibh mattis tortor, id feugiat velit diam et massa. Vestibulum
            lacinia ultrices urna, non rhoncus justo mollis vitae. Integer facilisis gravida ex, nec
            euismod augue aliquam vel.
          </Accordion.Body>
        </Accordion>
      </Accordion.Provider>
    </div>
  ))
