# v7.0.0 (Wed Jul 07 2021)

#### 💥 Breaking Change

- Reduce `min-width` of Select component [#620](https://github.com/repaygithub/cactus/pull/620) ([@wilysword](https://github.com/wilysword))
- Alter BrandMenu.UserMenuItem API to allow links to be used [#597](https://github.com/repaygithub/cactus/pull/597) ([@daniloPenaR](https://github.com/daniloPenaR))
- Change FileInput to synchronous event handling [#604](https://github.com/repaygithub/cactus/pull/604) ([@wilysword](https://github.com/wilysword))
- Set default h1-h4 margins to 0 in the Text component [#601](https://github.com/repaygithub/cactus/pull/601) ([@daniloPenaR](https://github.com/daniloPenaR))
- Various improvements to the ColorPicker component [#596](https://github.com/repaygithub/cactus/pull/596) ([@wilysword](https://github.com/wilysword))

#### 🚀 Enhancement

- Add `mini` variant to the Table component [#608](https://github.com/repaygithub/cactus/pull/608) ([@Dhalton](https://github.com/Dhalton))

#### 🐛 Bug Fix

- Fix broken props tables on the docs website [#616](https://github.com/repaygithub/cactus/pull/616) ([@wilysword](https://github.com/wilysword))
- Fix white corners on Notification component [#612](https://github.com/repaygithub/cactus/pull/612) ([@Dhalton](https://github.com/Dhalton))
- Fix flickering behavior in MenuBar dropdowns on IE11 [#606](https://github.com/repaygithub/cactus/pull/606) ([@wilysword](https://github.com/wilysword))

#### Authors: 3

- Danilo Peña ([@daniloPenaR](https://github.com/daniloPenaR))
- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))
- Glen Phelps ([@wilysword](https://github.com/wilysword))

---

# v7.0.0-beta.0 (Fri Jun 11 2021)

#### 💥 Breaking Change

- Set default h1-h4 margins to 0 in the Text component [#601](https://github.com/repaygithub/cactus/pull/601) ([@daniloPenaR](https://github.com/daniloPenaR))
  - You will now have to manually provide a margin if you want one
- Various improvements to the ColorPicker component [#596](https://github.com/repaygithub/cactus/pull/596) ([@wilysword](https://github.com/wilysword))
  - `target.value` for ColorPicker events is now a single
value depending on the `format` prop, instead of a single object with
multiple color formats; the `hex` format is now prefixed by a "#"

#### Authors: 2

- Danilo Peña ([@daniloPenaR](https://github.com/daniloPenaR))
- Glen Phelps ([@wilysword](https://github.com/wilysword))

---

# v6.5.0 (Fri Jun 11 2021)

#### 🚀 Enhancement

- Allow users to pass flex, flexBasis, flexGrow, and flexShrink to various components (see component docs for more) [#594](https://github.com/repaygithub/cactus/pull/594) ([@Dhalton](https://github.com/Dhalton))
- Add a Header.Description component to render descriptive text just below the main Header [#592](https://github.com/repaygithub/cactus/pull/592) ([@Dhalton](https://github.com/Dhalton))

#### 🐛 Bug Fix

- Fix our custom polyfills so that they are compatible with Webpack 5 [#603](https://github.com/repaygithub/cactus/pull/603) ([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 2

- [@Dhalton](https://github.com/Dhalton)
- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v6.4.0 (Thu May 20 2021)

#### 🚀 Enhancement

- Forward more props to the DOM for various components so that props like data-testid can be passed down [#590](https://github.com/repaygithub/cactus/pull/590) ([@wilysword](https://github.com/wilysword))
- Render Breadcrumbs in ellipsis mode if there is not enough space to render the standard version [#582](https://github.com/repaygithub/cactus/pull/582) ([@daniloPenaR](https://github.com/daniloPenaR))

#### 🐛 Bug Fix

- Fix bug where menu dropdowns were not opening on Safari [#591](https://github.com/repaygithub/cactus/pull/591) ([@Dhalton](https://github.com/Dhalton))
- Fix order of confirm/cancel buttons in ConfirmModal [#588](https://github.com/repaygithub/cactus/pull/588) ([@daniloPenaR](https://github.com/daniloPenaR))
- Fix infinite re-renders with useScroll inside % width containers [#583](https://github.com/repaygithub/cactus/pull/583) ([@wilysword](https://github.com/wilysword))

#### Authors: 3

- [@wilysword](https://github.com/wilysword)
- Danilo Peña ([@daniloPenaR](https://github.com/daniloPenaR))
- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))

---

# v6.3.0 (Fri Apr 30 2021)

#### 🚀 Enhancement

- Added dark variants for TextButton and IconButton [#577](https://github.com/repaygithub/cactus/pull/577) ([@daniloPenaR](https://github.com/daniloPenaR) [@mikesoltow](https://github.com/mikesoltow) [@Dhalton](https://github.com/Dhalton))
- Pass props to Footer.Link and add support for as prop [#574](https://github.com/repaygithub/cactus/pull/574) ([@daniloPenaR](https://github.com/daniloPenaR))
- Remove redundant selection state on options in Select [#573](https://github.com/repaygithub/cactus/pull/573) ([@wilysword](https://github.com/wilysword))

#### 🐛 Bug Fix

- Prevent scroll from propagating to the window from inside Select and DateInput dropdowns [#580](https://github.com/repaygithub/cactus/pull/580) ([@wilysword](https://github.com/wilysword))

#### 🏠 Internal

- Updated storyshots after adding missing storyshot dependency [#581](https://github.com/repaygithub/cactus/pull/581) ([@daniloPenaR](https://github.com/daniloPenaR) [@github-actions[bot]](https://github.com/github-actions[bot]))

#### Authors: 5

- [@daniloPenaR](https://github.com/daniloPenaR)
- [@github-actions[bot]](https://github.com/github-actions[bot])
- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))
- Glen Phelps ([@wilysword](https://github.com/wilysword))
- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v6.2.0 (Fri Apr 23 2021)

#### 🚀 Enhancement

- Improve Header Item spacing, pass props to Header.Title [#566](https://github.com/repaygithub/cactus/pull/566) ([@daniloPenaR](https://github.com/daniloPenaR))
- Add Preview component that allows viewing of embedded images [#565](https://github.com/repaygithub/cactus/pull/565) ([@Dhalton](https://github.com/Dhalton))
- Allow MenuBar sub-menus to be wider than their parent [#564](https://github.com/repaygithub/cactus/pull/564) ([@Dhalton](https://github.com/Dhalton))
- Add mobile version of Breadcrumb component [#558](https://github.com/repaygithub/cactus/pull/558) ([@Dhalton](https://github.com/Dhalton))

#### 🐛 Bug Fix

- Clear custom input values on empty string [#571](https://github.com/repaygithub/cactus/pull/571) ([@wilysword](https://github.com/wilysword))
- Fix FileInput onChange not firing in FireFox [#570](https://github.com/repaygithub/cactus/pull/570) ([@Dhalton](https://github.com/Dhalton))
- Fix Accordion IconButton shrinking in IE11 [#568](https://github.com/repaygithub/cactus/pull/568) ([@daniloPenaR](https://github.com/daniloPenaR))
- Fix broken type signatures on some components [#563](https://github.com/repaygithub/cactus/pull/563) ([@mikesoltow](https://github.com/mikesoltow))

#### 🔩 Dependency Updates

- Upgrade ssri [#572](https://github.com/repaygithub/cactus/pull/572) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 5

- [@daniloPenaR](https://github.com/daniloPenaR)
- [@dependabot[bot]](https://github.com/dependabot[bot])
- [@Dhalton](https://github.com/Dhalton)
- Glen Phelps ([@wilysword](https://github.com/wilysword))
- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v6.1.1 (Mon Mar 29 2021)

#### 🐛 Bug Fix

- Fix bug where drop-down menu would become hidden in Safari [#562](https://github.com/repaygithub/cactus/pull/562) ([@mikesoltow](https://github.com/mikesoltow))
- Fix bug where the MenuBar could obtain focus through a click below the menu [#560](https://github.com/repaygithub/cactus/pull/560) ([@mikesoltow](https://github.com/mikesoltow))
- Fix an issue with Accordion text alignment in IE11 [#554](https://github.com/repaygithub/cactus/pull/554) ([@daniloPenaR](https://github.com/daniloPenaR))

#### 🏠 Internal

- Refactor CheckBoxGroup and RadioGroup [#555](https://github.com/repaygithub/cactus/pull/555) ([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 2

- [@mikesoltow](https://github.com/mikesoltow)
- Danilo Peña ([@daniloPenaR](https://github.com/daniloPenaR))

---

# v6.1.0 (Fri Mar 19 2021)

#### 🚀 Enhancement

- Add Header component [#551](https://github.com/repaygithub/cactus/pull/551) ([@daniloPenaR](https://github.com/daniloPenaR) [@Dhalton](https://github.com/Dhalton))
- Add Notification component [#550](https://github.com/repaygithub/cactus/pull/550) ([@Dhalton](https://github.com/Dhalton))

#### 🐛 Bug Fix

- Prevent onChange from firing on Select/SelectField when an already selected option is picked from the dropdown [#549](https://github.com/repaygithub/cactus/pull/549) ([@mikesoltow](https://github.com/mikesoltow))
- The selected values displayed in the Select field (when `multiple={true}`) should now appear in the same order as the `value` of the Select component [#548](https://github.com/repaygithub/cactus/pull/548) ([@Dhalton](https://github.com/Dhalton))
- Breadcrumb and Footer links now have better contrast, improving accessibility [#547](https://github.com/repaygithub/cactus/pull/547) ([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 3

- [@Dhalton](https://github.com/Dhalton)
- Danilo Peña ([@daniloPenaR](https://github.com/daniloPenaR))
- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v6.0.1 (Tue Mar 09 2021)

#### 🐛 Bug Fix

- Fix MenuBar width on desktop screens [#545](https://github.com/repaygithub/cactus/pull/545) ([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 1

- [@mikesoltow](https://github.com/mikesoltow)

---

# vnull (Tue Mar 09 2021)

#### 🐛 Bug Fix

- Fix MenuBar width on desktop screens [#545](https://github.com/repaygithub/cactus/pull/545) ([@mikesoltow](https://github.com/mikesoltow))

#### 🏠 Internal

- undefined [#542](https://github.com/repaygithub/cactus/pull/542) ([@daniloPenaR](https://github.com/daniloPenaR))

#### Authors: 2

- [@daniloPenaR](https://github.com/daniloPenaR)
- [@mikesoltow](https://github.com/mikesoltow)

---

# v6.0.0 (Thu Mar 04 2021)

#### 💥 Breaking Change

- Change styling of mobile/tablet menu to use alternating colors [#541](https://github.com/repaygithub/cactus/pull/541) ([@wilysword](https://github.com/wilysword))
- Add textStyle prop to TextInput and TextInputField, allowing users to control size of these components [#533](https://github.com/repaygithub/cactus/pull/533) ([@wilysword](https://github.com/wilysword))
  - Default height of TextInput and TextInputField components has changed
- Redesign MenuBar and add dark variant [#509](https://github.com/repaygithub/cactus/pull/509) ([@daniloPenaR](https://github.com/daniloPenaR) [@wilysword](https://github.com/wilysword))
  - Appearance of MenuBar has changed significantly on desktop screens
- Make `aria-label` required for ActionBar.Item [#488](https://github.com/repaygithub/cactus/pull/488) ([@wilysword](https://github.com/wilysword))

#### 🚀 Enhancement

- Add Divider component [#537](https://github.com/repaygithub/cactus/pull/537) ([@daniloPenaR](https://github.com/daniloPenaR))
- Add List component [#522](https://github.com/repaygithub/cactus/pull/522) ([@Dhalton](https://github.com/Dhalton))
- Add ColorPicker component [#508](https://github.com/repaygithub/cactus/pull/508) ([@Dhalton](https://github.com/Dhalton))

#### 🐛 Bug Fix

- Fix blowout bug with Grid component [#536](https://github.com/repaygithub/cactus/pull/536) ([@daniloPenaR](https://github.com/daniloPenaR))
- Fix background color on Tag component [#530](https://github.com/repaygithub/cactus/pull/530) ([@wilysword](https://github.com/wilysword))
- Fix margin bug with Modal in IE11 [#523](https://github.com/repaygithub/cactus/pull/523) ([@wilysword](https://github.com/wilysword))
- Fix IconButton propTypes warnings [#528](https://github.com/repaygithub/cactus/pull/528) ([@daniloPenaR](https://github.com/daniloPenaR))
- Fix positioning of IconButtons that are children of Modal [#517](https://github.com/repaygithub/cactus/pull/517) ([@daniloPenaR](https://github.com/daniloPenaR))

#### 🏠 Internal

- Minor refactoring and add test coverage [#532](https://github.com/repaygithub/cactus/pull/532) ([@Dhalton](https://github.com/Dhalton))
- Migrate DescriptivePalette icon to `@repay/cactus-icons` [#534](https://github.com/repaygithub/cactus/pull/534) ([@daniloPenaR](https://github.com/daniloPenaR))
- Improve transition behavior for DateInput calendar [#514](https://github.com/repaygithub/cactus/pull/514) ([@Dhalton](https://github.com/Dhalton))

#### 🔩 Dependency Updates

- Upgrade Jest SonarQube reporter [#524](https://github.com/repaygithub/cactus/pull/524) ([@mikesoltow](https://github.com/mikesoltow))
- Upgrade various dependencies, including Reach libraries and build/bundling library [#518](https://github.com/repaygithub/cactus/pull/518) ([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 4

- [@daniloPenaR](https://github.com/daniloPenaR)
- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))
- Glen Phelps ([@wilysword](https://github.com/wilysword))
- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))
---

# v6.0.0-beta.0 (Thu Feb 25 2021)

#### 💥 Breaking Change

- Add textStyle prop to TextInput and TextInputField, allowing users to control size of these components [#533](https://github.com/repaygithub/cactus/pull/533) ([@wilysword](https://github.com/wilysword))
  - Default height of TextInput and TextInputField components has changed
- Redesign MenuBar and add dark variant [#509](https://github.com/repaygithub/cactus/pull/509) ([@daniloPenaR](https://github.com/daniloPenaR) [@wilysword](https://github.com/wilysword))
  - Appearance of MenuBar has changed significantly on desktop screens
- Make `aria-label` required for ActionBar.Item [#488](https://github.com/repaygithub/cactus/pull/488) ([@wilysword](https://github.com/wilysword))

#### 🚀 Enhancement

- Add List component [#522](https://github.com/repaygithub/cactus/pull/522) ([@Dhalton](https://github.com/Dhalton))
- Add ColorPicker component [#508](https://github.com/repaygithub/cactus/pull/508) ([@Dhalton](https://github.com/Dhalton))

#### 🐛 Bug Fix

- Fix background color on Tag component [#530](https://github.com/repaygithub/cactus/pull/530) ([@wilysword](https://github.com/wilysword))
- Fix margin bug with Modal in IE11 [#523](https://github.com/repaygithub/cactus/pull/523) ([@wilysword](https://github.com/wilysword))
- Fix IconButton propTypes warnings [#528](https://github.com/repaygithub/cactus/pull/528) ([@daniloPenaR](https://github.com/daniloPenaR))
- Fix positioning of IconButtons that are children of Modal [#517](https://github.com/repaygithub/cactus/pull/517) ([@daniloPenaR](https://github.com/daniloPenaR))

#### 🏠 Internal

- Migrate DescriptivePalette icon to `@repay/cactus-icons` [#534](https://github.com/repaygithub/cactus/pull/534) ([@daniloPenaR](https://github.com/daniloPenaR))
- Improve transition behavior for DateInput calendar [#514](https://github.com/repaygithub/cactus/pull/514) ([@Dhalton](https://github.com/Dhalton))

#### 🔩 Dependency Updates

- Upgrade Jest SonarQube reporter [#524](https://github.com/repaygithub/cactus/pull/524) ([@mikesoltow](https://github.com/mikesoltow))
- Upgrade various dependencies, including Reach libraries and build/bundling library [#518](https://github.com/repaygithub/cactus/pull/518) ([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 4

- [@daniloPenaR](https://github.com/daniloPenaR)
- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))
- Glen Phelps ([@wilysword](https://github.com/wilysword))
- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v5.2.0 (Fri Feb 12 2021)

#### 🚀 Enhancement

- Add ability to customize formatting of `Select` options using the `Select.Option` component [#507](https://github.com/repaygithub/cactus/pull/507) ([@wilysword](https://github.com/wilysword))
- Added a Dimmer component.  Modal component now uses this for the background overlay. [#502](https://github.com/repaygithub/cactus/pull/502) ([@daniloPenaR](https://github.com/daniloPenaR) [@Dhalton](https://github.com/Dhalton))

#### Authors: 3

- [@daniloPenaR](https://github.com/daniloPenaR)
- [@wilysword](https://github.com/wilysword)
- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))

---

# v5.1.1 (Thu Feb 04 2021)

#### 🐛 Bug Fix

- Fix wonky colors of the Alert close icons [#500](https://github.com/repaygithub/cactus/pull/500) ([@Dhalton](https://github.com/Dhalton))

#### 🏠 Internal

- Use the new NavigationFirst and NavigationLast icons in Pagination [#504](https://github.com/repaygithub/cactus/pull/504) ([@wilysword](https://github.com/wilysword))
- Refactor to clean up SonarQube issues [#501](https://github.com/repaygithub/cactus/pull/501) ([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 3

- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))
- Glen Phelps ([@wilysword](https://github.com/wilysword))
- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v5.1.0 (Mon Feb 01 2021)

#### 🚀 Enhancement

- Add warning and success variants to IconButton [#496](https://github.com/repaygithub/cactus/pull/496) ([@daniloPenaR](https://github.com/daniloPenaR))

#### 🐛 Bug Fix

- Fix bug where collapsing a sub-menu in tablet/mobile mode would close the menu panel [#489](https://github.com/repaygithub/cactus/pull/489) ([@mikesoltow](https://github.com/mikesoltow))
- Fix content overflow bug in mobile mode [#494](https://github.com/repaygithub/cactus/pull/494) ([@wilysword](https://github.com/wilysword))
- Fix Firefox bug where incorrect menu items would flash when the menu was clicked [#493](https://github.com/repaygithub/cactus/pull/493) ([@wilysword](https://github.com/wilysword))
- Fix bug where loading Select options asynchronously would result in duplicate options  [#492](https://github.com/repaygithub/cactus/pull/492) ([@wilysword](https://github.com/wilysword))

#### Authors: 3

- [@wilysword](https://github.com/wilysword)
- Danilo Peña ([@daniloPenaR](https://github.com/daniloPenaR))
- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v5.0.1 (Wed Jan 27 2021)

#### 🐛 Bug Fix

- Fix z-index bug that caused covered up elements to be clickable [#487](https://github.com/repaygithub/cactus/pull/487) ([@wilysword](https://github.com/wilysword))
- Fix a keypress bug in IE11 [#484](https://github.com/repaygithub/cactus/pull/484) ([@wilysword](https://github.com/wilysword))

#### 🔩 Dependency Updates

- Upgrade various dev dependencies [#486](https://github.com/repaygithub/cactus/pull/486) ([@wilysword](https://github.com/wilysword))

#### Authors: 1

- Glen Phelps ([@wilysword](https://github.com/wilysword))

---

# v5.0.0 (Fri Jan 15 2021)

#### 💥 Breaking Change

- Re-design DateInput component [#470](https://github.com/repaygithub/cactus/pull/470) ([@Dhalton](https://github.com/Dhalton))
  - `showMonthYear` is no longer valid in the `phrases` prop.  It has been split into `showMonth` and `showYear`, since the select month/year dropdowns are now separate.
- Remove left padding from Breadcrumb component [#477](https://github.com/repaygithub/cactus/pull/477) ([@Dhalton](https://github.com/Dhalton))

#### 🚀 Enhancement

- Add innerHeight and innerMaxHeight props to Modal component.  Fix text overflow for Modal. [#479](https://github.com/repaygithub/cactus/pull/479) ([@Dhalton](https://github.com/Dhalton))

#### 🐛 Bug Fix

- Fix bug where Alert close buttons were not visible in IE11 [#483](https://github.com/repaygithub/cactus/pull/483) ([@wilysword](https://github.com/wilysword))
- Fix issue where logo could overflow BrandBar [#481](https://github.com/repaygithub/cactus/pull/481) ([@wilysword](https://github.com/wilysword))

#### Authors: 2

- [@Dhalton](https://github.com/Dhalton)
- Glen Phelps ([@wilysword](https://github.com/wilysword))

---

# v5.0.0-beta.1 (Mon Jan 11 2021)

#### 🐛 Bug Fix

- Fix issue where mobile/tablet menu would scroll unexpectedly when sub-menus were expanded [#474](https://github.com/repaygithub/cactus/pull/474) ([@wilysword](https://github.com/wilysword))

#### Authors: 1

- [@wilysword](https://github.com/wilysword)

---

# v5.0.0-beta.0 (Thu Jan 08 2021)

#### 💥 Breaking Change

- Remove left padding from Breadcrumb component
[#477](https://github.com/repaygithub/cactus/pull/477) ([@Dhalton](https://github.com/Dhalton))

#### Authors: 1

- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))

---

# v4.4.1 (Tue Jan 12 2021)

#### 🐛 Bug Fix

- Fix issue where mobile/tablet menu would scroll unexpectedly when sub-menus were expanded [#474](https://github.com/repaygithub/cactus/pull/474) ([@wilysword](https://github.com/wilysword))

#### 🏠 Internal

- Fix SonarQube code smells [#473](https://github.com/repaygithub/cactus/pull/473) ([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 2

- [@wilysword](https://github.com/wilysword)
- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v4.4.0 (Tue Jan 05 2021)

#### 🚀 Enhancement

- Add Tab, TabList, and TabController components [#468](https://github.com/repaygithub/cactus/pull/468) ([@wilysword](https://github.com/wilysword))

#### 🐛 Bug Fix

- Fix a bug where the page would crash after deleting Accordions [#475](https://github.com/repaygithub/cactus/pull/475) ([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 2

- Glen Phelps ([@wilysword](https://github.com/wilysword))
- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v4.3.0 (Mon Dec 28 2020)

#### 🚀 Enhancement

- Allow devs to override default Modal widths with a width prop [#469](https://github.com/repaygithub/cactus/pull/469) ([@Dhalton](https://github.com/Dhalton))

#### 🐛 Bug Fix

- Fix misaligned text in FileInput component [#465](https://github.com/repaygithub/cactus/pull/465) ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
- Fix Tooltip overflow issue in IE11 [#461](https://github.com/repaygithub/cactus/pull/461) ([@NicolasSimmonds](https://github.com/NicolasSimmonds))

#### Authors: 2

- [@Dhalton](https://github.com/Dhalton)
- [@NicolasSimmonds](https://github.com/NicolasSimmonds)

---

# v4.2.2 (Mon Dec 21 2020)

#### 🐛 Bug Fix

- Fix Select text alignment in Firefox [#452](https://github.com/repaygithub/cactus/pull/452) ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
- Fix bottom border of BrandBar user menu in Safari and Edge [#450](https://github.com/repaygithub/cactus/pull/450) ([@NicolasSimmonds](https://github.com/NicolasSimmonds))

#### Authors: 1

- [@NicolasSimmonds](https://github.com/NicolasSimmonds)

---

# v4.2.1 (Wed Dec 16 2020)

#### 🐛 Bug Fix

- Fix a misalignment of the Toggle checkbox when Toggles are rendered inside Tables [#455](https://github.com/repaygithub/cactus/pull/455) ([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 1

- [@mikesoltow](https://github.com/mikesoltow)

---

# v4.2.0 (Tue Dec 15 2020)

#### 🚀 Enhancement

- Change focus style on IconButtons to an outline [#440](https://github.com/repaygithub/cactus/pull/440) ([@Dhalton](https://github.com/Dhalton))

#### 🐛 Bug Fix

- Fix bug where some components would incorrectly submit forms when clicked [#448](https://github.com/repaygithub/cactus/pull/448) ([@wilysword](https://github.com/wilysword))
- Fix tooltip alignment in Safari [#444](https://github.com/repaygithub/cactus/pull/444) ([@NicolasSimmonds](https://github.com/NicolasSimmonds))

#### 🔩 Dependency Updates

- Bump ini package [#438](https://github.com/repaygithub/cactus/pull/438) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 4

- [@dependabot[bot]](https://github.com/dependabot[bot])
- [@Dhalton](https://github.com/Dhalton)
- [@NicolasSimmonds](https://github.com/NicolasSimmonds)
- Glen Phelps ([@wilysword](https://github.com/wilysword))

---

# v4.1.0 (Thu Dec 10 2020)

#### 🚀 Enhancement

- Allow Tooltips attached to form elements to be left-aligned
[#411](https://github.com/repaygithub/cactus/pull/411) ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
- The "no options available" text on the Select element can now be customized
[#421](https://github.com/repaygithub/cactus/pull/421) ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
- Allow Tooltips to be shown on click/tap in addition to hover
[#420](https://github.com/repaygithub/cactus/pull/420) ([@Dhalton](https://github.com/Dhalton))

#### 🐛 Bug Fix

- Fix Tooltip alignment bug in IE11
[#425](https://github.com/repaygithub/cactus/pull/425) ([@mikesoltow](https://github.com/mikesoltow))
- Fix bug that prevented DateInputs from being used inside ActionBar Panels
[#409](https://github.com/repaygithub/cactus/pull/409) ([@wilysword](https://github.com/wilysword))
- Fix bug that prevented components with dropdowns from being used inside ActionBar Panels
[#399](https://github.com/repaygithub/cactus/pull/399) ([@wilysword](https://github.com/wilysword))
- Fix BrandBar logo stretching issue in Safari
[#431](https://github.com/repaygithub/cactus/pull/431) ([@NicolasSimmonds](https://github.com/NicolasSimmonds))

#### Authors: 4

- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))
- Glen Phelps ([@wilysword](https://github.com/wilysword))
- Nicolas Simmonds ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v4.0.0 (Mon Nov 30 2020)

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
- Allow more customization with placement of DataGrid sub-components.
[#385](https://github.com/repaygithub/cactus/pull/385)  ([@Dhalton](https://github.com/Dhalton))
  - All DataGride sub-components are no longer placed automatically and will need to be
placed manually. See https://repaygithub.github.io/cactus/components/datagrid/ for a
description of the new API.
- Upgrade `@repay/cactus-theme` to `v2.0.0`
[#401](https://github.com/repaygithub/cactus/pull/401) ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
  - If you don't pass a `shape` value to `generateTheme`, or if you use the default
export from `@repay/cactus-theme` as your theme, then the shape of all of your
components will change from `round` to `intermediate` when you upgrade.

#### 🚀 Enhancement

- Add `disableTooltip` prop to all form field components
[#396](https://github.com/repaygithub/cactus/pull/396) ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
- Prevent dismissal of Tooltip text if the user moves mouse from the icon to the text
[#393](https://github.com/repaygithub/cactus/pull/393) ([@Dhalton](https://github.com/Dhalton))- Change Accordion transition time from a dynamic value, based on Accordion height, to
a static value of 200ms. [#403](https://github.com/repaygithub/cactus/pull/403)
([@NicolasSimmonds](https://github.com/NicolasSimmonds))
- Allow the use of controlled Accordion components, if desired.  See
[the docs](https://repaygithub.github.io/cactus/components/accordion/) for examples of
both the controlled and uncontrolled variants. [#398](https://github.com/repaygithub/cactus/pull/398)
([@mikesoltow](https://github.com/mikesoltow))

#### 🐛 Bug Fix

- Fix several console warnings [#378](https://github.com/repaygithub/cactus/pull/378)
([@mikesoltow](https://github.com/mikesoltow))
- Fix React 17 issue with `onBlur` handlers in IE11
[#389](https://github.com/repaygithub/cactus/pull/389) ([@Dhalton](https://github.com/Dhalton))
- Fix bug in Layout where nav menu would occasionally display below conent
[#408](https://github.com/repaygithub/cactus/pull/408) ([@wilysword](https://github.com/wilysword))

#### Authors: 4

- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))
- Glen Phelps ([@wilysword](https://github.com/wilysword))
- Nicolas Simmonds ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
- Mike Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v4.0.0-beta.4 (Tue Nov 24 2020)

#### 🐛 Bug Fix

- Fix bug in Layout where nav menu would occasionally display below conent
[#408](https://github.com/repaygithub/cactus/pull/408) ([@wilysword](https://github.com/wilysword))

#### Authors: 1

- Glen Phelps ([@wilysword](https://github.com/wilysword))

---

# v4.0.0-beta.3 (Mon Nov 23 2020)

#### 🚀 Enhancement

- Allow the use of controlled Accordion components, if desired.  See
[the docs](https://repaygithub.github.io/cactus/components/accordion/) for examples of
both the controlled and uncontrolled variants. [#398](https://github.com/repaygithub/cactus/pull/398)
([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 1

- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v4.0.0-beta.2 (Thu Nov 19 2020)

#### 💥 Breaking Change

- Upgrade `@repay/cactus-theme` to `v2.0.0-beta-0`
[#401](https://github.com/repaygithub/cactus/pull/401) ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
  - If you don't pass a `shape` value to `generateTheme`, or if you use the default
export from `@repay/cactus-theme` as your theme, then the shape of all of your
components will change from `round` to `intermediate` when you upgrade.

#### 🚀 Enhancement

- Change Accordion transition time from a dynamic value, based on Accordion height, to
a static value of 200ms. [#403](https://github.com/repaygithub/cactus/pull/403)
([@NicolasSimmonds](https://github.com/NicolasSimmonds))

#### Authors: 1

- Nicolas Simmonds ([@NicolasSimmonds](https://github.com/NicolasSimmonds))

---

# v4.0.0-beta.1 (Wed Nov 18 2020)

#### 💥 Breaking Change

- Allow more customization with placement of DataGrid sub-components.
[#385](https://github.com/repaygithub/cactus/pull/385)  ([@Dhalton](https://github.com/Dhalton))
  - All DataGride sub-components are no longer placed automatically and will need to be
placed manually. See https://repaygithub.github.io/cactus/components/datagrid/ for a
description of the new API.

#### Authors: 1

- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))

---

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
