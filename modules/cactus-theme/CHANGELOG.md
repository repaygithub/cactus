# v3.2.4 (Fri Dec 02 2022)

#### 🏠 Internal

- Cactus-1072  fix linter errors [#821](https://github.com/repaygithub/cactus/pull/821) ([@maxrcollins](https://github.com/maxrcollins))

#### Authors: 1

- [@maxrcollins](https://github.com/maxrcollins)

---

# v3.2.3 (Thu Apr 21 2022)

#### 🏠 Internal

- CACTUS-885 :: Upgrade to Yarn Berry [#741](https://github.com/repaygithub/cactus/pull/741) ([@Dhalton](https://github.com/Dhalton))

#### Authors: 1

- [@Dhalton](https://github.com/Dhalton)

---

# v3.2.2 (Mon Apr 11 2022)

#### 🔩 Dependency Updates

- CACTUS-846 :: Dependency updates [#730](https://github.com/repaygithub/cactus/pull/730) ([@daniloPenaR](https://github.com/daniloPenaR))

#### Authors: 1

- [@daniloPenaR](https://github.com/daniloPenaR)

---

# v3.2.1 (Thu Mar 10 2022)

#### 🏠 Internal

- Resolve SonarQube code smells [#721](https://github.com/repaygithub/cactus/pull/721) ([@wilysword](https://github.com/wilysword))

#### 🔩 Dependency Updates

- build(deps): bump url-parse from 1.5.3 to 1.5.7 [#722](https://github.com/repaygithub/cactus/pull/722) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 2

- [@dependabot[bot]](https://github.com/dependabot[bot])
- Glen Phelps ([@wilysword](https://github.com/wilysword))

---

# v3.2.0 (Wed Feb 16 2022)

#### 🚀 Enhancement

- Add saturation multiplier to theme generator [#708](https://github.com/repaygithub/cactus/pull/708) ([@daniloPenaR](https://github.com/daniloPenaR))

#### Authors: 1

- Danilo Peña ([@daniloPenaR](https://github.com/daniloPenaR))

---

# v3.1.0 (Wed Jan 26 2022)

#### 🚀 Enhancement

- Make borderSize helper more compatible with TS & styled components [#707](https://github.com/repaygithub/cactus/pull/707) ([@Dhalton](https://github.com/Dhalton))

#### 🏠 Internal

- Fix SonarQube code smells [#696](https://github.com/repaygithub/cactus/pull/696) ([@daniloPenaR](https://github.com/daniloPenaR))

#### 🔩 Dependency Updates

- Cactus 715:: Dependency updates [#686](https://github.com/repaygithub/cactus/pull/686) ([@daniloPenaR](https://github.com/daniloPenaR) [@wilysword](https://github.com/wilysword) [@Dhalton](https://github.com/Dhalton))

#### Authors: 3

- Danilo Peña ([@daniloPenaR](https://github.com/daniloPenaR))
- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))
- Glen Phelps ([@wilysword](https://github.com/wilysword))

---

# v3.0.0 (Mon Aug 16 2021)

#### 💥 Breaking Change

- Require mediaQueries and breakpoints in CactusTheme type [#628](https://github.com/repaygithub/cactus/pull/628) ([@Dhalton](https://github.com/Dhalton))
- Replace transparent colors with non-transparent ones [#627](https://github.com/repaygithub/cactus/pull/627) ([@mikesoltow](https://github.com/mikesoltow))
  - `transparentCTA` replaced with `lightCalltoAction`
  - `transparentSuccess`, `transparentWarning`, and `transparentError` replaced with `successLight`, `warningLight`, and `errorLight`, respectively

#### 🚀 Enhancement

- Export style helpers such as shape() and color() to assist with using theme properties in your style definitions [#640](https://github.com/repaygithub/cactus/pull/640) ([@wilysword](https://github.com/wilysword))

#### Authors: 3

- [@mikesoltow](https://github.com/mikesoltow)
- Dhalton Huber ([@Dhalton](https://github.com/Dhalton))
- Glen Phelps ([@wilysword](https://github.com/wilysword))

---

# v2.1.1 (Mon Jul 19 2021)

#### 🐛 Bug Fix

- Stop ignoring light secondary colors in generateTheme [#624](https://github.com/repaygithub/cactus/pull/624) ([@mikesoltow](https://github.com/mikesoltow))

#### 🔩 Dependency Updates

- Upgrade various dependencies [#615](https://github.com/repaygithub/cactus/pull/615) ([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 1

- [@mikesoltow](https://github.com/mikesoltow)

---

# v2.1.0 (Thu Feb 25 2021)

#### 🚀 Enhancement

- Add grayscaleContrast option to theme - if enabled, replaces lightContrast color with gray [#519](https://github.com/repaygithub/cactus/pull/519) ([@mikesoltow](https://github.com/mikesoltow))

#### 🔩 Dependency Updates

- Upgrade Jest SonarQube reporter [#524](https://github.com/repaygithub/cactus/pull/524) ([@mikesoltow](https://github.com/mikesoltow))
- Upgrade various dependencies, including build/bundling library [#518](https://github.com/repaygithub/cactus/pull/518) ([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 1

- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v2.0.2 (Tue Jan 12 2021)

#### 🐛 Bug Fix

- Trim leading and trailing spaces from hex codes passed into generateTheme [#478](https://github.com/repaygithub/cactus/pull/478) ([@wilysword](https://github.com/wilysword))

#### 🏠 Internal

- Refactor theme generators to fix SonarQube code smells [#473](https://github.com/repaygithub/cactus/pull/473) ([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 2

- [@wilysword](https://github.com/wilysword)
- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v2.0.2-beta.1 (Mon Jan 11 2021)

#### 🐛 Bug Fix

- Trim leading and trailing spaces from hex codes passed into generateTheme [#478](https://github.com/repaygithub/cactus/pull/478) ([@wilysword](https://github.com/wilysword))

#### Authors: 1

- [@wilysword](https://github.com/wilysword)

---

# v2.0.2-beta.0 (Fri Jan 08 2021)

#### 🏠 Internal

- Refactor theme generators to fix SonarQube code smells
[#473](https://github.com/repaygithub/cactus/pull/473) ([@mikesoltow](https://github.com/mikesoltow))

#### Authors: 1

- Michael Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v2.0.0 (Mon Nov 30 2020)

#### 💥 Breaking Change

- Set default `shape` value to `intermediate`
[#401](https://github.com/repaygithub/cactus/pull/401) ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
  - If you don't pass a `shape` value to `generateTheme`, or if you use the default
export as your theme, then the shape of all of your components will change from `round`
to `intermediate` when you upgrade.

#### Authors: 1

- Nicolas Simmonds ([@NicolasSimmonds](https://github.com/NicolasSimmonds))

---

# v2.0.0-beta.0 (Thu Nov 19 2020)

#### 💥 Breaking Change

- Set default `shape` value to `intermediate`
[#401](https://github.com/repaygithub/cactus/pull/401) ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
  - If you don't pass a `shape` value to `generateTheme`, or if you use the default
export as your theme, then the shape of all of your components will change from `round`
to `intermediate` when you upgrade.

#### Authors: 1

- Nicolas Simmonds ([@NicolasSimmonds](https://github.com/NicolasSimmonds))

---

# v1.1.1 (Wed Nov 11 2020)

#### 🐛 Bug Fix

- Add missing `dist` files

#### Authors: 1

- Mike Soltow ([@mikesoltow](https://github.com/mikesoltow))

---

# v1.1.0 (Tue Nov 10 2020)

#### 🚀 Enhancement

- Add new colors and color styles to the theme [#308](https://github.com/repaygithub/cactus/pull/308)
([@NicolasSimmonds](https://github.com/NicolasSimmonds))

#### Authors: 1

- Nicolas Simmonds ([@NicolasSimmonds](https://github.com/NicolasSimmonds))
