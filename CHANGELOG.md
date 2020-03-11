# Changelog

## [@repay/cactus-i18n@v0.3.6](https://github.com/repaygithub/cactus/commit/42719cb107ed051ad962b6ab6420b07b6243b3bb)

- feat(cactus-i18n): provide extra params to load() [bba0a4d](https://github.com/repaygithub/cactus/commit/bba0a4dc2c07fdc7e9f8dd5e4e6f4076c0ff38b3)
- feat(cactus-i18n): restrict logging to debugMode only [c7d0ca8](https://github.com/repaygithub/cactus/commit/c7d0ca8696cfa13a26683c9d0a0873e4a1ccc236)
- chore(cactus-i18n): update changelog [8887658](https://github.com/repaygithub/cactus/commit/8887658b1328fb4651dd9c7171868abbc70b2a92)

## [@repay/cactus-theme@v0.4.6](https://github.com/repaygithub/cactus/commit/78a175a3b1906601e9bc89cfd1c98880018dae45)

- feat(cactus-theme): adds option to generate theme from hex colors [4a0c41e](https://github.com/repaygithub/cactus/commit/4a0c41e26f49f055bd307f1c4b02aa647f6fa01a)
- feat(cactus-theme): improve accessibility when secondary is light [52507f7](https://github.com/repaygithub/cactus/commit/52507f7e39ebc338e965bf81264b041bed782346)
- refactor(cactus-theme): move common variables to higher scope [045007f](https://github.com/repaygithub/cactus/commit/045007f4bd1797d2484b451b18b12ff5c3c0b1a4)
- docs(cactus-theme): include hex color theme generation option [5e419b1](https://github.com/repaygithub/cactus/commit/5e419b116299fd33cab48766f2da1fc9bc98a71f)
- feat(cactus-theme): adds option to generate theme from hex colors [dbaf80c](https://github.com/repaygithub/cactus/commit/dbaf80c67705389c80f87fb421295515def7f347)

## [@repay/cactus-i18n@v0.3.5](https://github.com/repaygithub/cactus/commit/fd736f5a6ba51bb1fa4780d34983c44ec79f848f)

- feat(cactus-i18n): allow choosing to use isolating char (#207) [6fa5ca4](https://github.com/repaygithub/cactus/commit/6fa5ca4b047180e6854c03a6f7a556d4b00325d2)
- chore(cactus-i18n): update changelog [197e293](https://github.com/repaygithub/cactus/commit/197e2931e07810b696583078b6fe4d4390e8732f)

## [@repay/cactus-i18n@v0.3.4](https://github.com/repaygithub/cactus/commit/d2cec267e9c5d52356ab70470b963b4417b2fde7)

- fix(cactus-i18n): Remove /compat from fluent bundle import [e1fa1e4](https://github.com/repaygithub/cactus/commit/e1fa1e4ca465f3a9fa7c2977826ec1325b3b1b49)
- docs(cactus-i18n): add documentation around transpiling fluent [ece24bb](https://github.com/repaygithub/cactus/commit/ece24bbe2ff9e714f637ffccfd41dac41c625565)
- fix(cactus-i18n): Remove /compat from fluent langneg [7672a45](https://github.com/repaygithub/cactus/commit/7672a4559dec231eb1c4695e3a1fa5adc1951138)
- fix(cactus-i18n): Remove /compat from fluent bundle import [c8e21ff](https://github.com/repaygithub/cactus/commit/c8e21ff8cc50e5b6181e3b9a6c1f920c73e4fbb2)
- chore(cactus-i18n): update changelog [31d513e](https://github.com/repaygithub/cactus/commit/31d513e1befe09840a643ffcaf2b005185478ce2)

## [@repay/cactus-i18n@v0.3.1](https://github.com/repaygithub/cactus/commit/d441d9973494c606941cc66cad0955a95bce3f86)

- fix(cactus-i18n): use compat version of langneg lib [604acd2](https://github.com/repaygithub/cactus/commit/604acd2f76782faa19d743e84ded6584bb046da3)
- fix(cactus-i18n): use compat version of langneg lib [20df999](https://github.com/repaygithub/cactus/commit/20df9999c486c0ffa121fa17e230e01b3e3098f6)
- chore(cactus-i18n): update changelog [7a823be](https://github.com/repaygithub/cactus/commit/7a823be0bca850ac9770c4fd5ed98979b22bec41)

## [@repay/cactus-i18n@v0.3.0](https://github.com/repaygithub/cactus/commit/ac18a3afc5c594376dbbe2ed61cd012788b557f1)

- feat(cactus-i18n): make i18n library platform agnostic [ea68ede](https://github.com/repaygithub/cactus/commit/ea68edeec9ab7a035fb0c989f006ef832b1e29c6)
  - 🧨 BREAKING: The I18nProvider will no longer use navigator.language internally to
ensure cross platform usage. Therefore, any DOM usage should provide the
navigator.language as the initial value for I18nProvider lang prop.
- feat(cactus-i18n): only load supported languages [859a998](https://github.com/repaygithub/cactus/commit/859a9987023f39f97b9d3d6f3eaeddefecc46bc7)
- feat(cactus-i18n): merge sections into a single bundle per language [27d778a](https://github.com/repaygithub/cactus/commit/27d778ab5f2bc9ecd44799f8cf4f210aaffb4af1)
  - 🧨 BREAKING: all keys in a given section must be prefixed with the pattern:
<section>__<id> so that there are no conflicts when merging the resources into
the single bundle.
- chore(cactus-i18n): update changelog [77c017b](https://github.com/repaygithub/cactus/commit/77c017b45d0c3acae469a76f5487bdcf178c80c2)

## [@repay/cactus-web@v0.7.2](https://github.com/repaygithub/cactus/commit/c3b00bc6115c9b6601a2aed59a409f7627424c4d)

- fix(cactus-web): Fix buttons in header toggling accordion [d6a77de](https://github.com/repaygithub/cactus/commit/d6a77de4892d7fd1aad602f47d6c4e69b41dabd1)
- fix(cactus-web): Use a do while loop to determine if the accordion should toggle [591cd25](https://github.com/repaygithub/cactus/commit/591cd251283db29424c7928d1bc7b077762cd2d5)
- fix(cactus-web): Fix buttons in header toggling accordion [770b877](https://github.com/repaygithub/cactus/commit/770b8771b15d97661dc7367e5a39b56e996f4cf0)
- chore(cactus-web): update changelog [0499f3d](https://github.com/repaygithub/cactus/commit/0499f3d01f03bfbfbddf1cc39a29e162e1af30ec)

## [@repay/cactus-i18n@v0.2.2](https://github.com/repaygithub/cactus/commit/e54664d0c27fbe374b01d8242771baafa806907a)

- feat(cactus-i18n): upgrade project fluent libraries [84f04f1](https://github.com/repaygithub/cactus/commit/84f04f152c0b37267ac156d093d4b42e236bc21a)
- chore(cactus-i18n): update changelog [23e9ceb](https://github.com/repaygithub/cactus/commit/23e9ceb13b345c03c0ef4ecf4e5928b1d448c6c4)

## [@repay/cactus-web@v0.7.1](https://github.com/repaygithub/cactus/commit/a95959a304d9c5819354f62b66bfc66d094e5770)

- feat(cactus-web): Add outline variant & render prop to accordion [3da2323](https://github.com/repaygithub/cactus/commit/3da2323f7d60a504c877616cf01bf9124bdd071a)
- docs(cactus-web): add accordion variant to basic story [d1682e1](https://github.com/repaygithub/cactus/commit/d1682e1feb8ac087046076c787afc48d6b4f00aa)
- chore(cactus-web): Add example rules page with new accordions to example app [62ee9f9](https://github.com/repaygithub/cactus/commit/62ee9f99ded8bf195c51ab4270e11289f637cb76)
- docs(cactus-web): Update accordion docs & stories [567362f](https://github.com/repaygithub/cactus/commit/567362fde3b7eb9a21e34accf7c9b32bc7cdc686)
- feat(cactus-web): Add outline variant and render prop to accordion [c3e9ae3](https://github.com/repaygithub/cactus/commit/c3e9ae39cd5aa9ccafad53426727d91c6d8d383d)
- chore(cactus-web): update changelog [16eaea8](https://github.com/repaygithub/cactus/commit/16eaea892d5bd5cafad5f705f49a827ca359a9f4)

## [@repay/cactus-web@v0.7.0](https://github.com/repaygithub/cactus/commit/6bf9b4ef24c391c67f7d8e7b84af560faad995bb)

- feat(cactus-web): default datetime format includes T separator for ISO [78bd19f](https://github.com/repaygithub/cactus/commit/78bd19f94f4292c8003210b0be91ffec86da7614)
  - 🧨 BREAKING: the default datetime format for the DateInput and DateInputField
now includes a T separator. No change is necessary if already using an ISO8601
date parser.
- fix(cactus-web): fix DateInput string value parsing [510f497](https://github.com/repaygithub/cactus/commit/510f497eaaab8f46d6d2724cf459b02562f578b1)
- chore(cactus-web): update changelog [adf2c48](https://github.com/repaygithub/cactus/commit/adf2c48c2481e19b0c5da0314d5681eae9b522d8)

## [@repay/cactus-web@v0.6.4](https://github.com/repaygithub/cactus/commit/4629f11a46051430c1fa671fe695e780315c6e54)

- fix(cactus-web): firefox differences in timezone offsets (#193) [4ee1263](https://github.com/repaygithub/cactus/commit/4ee1263646e28c36fd7e63eac9c4c2fe953ebd7a)
- fix(cactus-web): Remove 600 font weight in accordion header [692b6af](https://github.com/repaygithub/cactus/commit/692b6af42bcdae7a83ffedce2eb200225076c51c)
- fix(cactus-web): Remove 600 font weight in accordion header [1f21686](https://github.com/repaygithub/cactus/commit/1f21686ff364fcfe4f049d963145da73c44eb11a)
- chore(cactus-web): update changelog [c7e606e](https://github.com/repaygithub/cactus/commit/c7e606ece3e93ee662895cb318f5d32b233f1485)

## [@repay/cactus-web@v0.6.3](https://github.com/repaygithub/cactus/commit/13fee680f823d5bf01cb80d66004022650a7a90d)

- refactor(cactus-web): Move accordion arrow to the left side [6d3d8b9](https://github.com/repaygithub/cactus/commit/6d3d8b90fd0438c7b2179bb65f59957197541f01)
- refactor(cactus-web): Move accordion arrow to the left side [ecd0f11](https://github.com/repaygithub/cactus/commit/ecd0f11c8fed372ae6227ee945f58726d09e1e11)
- fix(cactus-web): Provide more space for elements in accordion header [43374d4](https://github.com/repaygithub/cactus/commit/43374d4ffb7ec810974f289f37e24d5a2f29fa5d)
- fix(cactus-web): stabilize time on large year changes in DateInput [dae9cf9](https://github.com/repaygithub/cactus/commit/dae9cf9acf82a6c45507b07f6579844b92bed10d)
- feat(cactus-web): allow refs on TextInput for focus control [6d7de41](https://github.com/repaygithub/cactus/commit/6d7de41c7a7e22e9c2b5fda52a91540d5c13104f)
- feat(cactus-web): adds AccessibleField component and hook (#188) [435a3b0](https://github.com/repaygithub/cactus/commit/435a3b0f29abd6bc8f454a3e69cb244f3146a42e)
- fix(cactus-web): Set aria-disabled='true' on accordion arrow icons [b755f21](https://github.com/repaygithub/cactus/commit/b755f21159fb2da363cf3107c8c4c6e7edf47a39)
- fix(cactus-web): date input changes time with large year changes (#189) [7dd76f0](https://github.com/repaygithub/cactus/commit/7dd76f0b70b04ef81577f88db9daeba28025129f)
- feat(cactus-web): Require label OR aria-labelledby prop on IconButton [ef63006](https://github.com/repaygithub/cactus/commit/ef630063b2d0e24217f8f4fbf5ad35cebc7b5378)
- docs(cactus-web): Update Accordion docs & stories [9aee63f](https://github.com/repaygithub/cactus/commit/9aee63fbce7dae79b1a5813ebb477c99c7ebfb37)
- feat(cactus-web): BREAKING - Provide more space for content in accordion headers. Make header containers divs instead of buttons [7886d43](https://github.com/repaygithub/cactus/commit/7886d43a55722eea6636e0a3173ddc8321d4969d)
- chore(cactus-web): update changelog [d88a889](https://github.com/repaygithub/cactus/commit/d88a889e72276e5d78c18da5675e6ebd76795c8e)

## [@repay/cactus-web@v0.6.2](https://github.com/repaygithub/cactus/commit/2802e630763539c7a8a90ce107a00b08ca3745cf)

- fix(cactus-web): Date objects to have correct year when less than 100 (#186) [c239a3a](https://github.com/repaygithub/cactus/commit/c239a3a0e8353628cdd5f2853f0312806026a497)
- fix(cactus-web): Handle nested accordions [a2c15b4](https://github.com/repaygithub/cactus/commit/a2c15b4255cc0f839398ae3d479d213da734c718)
- chore(cactus-web): Swap divs for Boxes in accordion stories [abe4d28](https://github.com/repaygithub/cactus/commit/abe4d289f26b81b237e3e8b3a9b3d11e9c705638)
- chore(cactus-web): Add nested accordion story [1e87d3b](https://github.com/repaygithub/cactus/commit/1e87d3bf1e8d2a9d1a72e7f5bba31284290fd175)
- fix(cactus-web): Handle nested accordions [4cda52c](https://github.com/repaygithub/cactus/commit/4cda52c8d9cab097e494b27067faa6db02f8f54c)
- chore(cactus-web): update changelog [4499ac4](https://github.com/repaygithub/cactus/commit/4499ac4163ba0566137437780b6db32838b01f45)

## [@repay/cactus-web@v0.6.1](https://github.com/repaygithub/cactus/commit/65eb1246d476a78753ba6c4e1d73a738c45290ee)

- fix(cactus-web): account for firefox specfic text alignments [3b56da0](https://github.com/repaygithub/cactus/commit/3b56da0e1e1edf951eed76dccee970865a3f87cb)
- fix(cactus-web): mobile key capture in DateInput [b601145](https://github.com/repaygithub/cactus/commit/b60114508f2f137bbd5e05f7e98da03154d3def4)
- feat(cactus-web): hide text selection in DateInput [ba4a017](https://github.com/repaygithub/cactus/commit/ba4a0174c365b85f32cce54bee3c74cec00ed595)
- fix(cactus-web): zero padding for firefox in DateInput [d3ebc83](https://github.com/repaygithub/cactus/commit/d3ebc832e0a565c9374561bd308e03ff2dfc49bc)
- feat(cactus-web): Allow user to initially render accordions open [b513ae9](https://github.com/repaygithub/cactus/commit/b513ae94d204237610f9f472b3e193fca0d37906)
- refactor(cactus-web): Combine useEffects in accordion [7c9ca59](https://github.com/repaygithub/cactus/commit/7c9ca5909efe2c1af29b21da7cd686d72e16be6f)
- fix(cactus-web): Make accordion header button type=button [3b36858](https://github.com/repaygithub/cactus/commit/3b36858023ace65d8494f1b98419553b012d1daa)
- refactor(cactus-web): Change initially open prop name [9e8b0db](https://github.com/repaygithub/cactus/commit/9e8b0db68fbfad5bf7e0579519db70f3b1fe473f)
- fix(cactus-web): provide default for ssr in getLocale [1ac5bef](https://github.com/repaygithub/cactus/commit/1ac5befde92a51a5f3a0438a952cdb2de65e8c4c)
- chore(cactus-web): Upgrade cactus in example app [ac78add](https://github.com/repaygithub/cactus/commit/ac78add8d6d680c1f4ffc091d0b39e632eb22432)
- feat(cactus-web): Allow user to initially render accordions open [6da99e0](https://github.com/repaygithub/cactus/commit/6da99e02ce47b251dece9540bcee65f35c2099e2)
- chore(cactus-web): update changelog [a669c2b](https://github.com/repaygithub/cactus/commit/a669c2b3828b2c78d9c36adf1bf745a33b788da8)

## [@repay/cactus-web@v0.6.0](https://github.com/repaygithub/cactus/commit/f16d3e7b561c1a1f10539498d736b0ba1ddbcd5b)

- refactor(cactus-web): Use data-role attribute for focus mgmt & pass props.id to useId [38d96ab](https://github.com/repaygithub/cactus/commit/38d96aba9b4ffa817b91fff7ffc928c2423c3676)
- docs(cactus-web): update accordion docs & examples [734c86a](https://github.com/repaygithub/cactus/commit/734c86a3d4dfdbf231cd148d2304676943c37928)
- fix(cactus-web): BREAKING - Include accessibility features in the accordion [4b5f33e](https://github.com/repaygithub/cactus/commit/4b5f33e81708da5d6d332d6b94e3cc3304105730)
- refactor(cactus-web): Update wording on no options placeholder [a9efdb4](https://github.com/repaygithub/cactus/commit/a9efdb484443f6eb9cf653aed65dcc4d8f5eb2db)
- refactor(cactus-web): Update wording on no options placeholder [60f7c0b](https://github.com/repaygithub/cactus/commit/60f7c0bc163e8692de7a08021be45b702c84633d)
- feat(cactus-web): Disable & provide placeholder when options are empty [035c3fd](https://github.com/repaygithub/cactus/commit/035c3fd40e75142ca29ff3e1f5f63bfcdf2e9d99)
- chore(cactus-web): update changelog [061e775](https://github.com/repaygithub/cactus/commit/061e775c839cf2f9062019f442a9ab3ce93e6930)

## [@repay/cactus-web@v0.5.8](https://github.com/repaygithub/cactus/commit/53fe7776fa1d26829ed9cc07295b5650981feeba)

- fix(cactus-web): Fix how we decide to make an option the create option [021e927](https://github.com/repaygithub/cactus/commit/021e927fc130915fce10eb78f37935418c821eac)
- fix(cactus-web): Fix how we decide to make an option the create option [cb26b34](https://github.com/repaygithub/cactus/commit/cb26b345ba1bf4251c6ae34cab5eacfd237408f6)
- refactor(cactus-web): Update types for tooltip position function [39d8c79](https://github.com/repaygithub/cactus/commit/39d8c79f685c38620bf83ccc8a25449d8f4d6d42)
- fix(cactus-web): Fix options from values displaying in reverse order [3c5743c](https://github.com/repaygithub/cactus/commit/3c5743c75aafcd87f00ca0152276090265c6df19)
- refactor(cactus-web): Update select to use new @reach/rect refs [1227d52](https://github.com/repaygithub/cactus/commit/1227d5269db132ce2b03dc6f11c5d51d2fab81f0)
- refactor(cactus-web): Rewrite Tooltip using newest version [0ce354a](https://github.com/repaygithub/cactus/commit/0ce354a260b3ee1008db1d21b362aedd85637c50)
- chore(cactus-web): upgrade @reach dependencies [ac9aceb](https://github.com/repaygithub/cactus/commit/ac9aceb95ff6096fa5bd0b13cdccaf1740083204)
- chore(cactus-web): update changelog [16cd286](https://github.com/repaygithub/cactus/commit/16cd286d3ff7783144330487f9ce8eb7f4ea5e1e)

## [@repay/cactus-web@v0.5.7](https://github.com/repaygithub/cactus/commit/caeda5f352c6e46c05868e650ae9d4e9fc9fdf71)

- fix(cactus-web): css fixes for MenuButton [45f95e8](https://github.com/repaygithub/cactus/commit/45f95e8da6208e54ac7a2d969707d68b0a2c56bc)
- fix(cactus-web): Check that relatedTarget is HTMLElement before calling any of its functions [af28d64](https://github.com/repaygithub/cactus/commit/af28d64e24b67bd94bd34d771000603a667e7179)
- fix(cactus-web): disappearing time inputs when new Date provided [c3862c9](https://github.com/repaygithub/cactus/commit/c3862c9691eee1cd6a017b9c94727b3e8544b70e)
- fix(cactus-web): add background to dropdown list [c731477](https://github.com/repaygithub/cactus/commit/c73147771e1ded59bbd919af093e9d2840bd60aa)
- chore(cactus-web): update changelog [02a4839](https://github.com/repaygithub/cactus/commit/02a48397e45a0aa2072a0aeaefeea7fb5cf06424)

## [@repay/cactus-web@v0.5.6](https://github.com/repaygithub/cactus/commit/b5ba47871641ba4494afb5037f70c0adb4ffd5a4)

- fix(cactus-web): Detect values that need to be added to options [db2b6d7](https://github.com/repaygithub/cactus/commit/db2b6d72ab55910b93d0b0e889442192484d59ee)
- fix(cactus-web): Detect values that need to be added to options [38868bb](https://github.com/repaygithub/cactus/commit/38868bbedfefd8a7ec74c1660dfd31338831b727)
- feat(cactus-web): add MenuButton [2fedd90](https://github.com/repaygithub/cactus/commit/2fedd904d631e84070b3fefb3b8a3b4f0cff4def)
- chore(cactus-web): update changelog [4acb64e](https://github.com/repaygithub/cactus/commit/4acb64e10227f2dc3b6fffa75e09343b12b4288b)

## [@repay/cactus-web@v0.5.5](https://github.com/repaygithub/cactus/commit/465c3aa07a71c5919e1554d00b13d01d918a7c73)

- feat(cactus-web): Add combobox functionality to select [b8bcb37](https://github.com/repaygithub/cactus/commit/b8bcb3752f4218acfc4e20e4e31f17b3471a8b1f)
- fix(cactus-web): Apply dialog role to list wrapper [fec7dad](https://github.com/repaygithub/cactus/commit/fec7dadad3f10fd5f234ec57fcbacde135e5304d)
- fix(cactus-web): Don't show create option if there is no search value [5d9b178](https://github.com/repaygithub/cactus/commit/5d9b178d365272aecaad446d51e531d45c823038)
- feat(cactus-web): Add combobox functionality to select [6a94cd3](https://github.com/repaygithub/cactus/commit/6a94cd30661e46e54e1e52f993b757550daf3c23)
- feat(cactus-web): null value to DateInput raises Date (#169) [010d6ec](https://github.com/repaygithub/cactus/commit/010d6ec6f23b2e29c0c3a773cf6a517776a812d7)
- fix(cactus-web): DateInput listens to changing type [1744f59](https://github.com/repaygithub/cactus/commit/1744f597f9a785cac44125046a32552b5cfc655f)
- feat(cactus-web): complete DateInput proptypes [005545f](https://github.com/repaygithub/cactus/commit/005545fbe9fb8109554180a2c3a7b6e9e39651ee)
- docs(cactus-web): finish docs for DateInput(Field) [afd532b](https://github.com/repaygithub/cactus/commit/afd532b060de7c2d0cf8cb77289dc204fae0953d)
- feat(cactus-web): add DateInput and DateInputField components [225734d](https://github.com/repaygithub/cactus/commit/225734d744e8799ad5eca271487fc6ecf9ed9008)
- fix(cactus-web): allow ssr [eb55302](https://github.com/repaygithub/cactus/commit/eb553020b92e9216d15eab8669036d6014efd80d)

## [@repay/cactus-i18n@v0.2.1](https://github.com/repaygithub/cactus/commit/1d5d859613e990a285c8a24ace85afda2d1c2406)

- feat(cactus-i18n): allow section language override (#113) [d31f5aa](https://github.com/repaygithub/cactus/commit/d31f5aa4c87362932305c3d5d293340e95d950eb)

## [@repay/cactus-web@v0.5.4](https://github.com/repaygithub/cactus/commit/fbda5e83406068fb154eb70d730e7c843ee98258)

- fix(cactus-web): Ensure breakpoint order will always be consistent [2f91910](https://github.com/repaygithub/cactus/commit/2f91910519353b954bd9dd83ad7b0180568e42df)
- feat(cactus-web): Add more mobile optimized select dropdown [ba7bef3](https://github.com/repaygithub/cactus/commit/ba7bef38493b890bc27d279d40755ca7c4a6791c)
- feat(cactus-web): Add danger variant to button [869430d](https://github.com/repaygithub/cactus/commit/869430dae8504db8ccfb402c96579fcccf055867)
- feat(cactus-web): Add danger variant to icon button [26b1e21](https://github.com/repaygithub/cactus/commit/26b1e21244044cb162ba0712168f2f376c33c5ea)
- refactor(cactus-web): Set general alert padding to 16px [a890085](https://github.com/repaygithub/cactus/commit/a8900858847f9a3ba1b9c8304b82ccd8064d5783)
- refactor(cactus-web): New toggle styles [ef9c109](https://github.com/repaygithub/cactus/commit/ef9c1092e668ce6e48c1f60d03c028d56dcf9333)

## [@repay/cactus-theme@v0.4.5](https://github.com/repaygithub/cactus/commit/827cdc94f96a891e367f3d25ee6930c9637ca9cc)

- feat(cactus-theme): Add danger dark color to theme [7b376af](https://github.com/repaygithub/cactus/commit/7b376af09ab3f5cc5fcb838c2fad74262e611e2f)

## [@repay/cactus-web@v0.5.3](https://github.com/repaygithub/cactus/commit/a97ab14f3690f7461bc106b62cbe620777c5fa5f)

- refactor(cactus-web): Use data-role rather than role for close buttons [641f54a](https://github.com/repaygithub/cactus/commit/641f54a65dad0e2b67b1cc872ddbffed1c3fe41b)
- fix(cactus-web): Capture click events at the trigger level [90274d4](https://github.com/repaygithub/cactus/commit/90274d45a775fea85bdd0d3d4783dd369b911701)
- chore(cactus-web): Add polyfill helpers to sideEffects [c886a1e](https://github.com/repaygithub/cactus/commit/c886a1ec3818aadda6e2d828a0b2a70b823a82a4)
- fix(cactus-web): Make clickable area around 'X' larger in multiselect tags [2843bac](https://github.com/repaygithub/cactus/commit/2843bacf22eac5d77804883c4dbabf19d2c0b540)
- fix(cactus-web): Click checkbox to add values in multiselect [8f83b8a](https://github.com/repaygithub/cactus/commit/8f83b8a332660646ce578d0150524a1c6a11ebe3)
- refactor(cactus-web): Swap location of toggle & label in ToggleField [c855d3b](https://github.com/repaygithub/cactus/commit/c855d3b2b47c6964152839048e687dcf51986d6d)
- refactor(cactus-web): Update border colors & widths [67ac636](https://github.com/repaygithub/cactus/commit/67ac63605de9aba019edbc87dfa6c351fa223478)
- refactor(cactus-web): Set label font weight to 600 [8c09edd](https://github.com/repaygithub/cactus/commit/8c09eddf4ec1d3bbff0b8599933bf8faec398933)

## [@repay/cactus-web@v0.5.2](https://github.com/repaygithub/cactus/commit/e578224d529265b451c4eb8365fe52c2b832fed4)

- fix(cactus-web): Add value to select memoization [de3e8aa](https://github.com/repaygithub/cactus/commit/de3e8aae97a396cc83ce96ad8de86ca516ec42cc)

## [@repay/cactus-web@v0.5.1](https://github.com/repaygithub/cactus/commit/3c03d05f209bfc7be119911182768486becb978c)

- fix(cactus-web): Set select height to 32px [de8333c](https://github.com/repaygithub/cactus/commit/de8333c2c423b01a455d784e8087cf96febcd6b3)

## [@repay/cactus-web@v0.5.0](https://github.com/repaygithub/cactus/commit/2b2dce1c9c07759769c17092b11e47f785c306eb)

- feat(cactus-web): Persist value in hidden file input [20a38cf](https://github.com/repaygithub/cactus/commit/20a38cfd6081c8db9b99d89ddcd0220c3ced9f03)
- feat(cactus-web): Make accept optional on FileInput [d536d64](https://github.com/repaygithub/cactus/commit/d536d646b9d4a6fe60f0443c24ba4d0b6ef89ebb)
- feat(cactus-web): BREAKING 🧨 Include entire dataURL in FileInput values [e052f93]https://github.com/repaygithub/cactus/commit/e052f933f15510bdf693c08a7abe901f0a3c6f47
- feat(cactus-web): BREAKING 🧨 Select allows multiselect [04e4b31](https://github.com/repaygithub/cactus/commit/04e4b314f39e681e42aa92a00f5b8bd5c620be10)
- fix(cactus-web): Prevent file input from growing to 100% of parent width [8086425](https://github.com/repaygithub/cactus/commit/8086425bffeab45440d20c854578ab1fc3f64a78)

## [@repay/cactus-web@v0.4.14](https://github.com/repaygithub/cactus/commit/dd0a2da9eb7571c6bf1da1f56c96c12c4edf74f9)

- chore(): Upgrade to @repay/cactus-icons v0.6.1 [6f60cf7](https://github.com/repaygithub/cactus/commit/6f60cf75734ddc8a40766d225f5f2d871046d5ea)
- feat(cactus-web): Add resize prop to TextArea [1cdf8f6](https://github.com/repaygithub/cactus/commit/1cdf8f62895b8a3e7a5ef0766c8d355f316b7286)
- fix(cactus-web): Allow number values in Select PropTypes [8df3aee](https://github.com/repaygithub/cactus/commit/8df3aee63004283cecfce963d8a292ed6bdd4be6)
- fix(cactus-web): Remove BackgroundColor from Box [5a8f8cf](https://github.com/repaygithub/cactus/commit/5a8f8cffd51b63217e043765db6b5170cc057263)
- fix(cactus-web): Allow Select to receive empty options & numbers [7bdb731](https://github.com/repaygithub/cactus/commit/7bdb731da11568b95437ab80937f6fcc0d9e1593)
- feat(cactus-web): add typography styling to Box and Flex [56d3c4d](https://github.com/repaygithub/cactus/commit/56d3c4d375fcfc0c03652dd91d3feac4263016a9)
- perf(cactus-web): use iconSizes from icons [a9359ce](https://github.com/repaygithub/cactus/commit/a9359ce76cccd713e514294bfab2edcda3038254)
- feat(cactus-web): add min and max height to Box and Flex [5c5f876](https://github.com/repaygithub/cactus/commit/5c5f876e02202b6c0f22b9ce2b0961567eb76dd2)

## [@repay/cactus-icons@v0.6.1](https://github.com/repaygithub/cactus/commit/1215a88461e6654873dbda407ff020905a23928b)

- feat(cactus-icons): add verticalAlign prop [a8949b4](https://github.com/repaygithub/cactus/commit/a8949b4ef858ed56af673d4cd5e217828a555696)
- feat(cactus-web,cactus-icons): upgrade styled-system to v5 [cc09e05](https://github.com/repaygithub/cactus/commit/cc09e05942893f3da700704e50dc59ddf1fa1146)

## [@repay/cactus-web@v0.4.13](https://github.com/repaygithub/cactus/commit/4c2e245eaf35c7e9ebfacafdda9ca9d7fc96f121)

- test(cactus-web): Remove unnecessary references to parentElement in select tests [01070e4](https://github.com/repaygithub/cactus/commit/01070e47c476bf4cd2b511dff74ce48dde23ddb8)
- test(cactus-web): Add test for Select value bug [7085d73](https://github.com/repaygithub/cactus/commit/7085d733cbaa37ad6ceeaece48abdc9723f12975)
- fix(cactus-web): Ensure empty select option has the same height as others [6b3d575](https://github.com/repaygithub/cactus/commit/6b3d57511d877905bcd2444f81e3a52b62360a74)
- fix(cactus-web): Fixed Select when value passed is not in options [ab992f5](https://github.com/repaygithub/cactus/commit/ab992f52457ff3d5747964bf35141b926899c51e)
- fix(cactus-web): Set flex-basis on alert avatar in IE [fabd660](https://github.com/repaygithub/cactus/commit/fabd66062d7439cd1c697f54afffa5676bd52a29)
- fix(cactus-web): Make select option ids unique enough to use getElementById [2afed83](https://github.com/repaygithub/cactus/commit/2afed8317c0e40c40219af8b32d6bdeda85bb4ff)

## [@repay/cactus-web@v0.4.12](https://github.com/repaygithub/cactus/commit/2857c72a8c6832a05317e07d6b5108c6cff912e9)

- fix(cactus-web): adjust accordion height when open [185e00b](https://github.com/repaygithub/cactus/commit/185e00b536332f0ca88187373c146811396d5ed5)
- fix(cactus-web): fix tooltip width drift [c8f1059](https://github.com/repaygithub/cactus/commit/c8f10598c2ccd30c81d3c15fe1ba5ae8e6108646)
- feat(cactus-web): update styles for input statuses [2446e89](https://github.com/repaygithub/cactus/commit/2446e893b96d3b825ca595bd6b67859e3fa3a8a8)
- feat(cactus-web): add width prop to Card [0bef3f8](https://github.com/repaygithub/cactus/commit/0bef3f8cac4f11ca03caa1bc8f259a45e3f28d3e)
- refactor(cactus-web): simplify Alert [b666f1c](https://github.com/repaygithub/cactus/commit/b666f1cd4085022e1c6dbd423a1ce28da541cbea)
- fix(cactus-web): fix avatar icon color [c781f72](https://github.com/repaygithub/cactus/commit/c781f726c7b803292a6eb137a5b6736c0c2414db)

## [@repay/cactus-web@v0.4.11](https://github.com/repaygithub/cactus/commit/aa5c13b07778dd48eab0a779b2d69538702effb9)

- fix(cactus-web): Refactor option id replace regex [9a499b8](https://github.com/repaygithub/cactus/commit/9a499b88680146e95964a6cac9f18993779a6589)
- fix(cactus-web): Remove special characters in select ids [4787fb8](https://github.com/repaygithub/cactus/commit/4787fb863e8aff6c5f01acd912353a55154d089f)
- fix(cactus-web): Set correct height & border color on inputs [5391a8e](https://github.com/repaygithub/cactus/commit/5391a8e7159e76dc864c9379c85401a9020ddc13)

## [@repay/cactus-web@v0.4.10](https://github.com/repaygithub/cactus/commit/4d837c65988faf3427c55e3e734c5569638a589f)

- feat(cactus-web): Standardize onFocus & onBlur event handlers [c639edc](https://github.com/repaygithub/cactus/commit/c639edc2768c5846b6ba30981f6a815cfdfc4af4)

## [@repay/cactus-web@v0.4.9](https://github.com/repaygithub/cactus/commit/d1c71da25ba0e66e7ccd3c4ac40dfc970550d668)

- fix(cactus-web): Remove accidentally exported props [ca9c51f](https://github.com/repaygithub/cactus/commit/ca9c51f7df9a950086a952737c693945ffe24e42)
- feat(cactus-web): Add FieldWrapper component [3e2f80d](https://github.com/repaygithub/cactus/commit/3e2f80d41685bf83ec45c98013eec7eade201008)

## [@repay/cactus-web@v0.4.8](https://github.com/repaygithub/cactus/commit/a4da69a03481805b6c6912cdbaf79773340ef76c)

- fix(cactus-web): Add button label [2f72d13](https://github.com/repaygithub/cactus/commit/2f72d132add24cf4720d2db7e1e140ceeee98711)

## [@repay/cactus-web@v0.4.7](https://github.com/repaygithub/cactus/commit/4991cd79bd55252d441aa4edba9b3f8729f587f7)

- fix(cactus-web): Use Icon button [2db89bf](https://github.com/repaygithub/cactus/commit/2db89bf07cb209d1f42fa9e2cd993efb55139d24)
- feat(cactus-web): Refactor code and add close button if "onClose" is set [76f76ee](https://github.com/repaygithub/cactus/commit/76f76ee2b4d5e760102363a6689670c40bd4f3ec)

## [@repay/cactus-web@v0.4.6](https://github.com/repaygithub/cactus/commit/5845070b7d1faa7aea1cf7bcaf257f3b8f0fb6f8)

- fix(cactus-web): in line box shadow [688b1c5](https://github.com/repaygithub/cactus/commit/688b1c5e6a4ca0d368d331df2918e234147f26cd)
- fix(cactus-web): Update spacing for nested card components [37568b3](https://github.com/repaygithub/cactus/commit/37568b36ab5346ba15c738ac5bec5456f55f17b8)
- feat(cactus-web): Update Shadow [dbfb481](https://github.com/repaygithub/cactus/commit/dbfb48184ce988903589504d72a2e92359600bd0)
- fix(cactus-web): make push default [b032841](https://github.com/repaygithub/cactus/commit/b032841875ec03dc38a9f7ac91785c94bafa838d)
- fix(cactus-web): Make ALert width responsive, and adjust layout of push to work with any width. [6b3be8b](https://github.com/repaygithub/cactus/commit/6b3be8b7702405e96240585cac4d0331407c473e)
- fix(cactus-web): Allow larger accordion height. [ee6b9a0](https://github.com/repaygithub/cactus/commit/ee6b9a01ac438009245454e22dbc2d41755724ea)
- feat(examples): Add example app as a mock ebpp. Implements various cactus components. [f0f27fb](https://github.com/repaygithub/cactus/commit/f0f27fbeb1ed1d56753735046a835c05aff3f2c8)

## [@repay/cactus-web@v0.4.5](https://github.com/repaygithub/cactus/commit/bb55e816d9adb5f593883cd36538d88c31fc572f)

- feat(cactus-web): Add textStyle prop to Box [5fbe022](https://github.com/repaygithub/cactus/commit/5fbe02282366dcf0899f00df6ef4c49a77de62bd)
- fix(cactus-web): Fix Accordion not closing bug [a1eea2b](https://github.com/repaygithub/cactus/commit/a1eea2b8c9b6db8551ff4c1d7b5c3074cc555e48)
- feat(cactus-web): enable tree-shaking [7f49d37](https://github.com/repaygithub/cactus/commit/7f49d37a367b091f90c37fd3793787ccb2f9e41e)
- fix(cactus-web): Don't pass margin props to inner input element [df33fa6](https://github.com/repaygithub/cactus/commit/df33fa6d459e778aceb41662300e46c6882b8b5e)
- fix(cactus-web): Change line color & add padding to accordion [fac0445](https://github.com/repaygithub/cactus/commit/fac0445a7147923822a398ad4b9d465007962fb2)
- fix(cactus-web): Pass name prop to TextArea & TextInput [59244cd](https://github.com/repaygithub/cactus/commit/59244cd3b23671e0c62abff104ca223c25fec84b)
- fix(cactus-web): Fix Accordion styles [a88c0a7](https://github.com/repaygithub/cactus/commit/a88c0a7809592ff868ec7c5ca167ee38eab32d86)
- feat(cactus-web): Add Accordion component [f83bec9](https://github.com/repaygithub/cactus/commit/f83bec9fefeb3f271f925cb2b4916146750801e6)
- fix(cactus-web): Updated alert component based on PR comments [645705a](https://github.com/repaygithub/cactus/commit/645705ae50419e6ae79436cce85d2abe1d2d84b6)
- feat(cactus-web): Wrote documentation for Alert componenet [a403310](https://github.com/repaygithub/cactus/commit/a40331094e4f480d03eeb69c4b8d31815f11d8be)
- feat(cactus-web): Created Alert (general and push notifications) component [7d0937a](https://github.com/repaygithub/cactus/commit/7d0937a929ade600139b90450a8c6737076297a8)
- feat(cactus-web): Added media queries and breakpoints scale to the style provider [3f481b4](https://github.com/repaygithub/cactus/commit/3f481b4774a44878fdb8c2573ed9cc8862f676d9)

## [@repay/cactus-theme@v0.4.4](https://github.com/repaygithub/cactus/commit/5f56e984eacfaa10bb546080a66ea237f360495b)

- feat(cactus-theme): Add avatar colors to theme [bb69f3f](https://github.com/repaygithub/cactus/pull/108/commits/bb69f3f706256ed88ee77990f3ad354436cf4013)
- feat(cactus-theme): update spaces [d1fd970](https://github.com/repaygithub/cactus/commit/d1fd970a3bf705c5f21218554297f484b0e490da)

## [@repay/cactus-web@v0.4.4](https://github.com/repaygithub/cactus/commit/ead4054504232e03bb0337a4b2e0dfe034695fe3)

- fix(cactus-web): Updated avatar colors to colors that are in the theme [f7d83b7](https://github.com/repaygithub/cactus/pull/111/commits/f7d83b7579bf544515b9190cdf4cb46acaddc79b)
- feat(cactus-web): Add FileInputField component [1939ea3](https://github.com/repaygithub/cactus/pull/110/commits/1939ea37d1522a2ec4e3389df0c75c3f06000661)
- feat(cactus-web): Implemented interactive step story [320d64b](https://github.com/repaygithub/cactus/pull/109/commits/320d64be7cfac718c5c9c09d9b50b59943a6cb25)
- feat(cactus-web): Add file input component [46061de](https://github.com/repaygithub/cactus/pull/108/commits/46061dede9615815a0078950dfde2e3c16b78c2f)
- fix(cactus-web): Updated avatars to display the icons from the actual avatar source code [8da3a57](https://github.com/repaygithub/cactus/pull/105/commits/8da3a579351c03a2e3bb2092e5be8ede7f736a9e)
- feat(cactus-web): Created avatar component [1fd6f40](https://github.com/repaygithub/cactus/pull/105/commits/1fd6f40b5e2d8f182ff973d7dace5f571ce3e82b)
- fix(cactus-web): vertical alignment of radio and checkbox inputs [14a1dec](https://github.com/repaygithub/cactus/commit/14a1dec99db094c392b167ac142b01ebc5f48346)
- 🚨 feat(cactus-web): add propTypes to components [c60a0b3](https://github.com/repaygithub/cactus/commit/c60a0b340d3ed7bd49b28c16d87213329f6c57b1)
- docs(cactus-web): add space to cactus-web api docs [95a5a65](https://github.com/repaygithub/cactus/commit/95a5a658ca6fccafc1de94244b4d02064ddc6e93)
- fix(cactus-web): Allow grid items to contain items with 100% width [94221de](https://github.com/repaygithub/cactus/commit/94221defd2c83a2dd1513735eb95365ed9ad1934)
- fix(cactus-web): move default props after styled upgrade [4b251ce](https://github.com/repaygithub/cactus/commit/4b251cede97c4f5193739c52963a12107a72e228)
- feat(cactus-web): Add new icon button focus state [69c1667](https://github.com/repaygithub/cactus/commit/69c16670254d474039d1e6dd04ea80c7106c1f08)
- feat(cactus-web): Add justify selection to Grid [41e7098](https://github.com/repaygithub/cactus/commit/41e7098874e3dd0a3994abf6a656bc3a5e0cd30d)
- docs(cactus-web): Remove debug from grid & explain media query hierarchy [58159fd](https://github.com/repaygithub/cactus/commit/58159fdad35818a0c94645c962e869d33291b5c2)
- feat(cactus-fwk): Add error boundary component [2d6090d](https://github.com/repaygithub/cactus/commit/2d6090d544554f7fda7c652c7abe54b63fc97aa1)
- feat(cactus-web): Add Grid component [ef43cd5](https://github.com/repaygithub/cactus/commit/ef43cd5b295be6ca0cb6fc1f26e909e4887c1202)

## [Documentation @ 2019-06-24](https://github.com/repaygithub/cactus/commit/96a8f5a004cb487f2b72db581e8dc7e3abbb86d0)

- docs(examples): add Icons page to examples [8a3ce38](https://github.com/repaygithub/cactus/commit/8a3ce38121279c32ee1d693db98f63b2caefea34)
- docs(examples): add form elements example page [e235aed](https://github.com/repaygithub/cactus/commit/e235aed5d8fd538e5f04a11bb28e503984b7eba0)
- website(docs): Used Grid to update principles listed on Language page, based on sugestion from PR. [ee78ec2](https://github.com/repaygithub/cactus/commit/ee78ec2bcfe145edae2cff5c059438945c11a3a0)
- website(docs): Updated Generic Markdown Template to add scrollbar for smaller window sizes. [0efe735](https://github.com/repaygithub/cactus/commit/0efe735761e6c0effcd7089bd1b8d1e5fc189c90)
- docs(website): update props table for mobile view. [eaae83b](https://github.com/repaygithub/cactus/commit/eaae83badb192a838332883c3096d93a02f25e05)
- docs(website): small error in typography documentatin. [ebde063](https://github.com/repaygithub/cactus/commit/ebde0630ad0351565cbcea675c2852d1f1facced)
- docs(website): better sidebar on mobile [d46d41e](https://github.com/repaygithub/cactus/commit/d46d41efdca61877fc2373c3908b8de6fd3f2e2b)
- docs(website): Updated text wrapping for code snippets, for better mobile view readability. [558bb7f](https://github.com/repaygithub/cactus/commit/558bb7f6ba84a47c43f1bf6d24eebe5477204b17)
- docs(website): Added title to tab for some of the documentation pages. [87f1793](https://github.com/repaygithub/cactus/commit/87f17932fb8e4587c185e5fd4e6d2046622701d5)
- docs(website): Changed "Color" page's accessibility tables for mobile view. Minor update to typography page's text for mobile view. [1b893f8](https://github.com/repaygithub/cactus/commit/1b893f8f555eaa992eeead138fe75001b5740102)
- fix(website): allow href for markdown rendering [e285262](https://github.com/repaygithub/cactus/commit/e285262a10107f3f8810216be30bcb08ed83a12f)
- docs(website): Updated and realigned text for mobile view of webpages. [732ad08](https://github.com/repaygithub/cactus/commit/732ad08f1c530b358f1384e31c2a804cc4f4370a)
- docs(website): Updated shared-styles to different table layout in mobile view. [f157735](https://github.com/repaygithub/cactus/commit/f1577356ca330ed063c7c5aec5db2c68188a1749)
- docs(website): Edited minimum width for images on "Typography" page for mobile view. (Still looks a bit small but is as large as screen). [f6aba6c](https://github.com/repaygithub/cactus/commit/f6aba6c81e06bd8cb04562ceeeb60c32057ac628)
- docs(website): Update typography mobile table with more defined line for each section. [8ef5f05](https://github.com/repaygithub/cactus/commit/8ef5f053b5b8dc450e6803d9b41608d810018cc2)
- docs(website): Update website pages for mobile view. Changed typography table style for mobile. Clear floating elements in shared-styles. [](https://github.com/repaygithub/cactus/commit/42e7f699e733d9a0d28f368f9934cbce08e47e4c)
- start tracking docs website changes

## [@repay/cactus-icons@v0.6.0](https://github.com/repaygithub/cactus/commit/020f5131510da3ec72b36a301d23ea3f72333ff9)

- 🚨 feat(cactus-icons): add proptypes [9540ec1](https://github.com/repaygithub/cactus/commit/9540ec176bdc16b839525f0faddf6f466e81d6dd)

## [@repay/cactus-i18n@v0.2.0](https://github.com/repaygithub/cactus/commit/49888fc7a7b3d6bc78d823ae013a731942f3abb0)

- 🚨 feat(cactus-i18n): add prop-types [d6c3809](https://github.com/repaygithub/cactus/commit/d6c3809bce5be4ec98fb39ae135c7037a7cf19d4)

## [@repay/cactus-fwk@v0.4.0](https://github.com/repaygithub/cactus/commit/962e252413474eca9ae8e8cf545f250af0ff9734)

- 🚨 feat(cactus-fwk): finish adding prop-types [3e6007c](https://github.com/repaygithub/cactus/commit/3e6007c02ac02d05d32b85db7e91f566759e0583)
- 🚨 feat(cactus-fwk): Add PropTypes to ErrorBoundary [3f165b5](https://github.com/repaygithub/cactus/commit/3f165b596934bd0ba88e852fc52c991d4b1ae1e3)
- feat(cactus-fwk): Add withErrorBoundary HOC [83b5b65](https://github.com/repaygithub/cactus/commit/83b5b6560b14658416662500cac38c70635c21ef)

## [@repay/cactus-web@v0.4.3](https://github.com/repaygithub/cactus/commit/70ec53052fd46648951fa83d3d6dafec512f9406)

- fix(cactus-web): Ensure we only check theme properties in development, one time per load [7048d0c](https://github.com/repaygithub/cactus/commit/7048d0ca95d733f08f2beb798c6f491714db0879)
- chore(): Update to latest versions of icons & web in website & examples [83dd052](https://github.com/repaygithub/cactus/commit/83dd0521957e5728f6d6c27ab48cf7ffd703a082)
- refactor(cactus-web): Add 4px spacing between icon & text on TextButton [779ee7b](https://github.com/repaygithub/cactus/commit/779ee7b1f2bdd07ffbc88147867453128e635300)
- refactor(cactus-web): Update icon sizing/positioning to match new icons version [5ed9a1d](https://github.com/repaygithub/cactus/commit/5ed9a1d76c6c887faf13f79ce3e56208b8a9d702)
- chore(cactus-web): Upgrade to cactus-icons v0.5.0 [733cdbb](https://github.com/repaygithub/cactus/commit/733cdbb0249e422039ea6d0e4c4ac17ba8cdf729)

## [@repay/cactus-icons@v0.5.1](https://github.com/repaygithub/cactus/commit/85b661d6f8a64fe1cf66985aae8e7b5eb11b1a86)

- fix(cactus-icons): New descriptive-at icon without edges cut off [a38f054](https://github.com/repaygithub/cactus/commit/a38f054fea3201b2fce602c8e625ce2d7b0d5d1d)
- feat(cactus-icons): Update to newest icons [78e5ea5](https://github.com/repaygithub/cactus/commit/78e5ea560250c2cfa64d070d7208b19470c050bc)

## [@repay/cactus-theme@v0.4.3](https://github.com/repaygithub/cactus/commit/2f5784e5da991ca326cc47e59cacb9b04b4ea23e)

- fix(cactus-theme): Change transparent CTA to 25% opacity for accessibility [a035dd4](https://github.com/repaygithub/cactus/commit/a035dd45075318c0eb9f8f40c59500f4ade841b3)
- feat(cactus-theme): Add new transparent CTA color for links [13c6627](https://github.com/repaygithub/cactus/commit/13c662709ba8d8f7d63219576c3eb645454659dc)

## [@repay/cactus-web@v0.4.2](https://github.com/repaygithub/cactus/commit/938f15ce00b3db5fb4a22077b6bcc49bb926f832)

- fix(cactus-web): Fix focus outline on buttons [e7db266](https://github.com/repaygithub/cactus/commit/e7db26641ceb5d65c02097679eea4e7b33d24ff7)
- docs(cactus-web): Text and Span stories [732cdf9](https://github.com/repaygithub/cactus/commit/732cdf9893d375667018ed1d03449dede2752962)
- fix(cactus-web): add aria-hidden to toggle svgs [581981f](https://github.com/repaygithub/cactus/commit/581981f2170935c94414fbb34da12247e3384120)
- feat(cactus-web): adding Text and Span components [4f28c77](https://github.com/repaygithub/cactus/commit/4f28c7704623dfd30bb736e3bb9d774e55b57316)
- feat(cactus-web): add card component [4d109aa](https://github.com/repaygithub/cactus/commit/4d109aad8aeac9c30732973bf28270d8785b602d)
- feat(cactus-web): Add theme property check in StyleProvider [175ae5a](https://github.com/repaygithub/cactus/commit/175ae5a4173c246bc8718c403311f274b370c092)
- refactor(cactus-web): Apply new link designs [971e7b7](https://github.com/repaygithub/cactus/commit/971e7b7d72b892efbaaac5fa5cd396af9939d8bb)
- feat(cactus-web): add Box and Flex components [2f87ec0](https://github.com/repaygithub/cactus/commit/2f87ec06ddf7609eae4ad662bf12039cdc1abd49)
- fix(cactus-web): Update focus state, add new stories, remove text styling for link [9d7046f](https://github.com/repaygithub/cactus/commit/9d7046f28092a09d8da8d18ae2026a5bd17ab540)
- feat(cactus-web): Add Link component [e2a27ef](https://github.com/repaygithub/cactus/commit/e2a27efbf16fe042e09412764bf9ea816ebe87e6)

## @repay/cactus-web@v0.4.1

- fix(cactus-web) export Spinner and SelectField ([0c37fe6](https://github.com/repaygithub/cactus/commit/0c37fe642e034f5c3ab0e7b861ca53f63eebf393))

## @repay/cactus-web@v0.4.0

- feat(cactus-web): clarity for button focus states ([250535](https://github.com/repaygithub/cactus/commit/2505350a4a695fe0458881e3c045352b28f11b84))
- feat(cactus-web): add SelectField ([85a7b63](https://github.com/repaygithub/cactus/commit/85a7b630faf40920c98f3f0b9607aaaa06bf4102))
- refactor(cactus-web): Toggle value as optional with default ([fbf81b](https://github.com/repaygithub/cactus/commit/fbf81b76296ac6ac082cbe7fbf3ba3e629a7401e))
- feat(cactus-web): Add TextAreaField component ([7da2d6](https://github.com/repaygithub/cactus/commit/7da2d629f0fcfa36096f1e37a4a7262c21c67469))
- feat(cactus-web): Make input field accessible ([158943](https://github.com/repaygithub/cactus/commit/1589432b240d97134127946b85acdc19c12486b2))
- feat(cactus-web): add Select component ([d11bd6](https://github.com/repaygithub/cactus/commit/d11bd6278bd351c96b6f15a2b53db7e50bec7593))
- feat(cactus-web): Add TextArea component ([16f14d](https://github.com/repaygithub/cactus/commit/16f14dc33bd9305d6d65849eefb68e538f9b0df6))
- feat(cactus-web): Use px definitions for textStyle line height ([cf42bd](https://github.com/repaygithub/cactus/commit/cf42bd282676bd3bc7f9abc84d138cae9dcd9bf7))
- feat(cactus-web): Add textStyles ([497ea0](https://github.com/repaygithub/cactus/commit/497ea0289c308eddb2b491058152ba185e761276))
  - upgrades cactus-theme version
- feat(cactus-web): use tooltip in TextInputField ([a510df](https://github.com/repaygithub/cactus/commit/a510df00710389f4e35acad1e35b34455c5d3d31))
- feat(cactus-web): add Tooltip component ([f4fa25](https://github.com/repaygithub/cactus/commit/f4fa255477f532b28bf436d3d9a756bd19aaee12))

## @repay/cactus-theme@v0.4.2

- feat(cactus-web): Use px definitions for textStyle line height ([cf42bd](https://github.com/repaygithub/cactus/commit/cf42bd282676bd3bc7f9abc84d138cae9dcd9bf7))
- feat(cactus-web): Add textStyles ([497ea0](https://github.com/repaygithub/cactus/commit/497ea0289c308eddb2b491058152ba185e761276))

## @repay/cactus-web@0.3.2

- feat(cactus-web): add Spinner and button loading state
- fix(cactus-web): Fix line-height & add theme to StyleProvider theme test
- feat(cactus-web): Add TextInputField component
- feat(cactus-web): Add StyleProvider to wrap ThemeProvider and add global styles
- fix(cactus-web): firefox dotted line on focus

## @repay/cactus-theme@0.4.1

- feat(cactus-theme): Add transparent versions of status colors
- feat(cactus-theme): add fontSizes, update spaces to match style guide
