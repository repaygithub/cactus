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
      await Promise.all(files.map((f) => fs.unlink(path.join(componentDir, f))))
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
  const indexPath = path.join(__dirname, '..', './src/index.ts')
  const currentIndexExports = await fs.readFile(indexPath, 'utf8')

  await Promise.all([
    fs.writeFile(
      indexPath,
      prettier.format(
        currentIndexExports +
          `export { ${componentName} } from './${componentName}/${componentName}'\n`,
        Object.assign({ parser: 'typescript' }, prettierConfig)
      )
    ),
    writeFile('.tsx', componentTemplate(componentName)),
    writeFile('.test.tsx', testTemplate(componentName)),
    writeFile('.story.tsx', storyTemplate(componentName)),
    writeFile('.mdx', mdxTemplate(componentName)),
  ])

  console.log(`Successfully created ${componentName}.`)
}

main().catch((error) => {
  console.error('[ERR]', error.stack)
  process.exit(1)
})

function includesAny(arr, ...values) {
  return values.some((v) => arr.includes(v))
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
import { margin, MarginProps } from 'styled-system'

interface ${componentName}Props extends MarginProps {}

export const ${componentName} = styled.div<${componentName}Props>\`
  \${margin}
\`

export default ${componentName}
    `
}

function testTemplate(componentName) {
  return `
import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import ${componentName} from './${componentName}'

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
import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import ${componentName} from './${componentName}'

export default {
  title: '${componentName}',
  component: ${componentName},
} as Meta

export const BasicUsage = (): React.ReactElement => <${componentName} />
`
}

function mdxTemplate(componentName) {
  return `
---
name: ${componentName}
menu: Components
---

import PropsTable from 'website-src/components/PropsTable'
import ${componentName} from './${componentName}'

# ${componentName}

TODO - describe component here

TODO - render component here

## Best practices

TODO - see README for what to include here

## Basic usage

TODO - brief description

\`\`\`jsx
import React from 'react'
import { ${componentName} } from '@repay/cactus-web'

<${componentName} />
\`\`\`

\`\`\`tsx
import * as React from 'react'
import { ${componentName} } from '@repay/cactus-web'

<${componentName} />
\`\`\`

## Properties

<PropsTable of={${componentName}} />
  `
}
