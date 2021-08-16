import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import FileInputField from './FileInputField'

describe('component: FileInputField', (): void => {
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

  test('should support margin space props', (): void => {
    const { container } = render(
      <StyleProvider>
        <FileInputField label="F" name="first" />
        <FileInputField name="default" label="D" mb={2} />
        <FileInputField name="override" label="O" mt={1} />
      </StyleProvider>
    )

    const blank = { marginTop: '', marginRight: '', marginBottom: '', marginLeft: '' }
    const first = container.firstElementChild
    expect(first).toHaveStyle(blank)
    expect(first?.nextElementSibling).toHaveStyle({
      ...blank,
      marginTop: '16px',
      marginBottom: '4px',
    })
    expect(first?.nextElementSibling?.nextElementSibling).toHaveStyle({
      ...blank,
      marginTop: '2px',
    })
  })

  test('should support flex item props', () => {
    const { container } = render(
      <StyleProvider>
        <FileInputField
          name="dabears"
          id="free-fallin"
          label="Bickin Back"
          accept={['.txt']}
          data-testid="flex-fileinput"
          flex={1}
          flexGrow={1}
          flexShrink={0}
          flexBasis={0}
        />
      </StyleProvider>
    )

    expect(container.firstElementChild).toHaveStyle('flex: 1')
    expect(container.firstElementChild).toHaveStyle('flex-grow: 1')
    expect(container.firstElementChild).toHaveStyle('flex-shrink: 0')
    expect(container.firstElementChild).toHaveStyle('flex-basis: 0')
  })
})
