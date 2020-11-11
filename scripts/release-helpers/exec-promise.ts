// Code comes from Inuit's "auto" library.  License below:

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

import { spawn } from 'child_process'

/**
 * Wraps up running a command into a single promise,
 * returning the stdout as a string if the command succeeds
 * and throwing if it does not.
 *
 * @param cmd - the command as a string to pass in
 */
export default async function execPromise(
  cmd: string,
  args: Array<string | undefined | false> = []
): Promise<string> {
  const callSite = new Error().stack
  const filteredArgs = args.filter((arg): arg is string => typeof arg === 'string')

  return new Promise<string>((completed, reject) => {
    const child = spawn(cmd, filteredArgs, {
      cwd: process.cwd(),
      env: process.env,
      shell: true,
    })

    let allStdout = ''
    let allStderr = ''

    if (child.stdout) {
      child.stdout.on('data', async (data: Buffer) => {
        const stdout = data.toString()
        allStdout += stdout
      })
    }

    if (child.stderr) {
      child.stderr.on('data', (data: Buffer) => {
        const stderr = data.toString()
        allStderr += stderr
      })
    }

    // This usually occurs during dev-time, when you have the wrong command
    child.on('error', (err) => {
      reject(new Error(`Failed to run '${cmd}' - ${err.message} \n\n\n${allStderr}`))
    })

    child.on('exit', (code) => {
      // No code, no errors
      if (code) {
        // The command bailed for whatever reason, print a verbose error message
        // with the stdout underneath
        let appendedStdErr = ''
        appendedStdErr += allStdout.length ? `\n\n${allStdout}` : ''
        appendedStdErr += allStderr.length ? `\n\n${allStderr}` : ''
        const argList = filteredArgs
          .join(', ')
          .replace(
            new RegExp(`${process.env.GH_TOKEN}`, 'g'),
            `****${(process.env.GH_TOKEN || '').slice(-4)}`
          )

        const error = new Error(
          `Running command '${cmd}' with args [${argList}] failed${appendedStdErr}`
        )
        error.stack = (error.stack || '') + callSite
        reject(error)
      } else {
        // Tools can occasionally print to stderr but not fail, so print that just in case.
        if (allStderr.length) {
          console.warn(allStderr)
        }

        // Resolve the string of the whole stdout
        completed(allStdout.trim())
      }
    })
  })
}
