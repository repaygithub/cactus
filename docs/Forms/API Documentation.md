---
title: API Docs
order: 3
---

# Cactus Form API Documentation

For the most part you can just use [React Final Form](https://final-form.org/docs/react-final-form/getting-started)
as it's documented, substituting our `Field` component for theirs.
This library re-exports everything from `final-form` and `react-final-form` except for the components that we override.
We also add two new components, as well as a basic `Form` wrapper and our own version of React Final Form's `FormSpy`:

- `DependentField` is like a `Field`, but takes a set of field names and a callback to use when any of those fields changes.
- `FieldSpy` is analagous to [FormSpy](https://final-form.org/docs/react-final-form/api/FormSpy), but for a single field.
- `FormSpy` works the same way that React Final Form's `FormSpy` works, except that it includes a fix for a bug where the initial state was incorrect.
- `Form` is a wrapper around React Final Form's `Form` component that sets an empty subscription by default, and sets the `onReset` handler on the `form` for you.

## Field

Takes the same arguments, with the same meaning as [React Final Form's version](https://final-form.org/docs/react-final-form/api/Field).
Like the original, it "consumes" all the props related to field configuration and forwards all other props to its component/render func.
In particular, note that these forwarded props can override the input props,
like `onChange` or `onBlur`, which will interfere with how `final-form` works;
if you pass overrides, make sure you know how to register the changes you want with the form API.
It also has two additional props:

- `getFieldComponent` should be a function that accepts the props object and returns a valid component: either a string e.g. "input" or a functional or class component. It's only called if no render function or `component` prop is given, and is called _before_ the base Field, so it doesn't have access to any `final-form` data.
- `processMeta` is a function that takes two arguments: the props (including the `input` props from [the base Field](https://final-form.org/docs/react-final-form/types/FieldRenderProps) merged with the forwarded props), and the `meta` object from the base Field. It should either return a single object containing the final version of the props to be passed to the component/render func, or it should modify the props argument that is passed in to the function and return nothing. If nothing is returned from `processMeta`, the component/render func will be called with the same props object that was updated in the function.
  - Note that although it's not named as such `processMeta` does follow the rules of hooks, so you can use hooks in whatever function you pass here.
  - One possibility is to use `React.useContext(I18nContext)` from `@repay/cactus-i18n` to implement translated labels/error messages for your fields.
- It also accepts an `as` prop as an alias of `component`, to fit in better with all the [styled-components](https://styled-components.com/) we use in Cactus Web.

The biggest difference in the output is that all render methods receive the same props.
React Final Form's `Field` passes `input` and `meta` to a render func or component,
but if the `component` is a string it just merges the `input` directly into the props and drops `meta`.
Since we allow customizing how the props are merged using `processMeta`,
we just always merge the props into a single object and pass that to the component/render func
regardless of whether the component is an HTML element (string) or custom component.

### Configuration

Perhaps the most important difference to React Final Form's `Field` is the configuration of
defaults for certain props, under the assumption that most fields in a project will work similarly.
The configuration looks like this in Typescript:

```
// You can actually use any props accepted by `Field`, but these are the most useful to configure.
interface FieldProps {
  getFieldComponent?: (props: Record<string, any>) => React.ElementType;
  // `FieldMetaState` is from React Final Form, ref `FieldRenderProps`.
  processMeta?: (props: Record<string, any>, meta: FieldMetaState) => Record<string, any>;
  // `FieldSubscription` is from Final Form, ref `registerField`.
  subscription?: FieldSubscription;
}

// Sets new config options, and returns the old config.
Field.configureDefaults = (defaults: FieldProps) => FieldProps

// Creates a new component with the given defaults.
Field.withDefaults = (defaults: FieldProps) => FunctionalComponent<FieldProps>

// Returns the original config, as defined in the Cactus Form library.
Field.initialDefaults = () => FieldProps
```

The `initialDefaults` is mostly provided so it can be extended without having to rewrite it entirely, and returns something like the following:

```
Field.initialDefaults = () => ({
  subscription: {
    value: true,
    error: true,
    touched: true,
    submitError: true,
    modifiedSinceLastSubmit: true,
  },

  // Note the commonalities between the subscription and what's used here.
  processMeta: (props, meta) => {
    const error = (meta.touched && meta.error) || (!meta.modifiedSinceLastSubmit && meta.submitError)
    if (error && !props.error) {
      props.error = error
    }
    return props
  },

  getFieldComponent: (props) => {
    switch (props.type) {
      // Omitted for brevity: maps to Cactus Web, e.g. "date" -> DateInputField
      default:
        return TextInputField
    }
  },
})
```

Both `configureDefaults` and `withDefaults` work by setting the `defaultProps`
property on the function they're attached to.
The main difference is scope: `configureDefaults` applies to the `Field` component itself,
and thus applies to the entire project (including uses of `DependentField`);
`withDefaults` makes a new component that can be used on a single form or type of form,
if it's somewhat different than how forms normally behave on the site.

```
const FieldWithAlwaysVisibleErrors = Field.withDefaults({
  subscription: { value: true, error: true },
  processMeta: (props, { error }) => ({ error, ...props }),
})
```

### Validation

One other default behavior that differs from the base Field is that if a `required` prop is passed,
but there is no `validate` function, one will automatically be set.
It basically checks that the value is not falsy or an empty array, though literal `0` and `false` are both allowed.
This validator is also available separately:

```
import { validateRequired } from '@repay/cactus-form'
```

You can also define custom required error messages with the `requiredMsg` prop. Both strings and React nodes are acceptable:

```
<Field required requiredMsg="Required Field" {...fieldProps} />
```

```
<Field required requiredMsg={<div>Required Field</div>} {...fieldProps} />
```

To use `required` without the validator you'd need to pass an explicit `validate` function, like a noop (or use `configureDefaults`/`withDefaults` to set a default validator or default `requiredMsg`).

### Refs & Extensions

The `Field` component is explicitly defined as a functional component so it's relatively easy to extend.
That does mean, however, that you can't pass a `ref` prop to forward to the field.
There are several ways around this, but probably the easiest two are a render func and a wrapper:

```
const withRenderFunc = (
  <Field {...propsWithoutRef}>
    {(props) => (
      <MyField {...props} ref={myRef} />
    })
  </Field>
)
// Note that you can just call `Field` as a normal function,
// which is more efficient than creating another level of the component tree.
const FieldWithRef = React.forwardRef((props, ref) => Field({ ...props, ref }))
```

## DependentField

`DependentField` is actually an extenstion of `Field` as described in the last section.
It creates a normal `Field`, then uses Final Form's `registerField` API to subscribe
to changes to the dependency fields.
The extra props look like this:

```
interface DependentFieldProps extends FieldProps {
  dependsOn: string | string[] | Record<string, DependencyConfig>;
  onDependencyChange?: (state: FieldState, props: FieldProps) => void
}

interface DependencyConfig {
  // The basic field subscription format, e.g. `value: true`
  [K in keyof FieldSubscription]?: boolean
  onChange?: (state: FieldState, props: FieldProps) => void
}
```

It's important to note that `dependsOn` is used in a `useEffect` hook to create the field subscriptions,
so to prevent unnecessary subscription turnover you should either use a constant or something like `useMemo`;
that caveat does _not_ apply to `onDependencyChange`, however.

If you pass the dependencies as a string or an array of field names, they will only subscribe
to `value` changes and will all use the same change handler;
you can still tell which field changed (for arrays) by looking at `state.name`.
The second dependency format allows more flexibility in the subscription and change handling.

The first argument to the change handler is the state of the field being watched;
it's the same as the state passed to the callback for `registerField`.
The second argument is the merged props of the `DependentField`; chances are the only
one you'll need is `onChange`, which you can use to update the DependentField's
value as the dependencies change.

```
const MyForm = (props) => (
  <Form {...props}>
    <Field name="power" type="number" />
    <DependentField name="reaction" dependsOn="power" onDependencyChange={
      (state, { onChange }) => {
        onChange(state.value > 9000 ? 'unbelievable' : 'still good')
      }
    } />
  </Form>
)
```

`DependentField` also has the `configureDefaults` and `withDefaults` functions that `Field` has.

## FieldSpy

Basically the same as [FormSpy](https://final-form.org/docs/react-final-form/api/FormSpy),
except for a single field. It also doesn't support the `onChange` prop that FormSpy has.
You indicate which field to watch with the `fieldName` prop:

```
const MyForm = (props) => (
  <Form {...props}>
    <Field name="power" type="number" />
    <FieldSpy fieldName="power" subscription={{ value: true }}>
      {({ value }) => (
        <span>You have selected a power level of {value}.</span>
      )}
    </FieldSpy>
  </Form>
)
```

## FormSpy

A re-implementation of [FormSpy](https://final-form.org/docs/react-final-form/api/FormSpy), but with a
fix for a bug that sometimes caused incorrect initial values on the first render. Allows you to spy on
form state values and re-render a section of your form with updated values when the values you spy on change.
Our `FormSpy` supports all of the same props that Final Form's implementation does, apart from the `onChange` prop,
which is not supported in this implementation.

```
const MyForm = (props) => (
  <Form {...props}>
    <Field name="power" type="number" />
    <FormSpy subscription={{ dirty: true }}>
      {({ dirty }) => (
        <span>Dirty value: {dirty}</span>
      )}
    </FormSpy>
  </Form>
)
```

OR

```
const MyForm = (props) => (
  <Form {...props}>
    <Field name="power" type="number" />
    <FormSpy
      subscription={{ dirty: true }}
      render={({ dirty }) => <span>Dirty value: {dirty}</span>}
    />
  </Form>
)
```

OR

```
const RenderOnDirtyChange = ({ dirty }) => <span>Dirty value: {dirty}</span>
const MyForm = (props) => (
  <Form {...props}>
    <FormSpy subscription={{ dirty: true }} component={RenderOnDirtyChange} />
  </Form>
)
```

## FieldArray

A specialized Field for dealing with arrays of objects.
It differs from the regular Field in a few important ways:

- If subscribed to `value`, a render will only be triggered when the array itself changes, not when any nested field changes. This is controlled by the [isEqual](https://final-form.org/docs/final-form/types/FieldConfig#isequal) config function, so passing something like `isEqual={Object.is}` would result in re-renders on all nested value changes.
- If subscribed to `value`, the value passed to the render func/component will always be an array, even if the real value in the form state is undefined.
- The array mutators from [Final Form Arrays](https://final-form.org/docs/final-form-arrays/api) will be bound to the field (i.e. the field's name will be curried) and passed to the render func/component, if they are present on the Form.
- A `validate` function that returns anything other than an array, will be converted to an array with the original error attached to the [Final Form array error](https://final-form.org/docs/final-form/api#array_error) property.
  - Note that a bug/shortcoming of Final Form's error processing causes this to overwrite validation errors from individual fields. We recommend using _either_ a FieldArray validator, _or_ nested field validators, not both.

Beyond that it takes a subscription (default includes `value` and `length`) and field config props, as accepted by the
[registerField](https://final-form.org/docs/final-form/types/FormApi#registerfield) function.
FieldArray also takes a `processState` function similar to Field's `processMeta`.
The first argument is the `...rest` props after all config-related props have been removed.
The second argument is the field state returned by the `registerField` subscriber.
The third argument contains functions bound to the field name: `form.change`, and any array mutators present on the form.
The default `processState` is just `Object.assign`, which consolidates all three arguments to a single object.

```
<Form mutators={arrayMutators}>
  <FieldArray name="rules">
    {({ name, map }) => map((value, index) => (
      <div key={index}>
        <h3>{value.ruleDescription}</h3>
        <Field name={`${name}[${index}].predicate`} />
        <Field name={`${name}[${index}].action`} />
      </div>
    ))}
  </FieldArray>
</Form>
```

### Value Comparison & Keys

When Final Form changes a value, it makes shallow copies of all parent objects,
from the value that changed all the way up to the root. This means that with any
simple comparison, every time a nested value is changed in the array, the array
itself is copied and the entire array would be re-rendered. With a complex form
this could be a major performance impact, but the copying behavior means there's
there's no easy way to keep track of which changes require a full re-render,
and which only require re-rendering the single field that changed.

The default solution used by `FieldArray` is to attach a key to each item in the array:
by tracking and comparing keys, we can see if items have been added or moved in the array
and differentiate from other changes. The default `isEqual` comparator uses two
supplemental functions, `setKey` and `getKey` to manage keys.

- `setKey` is called on every item on every value change, so it should be idempotent and fast;
  the included implementation looks for an `id` property and sets one if it doesn't exist.
- `getKey` is called by the comparator: if two objects have equal keys, they are considered equal.
  The included implementation returns the `id` property if there is one, else the object itself is the key.
- If your objects have a good natural key, you should override `setKey` and `getKey`,
  e.g. `setKey={null}` & `getKey={(x) => x.naturalKey}`.
- Or you can pass a custom `isEqual` function, in which case `getKey` and `setKey` will be ignored.

Because it has to actually attach the keys to the objects, that may be something
that will have to be cleaned up in an `onSubmit` handler.

## Form

A wrapper around [Form](https://final-form.org/docs/react-final-form/api/Form) that includes an empty subscription
by default. It will also include a basic render function and form reset function if neither `component` or `render`
props are provided. Because the subscription is empty by default, we recommend that you use spies (`FormSpy`, `FieldSpy`)
to hook into form state changes.

```
<Form>
  <Field name="power" type="number" />
  <button type="reset">
    Reset handler included in 'Form'
  </button>
</Form>
```

## SubmitButton

`SubmitButton` is essentially a `FormSpy` that renders a `Button` with `type="submit"`. By default, it's subscribed
to `hasValidationErrors`, `submitting`, and `pristine`, and it will set the `disabled` and `loading` props for you based
on those state values. You can override the default subscription if necessary, and `SubmitButton` supports an extra prop
called `processState`, which functions similarly to `processMeta` on the `Field` component, so you have full control over
the subscription and how it affects the output. Most of the time, though, the default subscription and `processState` behavior
should be all that you need:

```
<Form>
  <SubmitButton />
</Form>
```

Or, if you need to change the label:

```
<Form>
  <SubmitButton>Submit Me!</SubmitButton>
</Form>
```

If you need more control for your use-case, though, you can still set the behavior based on your specific needs using
the `subscription` and the `processState` function.

### processState

`processState` accepts two arguments: the `props` object that will ultimately be passed to the `Button`, and the
[form state](https://final-form.org/docs/final-form/types/FormState) values that you're subscribed to. You can then use those
state values to drive the props that get passed to the `Button`. You can either return a new props object from `processState`,
or if you don't return anything, it will just use the updated props object that was passed to the function.

For example:

```
const processState = (props, state) => {
  props.disabled = !state.dirtySinceLastSubmit
}
<Form>
  <SubmitButton subscription={{ dirtySinceLastSubmit: true }} processState={processState} />
</Form>
```
