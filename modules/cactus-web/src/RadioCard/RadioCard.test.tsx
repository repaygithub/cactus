import userEvent from '@testing-library/user-event'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import RadioCard from './RadioCard'

describe('component: RadioCard', () => {
  test('style props go to wrapper', () => {
    const style = { outline: '1px solid orange' }
    const { getByTestId } = renderWithTheme(
      <RadioCard
        id="what"
        name="hope"
        value="quest"
        data-testid="myradio"
        className="sup"
        style={style}
      />
    )
    const input = getByTestId('myradio')
    const wrapper = input.parentElement
    expect(input).toHaveAttribute('id', 'what')
    expect(input).toHaveAttribute('name', 'hope')
    expect(input).toHaveAttribute('value', 'quest')
    expect(input).toHaveAttribute('aria-labelledby', wrapper?.id)
    expect(input).not.toHaveStyle(style)
    expect(input).not.toHaveClass('sup')
    expect(wrapper?.id).not.toBe('what')
    expect(wrapper).toHaveStyle(style)
    expect(wrapper).toHaveClass('sup', RadioCard.toString().slice(1))
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
      <RadioCard data-testid="myradio" onChange={change} onClick={click} onFocus={focus} />
    )
    const input = getByTestId('myradio')
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
      renderWithTheme(<RadioCard ref={ref} />)
      userEvent.tab()
      expect(ref.current).toHaveFocus()
      expect(ref.current?.matches('input[type="radio"]')).toBe(true)
    })

    test('focus on click wrapper', () => {
      const { getByLabelText } = renderWithTheme(<RadioCard>Label Y'all</RadioCard>)
      const input = getByLabelText("Label Y'all")
      userEvent.click(input.parentElement as HTMLElement)
      expect(input).toHaveFocus()
      expect(input.nextElementSibling).toHaveTextContent("Label Y'all")
    })

    test('focus forward to focusRef', () => {
      const ref = React.createRef<HTMLDivElement>()
      const { getByTestId } = renderWithTheme(
        <RadioCard name="test" focusRef={ref} data-testid="radio">
          <div tabIndex={-1} ref={ref} data-testid="focus" />
        </RadioCard>
      )
      const input = getByTestId('radio')
      const focusable = getByTestId('focus')
      userEvent.click(input.parentElement as HTMLElement)
      expect(focusable).toHaveFocus()
    })

    test('focus properly on click inner label', () => {
      const { getByTestId } = renderWithTheme(
        <RadioCard>
          <label data-testid="label" htmlFor="input">
            Go Beyond
          </label>
          <input id="input" defaultValue="plus" data-testid="ultra" />
        </RadioCard>
      )
      userEvent.click(getByTestId('label'))
      expect(getByTestId('ultra')).toHaveFocus()
    })
  })

  describe('RadioCard.Group', () => {
    test('group attributes', () => {
      const style = { outline: '1px solid orange' }
      const { getByTestId } = renderWithTheme(
        <RadioCard.Group
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
        </RadioCard.Group>
      )
      const field = getByTestId('group')
      expect(field).toHaveAttribute('id', 'group')
      expect(field).toHaveAttribute('role', 'radiogroup')
      expect(field).not.toHaveAttribute('name')
      expect(field).toHaveClass('yup', RadioCard.Group.toString().slice(1))
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
        <RadioCard.Group name="forward" label="march" defaultValue="two" required disabled>
          <RadioCard value="one" disabled={false} />
          <RadioCard value="two" />
          <RadioCard value="three" required={false} />
        </RadioCard.Group>
      )
      const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input'))
      expect(inputs[0].value).toBe('one')
      expect(inputs[1].value).toBe('two')
      expect(inputs[2].value).toBe('three')
      for (const i of inputs) {
        expect(i).toHaveAttribute('name', 'forward')
        expect(i.disabled).toBe(i.value !== 'one')
        expect(i.required).toBe(i.value !== 'three')
        expect(i.checked).toBe(i.value === 'two')
      }
    })

    test('controlled', () => {
      const formRef = React.createRef<HTMLFormElement>()
      const WithControl = () => {
        const [value, setValue] = React.useState<string>('')
        const change = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
        return (
          <form ref={formRef}>
            <RadioCard.Group name="radios" label="Label" value={value} onChange={change}>
              <RadioCard data-testid="one" value="uno" />
              <RadioCard data-testid="two" value="dos" />
              <RadioCard data-testid="three" value="tres" />
            </RadioCard.Group>
          </form>
        )
      }
      const { getByTestId } = renderWithTheme(<WithControl />)
      expect(formRef.current).toHaveFormValues({ radios: undefined })
      userEvent.click(getByTestId('one'))
      expect(formRef.current).toHaveFormValues({ radios: 'uno' })
      userEvent.click(getByTestId('three'))
      expect(formRef.current).toHaveFormValues({ radios: 'tres' })
    })
  })
})
