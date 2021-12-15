---
title: API Docs
order: 3
---

# Cactus Form API Documentation

For the most part you can just use [React Final Form](https://final-form.org/docs/react-final-form/getting-started)
as it's documented, substituting our `Field` component for theirs.
We also add two new components:

- `DependentField` is like a `Field`, but takes a set of field names and a callback to use when any of those fields changes.
- `FieldSpy` is analagous to [FormSpy](https://final-form.org/docs/react-final-form/api/FormSpy), but for a single field.

## Field

Takes the same arguments, with the same meaning as [React Final Form's version](https://final-form.org/docs/react-final-form/api/Field).
Like the original, it "consumes" all the props related to field configuration and forwards all other props to its component/render func.
In particular, note that these forwarded props can override the input props,
like `onChange` or `onBlur`, which will interfere with how `final-form` works;
if you pass overrides, make sure you know how to register the changes you want with the form API.
It also has two additional props:

- `getFieldComponent` should be a function that accepts the props object and returns a valid component: either a string e.g. "input" or a functional or class component. It's only called if no render function or `component` prop is given, and is called _before_ the base Field, so it doesn't have access to any `final-form` data.
- `processMeta` is a function that takes two arguments: the props (including the `input` props from [the base Field](https://final-form.org/docs/react-final-form/types/FieldRenderProps) merged with the forwarded props), and the `meta` object from the base Field. It should return a single object containing the final version of the props to be passed to the component/render func.
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

To use `required` without the validator you'd need to pass an explicit `validate` function, like a noop (or use `configureDefaults`/`withDefaults` to set a default validator).

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
const spyOn = { value: true }
const MyForm = (props) => (
  <Form {...props}>
    <Field name="power" type="number" />
    <FieldSpy fieldName="power" subscription={spyOn}>
      {({ value }) => (
        <span>You have selected a power level of {value}.</span>
      )}
    </FieldSpy>
  </Form>
)
```
