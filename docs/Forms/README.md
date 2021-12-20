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
Once those are installed, Cactus Form is used basically the same way as React Final Form.
In particular, the `Field` component is very similar to
[React Final Form's version](https://final-form.org/docs/react-final-form/api/Field),
but it has customization features and handles prop forwarding a bit differently:

- You can set a default `subscription` under the assumption that most fields in your project will work similarly. The included default includes the `value` and error fields.
- You can provide a function to derive a component from the props. This is included to help with dynamic forms, where field types may be stored as strings in a configuration data structure; using this method, you can pass your configuration directly to the field, and map it to a concrete component class/function. The included default mostly maps the `type` prop to field components from Cactus Web.
- It adds a post-processing callback for customizing how [the render props](https://final-form.org/docs/react-final-form/types/FieldRenderProps) are combined. The included default adds an `error` prop if the field has been touched or the form submitted.
- Each of these can be configured project-wide, or overridden on a per-render basis.

More info on those, along with the two new components `FieldSpy` and `DependentField`,
is in the <a to='./api-documentation/'>API documentation</a>.
