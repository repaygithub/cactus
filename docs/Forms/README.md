---
title: Cactus Form
order: 10
---

# Forms

The Cactus Form library wraps [final-form](https://final-form.org) and `react-final-form`
to provide functionality commonly used in our designs, and fix a couple of "bugs"
that don't really appear in normal usage but do appear in the way our designs work.
We use `final-form` because it has a good feature set and flexibility,
while being more efficient when working on large forms than other options.

## Quick Links

- <a to='./api-documentation/'>API Documentation</a>
- [Source Code](../../modules/cactus-form/)
- [final-form](https://final-form.org)
- [react-final-form](https://final-form.org/react)

## Getting Started

Both `final-form` and `react-final-form`, as well as `@repay/cactus-web` are peer dependencies of Cactus Form.
There's also an optional step to make React Final Form a little more cactus-friendly;
see the "Patching React Final Form" section below.

Once everything is installed, Cactus Form is used basically the same way as React Final Form.
In particular, the `Field` component is very similar to
[React Final Form's version](https://final-form.org/docs/react-final-form/api/Field),
but it has customization features and handles prop forwarding a bit differently:

- You can set a default `subscription` under the assumption that most fields in your project will work similarly. The included default includes the `value` and error fields.
- You can provide a function to derive a component from the props. This is included to help with dynamic forms, where field types may be stored as strings in a configuration data structure; using this method, you can pass your configuration directly to the field, and map it to a concrete component class/function. The included default mostly maps the `type` prop to field components from Cactus Web.
- It adds a post-processing callback for customizing how [the render props](https://final-form.org/docs/react-final-form/types/FieldRenderProps) are combined. The included default adds an `error` prop if the field has been touched or the form submitted.
- Each of these can be configured project-wide, or overridden on a per-render basis.

More info on those, along with the two new components `FieldSpy` and `DependentField`,
is in the <a to='./api-documentation/'>API documentation</a>. Specific examples on how to use these components with along with Cactus Web is in the <a to='/how-tos/forms/'>how-to guide</a>.

### Patching React Final Form

Cactus Form should work fine out of the box, but there are a couple of issues
with certain Cactus components and common design patterns:

- React Final Form doesn't work with CheckBoxGroup/CheckBoxCard.Group & array values (i.e. multiple checkboxes with the same name); you have to wrap each checkbox individually, and pass `type="checkbox"` on each one.
- With both checkbox groups and radio groups, React Final Form emits a warning that you need to pass `type="checkbox"` (or "radio"), but if you actually do so it will give the wrong checked/value props to the group component.
- We often put fields into Accordions that can be re-ordered, e.g. when there's a repeatable subset of fields on the form. However, Accordion only renders its child fields when it's open, and the mutators in `final-form-arrays` are not compatible with `react-final-form` unless the source and destination fields being reordered are both rendered on the page.

To work around these issues, we provide a patch that can be applied using [patch-package](https://www.npmjs.com/package/patch-package).
Because this is a library we can't just apply the patch automatically, so it takes a couple of extra steps:

1. Make sure you have `patch-package` in `devDependencies` or `dependencies`.
2. Add the following to your `package.json`:

```
"scripts": {
  "postinstall": "patch-package --patch-dir=node_modules/@repay/cactus-form/dist"
}
```

Or, if you already use `patch-package` in your project, you may need to run it twice:

```
"scripts": {
  "postinstall": "patch-package && patch-package --patch-dir=node_modules/@repay/cactus-form/dist"
}
```
