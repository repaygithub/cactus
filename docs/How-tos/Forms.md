# How to Write Cactus Forms Using Final Form

Collecting data using forms is one of the most basic functions of a website. <a to='/components/'>@repay/cactus-web</a> provides several styled form inputs, as well as a few custom inputs that emulate built-in HTML inputs. This guide will show you the basics of combining these input components with a common forms library, [Final Form](https://final-form.org/).

Because Final Form is framework-agnostic, there's [another library](https://final-form.org/react) for the React-specific parts. Besides the official React Final Form library, we have our own addition in <a to='/forms/'>@repay/cactus-form</a> that's more specifically suited to working with Cactus Web.

Before starting, you should have an application, and know how to add a page or component. The examples used will be based on an app like those created by the [@repay/create-ui](https://github.com/repaygithub/ui-tools/tree/master/modules/create-repay-ui) package; see <a to='/tutorials/responsive-web-design/'>this tutorial</a> for an example with starting a new project.

### Installation

Installation is simple enough, just add the latest version of "final-form", "react-final-form", and "@repay/cactus-form" to the `dependencies` list in your package.json (or however you add dependencies in your particular project).

Cactus Form also has an optional setup step using [patch-package](https://www.npmjs.com/package/patch-package), described in more depth in the library documentation.

## Using React Final Form

The basic Final Form library is very flexible, and we highly recommend going through the docs to understand what it's capable of. However, the majority of use cases can be covered by the components in React Final Form and Cactus Form.

To make a form you start with the [Form](https://final-form.org/docs/react-final-form/api/Form) component,
which creates both a form and a React context that allows you to access it from any descendants.
Once the form is created, there are a variety of hooks and components that can be used to implement the functionality.
We won't be getting into all the arguments and subtleties since those are well-covered in the documentation,
just covering enough to show how it works with Cactus components.

Creating a form is simple:

```jsx
import { Field } from '@repay/cactus-form'
import { Button } from '@repay/cactus-web'
import { Form } from 'react-final-form'
import React from 'react'

const TestForm = (props) => (
  <Form {...props}>
    {({ handleSubmit, invalid, error }) => (
      <form onSubmit={handleSubmit}>
        {error && (<Alert status="error">{error}</Alert>)}
        <Field id="text-input" name="mytext" label="Enter some text" />
        <Field type="checkbox" name="mycb" label="Check me (or don't)" />
        <Button type="submit" disabled={invalid}>Save</Button>
      </form>
    )}
  </Form>
)
```

The Cactus Form version of `Field` automatically maps `type` to Cactus Web components:
the example above will render a `TextInputField` and a `CheckBoxField`,
but this behavior is customizable in a number of ways, covered more in the docs.
Field also automatically adds `value`, `checked`, `onChange`, and `onBlur` props to the field.

If the default components don't quite do what you need, you can fall back to
hooks that give you greater control over how to interact with Final Form.
In particular, `useForm` gives you access to the basic Final Form API with significant customization options.

```
import { useField, useForm } from 'react-final-form'

const CustomField = (props) => {
  const { input, meta } = useField(props.name, props)
  if (meta.error) {
    return <Alert status="error">All is lost, no hope of recovery.</Alert>
  }
  return <FieldLike {...props} {...input} touched={meta.touched} />
}

const SuperCustomField = (props) => {
  const form = useForm()
  const [state, setState] = React.useState()
  React.useEffect(() => {
    const listener = (state) => {
      props.doSomeCustomLogic(state)
      form.mutators.updateSomeOtherFormState(state.value)
      setState(state)
    }
    return form.registerField(props.name, listener, props.subscription, props)
  }, [props.name])
  if (!state) return null
  return <FieldLike {...state} />
}
```

## Final Form & Cactus

Cactus has two basic kinds of field components: regular HTML inputs that have simply been styled using `@repay/cactus-theme`, and custom components that mimic regular HTML inputs. These are the styled inputs and their default mapping in Cactus Form:

- `CheckBox`/`CheckBoxField` (type="checkbox")
- `CheckBoxCard`
- `RadioButton`/`RadioButtonField` (type="radio")
- `RadioCard`
- `TextArea`/`TextAreaField`
- `TextInput`/`TextInputField` (default/type="text")
- `Toggle`/`ToggleField` (type="boolean")

And these are the custom components:

- `ColorPicker`
- `DateInput`/`DateInputField` (type="date"/"time"/"datetime")
- `FileInput`/`FileInputField` (type="file")
- `RadioGroup`/`RadioCard.Group`
- `Select`/`SelectField` (type="select"/"multiSelect")

`CheckBoxGroup`/`CheckBoxCard.Group` is a special case, since it's not a single field, but we'll cover it separately.

### Field Examples

Almost all of our components work out-of-the-box with the Cactus Form `Field` component.
You can either rely on the default mapping, configure your own, or explicitly pass the field you want to use;
just replace where you'd normally call the Cactus field component with Field,
and props are forwarded to the underlying component, including children.

```jsx
import { Field } from '@repay/cactus-form'

<Field as={RadioCard.Group} name="radios" label="Some radio buttons">
  <RadioCard value="ham">Ham Radio</RadioCard>
  <RadioCard value="transistor">Transistor Radio</RadioCard>
</Field>
<Field
  type="select"
  multiple
  name="selection"
  label="Select Something(s)"
  options={['option1', 'variant2', 'type3']}
/>
```

The basic React Final Form `Field` component does not directly support custom components:
they have to be explicitly rendered, which is why we recommend Cactus Form.

```jsx
import { Field as CactusField } from '@repay/cactus-form'
import { Field } from 'react-final-form'

<Field name="myfield" subscription={{ value: true, error: true }}>
  {({ input, meta }) => (
    <TextInputField {...input} error={meta.error} label="My Field" />
  )}
</Field>
// which is roughly the same as
<CactusField name="myfield" label="My Field" type="text" />
```

### Radio Buttons, Checkboxes & Toggles

React Final Form has some special behavior around radio buttons and checkboxes
that needs to be mentioned, due to the addition of the `checked` prop.
While radio groups work out-of-the-box, a single radio button or checkbox needs a slight adjustment:

```jsx
<Field as={RadioButtonField} type="radio" {...rest} />
<Field as={CheckBoxField} type="checkbox" {...rest} />
<Field as={ToggleField} type="checkbox" {...rest} />
```

Even if you explicitly tell it which component to use, you _also_ must pass the `type` prop
to tell final form that `checked` is needed, and how to calculate it.
The corollary is that you should _never_ pass the `type` prop to a radio or checkbox _group_,
because those work using the `value` prop like a generic input instead of `checked`.

### Checkbox Groups

Checkbox groups are the trickiest field types, because they can be used in two different ways:

```jsx
// Creates form values like -> { cbgroup: ["one", "three"] }
<Field as={CheckBoxGroup} name="cbgroup" label="Array Of Strings">
  <CheckBoxGroup.Item value="one" label="Uno" />
  <CheckBoxGroup.Item value="two" label="Dos" />
  <CheckBoxGroup.Item value="three" label="Tres" />
</Field>

// Creates form values like -> { uno: true, dos: false, tres: true }
<CheckBoxCard.Group label="Several Unrelated Booleans">
  <Field as={CheckBoxCard} type="checkbox" name="uno">One</Field>
  <Field as={CheckBoxCard} type="checkbox" name="dos">Two</Field>
  <Field as={CheckBoxCard} type="checkbox" name="tres">Three</Field>
</CheckBoxCard.Group>
```

Note that you need as many Field components as there are unique names.

The array group variant will only work if you do the optional patch-package step
when installing `@repay/cactus-form`.
However, even if you don't use the patch you can still support checkbox arrays with more verbose code:

```jsx
// CheckBoxGroup forwards `name` to all its children, so you don't have to repeat it.
<CheckBoxGroup name="cbgroup" label="Array Of Strings">
  <Field as={CheckBoxGroup.Item} type="checkbox" value="one" label="Uno" />
  <Field as={CheckBoxGroup.Item} type="checkbox" value="two" label="Dos" />
  <Field as={CheckBoxGroup.Item} type="checkbox" value="three" label="Tres" />
</CheckBoxGroup>
```

### Further Reading

- [Final Form Documentation](https://final-form.org/docs/final-form/getting-started)
- [React Final Form Documentation](https://final-form.org/docs/react-final-form/getting-started)
- <a to='/components/'>@repay/cactus-web Documentation</a>
- <a to='/forms/'>@repay/cactus-form Documentation</a>
- [Example app w/ form (UI Config page)](https://github.com/repaygithub/cactus/tree/master/examples/mock-ebpp)
