# How to Write Cactus Forms Using Formik

Collecting data using forms is one of the most basic functions of a website. <a to='/components/'>@repay/cactus-web</a> provides several styled form inputs, as well as a few custom inputs that emulate built-in HTML inputs. This guide will show you the basics of combining these input components with a common forms library, [Formik](https://formik.org/).

Before starting, you should have an application, and know how to add a page or component. The examples used will be based on an app like those created by the [@repay/create-ui](https://github.com/repaygithub/ui-tools/tree/master/modules/create-repay-ui) package; see <a to='/tutorials/responsive-web-design/'>this tutorial</a> for an example with starting a new project.

### Installation

Installation is simple enough, just add the latest verstion of "formik" to the `dependencies` list in your package.json (or however you add dependencies in your particular project).

## Using Formik

There are two basic ways of using Formik: with components, and with hooks. We won't be getting into all the arguments and subtleties since those are well-covered in the Formik documentation, just covering enough to show how it works with `@repay/cactus-web` components.

Creating a form is simple by either method:

```jsx
import { Formik, useFormik }
import React from 'react'

import { TextInputField } from '@repay/cactus-web'

const TestFormComponent = (props) => (
  <Formik {...props}>
    {({ handleSubmit, handleChange, values, touched, errors }) => (
      <form onSubmit={handleSubmit}>
        <TextInputField
          id="text-input"
          name="mytext"
          value={values.mytext}
          label="Enter some text"
          error={touched.mytext && errors.mytext}
          onChange={handleChange}
        />
      </form>
    )}
  </Formik>
)

const TestFormHook = (props) => {
  const { handleSubmit, handleChange, values, touched, errors } = useFormik(props)
  return (
    <form onSubmit={handleSubmit}>
      <TextInputField
        name="mytext"
        value={values.mytext}
        label="Enter some text"
        error={touched.mytext && errors.mytext}
        onChange={handleChange}
      />
    </form>
  )
}
```

The main difference between the two is depth: `useFormik` does everything locally, while the `Formik` component (which in fact utilizes the hook internally) creates a React context which allows access to the formik helpers within sub-components via the `useFormikContext` hook (or `FormikConsumer` component).

Finally, there are two other helper components we'll be using within a Formik context:

- `Form` creates a `<form>` element and automatically adds the `handleSubmit` and `handleReset` event handlers.
- `Field` creates an element and automatically adds the `name`, `value`, `handleChange`, and `handleBlur` props.

## Formik & Cactus

Cactus has two basic kinds of field components: regular HTML inputs that have simply been styled using `@repay/cactus-theme`, and custom components that mimic regular HTML inputs. The former can be used pretty much like any other input with Formik (and there are plenty of examples in their docs):

- `CheckBox`/`CheckBoxField`
- `RadioButton`/`RadioButtonField`
- `TextArea`/`TextAreaField`
- `TextInput`/`TextInputField`
- `Toggle`/`ToggleField`

The custom components are these:

- `ColorPicker`
- `DateInput`/`DateInputField`
- `FileInput`/`FileInputField`
- `RadioGroup`
- `Select`/`SelectField`

`CheckBoxGroup` isn't really a field, though it behaves a bit like one so we'll cover it as well.

### Field Examples

For the rest of these examples, I'll be omitting the form boilerplate for brevity; assume a similar basic Formik setup like the following (we'll mostly be referencing the `formik` variable in the examples):

```jsx
import { Field, Form, Formik }
import React from 'react'

import { Button, [example component] } from '@repay/cactus-web'

const logValues = (values) => console.log(values)

const TestForm = (props) => (
  <Formik onSubmit={logValues} initialValues={{}} {...props}>
    {(formik) => (
      <Form>
        [example components]
        <Button type="submit>Submit</Button>
      </Form>
    )}
  </Formik>
)
```

#### TextAreaField, TextInputField

These are as basic as it gets; you can use them directly, or through the `Field` helper component.

```jsx
<TextAreaField
  name="largeText"
  label="Lots of Text"
  onChange={formik.handleChange}
  value={formik.values.largeText}
  error={formik.errors.largeText}
/>
<Field
  as={TextInputField}
  name="smallText"
  label="One line"
  error={formik.errors.smallText}
/>
```

#### CheckBoxField, RadioButtonField, ToggleField

These three are similar to the other basic fields, but there's an important difference: their value is determined by the `checked` prop, not the `value` prop.
In order for Formik to set the values appropriately when using `Field`, you must set the `type` prop so it knows how to set the `checked` prop.

```jsx
<Field
  as={CheckBoxField}
  type="checkbox"
  name="ready"
  label="Are you Ready?"
/>
<Field
  as={ToggleField}
  type="checkbox"
  name="set"
  label="Are you Set?"
/>
<RadioButtonField
  name="yesOrNo"
  value="yes"
  label="Yes!"
  checked={formik.values.yesOrNo === 'yes'}
  onChange={formik.handleChange}
/>
<Field
  as={RadioButtonField}
  type="radio"
  name="yesOrNo"
  value="no"
  label="No!!"
/>
```

With checkboxes (including Toggle) you can provide a non-boolean value (similar to how radio buttons work, but in a "choose one or more" kind of use case). In that case, Formik sets the value as a list and the `checked` prop based on whether or not the value is in the list. **Note:** on some browsers, at least, checkboxes have a default value; thus, it's recommended you _not_ use the basic `formik.handleChange` function because it will incorrectly turn the checkbox value into a list. Either use the `Field` helper, which handles the default value correctly, or write a custom change handler using `formik.setFieldValue`.

#### CheckBoxGroup

Since CheckBoxGroup isn't really a field, the `Field` helper doesn't work well with it. It _can_ be used to wrap the individual checkboxes, especially if they all have different names and/or boolean values. However, if **all** the checkboxes have non-boolean values, you only need to pass the change/blur handlers at the top level (even if they have different names).

```jsx
<CheckBoxGroup
  name="zeroOrMore"
  label="Choose Zero or More"
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
>
  <CheckBoxGroup.Item
    name="zeroOrMore"
    label="Zero"
    value="zero"
    checked={formik.values.zeroOrMore?.includes?.('zero')}
  />
  {/* In real code you probably shouldn't mix these methods. */}
  <Field
    as={CheckBoxGroup.Item}
    type="checkbox"
    name="conjunction"
    label="OR"
  />
  <CheckBoxGroup.Item
    name="zeroOrMore"
    label="More"
    value="more"
    checked={formik.values.zeroOrMore?.includes?.('more')}
  />
</CheckBoxGroup>
```

If all the child checkboxes have different names _and_ boolean values, you can take a different shortcut to set the `checked` prop:

```jsx
<CheckBoxGroup
  name="shortcuts"
  label="Shortcuts"
  onChange={(e) => formik.setFieldValue(e.target.name, e.target.checked)}
  checked={formik.values}
>
  <CheckBoxGroup.Item name="one" label="One" />
  <CheckBoxGroup.Item name="two" label="Two" />
</CheckBoxGroup>
```

#### ColorPicker, DateInputField, FileInputField, RadioGroup, SelectField

These fields are all custom components rather than styled HTML elements, but their `onChange`/`value` props are designed to work with Formik as if they were regular text inputs. The important thing is to _not_ set the `type` prop: with no type prop, Formik will just take `event.target.value` from the change event, and pass it as-is to the component's `value` prop.

```jsx
{/* Note that AccessibleField forwards `name` to its child. */}
<AccessibleField
  name="surprise"
  label="Color Me Surprised"
  error={formik.errors.surprise}
>
  <Field as={ColorPicker} />
</AccessibleField>
<DateInputField
  name="when"
  label="When was it?"
  onChange={formik.handleChange}
  value={formik.values.when}
  error={formik.errors.when}
/>
<Field
  as={FileInputField}
  name="theFiles"
  label="Add the Files"
  error={formik.errors.theFiles}
/>
<SelectField
  name="chooseOne"
  label="Choose One"
  options={['chosen', 'value', 'options']}
  onChange={formik.handleChange}
  value={formik.values.chooseOne}
/>
<Field
  as={RadioGroup}
  name="chooseOneAgain"
  label="Choose Another One"
  error={formik.errors.chooseOneAgain}
>
  <RadioGroup.Button label="English" value="English" />
  <RadioGroup.Button label="French" value="French" />
  <RadioGroup.Button label="German" value="German" />
</Field>
```

### Further Reading

- [Formik Documentation](https://formik.org/docs/tutorial)
- <a to='/components/'>@repay/cactus-web Documentation</a>
- [Example app w/ form (UI Config page)](https://github.com/repaygithub/cactus/tree/master/examples/mock-ebpp)
