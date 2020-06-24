#!/usr/bin/env node

const path = require('path')
const { promises: fs, existsSync } = require('fs')
const cpy = require('cpy')
const prettier = require('prettier')
const { exec: originalExec } = require('child_process')
const exec = require('util').promisify(originalExec)

function resolveModule(...paths) {
  return path.resolve(__dirname, '../modules', ...paths)
}

function hasStorybook(dirname) {
  return existsSync(resolveModule(dirname, '.storybook'))
}

async function main() {
  // gather module metadata
  const moduleDirs = await fs.readdir(resolveModule())
  const packagesPromises = moduleDirs.map((dirname) => {
    return fs.readFile(resolveModule(dirname, 'package.json')).then((json) => JSON.parse(json))
  })
  const packages = await Promise.all(packagesPromises)
  console.log('found modules:')
  const modules = packages.map((pkg, index) => {
    pkg.dirname = moduleDirs[index]
    pkg.hasStorybook = hasStorybook(pkg.dirname)
    console.log(`\t${pkg.name.padEnd(16)}: ${pkg.hasStorybook ? 'has storybook' : 'no stories'}`)
    return pkg
  })

  // start building storybook
  const storybookBuilds = modules
    .filter((m) => m.hasStorybook)
    .map((pkg) => exec('yarn build:stories --quiet', { cwd: resolveModule(pkg.dirname) }))

  const prettierConfig = await prettier.resolveConfig(__dirname)

  // write index.html
  let indexHtml = prettier.format(
    `
  <!DOCTYPE>
  <html>
    <head>
      <title>🌵 Cactus Design System and Framework</title>
      <meta param="viewport" value="">
    </head>
    <body>
      <h1>Cactus Design System and Framework</h1>
      <p>Temporary placeholder for navigation to implemented stories.</p>
      <ul>
      ${(() =>
        modules
          .map((pkg) => {
            if (pkg.hasStorybook) {
              return `<li>
            <a href="/cactus/stories/${pkg.dirname}/">
              <code>${pkg.name}</code>
            </a>
          </li>`
            }
            return `<li>
          <code>${pkg.name}</code> (no storybook)
        </li>`
          })
          .join('\n'))()}
      </ul>
    </body>
  </html>
  `,
    Object.assign({ parser: 'html' }, prettierConfig)
  )

  // write index.html
  let notFound = prettier.format(
    `
  <!DOCTYPE>
  <html>
    <head>
      <title>🌵 Cactus Design System and Framework</title>
      <meta param="viewport" value="">
    </head>
    <body>
      <h1>Page Not Found</h1>
      <p>Use the links below to find the project you are looking for.</p>
      <ul>
      ${(() =>
        modules
          .map((pkg) => {
            if (pkg.hasStorybook) {
              return `<li>
            <a href="/cactus/stories/${pkg.dirname}/">
              <code>${pkg.name}</code>
            </a>
          </li>`
            }
            return `<li>
          <code>${pkg.name}</code> (no storybook)
        </li>`
          })
          .join('\n'))()}
      </ul>
    </body>
  </html>
  `,
    Object.assign({ parser: 'html' }, prettierConfig)
  )

  const dist = path.resolve(__dirname, '../dist')
  if (!existsSync(dist)) {
    await fs.mkdir(path.join(dist, 'stories'), { recursive: true })
  }

  await fs.writeFile(path.resolve(dist, 'index.html'), indexHtml, 'utf8')
  await fs.writeFile(path.resolve(dist, '404.html'), notFound, 'utf8')
  await fs.writeFile(path.resolve(dist, 'stories/index.html'), indexHtml, 'utf8')

  console.log('\nwaiting for storybook...\n')
  await Promise.all(storybookBuilds)
  console.log('finished storybook!\n')
  for (const pkg of modules) {
    if (pkg.hasStorybook) {
      console.log(`\tcopying files for ${pkg.name}`)
      await cpy(
        [resolveModule(pkg.dirname, '.storybook/dist/**')],
        path.join(dist, 'stories', pkg.dirname)
      )
    }
  }
  // make console a little prettier
  console.log('')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
