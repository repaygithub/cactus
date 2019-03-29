const fs = require('fs').promises
const path = require('path')

async function main() {
  const args = process.argv.slice(2)
  if (includesAny(args, '-h', '--help')) {
    console.log(`
    Usage: node make-component.js [...options] ComponentName
    - component name must be the last argument, contain no spaces,
      and shoulb be pascal case.

      Options:
      --help, -h      display this information
      --force, -f     overwrite component if it exists
    `)
    return
  }

  const srcDir = path.join(__dirname, '..', 'src')
  const componentName = args.pop()
  const componentDir = path.join(srcDir, componentName)
  const doesComponentExist = await fileExists(componentDir)
  if (doesComponentExist) {
    if (includesAny(args, '--force', '-f')) {
      console.log('component already exists, removing directory')
      await fs.rmdir(componentDir)
    } else {
      throw new Error(`${componentName} already exists.`)
    }
  }

  await fs.mkdir(componentDir)

  const fileWithExt = ext => path.join(componentDir, `${componentName}${ext}`)

  await Promise.all([
    fs.writeFile(fileWithExt('.tsx'), componentTemplate(componentName)),
    fs.writeFile(fileWithExt('.test.tsx'), testTemplate(componentName)),
    fs.writeFile(fileWithExt('.story.tsx'), storyTemplate(componentName)),
    fs.writeFile(fileWithExt('.mdx'), mdxTemplate(componentName)),
  ])
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
  return (
    `
import React from 'react'
import styled from 'styled-components'

interface ${componentName}Props {}

const ${componentName} = styled.div<${componentName}Props>\`\`

export default ${componentName}
    `.trim() + '\n'
  )
}

function testTemplate(componentName) {
  return `
import * as React from 'react'
import { cleanup, render, fireEvent } from 'react-testing-library'
import ${componentName} from './${componentName}'
import repayTheme from '../repayTheme'
import { ThemeProvider } from 'styled-components'

afterEach(cleanup)

describe('component: ${componentName}', () => {
  test('snapshot', () => {
    const { container } = render(
      <ThemeProvider theme={repayTheme}>
        <${componentName} />
      </ThemeProvider>
    )

    expect(container).toMatchSnapshot()
  })
})
`.trim()
}

function storyTemplate(componentName) {
  return (
    ` 
import React from 'react'
import { storiesOf } from '@storybook/react'
import ${componentName} from './${componentName}'

storiesOf('${componentName}', module).add('Basic Usage', () => <${componentName} />)`.trim() + '\n'
  )
}

function mdxTemplate(componentName) {
  return (
    `
---
name: ${componentName}
menu: Components
---

import { Playground, PropsTable } from 'docz'
import ${componentName} from './${componentName}'
import repayTheme from '../repayTheme'

# ${componentName}

## Best practices

## Basic usage

<Playground>
  <${componentName} theme={repayTheme} />
</Playground>

## Properties

<PropsTable of={${componentName}} />
  `.trim() + '\n'
  )
}
