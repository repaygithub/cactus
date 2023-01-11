import { CheckBoxGroup, StyleProvider } from '@repay/cactus-web'
import { act, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Form as FinalForm, FormSpy as FinalFormSpy } from 'react-final-form'

import {
  DependentField,
  Field,
  FieldArray,
  FieldSpy,
  Form,
  FormSpy,
  SubmitButton,
} from '../src/index'

const noop = () => undefined
const form = ({ children }: any) => React.createElement('form', {}, children)

const App = (props: any) => (
  <StyleProvider>
    <FinalForm onSubmit={noop} component={form} {...props} />
  </StyleProvider>
)
const hasFormApi = (props: Record<string, any>) => {
  expect(props.form).toBeDefined()
  expect(typeof props.form.batch).toBe('function')
  expect(typeof props.form.blur).toBe('function')
  expect(typeof props.form.change).toBe('function')
  expect(typeof props.form.focus).toBe('function')
  expect(typeof props.form.initialize).toBe('function')
  expect(typeof props.form.reset).toBe('function')
}

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

    test('uses modified original props object if processMeta returns undefined', () => {
      const rf = jest.fn()
      rf.mockReturnValue(null)
      const processMeta = (props: any, meta: any) => {
        props.error = meta.error
      }
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

    test('allows custom required messages', () => {
      const rf = jest.fn()
      rf.mockReturnValue(null)
      const processMeta = (props: any, meta: any) => ({ ...props, error: meta.error })
      // String messages
      render(
        <App>
          <Field
            name="test"
            required
            requiredMsg="You missed a spot"
            processMeta={processMeta}
            render={rf}
          />
        </App>
      )
      expect(rf).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'test',
          required: true,
          error: 'You missed a spot',
        })
      )

      // React node messages
      render(
        <App>
          <Field
            name="test"
            required
            requiredMsg={<div>C'mon man you're skipping important steps</div>}
            processMeta={processMeta}
            render={rf}
          />
        </App>
      )
      expect(rf).toHaveBeenLastCalledWith(
        expect.objectContaining({
          name: 'test',
          required: true,
          error: <div>C'mon man you're skipping important steps</div>,
        })
      )
    })

    describe('Field.configureDefaults', () => {
      const Component = jest.fn()
      Component.mockReturnValue(null)

      afterEach(() => {
        Field.configureDefaults(Field.initialDefaults())
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

    describe('Field.withDefaults', () => {
      const Component = jest.fn()
      Component.mockReturnValue(null)

      test('creates new component using `withDefaults`', () => {
        const NewField = Field.withDefaults({
          subscription: { value: true, dirty: true, invalid: true },
          processMeta: (p: any, m: any) => Object.assign(p, m),
          getFieldComponent: () => Component as any,
        })
        const { container } = render(
          <App>
            <Field name="old" label="Old" required defaultValue="something" />
            <NewField name="new" required defaultValue="something" />
          </App>
        )
        expect(Component).toHaveBeenCalledTimes(1)
        expect(Component).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'new',
            value: 'something',
            dirty: true,
            invalid: false,
            required: true,
          }),
          {}
        )
        const inputs = container.querySelectorAll<HTMLInputElement>('input')
        expect(inputs).toHaveLength(1)
        expect(inputs[0].type).toBe('text')
        expect(inputs[0].name).toBe('old')
      })
    })

    // This illustrates one of the more important fixes in the patch.
    test('can handle checkbox group as array', () => {
      const mock = jest.fn()
      const spyValues = ({ values }: any) => mock(values)
      const { getByLabelText } = render(
        <App>
          <Field as={CheckBoxGroup} name="array" label="Array">
            <CheckBoxGroup.Item label="One" value="uno" />
            <CheckBoxGroup.Item label="Two" value="dos" />
            <CheckBoxGroup.Item label="Three" value="tres" />
          </Field>
          <FinalFormSpy subscription={{ values: true }} onChange={spyValues} />
        </App>
      )
      userEvent.click(getByLabelText('One'))
      expect(mock).toHaveBeenCalledWith({ array: ['uno'] })
      userEvent.click(getByLabelText('Three'))
      expect(mock).toHaveBeenCalledWith({ array: ['uno', 'tres'] })
      userEvent.click(getByLabelText('One'))
      expect(mock).toHaveBeenCalledWith({ array: ['tres'] })
    })

    test('can handle checkbox group as booleans', () => {
      const mock = jest.fn()
      const spyValues = ({ values }: any) => mock(values)
      // Remember, type="checkbox" is needed so final-form passes the right props.
      const { getByLabelText } = render(
        <App>
          <CheckBoxGroup name="group" label="Bools">
            <Field as={CheckBoxGroup.Item} type="checkbox" name="yi" label="One" />
            <Field as={CheckBoxGroup.Item} type="checkbox" name="er" label="Two" />
            <Field as={CheckBoxGroup.Item} type="checkbox" name="san" label="Three" />
          </CheckBoxGroup>
          <FinalFormSpy subscription={{ values: true }} onChange={spyValues} />
        </App>
      )
      userEvent.click(getByLabelText('One'))
      expect(mock).toHaveBeenCalledWith({ yi: true })
      userEvent.click(getByLabelText('Three'))
      expect(mock).toHaveBeenCalledWith({ yi: true, san: true })
      userEvent.click(getByLabelText('One'))
      expect(mock).toHaveBeenCalledWith({ yi: false, san: true })
    })
  })

  describe('<FieldArray />', () => {
    test('does not re-render on nested value change', () => {
      const mock: any = jest.fn(() => <Field name="array[0].one" label="One" />)
      const { getByLabelText } = render(
        <App>
          <FieldArray name="array" component={mock} initialValue={[{ one: 'uno' }]} />
        </App>
      )
      expect(mock).toHaveBeenCalledTimes(1)
      userEvent.type(getByLabelText('One'), '!')
      expect(getByLabelText('One')).toHaveValue('uno!')
      expect(mock).toHaveBeenCalledTimes(1)
      const change = mock.mock.calls[0][0].change
      act(() => change([{ one: 'ichi' }]))
      expect(mock).toHaveBeenCalledTimes(2)
      expect(getByLabelText('One')).toHaveValue('ichi')
    })

    test('props contains `rest`, subscription, & operators', () => {
      const mock = jest.fn(() => null)
      const value = [{ two: 'dos' }]
      const { rerender } = render(
        <App mutators={{ insert: () => 0, nonArrayMutator: () => 1 }}>
          <FieldArray key={0} name="array" render={mock} initialValue={value} />
        </App>
      )
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith({
        name: 'array',
        insert: expect.any(Function),
        change: expect.any(Function),
        value: value,
        length: 1,
      })
      rerender(
        <App mutators={{ insert: () => 0, nonArrayMutator: () => 1 }}>
          <FieldArray
            key={1}
            name="array"
            render={mock}
            subscription={{ dirty: true }}
            otherProp="hey"
          />
        </App>
      )
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenCalledWith({
        name: 'array',
        insert: expect.any(Function),
        change: expect.any(Function),
        dirty: false,
        otherProp: 'hey',
      })
    })

    test('does not return error arrays', () => {
      const mock = jest.fn(() => (
        <Field
          name="array[0].three"
          label="Three"
          processMeta={(p, m) => {
            p.error = m.error
          }}
        />
      ))
      const validate = () => {
        return [{ three: 'I am a field error ' }]
      }
      const { getByText } = render(
        <App>
          <FieldArray name="array" validate={validate} subscription={{ error: true }}>
            {mock}
          </FieldArray>
        </App>
      )
      expect(getByText('I am a field error')).toBeInTheDocument()
      expect(mock).toHaveBeenCalledWith({
        name: 'array',
        change: expect.any(Function),
        error: undefined,
      })
    })

    test('converts simple error to array', () => {
      const mock = jest.fn(() => <Field name="array[0].three" label="Three" />)
      const validate = () => 'I am an array error'
      render(
        <App>
          <FieldArray name="array" validate={validate} subscription={{ error: true }}>
            {mock}
          </FieldArray>
        </App>
      )
      expect(mock).toHaveBeenCalledWith({
        name: 'array',
        change: expect.any(Function),
        error: 'I am an array error',
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

  describe('<Form />', () => {
    test('renders a form with no subscriptions by default', () => {
      const renderCounter = jest.fn()
      const { getByLabelText, getByText } = render(
        <StyleProvider>
          <Form onSubmit={noop}>
            {renderCounter()}
            <Field name="change" label="Change Me" />
            <button type="submit">Submit</button>
          </Form>
        </StyleProvider>
      )

      const field = getByLabelText('Change Me')
      const submit = getByText('Submit')
      userEvent.type(field, 'Value Change')
      userEvent.click(submit)

      expect(renderCounter).toHaveBeenCalledTimes(1)
    })

    test('provides default reset behavior', () => {
      const { getByLabelText, getByText } = render(
        <StyleProvider>
          <Form onSubmit={noop}>
            <Field name="change" label="Change Me" />
            <button type="reset">Reset</button>
          </Form>
        </StyleProvider>
      )

      const field = getByLabelText('Change Me')
      const reset = getByText('Reset')
      userEvent.type(field, 'Value Change')
      userEvent.click(reset)

      expect(field).toHaveValue('')
    })
  })

  describe('<FormSpy />', () => {
    test('subscribes to everything by default', () => {
      const renderFn = jest.fn().mockImplementation(() => <div />)
      render(
        <App>
          <Field name="test" label="Test Field" />
          <FormSpy render={renderFn} />
        </App>
      )

      expect(renderFn).toHaveBeenCalledTimes(2)
      hasFormApi(renderFn.mock.calls[0][0])
      expect(renderFn.mock.calls[0][0].dirty).toBe(false)
      expect(renderFn.mock.calls[0][0].errors).toEqual({})
      expect(renderFn.mock.calls[0][0].invalid).toBe(false)
      expect(renderFn.mock.calls[0][0].pristine).toBe(true)
      expect(renderFn.mock.calls[0][0].submitFailed).toBe(false)
      expect(renderFn.mock.calls[0][0].submitSucceeded).toBe(false)
      expect(renderFn.mock.calls[0][0].submitting).toBe(false)
      expect(renderFn.mock.calls[0][0].valid).toBe(true)
      expect(renderFn.mock.calls[0][0].validating).toBe(false)
      expect(renderFn.mock.calls[0][0].values).toEqual({})
      hasFormApi(renderFn.mock.calls[1][0])
      expect(renderFn.mock.calls[1][0].dirty).toBe(false)
      expect(renderFn.mock.calls[1][0].errors).toEqual({})
      expect(renderFn.mock.calls[1][0].invalid).toBe(false)
      expect(renderFn.mock.calls[1][0].pristine).toBe(true)
      expect(renderFn.mock.calls[1][0].submitFailed).toBe(false)
      expect(renderFn.mock.calls[1][0].submitSucceeded).toBe(false)
      expect(renderFn.mock.calls[1][0].submitting).toBe(false)
      expect(renderFn.mock.calls[1][0].valid).toBe(true)
      expect(renderFn.mock.calls[1][0].validating).toBe(false)
      expect(renderFn.mock.calls[1][0].values).toEqual({})
    })

    test('can spy on specific state values', () => {
      const renderFn = jest.fn().mockImplementation(() => <div />)
      const { getByLabelText } = render(
        <App>
          <Field name="test" label="Test Field" />
          <FormSpy subscription={{ dirty: true, values: true }}>{renderFn}</FormSpy>
        </App>
      )

      expect(renderFn).toHaveBeenCalledTimes(2)
      hasFormApi(renderFn.mock.calls[0][0])
      expect(renderFn.mock.calls[0][0].dirty).toBe(false)
      expect(renderFn.mock.calls[0][0].errors).toBeUndefined()
      expect(renderFn.mock.calls[0][0].invalid).toBeUndefined()
      expect(renderFn.mock.calls[0][0].pristine).toBeUndefined()
      expect(renderFn.mock.calls[0][0].submitFailed).toBeUndefined()
      expect(renderFn.mock.calls[0][0].submitSucceeded).toBeUndefined()
      expect(renderFn.mock.calls[0][0].submitting).toBeUndefined()
      expect(renderFn.mock.calls[0][0].valid).toBeUndefined()
      expect(renderFn.mock.calls[0][0].validating).toBeUndefined()
      expect(renderFn.mock.calls[0][0].values).toEqual({})
      hasFormApi(renderFn.mock.calls[1][0])
      expect(renderFn.mock.calls[1][0].dirty).toBe(false)
      expect(renderFn.mock.calls[1][0].errors).toBeUndefined()
      expect(renderFn.mock.calls[1][0].invalid).toBeUndefined()
      expect(renderFn.mock.calls[1][0].pristine).toBeUndefined()
      expect(renderFn.mock.calls[1][0].submitFailed).toBeUndefined()
      expect(renderFn.mock.calls[1][0].submitSucceeded).toBeUndefined()
      expect(renderFn.mock.calls[1][0].submitting).toBeUndefined()
      expect(renderFn.mock.calls[1][0].valid).toBeUndefined()
      expect(renderFn.mock.calls[1][0].validating).toBeUndefined()
      expect(renderFn.mock.calls[1][0].values).toEqual({})

      userEvent.type(getByLabelText('Test Field'), 'S')

      expect(renderFn).toHaveBeenCalledTimes(4)
      hasFormApi(renderFn.mock.calls[3][0])
      expect(renderFn.mock.calls[3][0].dirty).toBe(true)
      expect(renderFn.mock.calls[3][0].errors).toBeUndefined()
      expect(renderFn.mock.calls[3][0].invalid).toBeUndefined()
      expect(renderFn.mock.calls[3][0].pristine).toBeUndefined()
      expect(renderFn.mock.calls[3][0].submitFailed).toBeUndefined()
      expect(renderFn.mock.calls[3][0].submitSucceeded).toBeUndefined()
      expect(renderFn.mock.calls[3][0].submitting).toBeUndefined()
      expect(renderFn.mock.calls[3][0].valid).toBeUndefined()
      expect(renderFn.mock.calls[3][0].validating).toBeUndefined()
      expect(renderFn.mock.calls[3][0].values).toEqual({ test: 'S' })
    })

    test('will unsubscribe on unmount', () => {
      const renderFn = jest.fn().mockImplementation(() => <div />)
      const Toggle: React.FC<any> = ({ children }) => {
        const [show, setShow] = React.useState<boolean>(true)
        return (
          <>
            <button type="button" onClick={() => setShow((s) => !s)}>
              toggle
            </button>
            {show && children}
          </>
        )
      }
      const { getByText } = render(
        <App>
          <Toggle>
            <FormSpy render={renderFn} />
          </Toggle>
        </App>
      )

      expect(renderFn).toHaveBeenCalledTimes(2)
      userEvent.click(getByText('toggle'))
      expect(renderFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('<SubmitButton />', () => {
    test('is disabled based on form state by default', () => {
      const { getByText, getByLabelText } = render(
        <App>
          <Field name="type" label="Type" />
          <SubmitButton />
        </App>
      )

      const btn = getByText('Submit').parentElement
      expect(btn).toBeDisabled()
      userEvent.type(getByLabelText('Type'), 'test')
      expect(btn).not.toBeDisabled()
    })

    test('uses custom mapping for state values', () => {
      const rf = jest.fn()
      rf.mockReturnValue(null)
      const processState = (props: any) => {
        props.disabled = false
        props.randomProp = 'supported'
        return props
      }
      render(
        <App>
          <SubmitButton processState={processState} render={rf}>
            Sub
          </SubmitButton>
        </App>
      )

      expect(rf).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: false,
          randomProp: 'supported',
        })
      )
    })

    test('uses modified original props object if processState returns undefined', () => {
      const rf = jest.fn()
      rf.mockReturnValue(null)
      const processState = (props: any) => {
        props.disabled = false
        props.randomProp = 'supported'
      }
      render(
        <App>
          <SubmitButton processState={processState} render={rf}>
            Sub
          </SubmitButton>
        </App>
      )

      expect(rf).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: false,
          randomProp: 'supported',
        })
      )
    })

    test('can override default subscription', () => {
      const processState = jest.fn()
      render(
        <App>
          <SubmitButton subscription={{ hasSubmitErrors: true }} processState={processState}>
            Submit Errors Only
          </SubmitButton>
        </App>
      )
      expect(processState).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'submit' }),
        expect.objectContaining({
          hasSubmitErrors: false,
        })
      )
    })
  })
})
