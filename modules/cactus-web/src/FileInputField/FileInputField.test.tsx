import * as React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import cactusTheme from '@repay/cactus-theme'
import FileInputField from './FileInputField'

afterEach(cleanup)

describe('component: FileInputField', () => {
  test('should render file input field', () => {
    const { container } = render(
      <StyleProvider>
        <FileInputField
          name="bears"
          id="consistent"
          label="Just Boolin"
          accept={['.txt']}
          tooltip="upload something"
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a loading file', () => {
    const { container } = render(
      <StyleProvider>
        <FileInputField
          name="bears"
          id="consistent"
          label="Just Boolin"
          accept={['.txt']}
          tooltip="upload something"
          value={[{ fileName: 'boolest.txt', contents: null, status: 'loading' }]}
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a loaded file', () => {
    const { container } = render(
      <StyleProvider>
        <FileInputField
          name="bears"
          id="consistent"
          label="Just Boolin"
          accept={['.txt']}
          tooltip="upload something"
          value={[{ fileName: 'boolest.txt', contents: 'some-b64-string', status: 'loaded' }]}
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a file with an error', () => {
    const { container } = render(
      <StyleProvider>
        <FileInputField
          name="bears"
          id="consistent"
          label="Just Boolin"
          accept={['.txt']}
          tooltip="upload something"
          value={[
            {
              fileName: 'boolest.txt',
              contents: null,
              status: 'error',
              errorMsg: 'Get it together, man',
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
