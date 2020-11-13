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
