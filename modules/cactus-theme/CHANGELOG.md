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
