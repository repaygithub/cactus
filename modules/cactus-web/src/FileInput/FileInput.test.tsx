import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import FileInput from './FileInput'

// Fake File object; aren't dynamic languages great?
const file: File = Object.create(File.prototype)
Object.defineProperty(file, 'name', { enumerable: true, value: 'boolest.txt' })
Object.defineProperty(file, 'size', { enumerable: true, value: 42 })

const fakeValue = [FileInput.toFileObj(file)]

describe('component: FileInput', (): void => {
  test('should clear input with empty string', (): void => {
    const { getByText, rerender } = render(
      <StyleProvider>
        <FileInput name="throatpunch" value={fakeValue} />
      </StyleProvider>
    )
    const span = getByText('boolest.txt')
    rerender(
      <StyleProvider>
        <FileInput name="throatpunch" value="" />
      </StyleProvider>
    )

    expect(span).not.toBeInTheDocument()
  })

  test('should forward input-specific props to input', () => {
    const { getByLabelText, getByTestId } = render(
      <StyleProvider>
        <FileInput
          data-testid="wrapper"
          aria-hidden
          id="punchthroat"
          name="throatpunch"
          aria-label="Oh Yeah!"
          aria-labelledby="punchthroat"
          aria-describedby="desc"
          aria-details="details"
          aria-errormessage="Oh no!"
          aria-invalid
          aria-placeholder="Hold my _____"
          capture="user"
          form="other"
          multiple
          disabled
          required
          aria-required
        />
      </StyleProvider>
    )
    const wrapper = getByTestId('wrapper')
    expect(wrapper.matches(`div${FileInput}`)).toBe(true)
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
    expect(wrapper).toHaveAttribute('aria-disabled', 'true')
    expect(wrapper).not.toHaveAttribute('id')
    expect(wrapper).not.toHaveAttribute('aria-label')
    const input = getByLabelText('Oh Yeah!')
    expect(input.matches('input#punchthroat')).toBe(true)
    expect(input).not.toHaveAttribute('aria-hidden')
    expect(input).not.toHaveAttribute('aria-disabled')
    expect(input).toHaveAttribute('aria-label', 'Oh Yeah!')
    expect(input).toHaveAttribute('aria-labelledby', 'punchthroat')
    expect(input).toHaveAttribute('aria-describedby', 'desc')
    expect(input).toHaveAttribute('aria-details', 'details')
    expect(input).toHaveAttribute('aria-errormessage', 'Oh no!')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-placeholder', 'Hold my _____')
    expect(input).toHaveAttribute('capture', 'user')
    expect(input).toHaveAttribute('form', 'other')
    expect(input).toHaveAttribute('multiple')
    expect(input).toHaveAttribute('disabled')
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('aria-required', 'true')
  })

  test('should fire focus/blur events at element boundary', () => {
    let focusTarget: any = undefined,
      blurTarget: any = undefined
    const focus = jest.fn((e: any) => {
      focusTarget = { ...e.target }
    })
    const blur = jest.fn((e: any) => {
      blurTarget = { ...e.target }
    })
    render(
      <StyleProvider>
        <FileInput name="throatpunch" value={fakeValue} onFocus={focus} onBlur={blur} />
      </StyleProvider>
    )
    userEvent.tab()
    expect(document.activeElement).toHaveAttribute('name', 'throatpunch')
    expect(focus).toHaveBeenCalledTimes(1)
    expect(blur).toHaveBeenCalledTimes(0)
    userEvent.tab()
    expect(document.activeElement).toHaveTextContent('boolest.txt')
    expect(focus).toHaveBeenCalledTimes(1)
    expect(blur).toHaveBeenCalledTimes(0)
    userEvent.tab()
    expect(document.activeElement).toHaveAttribute('aria-label', 'Delete File')
    expect(focus).toHaveBeenCalledTimes(1)
    expect(blur).toHaveBeenCalledTimes(0)
    userEvent.tab()
    expect(focus).toHaveBeenCalledTimes(1)
    expect(blur).toHaveBeenCalledTimes(1)
    expect(focusTarget).toEqual({ name: 'throatpunch', value: fakeValue })
    expect(blurTarget).toEqual(focusTarget)
  })

  test('should be able to delete file', () => {
    let changeTarget: any = undefined

    const Controlled = () => {
      const [state, setState] = React.useState(fakeValue)
      const change = jest.fn((e) => {
        changeTarget = { ...e.target }
        setState(e.target.value)
      })
      return <FileInput name="controlled" onChange={change} value={state} />
    }

    const { getByLabelText } = render(
      <StyleProvider>
        <Controlled />
      </StyleProvider>
    )
    const deleteButton = getByLabelText('Delete File')
    userEvent.click(deleteButton)
    expect(deleteButton).not.toBeInTheDocument()
    expect(changeTarget).toEqual({ name: 'controlled', value: [] })
  })

  /** TODO: Add integration tests to theme-components example using puppeteer. We can't put them here because
   * @types/puppeteer brings in @types/node and sets everything else on fire
   * */
})
