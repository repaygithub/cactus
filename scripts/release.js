const { promises: fsp, readdirSync } = require('fs')
const path = require('path')
const gitRawCommits = require('git-raw-commits')
const commitsParser = require('conventional-commits-parser')
const util = require('util')
const { spawnSync } = require('child_process')
const exec = util.promisify(require('child_process').exec)
const prompts = require('prompts')

/**
 * The parsed commit from conventional-commits-parser
 * type Commit = {
 *   type: string
 *   scope: null | string
 *   subject: string
 *   merge: null | string
 *   header: string (full, unparsed first line)
 *   body: string (inner content)
 *   footer: string (anything after two line breaks in body)
 *   notes: Array<unknown>
 *   references: Array<>
 *   revert: null | string
 * }
 *
 * // git issue reference
 * type Reference = {
 *
 * }
 */

const errors = []
const all = []
const disallowCommitType = ['test', 'style']

const cwd = process.cwd()
const MODULES = readdirSync(path.join(cwd, 'modules'))
const RELEVENT_MODULES = {}
for (const mod of MODULES) {
  let scope = mod
  let pkgName = '@repay/' + mod
  let short = mod.split('-').pop()
  let obj = { scope, pkgName, short }
  RELEVENT_MODULES[pkgName] = obj
  RELEVENT_MODULES[scope] = obj
  RELEVENT_MODULES[short] = obj
}

const RELEASE_RE = /^\d+\.\d+\.\d+$/

async function main() {
  const args = process.argv.slice(2)
  const argPkg = args.find(a => RELEVENT_MODULES.hasOwnProperty(a.trim()))
  let pkg = argPkg ? RELEVENT_MODULES[argPkg] : undefined
  let pkgJson = getPkgJson(pkg)
  let answers = { pkgName: pkg && pkg.pkgName }
  answers.releaseVersion = args.find(a => RELEASE_RE.test(a))

  if (!answers.pkgName || !answers.releaseVersion) {
    prompts.override(answers)
    answers = await prompts(
      [
        {
          type: 'select',
          name: 'pkgName',
          message: 'Package to publish?',
          choices: MODULES.map(m => ({ title: `@repay/${m}`, value: m })),
        },
        {
          type: 'text',
          name: 'releaseVersion',
          message: prev => {
            if (!pkg) {
              pkg = RELEVENT_MODULES[prev]
              pkgJson = getPkgJson(pkg)
            }
            return `Release Version (current = ${pkgJson.version})?`
          },
          validate: value =>
            RELEASE_RE.test(value) ||
            `invalid version ${value} -- must be in semver format and ` +
              `pre-release is not supported with this command.`,
        },
      ],
      { onCancel: () => process.exit(0) }
    )
  }

  let { releaseVersion } = answers
  let { pkgName, scope, short } = pkg

  console.log(`\n** Releasing ${pkgName} v${releaseVersion} **\n`)

  let cleanupResult = await exec(`yarn ${short} cleanup`, { cwd, encoding: 'utf-8' })
  if (cleanupResult.stderr) {
    throw new Error(`Failed to run yarn ${short} cleanup`)
  }
  let buildResult = spawnSync('yarn', [short, 'build'], {
    cwd,
    encoding: 'utf-8',
    stdio: 'inherit',
  })
  if (buildResult.status !== 0 || buildResult.error) {
    console.error(buildResult.stderr)
    throw buildResult.error
  }
  let publishResult = spawnSync('yarn', [short, 'publish', '--new-version', releaseVersion], {
    cwd,
    stdio: 'inherit',
  })
  if (publishResult.status !== 0 || publishResult.error) {
    console.error(publishResult.stderr)
    throw publishResult.error || new Error(`Failed to publish ${pkgName}`)
  }
  await exec(`git add modules/${scope}/package.json`)
  let gitCommitResult = await exec(
    `git commit -m "chore(${scope}): publish ${pkgName} v${releaseVersion}"`
  )
  if (gitCommitResult.stderr) {
    throw new Error(`Failed while committing publish updates.`)
  }

  let CHANGELOG = await fsp.readFile(path.join(process.cwd(), 'CHANGELOG.md'), 'utf-8')

  return new Promise((resolve, reject) => {
    gitRawCommits({
      format: '%B%n-hash-%n%H%n-gitTags-%n%d%n-committerDate-%n%ci',
    })
      .on('error', getErrorHandler('git-raw-commits'))
      .pipe(
        commitsParser({
          noteKeywords: ['BREAKING CHANGE', 'BREAKING'],
          mergePattern: /^Merge pull request #(\d+) from (.*)$/,
          mergeCorrespondence: ['id', 'source'],
        })
      )
      .on('error', getErrorHandler('conventional-commits-parser'))
      .on('data', commit => {
        all.push(commit)
      })
      .on('error', getErrorHandler('main'))
      .on('end', () => {
        if (errors.length) {
          errors.forEach(err => {
            console.error(err)
          })
          reject(new Error('Something went wrong; see above errors for details.'))
        } else {
          resolve(all)
        }
      })
  }).then(async () => {
    let content = ''
    let relevant = all.slice(1)
    const lastReleaseCommitIndex = relevant.findIndex(
      commit =>
        commit.type === 'chore' &&
        commit.header.includes('publish') &&
        commit.header.includes(scope)
    )
    let relevantCommits = relevant.slice(0, lastReleaseCommitIndex)
    for (const commit of relevantCommits) {
      let { scope: commitScope } = normalizeScope(commit.scope)
      if (commitScope === scope && !disallowCommitType.includes(commit.type)) {
        content += generateCommit(commit)
      }
    }

    content = generateReleaseHeader(pkg, releaseVersion, all[0]) + content + '\n'

    let where = CHANGELOG.indexOf('## ')
    CHANGELOG = CHANGELOG.substring(0, where) + content + CHANGELOG.substring(where)

    await fsp.writeFile(path.join(process.cwd(), 'CHANGELOG.md'), CHANGELOG)

    await exec(`git add CHANGELOG.md`)
    let gitCommitResult = await exec(`git commit -m "chore(${scope}): update changelog"`)
    if (gitCommitResult.stderr) {
      throw new Error(`Failed while committing changelog updates.`)
    }
    await exec(`git push`)

    console.log(`\n\n** Successfully published and updated the changelog **\n\n`)
  })
}

function getPkgJson(pkg) {
  if (!pkg) {
    return
  }
  return require(path.join(cwd, 'modules', pkg.scope, 'package.json'))
}

function getErrorHandler(scope) {
  return function(error) {
    error.message = `[${scope}] :: ${error.message}`
    errors.push(error)
  }
}

function normalizeScope(rawScope) {
  if (RELEVENT_MODULES.hasOwnProperty(rawScope)) {
    return RELEVENT_MODULES[rawScope]
  }
  return {}
}

function generateCommit(commit) {
  let shortHash = commit.hash.slice(0, 7)
  let content = `- ${commit.header} [${shortHash}](https://github.com/repaygithub/cactus/commit/${
    commit.hash
  })\n`
  if (Array.isArray(commit.notes)) {
    commit.notes.forEach(note => {
      if (note.title.includes('BREAKING')) {
        content += '  - 🧨 BREAKING: ' + note.text + '\n'
      }
    })
  }
  return content
}

function generateReleaseHeader(pkg, releaseVersion, commit) {
  return `## [${pkg.pkgName}@v${releaseVersion}](https://github.com/repaygithub/cactus/commit/${
    commit.hash
  })\n\n`
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
