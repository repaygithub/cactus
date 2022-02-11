import { render } from '@testing-library/react'
import * as React from 'react'

import { RangeField, StyleProvider } from '../'

describe('component: RangeField', (): void => {
  test('should render a disabled RangeField', (): void => {
    const { getByLabelText } = render(
      <StyleProvider>
        <RangeField
          id="trick"
          name="trick"
          label="Come on, type something"
          tooltip="Sike!"
          disabled
        />
      </StyleProvider>
    )

    expect(getByLabelText('Come on, type something')).toBeDisabled()
  })

  test('should render a success RangeField', (): void => {
    const { getByText, getByLabelText } = render(
      <StyleProvider>
        <RangeField
          id="success"
          name="success"
          label="No seriously, type something"
          success="Great! you typed something!"
        />
      </StyleProvider>
    )

    expect(
      getByLabelText('No seriously, type something').getAttribute('aria-describedby')
    ).toContain(getByText('Great! you typed something!').id)
  })

  test('should render a warning RangeField', (): void => {
    const { getByText, getByLabelText } = render(
      <StyleProvider>
        <RangeField
          id="warn"
          name="warn"
          label="Do it again"
          warning="Really? That's all you got?"
        />
      </StyleProvider>
    )

    expect(getByLabelText('Do it again').getAttribute('aria-describedby')).toContain(
      getByText(`Really? That's all you got?`).id
    )
  })

  test('should render an error RangeField', (): void => {
    const { getByText, getByLabelText } = render(
      <StyleProvider>
        <RangeField id="error" name="error" label="Try again" error="That's it, we're done here" />
      </StyleProvider>
    )

    expect(getByLabelText('Try again').getAttribute('aria-describedby')).toContain(
      getByText(`That's it, we're done here`).id
    )
  })

  test('should support margin space props', (): void => {
    const { getByTestId } = render(
      <StyleProvider>
        <RangeField label="F" name="1st" data-testid="first" />
        <RangeField name="def" label="D" data-testid="default" mb={2} />
        <RangeField name="over" label="O" data-testid="override" mt={1} />
      </StyleProvider>
    )

    const blank = { marginTop: '', marginRight: '', marginBottom: '', marginLeft: '' }
    expect(getByTestId('first').parentElement?.parentElement).toHaveStyle(blank)
    expect(getByTestId('default').parentElement?.parentElement).toHaveStyle({
      ...blank,
      marginTop: '16px',
      marginBottom: '4px',
    })
    expect(getByTestId('override').parentElement?.parentElement).toHaveStyle({
      ...blank,
      marginTop: '2px',
    })
  })

  test('should support flex item props', () => {
    const { container } = render(
      <StyleProvider>
        <RangeField
          id="margins"
          name="margins"
          label="Check out all these sick margins"
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

  test('should support ref prop', () => {
    const ref = React.createRef<HTMLInputElement>()
    const { getByLabelText } = render(
      <StyleProvider>
        <RangeField defaultValue="42" name="reflected" label="Referred" ref={ref} />
      </StyleProvider>
    )
    expect(getByLabelText('Referred')).toBe(ref.current)
    expect(ref.current).toHaveValue('42')
  })
})
