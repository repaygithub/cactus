import userEvent from '@testing-library/user-event'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import CheckBoxCard from './CheckBoxCard'

// Click then wait for the `setTimeout` call in `ToggleCard.tsx` to clear.
const waitForTimeout = (resolve: (v: unknown) => void) => setTimeout(resolve)
const clickAndWait: typeof userEvent.click = async (...args) => {
  const result = userEvent.click(...args)
  await new Promise(waitForTimeout)
  return result
}

describe('component: CheckBoxCard', () => {
  test('style props go to wrapper', () => {
    const style = { outline: '1px solid orange' }
    const { getByTestId } = renderWithTheme(
      <CheckBoxCard
        id="what"
        name="hope"
        value="quest"
        data-testid="mycheckbox"
        className="sup"
        margin={3}
        flexGrow="3"
        style={style}
      />
    )
    const styles = [style, { margin: '8px' }, { flexGrow: 3 }]
    const input = getByTestId('mycheckbox')
    const wrapper = input.parentElement
    expect(input).toHaveAttribute('id', 'what')
    expect(input).toHaveAttribute('name', 'hope')
    expect(input).toHaveAttribute('value', 'quest')
    expect(input).toHaveAttribute('aria-labelledby', wrapper?.id)
    expect(input).not.toHaveClass('sup')
    for (const s of styles) {
      expect(input).not.toHaveStyle(s)
      expect(wrapper).toHaveStyle(s)
    }
    expect(wrapper?.id).not.toBe('what')
    expect(wrapper).toHaveClass('sup', CheckBoxCard.toString().slice(1))
  })

  test('card wrapper behaves like <label>', () => {
    let changeTarget: HTMLInputElement | undefined = undefined
    const change = jest.fn((e: React.ChangeEvent<HTMLInputElement>) => {
      changeTarget = e.target
    })
    let focusTarget: HTMLInputElement | undefined = undefined
    const focus = jest.fn((e: React.FocusEvent<HTMLInputElement>) => {
      focusTarget = e.target
    })
    let clickTarget: HTMLInputElement | undefined = undefined
    const click = jest.fn((e: React.MouseEvent<HTMLInputElement>) => {
      clickTarget = e.target as HTMLInputElement
    })
    const { getByTestId } = renderWithTheme(
      <CheckBoxCard data-testid="mycheckbox" onChange={change} onClick={click} onFocus={focus} />
    )
    const input = getByTestId('mycheckbox')
    userEvent.click(input.parentElement as HTMLElement)
    expect(input).toBe(changeTarget)
    expect(input).toBe(focusTarget)
    expect(input).toBe(clickTarget)
    expect(change).toHaveBeenCalledTimes(1)
    expect(focus).toHaveBeenCalledTimes(1)
    expect(click).toHaveBeenCalledTimes(1)
  })

  describe('focus behavior', () => {
    test('focus on tab', () => {
      const ref = React.createRef<HTMLInputElement>()
      renderWithTheme(<CheckBoxCard ref={ref} />)
      userEvent.tab()
      expect(ref.current).toHaveFocus()
      expect(ref.current?.matches('input[type="checkbox"]')).toBe(true)
    })

    test('focus on click wrapper', () => {
      const { getByLabelText } = renderWithTheme(
        <CheckBoxCard defaultChecked>Label Y'all</CheckBoxCard>
      )
      const input = getByLabelText("Label Y'all")
      userEvent.click(input.parentElement as HTMLElement)
      expect(input).toHaveFocus()
      expect(input).not.toBeChecked()
      expect(input.nextElementSibling).toHaveTextContent("Label Y'all")
    })

    test('focus forward to focusRef', async () => {
      const ref = React.createRef<HTMLDivElement>()
      const { getByTestId } = renderWithTheme(
        <CheckBoxCard name="test" focusRef={ref} data-testid="checkbox">
          <div tabIndex={-1} ref={ref} data-testid="focus" />
        </CheckBoxCard>
      )
      const input = getByTestId('checkbox')
      const focusable = getByTestId('focus')
      await clickAndWait(input.parentElement as HTMLElement)
      expect(focusable).toHaveFocus()
      expect(input).toBeChecked()
      // It only calls the focusRef when `checked=true`.
      await clickAndWait(input.parentElement as HTMLElement)
      expect(focusable).not.toHaveFocus()
      expect(input).not.toBeChecked()
    })

    test('focus properly on click inner label', async () => {
      const { getByTestId } = renderWithTheme(
        <CheckBoxCard data-testid="checkbox">
          <label data-testid="label" htmlFor="input">
            Go Beyond
          </label>
          <input id="input" defaultValue="plus" data-testid="ultra" />
        </CheckBoxCard>
      )
      const checkbox = getByTestId('checkbox')
      const label = getByTestId('label')
      const input = getByTestId('ultra')
      await clickAndWait(label)
      expect(input).toHaveFocus()
      expect(checkbox).toBeChecked()
      await clickAndWait(label)
      expect(input).toHaveFocus()
      expect(checkbox).not.toBeChecked()
      // Clicking directly on an input won't uncheck the checkbox.
      await clickAndWait(input)
      expect(checkbox).toBeChecked()
      await clickAndWait(input)
      expect(checkbox).toBeChecked()
    })
  })

  describe('CheckBoxCard.Group', () => {
    test('group attributes', () => {
      const style = { outline: '1px solid orange' }
      const { getByTestId } = renderWithTheme(
        <CheckBoxCard.Group
          id="group"
          name="what"
          className="yup"
          style={style}
          label="nope"
          width="100px"
          flex="1 0 30px"
          mb="14px"
          data-testid="group"
          error="oh noes!"
        >
          <input data-testid="placeholder" />
        </CheckBoxCard.Group>
      )
      const field = getByTestId('group')
      expect(field).toHaveAttribute('id', 'group')
      expect(field).toHaveAttribute('role', 'group')
      expect(field).not.toHaveAttribute('name')
      expect(field).toHaveClass('yup', CheckBoxCard.Group.toString().slice(1))
      expect(field).toHaveStyle({
        ...style,
        width: '100px',
        flexGrow: '1',
        flexShrink: '0',
        flexBasis: '30px',
        marginBottom: '14px',
      })
      const label = document.querySelector('.field-label-row label')
      expect(field).toHaveAttribute('aria-labelledby', label?.id)
      const errorMsg = document.querySelector('.field-status-row *')
      expect(field).toHaveAttribute('aria-describedby', errorMsg?.id)
      // Unlike a normal AccessibleField, these props aren't forwarded to the child.
      const child = getByTestId('placeholder')
      expect(child.parentElement).toHaveClass('field-input-group')
      expect(child).not.toHaveAttribute('id')
      expect(child).not.toHaveAttribute('aria-describedby')
    })

    test('forwarded attributes', () => {
      renderWithTheme(
        <CheckBoxCard.Group name="" label="march" defaultChecked={{ two: true }} required disabled>
          <CheckBoxCard name="one" disabled={false} />
          <CheckBoxCard name="two" />
          <CheckBoxCard name="three" required={false} />
        </CheckBoxCard.Group>
      )
      const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input'))
      expect(inputs[0].name).toBe('one')
      expect(inputs[1].name).toBe('two')
      expect(inputs[2].name).toBe('three')
      for (const i of inputs) {
        expect(i.disabled).toBe(i.name !== 'one')
        expect(i.required).toBe(i.name !== 'three')
        expect(i.checked).toBe(i.name === 'two')
      }
    })

    test('controlled with checked', () => {
      const formRef = React.createRef<HTMLFormElement>()
      const WithControl = () => {
        const [value, setValue] = React.useState<Record<string, boolean>>({})
        const change = ({ target: { name, checked } }: React.ChangeEvent<HTMLInputElement>) =>
          setValue((s) => ({ ...s, [name]: checked }))
        return (
          <form ref={formRef}>
            <CheckBoxCard.Group name="" label="Label" checked={value} onChange={change}>
              <CheckBoxCard data-testid="one" name="uno" />
              <CheckBoxCard data-testid="two" name="dos" />
              <CheckBoxCard data-testid="three" name="tres" />
            </CheckBoxCard.Group>
          </form>
        )
      }
      const { getByTestId } = renderWithTheme(<WithControl />)
      expect(formRef.current).toHaveFormValues({ uno: false, dos: false, tres: false })
      userEvent.click(getByTestId('one'))
      expect(formRef.current).toHaveFormValues({ uno: true, dos: false, tres: false })
      userEvent.click(getByTestId('three'))
      expect(formRef.current).toHaveFormValues({ uno: true, dos: false, tres: true })
      userEvent.click(getByTestId('one'))
      expect(formRef.current).toHaveFormValues({ uno: false, dos: false, tres: true })
    })

    test('controlled with value array', () => {
      const formRef = React.createRef<HTMLFormElement>()
      const WithControl = () => {
        const [value, setValue] = React.useState<string[]>(['tres'])
        const change = ({ target: { checked, value } }: React.ChangeEvent<HTMLInputElement>) =>
          setValue((s) => (checked ? s.concat(value) : s.filter((v) => v !== value)))
        return (
          <form ref={formRef}>
            <CheckBoxCard.Group name="checkboxes" label="Label" value={value} onChange={change}>
              <CheckBoxCard data-testid="one" value="uno" />
              <CheckBoxCard data-testid="two" value="dos" />
              <CheckBoxCard data-testid="three" value="tres" />
            </CheckBoxCard.Group>
          </form>
        )
      }
      const { getByTestId } = renderWithTheme(<WithControl />)
      expect(formRef.current).toHaveFormValues({ checkboxes: ['tres'] })
      userEvent.click(getByTestId('one'))
      expect(formRef.current).toHaveFormValues({ checkboxes: ['tres', 'uno'] })
      userEvent.click(getByTestId('three'))
      expect(formRef.current).toHaveFormValues({ checkboxes: ['uno'] })
    })
  })
})
