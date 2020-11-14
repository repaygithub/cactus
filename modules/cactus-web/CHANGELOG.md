# v4.0.0-beta.0 (Fri Nov 13 2020)

#### 💥 Breaking Change

- Several updates and fixes to the `Breadcrumb` component
[#358](https://github.com/repaygithub/cactus/pull/358) ([@mikesoltow](https://github.com/mikesoltow))
  - The label prop of Breadcrumb.Item is no longer accepted.  Please put the text for
each Breadcrumb.Item in children instead.
  - The `BreadCrumbItem` component has been renamed to `BreadcrumbItem` for consistency.
  - The colors of the Breadcrumb.Item links now pull from the theme.  In addition, the
color now changes when the links are hovered, and a custom border appears when the links are
focused.
  - The linkTo prop of Breadcrumb.Item no longer exists.  If not using the "as" prop,
then you must replace linkTo with "href".
- Change form field event handlers for easier integration with form libraries
[#360](https://github.com/repaygithub/cactus/pull/360) and
[#366](https://github.com/repaygithub/cactus/pull/366) ([@wilysword](https://github.com/wilysword))
  - The `onChange`, `onFocus`, and `onBlur` props of the following components now use
standard React change and focus event handling functions instead of custom Cactus functions:
CheckBoxField, CheckBoxGroup, RadioButtonField, RadioGroup, TextAreaField, TextInputField,
Toggle, and ToggleField.
  - The Toggle component now uses the `checked` prop instead of `value`.
  - The `onChange`, `onFocus`, and `onBlur` props of the following components now use event
handling functions with custom events instead of the custom Cactus functions: DateInput,
DateInputField, FileInput, FileInputField, Select, and SelectField.
- Fix bug where `aria-describedby` would reference non-existent IDs in form field
components [#379](https://github.com/repaygithub/cactus/pull/379) ([@mikesoltow](https://github.com/mikesoltow))
  - The `ariaDescribedBy` field returned by `useAccessibleField` will now return `undefined`
if the DOM element should not have an `aria-describedby` attribute.
- Improvements to the Footer component [#369](https://github.com/repaygithub/cactus/pull/369)
([@NicolasSimmonds](https://github.com/NicolasSimmonds))
  - The Footer will now be placed at the bottom of the screen if there is not enough
content to fill the viewport.
  - The Footer font size has been reduced from 18px to 15px.
  - The logo in the Footer now has a max height of 40px.
- More Footer improvements [#376](https://github.com/repaygithub/cactus/pull/376)
([@wilysword](https://github.com/wilysword))
  - If no `children` are provided to the Footer, then the Footer links will now be
displayed in the top section, and no bottom Footer section will be displayed.
  - The color of the Footer links has been altered to ensure accessibility if they are
displayed in the top section.
  - The underline for the Footer links will now disappear when hovered.
  - The Footer will no longer be in a fixed position at any screen size.
- Update the designs for the Table and DataGrid components
[#374](https://github.com/repaygithub/cactus/pull/374)
([@NicolasSimmonds](https://github.com/NicolasSimmonds))
  - The font within tables has been increased in size
  - The Table and DataGrid components accept a dividers prop.  If true, then dividers
are added between cells, including header cells.
- Allow custom components in the BrandBar [#387](https://github.com/repaygithub/cactus/pull/387)
([@wilysword](https://github.com/wilysword))
  - BrandBar user menu moved to separate BrandBar.UserMenu component; related props
moved to new component, with `userMenuText` renamed to `label`
- Fix issue where certain Cactus styles were being overridden by user agent
[#390](https://github.com/repaygithub/cactus/pull/390) ([@wilysword](https://github.com/wilysword))
  - Minor font change to several components
- Change MenuBar scroll button visibility
[#397](https://github.com/repaygithub/cactus/pull/397) ([@wilysword](https://github.com/wilysword))
  - MenuBar scroll buttons are now visible but styled as disabled when scolled to
either end of the menu.

#### 🚀 Enhancement

- Add `disableTooltip` prop to all form field components
[#396](https://github.com/repaygithub/cactus/pull/396) ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
- Prevent dismissal of Tooltip text if the user moves mouse from the icon to the text
[#393](https://github.com/repaygithub/cactus/pull/393) ([@Dhalton](https://github.com/Dhalton))

#### 🐛 Bug Fix

- Fix several console warnings [#378](https://github.com/repaygithub/cactus/pull/378)
([@mikesoltow](https://github.com/mikesoltow))
- Fix React 17 issue with `onBlur` handlers in IE11
[#389](https://github.com/repaygithub/cactus/pull/389) ([@Dhalton](https://github.com/Dhalton))


#### Authors: 4

- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))
- Glen Phelps ([@wilysword](https://github.com/wilysword))
- Nicolas Simmonds ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
- Mike Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v3.3.2 (Wed Nov 11 2020)

#### 🐛 Bug Fix

- Add missing `dist` files

#### Authors: 1

- Mike Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v3.3.1 (Tue Nov 10 2020)

#### 🐛 Bug Fix

- Fix polymophism behavior for `Button` (i.e. you can now use
`<Button as={Link} to="http://www.google.com">`) [#375](https://github.com/repaygithub/cactus/pull/375)
([@Dhalton](https://github.com/Dhalton))
- Fix issue where tooltip would cover Select dropdowns [#380](https://github.com/repaygithub/cactus/pull/380)
([@NicolasSimmonds](https://github.com/NicolasSimmonds))
- Fix disabled styles for the Toggle component [#384](https://github.com/repaygithub/cactus/pull/384)
([@NicolasSimmonds](https://github.com/NicolasSimmonds))

#### 🏠 Internal

- Refactor nav menu dropdowns [#383](https://github.com/repaygithub/cactus/pull/383)
([@wilysword](https://github.com/wilysword))

#### 🔩 Dependency Updates

- Upgrade `@repay/cactus-theme` to `v1.1.0`

#### Authors: 4

- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))
- Glen Phelps ([@wilysword](https://github.com/wilysword))
- Nicolas Simmonds ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))
