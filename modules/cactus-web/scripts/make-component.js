// try to exit if only help command
const args = process.argv.slice(2)
if (includesAny(args, '-h', '--help')) {
  console.log(`
Usage: node make-component.js [...options] ComponentName
- component name must be the last argument, contain no spaces,
  and should be pascal case.

  Options:
  --help, -h      display this information
  --force, -f     overwrite component if it exists
    `)
  return
}

const fs = require('fs').promises
const path = require('path')
const prettier = require('prettier')

async function main() {
  const srcDir = path.join(__dirname, '..', 'src')
  const componentName = args.pop()
  const componentDir = path.join(srcDir, componentName)
  const doesComponentExist = await fileExists(componentDir)
  if (doesComponentExist) {
    if (includesAny(args, '--force', '-f')) {
      console.log('component already exists, removing directory')
      const files = await fs.readdir(componentDir)
      await Promise.all(files.map(f => fs.unlink(path.join(componentDir, f))))
      await fs.rmdir(componentDir)
    } else {
      throw new Error(`${componentName} already exists.`)
    }
  }

  const [prettierConfig] = await Promise.all([
    prettier.resolveConfig(__filename),
    fs.mkdir(componentDir),
  ])

  const writeFile = (ext, source) =>
    fs.writeFile(
      path.join(componentDir, `${componentName}${ext}`),
      prettier.format(
        source,
        Object.assign({ parser: ext.endsWith('tsx') ? 'typescript' : 'markdown' }, prettierConfig)
      )
    )

  await Promise.all([
    writeFile('.tsx', componentTemplate(componentName)),
    writeFile('.test.tsx', testTemplate(componentName)),
    writeFile('.story.tsx', storyTemplate(componentName)),
    writeFile('.mdx', mdxTemplate(componentName)),
  ])

  console.log(`Successfully created ${componentName}.`)
}

main().catch(error => {
  console.error('[ERR]', error.stack)
  process.exit(1)
})

function includesAny(arr, ...values) {
  return values.some(v => arr.includes(v))
}

async function fileExists(filePath) {
  try {
    await fs.stat(filePath)
  } catch (e) {
    return false
  }
  return true
}

function componentTemplate(componentName) {
  return `
import styled from 'styled-components'
import { margins, MarginProps } from '../helpers/margins'

interface ${componentName}Props extends MarginProps {}

export const ${componentName} = styled.div<${componentName}Props>\`
  \${margins}
\`

export default ${componentName}
    `
}

function testTemplate(componentName) {
  return `
import * as React from 'react'
import { cleanup, render, fireEvent } from 'react-testing-library'
import ${componentName} from './${componentName}'
import cactusTheme from '@repay/cactus-theme'
import { StyleProvider } from '@repay/cactus-web'

afterEach(cleanup)

describe('component: ${componentName}', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <${componentName} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
`
}

function storyTemplate(componentName) {
  return `
import React from 'react'
import { storiesOf } from '@storybook/react'
import ${componentName} from './${componentName}'

storiesOf('${componentName}', module).add('Basic Usage', () => <${componentName} />)`
}

function mdxTemplate(componentName) {
  return `
---
name: ${componentName}
menu: Components
---

import PropsTable from 'website-src/components/PropsTable'
import ${componentName} from './${componentName}'
import cactusTheme from '@repay/cactus-theme'

# ${componentName}

## Best practices

TODO - see README for what to include here

## Basic usage

TODO - brief description

\`\`\`jsx
import React from 'react'

<${componentName} />
\`\`\`

\`\`\`tsx
import * as React from 'react'

<${componentName} />
\`\`\`

## Properties

<PropsTable of={${componentName}} />
  `
}
