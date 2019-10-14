import * as React from 'react'
import { cleanup, render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import FileInput from './FileInput'

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

  /** TODO: Add integration tests to theme-components example using puppeteer. We can't put them here because
   * @types/puppeteer brings in @types/node and sets everything else on fire
   * */
})
