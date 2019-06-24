import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import FileInput from './FileInput'
import path from 'path'
import puppeteer from 'puppeteer'
import repayScripts from '@repay/scripts'
import startStaticServer from '../../tests/static-server'

afterEach(cleanup)

describe('component: FileInput', () => {
  test('should render a file input', () => {
    const { container } = render(
      <StyleProvider>
        <FileInput
          name="throatpunch"
          accept={['.tsx']}
          labels={{ delete: 'ejecto seato cuz', retry: 'give it another try' }}
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a loading file', () => {
    const { container } = render(
      <StyleProvider>
        <FileInput
          name="throatpunch"
          accept={['.md']}
          labels={{ delete: 'ejecto seato cuz', retry: 'give it another try' }}
          value={[{ fileName: 'boolest.md', contents: 'bickin back bein bool', status: 'loading' }]}
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a loaded file', () => {
    const { container } = render(
      <StyleProvider>
        <FileInput
          name="throatpunch"
          accept={['.md']}
          labels={{ delete: 'ejecto seato cuz', retry: 'give it another try' }}
          value={[{ fileName: 'boolest.md', contents: 'bickin back bein bool', status: 'loaded' }]}
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a file with an error', () => {
    const { container } = render(
      <StyleProvider>
        <FileInput
          name="throatpunch"
          accept={['.md']}
          labels={{ delete: 'ejecto seato cuz', retry: 'give it another try' }}
          value={[
            {
              fileName: 'boolest.md',
              contents: 'bickin back bein bool',
              status: 'error',
              errorMsg: 'You must not be bool',
            },
          ]}
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should upload a file', async () => {
    jest.useFakeTimers()
    const _log = console.log
    console.log = jest.fn()
    await repayScripts({
      command: 'build',
      entry: 'index.tsx',
      cwd: path.join(process.cwd(), 'src/FileInput/test-app/'),
    })
    const server = startStaticServer({
      directory: path.join(process.cwd(), 'src/FileInput/test-app/dist'),
      port: '8585',
    })

    const browser = await puppeteer.launch({ ignoreHTTPSErrors: true })
    const page = await browser.newPage()
    await page.goto('http://localhost:8585')
    await page.waitFor('input[type=file]')
    const input = await page.$('input[type=file]')
    // @ts-ignore
    await input.uploadFile(path.join(process.cwd(), 'src/FileInput/test-app/test-file.txt'))
    const fileSpan = await page.$('span')
    const spanContent = await page.evaluate(fileSpan => fileSpan.textContent, fileSpan)
    expect(fileSpan).not.toBeNull()
    expect(spanContent).toBe('test-file.txt')
    server.close()
    console.log = _log
  }, 30000)
})
