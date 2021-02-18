import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import FileInput from './FileInput'

describe('component: FileInput', (): void => {
  test('should render a file input', (): void => {
    const { container } = render(
      <StyleProvider>
        <FileInput name="throatpunch" accept={['.tsx']} labels={{ delete: 'ejecto seato cuz' }} />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a disabled file input', (): void => {
    const { container } = render(
      <StyleProvider>
        <FileInput
          name="throatpunch"
          accept={['.tsx']}
          labels={{ delete: 'ejecto seato cuz' }}
          disabled={true}
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a loading file', (): void => {
    const { container } = render(
      <StyleProvider>
        <FileInput
          name="throatpunch"
          accept={['.md']}
          labels={{ delete: 'ejecto seato cuz' }}
          value={[{ fileName: 'boolest.md', contents: 'bickin back bein bool', status: 'loading' }]}
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a loaded file', (): void => {
    const { container } = render(
      <StyleProvider>
        <FileInput
          name="throatpunch"
          accept={['.md']}
          labels={{ delete: 'ejecto seato cuz' }}
          value={[{ fileName: 'boolest.md', contents: 'bickin back bein bool', status: 'loaded' }]}
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a file with an error', (): void => {
    const { container } = render(
      <StyleProvider>
        <FileInput
          name="throatpunch"
          accept={['.md']}
          labels={{ delete: 'ejecto seato cuz' }}
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