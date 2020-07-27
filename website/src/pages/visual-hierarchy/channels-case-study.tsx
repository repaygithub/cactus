import * as React from 'react'
import Helmet from 'react-helmet'

import blfConfig1 from './blf-config-1.png'
import blfConfig2 from './blf-config-2.png'
import blfConfig3 from './blf-config-3.png'
import blfConfigOld1 from './blf-config-old-1.png'
import blfConfigOld2 from './blf-config-old-2.png'

export default () => {
  return (
    <>
      <Helmet title="Channels Case Study" />
      <h1>Channels Case Study</h1>
      <p>
        Let's investigate the BLF Config form in Channels, and convert it to implement the hierarchy
        guidelines defined here. As you can see, this form is already not adhering to our guidelines
        by using unnecessary segments at the top level:
      </p>
      <img src={blfConfigOld1} />
      <p>We can start by removing the outer segment enclosing the form:</p>
      <img src={blfConfig1} />
      <p>
        Next, let's take a look at another section of the form, which contains several fields that
        should be grouped together:
      </p>
      <img src={blfConfigOld2} />
      <p>
        As you can see, this section is also unnecessarily nested in a segment component, and it's
        not using the accordions provided by @repay/cactus-web. Let's update that and view the
        results below:
      </p>
      <img src={blfConfig2} />
      <p>
        We see here that removing the unnecessary segments yields a cleaner design that will
        translate better to mobile devices. As can be seen below, the content in each accordion
        takes up a considerable amount of space, and for this reason, baseed on our hierarchical
        guidelines, it's okay to keep them in accordions.
      </p>
      <img src={blfConfig3} />
      <p>
        After modifying the form to fit our guidelines (as well as switching to the components
        provided by @repay/cactus-web), what we're left with is a cleaner looking form, which will
        lend itself much better to a mobile device, due to the reduction of nested content. These
        guidelines can and should be applied to all pages to ensure mobile compatibility as well as
        a simple design that is easy to understand.
      </p>
    </>
  )
}
