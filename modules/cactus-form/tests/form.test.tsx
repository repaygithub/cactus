import { StyleProvider } from '@repay/cactus-web'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Form } from 'react-final-form'

import { DependentField, Field, FieldSpy } from '../src/index'

const noop = () => undefined
const form = ({ children }: any) => React.createElement('form', {}, children)

const App = (props: any) => (
  <StyleProvider>
    <Form onSubmit={noop} component={form} {...props} />
  </StyleProvider>
)

describe('final-form functionality', () => {
  describe('<Field />', () => {
    test.each([
      { expected: 'text' },
      { expected: 'select', options: ['uno', 'dos'] },
      { expected: 'toggle', type: 'boolean' },
      { expected: 'checkbox', type: 'checkbox' },
      { expected: 'radio', type: 'radio' },
      { expected: 'multi', type: 'select-multiple', options: ['ichi', 'ni'] },
      { expected: 'combo', type: 'creatableDropdown', options: ['yi', 'er'] },
      { expected: 'date', type: 'datetime', 'data-testid': 'date' },
      { expected: 'file', type: 'file' },
      { expected: 'hidden', type: 'hidden', 'data-testid': 'hidden' },
      { expected: 'number', type: 'numeric' },
    ])('selects $expected cactus field by type', ({ expected, ...props }: any) => {
      const { getByTestId, getByLabelText, getByText } = render(
        <App>
          <Field name="test" label="Testing 123" {...props} />
        </App>
      )
      const testid = props['data-testid']
      const input = (
        testid ? getByTestId(testid) : getByLabelText('Testing 123')
      ) as HTMLInputElement
      switch (expected) {
        case 'select':
        case 'multi':
        case 'combo':
          expect(input).toHaveAttribute('aria-haspopup', 'listbox')
          expect(input).toHaveAttribute('aria-multiselectable', `${expected === 'multi'}`)
          userEvent.click(input)
          expect(getByText(props.options[0])).toBeVisible()
          const expanded = document.querySelector('[aria-expanded]')
          if (expected === 'combo') {
            expect(expanded).toHaveAttribute('role', 'textbox')
          } else {
            expect(expanded).toBe(input)
          }
          break
        case 'toggle':
          expect(input.type).toBe('checkbox')
          expect(input).toHaveAttribute('role', 'switch')
          break
        case 'text':
        case 'checkbox':
        case 'radio':
        case 'file':
        case 'number':
        case 'hidden':
          expect(input.type).toBe(expected)
          break

        case 'date':
          const inputs = Array.from(input.querySelectorAll('input'))
          const labels = inputs.map((i) => i.getAttribute('aria-label'))
          expect(labels.sort()).toEqual([
            'day of month',
            'hours',
            'minutes',
            'month',
            'time period',
            'year',
          ])
          return
      }
      expect(input.name).toBe('test')
    })

    test.each(['as', 'component'])('uses `%s` prop to render component', (prop) => {
      const props = { name: 'prop', [prop]: 'input', 'data-testid': 'test' }
      const { getByTestId } = render(
        <App initialValues={{ prop }}>
          <Field {...props} />
        </App>
      )
      const input = getByTestId('test') as HTMLInputElement
      expect(input.type).toBe('text')
      expect(input).toHaveValue(prop)
    })

    test('uses render func to render component', () => {
      const rf = jest.fn()
      rf.mockReturnValue(null)
      const cf = jest.fn()
      cf.mockReturnValue(null)
      render(
        <App initialValues={{ render: 'something', children: true }}>
          <Field name="render" render={rf} type="radio" value="nothing" />
          <Field name="children" type="checkbox">
            {cf}
          </Field>
        </App>
      )
      expect(rf).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'render',
          type: 'radio',
          value: 'nothing',
          checked: false,
        })
      )
      expect(cf).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'children',
          type: 'checkbox',
          checked: true,
        })
      )
    })

    test('forwards field props, removes config props', () => {
      const ident = (val: any) => val
      const removed = {
        afterSubmit: noop,
        allowNull: true,
        beforeSubmit: noop,
        data: { some: 'data' },
        defaultValue: 'hey',
        format: ident,
        formatOnBlur: true,
        initialValue: 'ho',
        isEqual: (l: any, r: any) => l === r,
        parse: ident,
        subscription: { value: true },
        validate: noop,
        validateFields: [],
        value: 'go',
        processMeta: ident,
      }
      const kept = {
        name: 'George',
        multiple: true,
        type: 'multi',
        random: 'prop',
        forwarded: 'mail',
        value: 'ho', // Seems `initialValue` has precedence over `defaultValue`.
      }
      const rf = jest.fn()
      rf.mockReturnValue(null)
      render(
        <App initialValues={{ render: 'something', children: true }}>
          <Field {...kept} {...removed} render={rf} />
        </App>
      )
      expect(rf).toHaveBeenCalledWith(expect.objectContaining(kept))
      expect(rf).toHaveBeenCalledWith(expect.not.objectContaining(removed))
    })

    test('uses custom mapping for meta values', () => {
      const rf = jest.fn()
      rf.mockReturnValue(null)
      // I'm going to throw in the default required validator here,
      // since it's difficult to test with default settings.
      const processMeta = (props: any, meta: any) => ({ ...props, error: meta.error })
      render(
        <App>
          <Field name="test" required processMeta={processMeta} render={rf} />
        </App>
      )
      expect(rf).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'test',
          required: true,
          error: 'Missing required field',
        })
      )
    })

    describe('Field.configureDefaults', () => {
      const Component = jest.fn()
      Component.mockReturnValue(null)

      afterEach(() => {
        Field.configureDefaults(Field.defaultConfig())
      })

      test('overrides default props using `configureDefaults`', () => {
        Field.configureDefaults({
          subscription: { value: true, dirty: true, invalid: true },
          processMeta: (p: any, m: any) => Object.assign(p, m),
          getFieldComponent: () => Component as any,
        })
        render(
          <App>
            <Field name="defaults" required defaultValue="something" />
          </App>
        )
        expect(Component).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'defaults',
            value: 'something',
            dirty: true,
            invalid: false,
            required: true,
          }),
          {}
        )
      })
    })
  })

  describe('<DependentField />', () => {
    test('use single callback for multiple fields', () => {
      const onChange = jest.fn((state: any, props: any) => {
        props.onChange(state.value ? state.name : 'nada')
      })
      const { getByLabelText } = render(
        <App>
          <Field name="zero" label="Cero" type="checkbox" />
          <DependentField
            name="one"
            label="Uno"
            defaultValue="nada"
            dependsOn={['two', 'three']}
            onDependencyChange={onChange}
          />
          <Field name="two" label="Dos" type="checkbox" />
          <Field name="three" label="Tres" type="checkbox" />
        </App>
      )
      const field = getByLabelText('Uno')
      expect(field).toHaveValue('nada')

      userEvent.click(getByLabelText('Cero'))
      expect(field).toHaveValue('nada')
      expect(onChange).not.toHaveBeenCalled()

      userEvent.click(getByLabelText('Dos'))
      expect(field).toHaveValue('two')
      expect(onChange).toHaveBeenCalledTimes(1)

      userEvent.click(getByLabelText('Tres'))
      expect(field).toHaveValue('three')
      expect(onChange).toHaveBeenCalledTimes(2)

      userEvent.click(getByLabelText('Dos'))
      expect(field).toHaveValue('nada')
      expect(onChange).toHaveBeenCalledTimes(3)
    })

    test('can change value independently', () => {
      const onChange = jest.fn((state: any, props: any) => {
        props.onChange(state.value)
      })
      const { getByLabelText } = render(
        <App>
          <Field name="power" label="Power" />
          <DependentField
            name="shadow"
            label="Shadow"
            dependsOn="power"
            onDependencyChange={onChange}
          />
        </App>
      )
      const field = getByLabelText('Shadow')
      userEvent.type(field, 'Boxing')
      expect(field).toHaveValue('Boxing')
      expect(onChange).not.toHaveBeenCalled()

      userEvent.type(getByLabelText('Power'), 'Overwhelming')
      expect(field).toHaveValue('Overwhelming')
      expect(onChange).toHaveBeenCalledTimes(12)

      userEvent.type(field, ' Darkness')
      expect(field).toHaveValue('Overwhelming Darkness')
      expect(onChange).toHaveBeenCalledTimes(12)
    })

    test('use per-field configuration', () => {
      const onTwoChange = jest.fn((state: any, props: any) => {
        props.onChange(state.error || 'no error')
      })
      const onThreeChange = jest.fn((state: any, props: any) => {
        props.onChange(state.value)
      })
      const validateTwo = (val: unknown) => (val === 'hey' ? '"hey" is for horses' : undefined)
      const { getByLabelText } = render(
        <App>
          <DependentField
            name="one"
            label="Uno"
            defaultValue="nada"
            dependsOn={{
              two: { error: true, onChange: onTwoChange },
              three: { value: true, onChange: onThreeChange },
            }}
          />
          <Field name="two" label="Dos" validate={validateTwo} />
          <Field name="three" label="Tres" />
        </App>
      )
      const field = getByLabelText('Uno')
      expect(field).toHaveValue('nada')

      const two = getByLabelText('Dos')
      userEvent.type(two, 'hey')
      expect(field).toHaveValue('"hey" is for horses')
      // Three `value` change events, but only one change to `error`.
      expect(onTwoChange).toHaveBeenCalledTimes(1)

      userEvent.type(getByLabelText('Tres'), 'zo')
      expect(field).toHaveValue('zo')
      expect(onThreeChange).toHaveBeenCalledTimes(2)

      userEvent.type(two, 'lo')
      expect(field).toHaveValue('no error')
      expect(onTwoChange).toHaveBeenCalledTimes(2)
    })
  })

  describe('<FieldSpy />', () => {
    test('can spy on multiple state values', () => {
      const { getByTestId } = render(
        <App>
          <Field name="field" label="McField" required data-testid="field" />
          <FieldSpy
            fieldName="field"
            valueId="value"
            errorId="error"
            subscription={{ value: true, error: true }}
          >
            {(props: any) => (
              <>
                <span data-testid={props.valueId}>{props.value}</span>
                <span data-testid={props.errorId}>{props.error}</span>
              </>
            )}
          </FieldSpy>
        </App>
      )
      const value = getByTestId('value')
      expect(value).toHaveTextContent('')
      const error = getByTestId('error')
      expect(error).toHaveTextContent('Missing required field')

      userEvent.type(getByTestId('field'), 'Hey')
      expect(value).toHaveTextContent('Hey')
      expect(error).toHaveTextContent('')
    })
  })
})
