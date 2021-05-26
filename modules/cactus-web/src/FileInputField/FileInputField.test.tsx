import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import FileInputField from './FileInputField'

describe('component: FileInputField', (): void => {
  test('should render a loading file', (): void => {
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

  test('should render a loaded file', (): void => {
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

  test('should render a file with an error', (): void => {
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

  test('should render field validation messages', () => {
    const { getByText, rerender } = render(
      <StyleProvider>
        <FileInputField
          name="dabears"
          id="free-fallin"
          label="Bickin Back"
          accept={['.txt']}
          success="Mirror mirror on the wall"
        />
      </StyleProvider>
    )

    const successMsg = getByText('Mirror mirror on the wall')
    expect(successMsg).toBeInTheDocument()

    rerender(
      <StyleProvider>
        <FileInputField
          name="dabears"
          id="free-fallin"
          label="Bickin Back"
          accept={['.txt']}
          warning="Who's the boolest of them all?"
        />
      </StyleProvider>
    )

    const warningMsg = getByText("Who's the boolest of them all?")
    expect(warningMsg).toBeInTheDocument()

    rerender(
      <StyleProvider>
        <FileInputField
          name="dabears"
          id="free-fallin"
          label="Bickin Back"
          accept={['.txt']}
          error="My boy's the boolest of them all"
        />
      </StyleProvider>
    )

    const errorMsg = getByText("My boy's the boolest of them all")
    expect(errorMsg).toBeInTheDocument()
  })
})
