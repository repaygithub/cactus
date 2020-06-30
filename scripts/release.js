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
  const argPkg = args.find((a) => RELEVENT_MODULES.hasOwnProperty(a.trim()))
  let pkg = argPkg ? RELEVENT_MODULES[argPkg] : undefined
  let pkgJson = getPkgJson(pkg)
  let answers = { pkgName: pkg && pkg.pkgName }
  answers.releaseVersion = args.find((a) => RELEASE_RE.test(a))

  if (!answers.pkgName) {
    let { pkgName } = await prompts(
      [
        {
          type: 'select',
          name: 'pkgName',
          message: 'Package to publish?',
          choices: MODULES.map((m) => ({ title: `@repay/${m}`, value: m })),
        },
      ],
      { onCancel: () => process.exit(0) }
    )
    answers.pkgName = pkgName
  }

  if (!pkg) {
    pkg = RELEVENT_MODULES[answers.pkgName]
    pkgJson = getPkgJson(pkg)
  }

  let { pkgName, scope, short } = pkg

  // GET COMMIT MESSAGES
  const relevantCommits = await getRelevantCommits(scope)

  if (!answers.releaseVersion) {
    console.log('\nIncluded commits:\n')
    relevantCommits.forEach((ci) => {
      console.log(`* ${ci.header}`)
      if (Array.isArray(ci.notes)) {
        ci.notes.forEach((note) => {
          if (note.title.includes('BREAKING')) {
            console.log('  - BREAKING: ' + note.text)
          }
        })
      }
    })
    console.log()
    let { releaseVersion } = await prompts(
      [
        {
          type: 'text',
          name: 'releaseVersion',
          message: `Release Version (current = ${pkgJson.version})?`,
          validate: (value) =>
            RELEASE_RE.test(value) ||
            `invalid version ${value} -- must be in semver format and ` +
              `pre-release is not supported with this command.`,
        },
      ],
      { onCancel: () => process.exit(0) }
    )
    answers.releaseVersion = releaseVersion
  }
  let { releaseVersion } = answers
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
  let gitPublishCommitResult = await exec(
    `git commit -m "chore(${scope}): publish ${pkgName} v${releaseVersion}"`
  )
  if (gitPublishCommitResult.stderr) {
    throw new Error(`Failed while committing publish updates.`)
  }

  // build and edit changelog
  let CHANGELOG = await fsp.readFile(path.join(process.cwd(), 'CHANGELOG.md'), 'utf-8')
  let content = ''
  for (const commit of relevantCommits) {
    if (!disallowCommitType.includes(commit.type)) {
      content += generateCommit(commit)
    }
  }
  const publishCommit = getRelevantCommits()[0]
  content = generateReleaseHeader(pkg, releaseVersion, publishCommit) + content + '\n'

  let where = CHANGELOG.indexOf('## ')
  CHANGELOG = CHANGELOG.substring(0, where) + content + CHANGELOG.substring(where)

  await fsp.writeFile(path.join(process.cwd(), 'CHANGELOG.md'), CHANGELOG)

  await exec(`git add CHANGELOG.md`)
  let gitChangelogCommitResult = await exec(`git commit -m "chore(${scope}): update changelog"`)
  if (gitChangelogCommitResult.stderr) {
    throw new Error(`Failed while committing changelog updates.`)
  }
  await exec(`git push`)

  console.log(`\n\n** Successfully published and updated the changelog **\n\n`)
}

function getPkgJson(pkg) {
  if (!pkg) {
    return
  }
  return require(path.join(cwd, 'modules', pkg.scope, 'package.json'))
}

function getRelevantCommits(scope) {
  let all = []
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
      .on('data', (commit) => {
        all.push(commit)
      })
      .on('error', getErrorHandler('main'))
      .on('end', () => {
        if (errors.length) {
          errors.forEach((err) => {
            console.error(err)
          })
          reject(new Error('Something went wrong; see above errors for details.'))
        } else {
          resolve(all)
        }
      })
  }).then(() => {
    if (scope) {
      const lastReleaseCommitIndex = all.findIndex(
        (commit) =>
          commit.type === 'chore' &&
          commit.header.includes('publish') &&
          commit.header.includes(scope)
      )
      return all
        .slice(0, lastReleaseCommitIndex)
        .filter((ci) => normalizeScope(ci.scope).scope === scope)
    }
    return all
  })
}

function getErrorHandler(scope) {
  return function (error) {
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
  let content = `- ${commit.header} [${shortHash}](https://github.com/repaygithub/cactus/commit/${commit.hash})\n`
  if (Array.isArray(commit.notes)) {
    commit.notes.forEach((note) => {
      if (note.title.includes('BREAKING')) {
        content += '  - 🧨 BREAKING: ' + note.text + '\n'
      }
    })
  }
  return content
}

function generateReleaseHeader(pkg, releaseVersion, commit) {
  return `## [${pkg.pkgName}@v${releaseVersion}](https://github.com/repaygithub/cactus/commit/${commit.hash})\n\n`
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
