// Code modified from Inuit's "auto" library.  License below:

// Copyright (c) 2018 Intuit

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
// OR OTHER DEALINGS IN THE SOFTWARE.

import { enterpriseCompatibility } from '@octokit/plugin-enterprise-compatibility'
import { retry } from '@octokit/plugin-retry'
import { throttling } from '@octokit/plugin-throttling'
import { Octokit } from '@octokit/rest'

interface ThrottleOpts {
  /** The request object */
  request: { /** What retry we are on */ retryCount: number }
  /** API method that was throttled */
  method: string
  /** URL that was throttled */
  url: string
}

const GitHub = Octokit.plugin(enterpriseCompatibility, retry, throttling)

export default new GitHub({
  baseUrl: 'https://api.github.com',
  auth: process.env.GITHUB_AUTH,
  previews: ['symmetra-preview'],
  throttle: {
    /** Add a wait once rate limit is hit */
    onRateLimit: (retryAfter: number, opts: ThrottleOpts) => {
      console.warn(`Request quota exhausted for request ${opts.method} ${opts.url}`)

      if (opts.request.retryCount < 5) {
        console.log(`Retrying after ${retryAfter * 1000}ms!`)
        return true
      }
    },
    /** wait after abuse */
    onAbuseLimit: (retryAfter: number, opts: ThrottleOpts) => {
      console.error(
        `Went over abuse rate limit ${opts.method} ${opts.url}, retrying in ${retryAfter * 1000}ms.`
      )
      return true
    },
  },
})
