import * as core from '@actions/core'
import { inspect } from 'util'

import { createPullRequest, Inputs } from './create-pull-request'
import * as utils from './utils'

// The code for this action has been taken from Peter Evens' "Create Pull Request" (https://github.com/peter-evans/create-pull-request)
// and adapted slightly to fit our needs.

async function run(): Promise<void> {
  try {
    const inputs: Inputs = {
      token: core.getInput('token'),
      path: core.getInput('path'),
      commitMessage: core.getInput('commit-message'),
      committer: core.getInput('committer'),
      author: core.getInput('author'),
      signoff: core.getInput('signoff') === 'true',
      branch: core.getInput('branch'),
      deleteBranch: core.getInput('delete-branch') === 'true',
      branchSuffix: core.getInput('branch-suffix'),
      base: core.getInput('base'),
      pushToFork: core.getInput('push-to-fork'),
      title: core.getInput('title'),
      body: core.getInput('body'),
      labels: utils.getInputAsArray('labels'),
      assignees: utils.getInputAsArray('assignees'),
      reviewers: utils.getInputAsArray('reviewers'),
      teamReviewers: utils.getInputAsArray('team-reviewers'),
      milestone: Number(core.getInput('milestone')),
      draft: core.getInput('draft') === 'true',
    }
    core.debug(`Inputs: ${inspect(inputs)}`)

    await createPullRequest(inputs)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
