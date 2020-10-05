# Changelog

## [@repay/cactus-web@v3.1.0](https://github.com/repaygithub/cactus/commit/50b46d46832db3a88f7237506ffd9e73468498e4)

- docs(cactus-web): fix ActionBar.Item docs [0edd3d6](https://github.com/repaygithub/cactus/commit/0edd3d607e4800325f1c668063eb500ac3a3ce8a)
- fix(cactus-web): remove experimental key access, use `id` instead [f269788](https://github.com/repaygithub/cactus/commit/f26978887ad0b83b39c68a59e09667bf9a2e54e4)
- fix(cactus-web): fix focus outline on MenuButton in IE11 [a6c5a67](https://github.com/repaygithub/cactus/commit/a6c5a67b139546365d1237771ed46ed687f55e64)
- refactor(cactus-web): decouple Sidebar code from Layout [451d78a](https://github.com/repaygithub/cactus/commit/451d78a01f21ee3313b477a3d6144c392b72624c)
- refactor(cactus-web): add overflow props to Box component [50c3175](https://github.com/repaygithub/cactus/commit/50c31751b7faf73a5eb47ed7e9f402701211c750)
- docs(cactus-web): fix typo [97d9e7c](https://github.com/repaygithub/cactus/commit/97d9e7c6e05fbb7a92f673ec54e15c3a596c2652)
- refactor(cactus-web): add overflow props to Box component [288b1c8](https://github.com/repaygithub/cactus/commit/288b1c8844f3c91d3d991ee2cd45f39c73df287a)
- refactor(cactus-web): remove defaultValue prop, change value prop to checked [4f47382](https://github.com/repaygithub/cactus/commit/4f473829512f0aa803db0726a6f266bfa4f1e87e)
- refactor(cactus-web): put Fieldset in separate file that both RadioGroup & CheckBoxGroup can use [ba7fe01](https://github.com/repaygithub/cactus/commit/ba7fe01cc829b3b27cddd92e5b355403f8519ee5)
- chore(cactus-web): remove reference to includeProps, export default from CheckBoxGroup [e25db35](https://github.com/repaygithub/cactus/commit/e25db35ba2952a689345a7674e5c31714a1c93a9)
- chore(cactus-web): remove react-live from dependencies [5a70fb5](https://github.com/repaygithub/cactus/commit/5a70fb5ee8b817d911b955e5c4da3eb175f9ab9f)
- docs(cactus-web): add CheckBoxGroup docs [39ec76a](https://github.com/repaygithub/cactus/commit/39ec76a96b5316a54670fb32f94f9cdeb76aa585)
- feat(cactus-web): add CheckBoxGroup component [51ddeb4](https://github.com/repaygithub/cactus/commit/51ddeb4fc1724522f56ca3494cccfd0c44ff9ee8)
- refactor(cactus-web): convert CheckBox & CheckBoxField to forwardRef components [45e7fa5](https://github.com/repaygithub/cactus/commit/45e7fa534e41366a2750514b4703b589ccc03dfc)
- feat(cactus-web): add ActionBar component [5c6206c](https://github.com/repaygithub/cactus/commit/5c6206c8281ec4864df6cf7e8fbb4a636e00f906)
- fix(cactus-web): fix logo/menubar alignment on IE11 [d43b9d8](https://github.com/repaygithub/cactus/commit/d43b9d88177bbe95799b9493fd6b4de677037d83)
- fix(cactus-web): change outsetborder to inset border. Fix docs page names [565287a](https://github.com/repaygithub/cactus/commit/565287a96bdf14fd5b66f2652a0c4ab41a9fb478)
- fix(cactus-web): fix dropdown. Change main and subcomponent to prevent the use of as prop [f751f84](https://github.com/repaygithub/cactus/commit/f751f8434a80673416dac8e5bc42283d384925f1)
- fix(cactus-web): remove redundant props on FileInputField [93e238b](https://github.com/repaygithub/cactus/commit/93e238b09e2faad2add0290fc205292ca1c0db50)
- chore(cactus-web): update changelog [8c4b9b5](https://github.com/repaygithub/cactus/commit/8c4b9b56de86b16ab1f353d635d5ebfdd77557a6)

## [@repay/cactus-web@v3.0.0](https://github.com/repaygithub/cactus/commit/544b69b3b3aa2b420b6180d7683526970f06dfc4)

- chore(cactus-web): upgrade cactus-icons to 2.x.x [4957895](https://github.com/repaygithub/cactus/commit/49578955cdcd74f126108f26abb9d93403b00da9)
- perf(cactus-web): alter styled-components peer dependency to v5 only [6cfae83](https://github.com/repaygithub/cactus/commit/6cfae83904322f590b2d386516763a8d300dec16)
  - 🧨 BREAKING: Styled Components v4.x.x can no longer be used as a peer dependency.  An upgrade to
v5.x.x is required.

CACTUS-364
- perf(cactus-web): upgrade Reach packages to improve popover performance [ad30fdc](https://github.com/repaygithub/cactus/commit/ad30fdc6e6898a38af435e33b9293d7989b8497a)
- feat(cactus-web): add useBoxShadow prop to Card [8be2af4](https://github.com/repaygithub/cactus/commit/8be2af40618f412e12bcbe62d2147d585da9730e)
- fix(cactus-web): apply appropriate margin to DataGrid TopSection [a29bbcf](https://github.com/repaygithub/cactus/commit/a29bbcf63012201f1566222d3e9eeeb1776cbff2)
- fix(cactus-web): remove hard-coded text colors on nested cards [dd5c417](https://github.com/repaygithub/cactus/commit/dd5c417499ab4e28be835fd675b3467b524adb2f)
- chore(cactus-web): add some scroll bars to TextInputField story [6e6c63a](https://github.com/repaygithub/cactus/commit/6e6c63ae82cfb752b9f8f6d26b0a0c6d947d1ade)
- fix(cactus-web): fix tooltip positioning on field focus [e050dc7](https://github.com/repaygithub/cactus/commit/e050dc71111e70b7d66dcde3e05f2944dd7b3b74)
- chore(cactus-web): update changelog [1a782c7](https://github.com/repaygithub/cactus/commit/1a782c737d1d05b2b9c832bb98cb4f08473554ae)

## [@repay/cactus-icons@v2.0.0](https://github.com/repaygithub/cactus/commit/eaf0c0e842136348d76620f3d35b8d996314149f)

- perf(cactus-icons): alter styled-components peer dependency to v5 only [c918fde](https://github.com/repaygithub/cactus/commit/c918fdeeefffe2813783edeb010d83ff89779aeb)
  - 🧨 BREAKING: Styled Components v4.x.x can no longer be used as a peer dependency.  An upgrade to
v5.x.x is required.

CACTUS-364
- chore(cactus-icons): update changelog [5204e79](https://github.com/repaygithub/cactus/commit/5204e795ccce9e2446ed947f62828545cc60da75)

## [@repay/cactus-web@v2.1.0](https://github.com/repaygithub/cactus/commit/0fe4551c5cf914ee046b9f581eacbeeed9cbda24)

- fix(cactus-web): call styled-system's width function correctly [b574eea](https://github.com/repaygithub/cactus/commit/b574eea4ac59f06e8f0607ebd6a306cc2c401733)
- fix(cactus-web): fix Select issue when focused [bf99df5](https://github.com/repaygithub/cactus/commit/bf99df51794166fd6f509c9d751690dd957e248b)
- chore(cactus-web): add theme field to force storybook to set everything to border-box [71eb70c](https://github.com/repaygithub/cactus/commit/71eb70cead7c75759a3728b8881bffc0a6da60a1)
- fix(cactus-web): extend from WidthProps, prevent width attr from being passed to td elements [de38843](https://github.com/repaygithub/cactus/commit/de388431e3b003b36887f1de9635c4a44b789026)
- fix(cactus-web): change value to use prop forwarding for performance [d312aea](https://github.com/repaygithub/cactus/commit/d312aead62dca2826ee8f763b9214c3176682456)
- fix(cactus-web): fix ie11 input alignment error [a1c7c42](https://github.com/repaygithub/cactus/commit/a1c7c42b8e6a535eb43fa32829e6b4f2c72c0253)
- fix(cactus-web): remove non-functional `readOnly` prop from RadioGroup [3d31b06](https://github.com/repaygithub/cactus/commit/3d31b068f38cd0d0ab62e3e63c6cd4b20c7987fd)
- chore(cactus-web): remove prop I accidentally left in DataGrid storybook [6adbf9c](https://github.com/repaygithub/cactus/commit/6adbf9c8602ea09c00a7a9eaf363b72c18e62433)
- chore(cactus-web): apply border-box styles to everything in storybooks [05c5bac](https://github.com/repaygithub/cactus/commit/05c5bac0894e4a898bff13e99fdf2478aa83231c)
- fix(cactus-web): fix DataGrid vertical scroll bar when everything is border-box [0d59017](https://github.com/repaygithub/cactus/commit/0d59017fd5a98c5d67359306f16c0f7117f19e68)
- refactor(cactus-web): extend column props from table cell props [86185b4](https://github.com/repaygithub/cactus/commit/86185b4f8835f868bf9735677c313328790a9ad2)
- fix(cactus-web): fix select focus issue [031f345](https://github.com/repaygithub/cactus/commit/031f345bbe41fd46f1dec476b389c54efaa61a34)
- docs(cactus-web): update DataGrid docs [b374366](https://github.com/repaygithub/cactus/commit/b3743661298ef448ef625df06ff1f7229f1f3453)
- feat(cactus-web): pass extra props (including width) to Table.Cell [22be4fc](https://github.com/repaygithub/cactus/commit/22be4fcf71b6ba7cba2e5e2c88d92a7e2fbfde6d)
- feat(cactus-web): call width function in Table Cell [a7bfd76](https://github.com/repaygithub/cactus/commit/a7bfd76181d49e067ba7c38e542fa719b6dcf43e)
- chore(cactus-web): change propTypes peerDependency to >=15.7.0 in cac… [dbe2a85](https://github.com/repaygithub/cactus/commit/dbe2a85fdea18a47661d4d3b8a16130c0074ded1)
- fix(cactus-web): fix ie11 input alignment error [a72c24a](https://github.com/repaygithub/cactus/commit/a72c24aa392e13eb2e6d9abfe557b31fccacf832)
- feat(cactus-web): add RadioGroup component [9bc8f42](https://github.com/repaygithub/cactus/commit/9bc8f422caa531d38e171e2a4a0da54fabfe61a4)
- fix(cactus-web): change transient prop to non-transient [5ea1ffe](https://github.com/repaygithub/cactus/commit/5ea1ffe14174afade1ed10fdfa46b7b1632433b1)
- fix(cactus-web): fix prop being passed all the way down the DOM [5c24eb5](https://github.com/repaygithub/cactus/commit/5c24eb53d2a7bbde469ac3905181a520d9822a81)
- chore(cactus-web): change propTypes peerDependency to >=15.7.0 in cactus-web [b05285e](https://github.com/repaygithub/cactus/commit/b05285ed84ffc93120b9e16888638f0ec354c78f)
- fix(cactus-web): remove redundant code [fbc4d47](https://github.com/repaygithub/cactus/commit/fbc4d475768935412cca20e9703da848ac912756)
- docs(cactus-web): include links to Formik & the Formik example in docs site [a1fd3ff](https://github.com/repaygithub/cactus/commit/a1fd3ff1658234483ec5d38ddca71569feaf6da8)
- refactor(cactus-web): add closeOption to the conditional render of the icon. Add margin props to tag [24a6097](https://github.com/repaygithub/cactus/commit/24a6097247b6edca3b8a214e9ab7e51d9b293685)
- fix(cactus-web): refactor tooltip behavior on the accesiblefield. Add color when it's shown [3df47f3](https://github.com/repaygithub/cactus/commit/3df47f327ea625f519f07951aeb5645ac76108cf)
- fix(cactus-web): handle onBlur and onFocus on DateInputField [bd6342e](https://github.com/repaygithub/cactus/commit/bd6342edb7331c397789c7dc8bad1e519089984b)
- docs(cactus-web): update Box docs [3edcfdb](https://github.com/repaygithub/cactus/commit/3edcfdbfd8ad0d148396f8af411d7a2a0ded4c8d)
- feat(cactus-web): add border radius theming and customizablity to Box [2260efe](https://github.com/repaygithub/cactus/commit/2260efe7651e7d3a479048d96311c9ba6958f145)
- docs(cactus-web): docs for the Tag component [aa5841e](https://github.com/repaygithub/cactus/commit/aa5841eb61e7a4903b7b0a66ea5b08c4ec048e24)
- chore(cactus-web): update changelog [cb242d2](https://github.com/repaygithub/cactus/commit/cb242d242a802540350b6c3ed46caee13aecf311)

## [@repay/cactus-web@v2.0.0](https://github.com/repaygithub/cactus/commit/13ecec3ef19e871987405418d9b5c33bb28c38b5)

- fix(cactus-web): fix conflicts with master [c9b53b5](https://github.com/repaygithub/cactus/commit/c9b53b5c1c4caa3b0a00dd0554c89181a3dbcdbc)
- fix(cactus-web): fix disble style applying even when it's enabled [5acc983](https://github.com/repaygithub/cactus/commit/5acc9830f3037560f162abcb27d33f022d8d797e)
- fix(cactus-web): add colorStyle object to some components [d0cede6](https://github.com/repaygithub/cactus/commit/d0cede60d11213ff32fdf4fd6236c3b010a453fe)
- feat(cactus-web): add more color styles to the theme [8be5ec3](https://github.com/repaygithub/cactus/commit/8be5ec34d87f1eeea61ba84cf61f4dded9280e11)
- fix(cactus-web): pull disable prop from render function or clone element [bcb48df](https://github.com/repaygithub/cactus/commit/bcb48dfa48aaab7f2439bee1333007340bf9d124)
- fix(cactus-web): fix arrow shifting in header buttons in DataGrid [dbc7bfb](https://github.com/repaygithub/cactus/commit/dbc7bfbcf658cebaedb100513455bb100bc1b9b1)
- fix(cactus-web): fix text overflow bug in SplitButton [e2e8dd2](https://github.com/repaygithub/cactus/commit/e2e8dd2622fdbb07e99963bfa3e75594858dfe1a)
- fix(cactus-web): fix calendar disable clickable [dca6460](https://github.com/repaygithub/cactus/commit/dca6460e966ed6c3079f94bb9481b518fdd4cc0c)
- fix(cactus-web): remove blank IDs from dd and yyyy DateInput input elements [f5554d8](https://github.com/repaygithub/cactus/commit/f5554d8ae8f21f00ba90f16a674e1f6c6abb110c)
- fix(cactus-web): match the disable styles to the form elements [1a3eb46](https://github.com/repaygithub/cactus/commit/1a3eb46ce784b91587fac8b8c608f6135c1c8fe6)
- fix(cactus-web): fix integration tests [7c780ca](https://github.com/repaygithub/cactus/commit/7c780ca92115ae382cfb2116f44e9f8895b08f56)
- refactor(cactus-web): clean up CSS helpers for TextInput [4669e6f](https://github.com/repaygithub/cactus/commit/4669e6fe52daf4c0309e17f319641c12faf2c5c2)
- refactor(cactus-web): clean up CSS helpers for TextButton [148ac8c](https://github.com/repaygithub/cactus/commit/148ac8cc57df21fb0d40c67834d26215851901fd)
- refactor(cactus-web): clean up CSS helpers for TextArea [78e5282](https://github.com/repaygithub/cactus/commit/78e5282eb93c5ab3bf24ed225c95591d27a9ba9b)
- refactor(cactus-web): make SplitButton accept JSX [058e7b4](https://github.com/repaygithub/cactus/commit/058e7b46156be57da226c4c6881793a520e246fa)
- refactor(cactus-web): clean up CSS helpers for Modal [eaff624](https://github.com/repaygithub/cactus/commit/eaff6244dc44917e61919c8ccb978b6229e8b102)
- fix(cactus-web): add ref to Link component [9aeb086](https://github.com/repaygithub/cactus/commit/9aeb0869e8ec46ae0abacb088ecf3f72f856d285)
- refactor(cactus-web): remove redundant props from Grid [4eea4cb](https://github.com/repaygithub/cactus/commit/4eea4cbc6aa6caf02e3feaac030bfb27e1db10a6)
- fix(cactus-web): fix DateInput colors [29fd64a](https://github.com/repaygithub/cactus/commit/29fd64afcfb42a195f28a887060b8e344b17e3b7)
- refactor(cactus-web): rename css selector for DateInput month/year title [7dbfe2c](https://github.com/repaygithub/cactus/commit/7dbfe2c35054ce54be53e1330dc0a9d32d80a551)
- fix(cactus-web): fix DateInput colors [72bff82](https://github.com/repaygithub/cactus/commit/72bff82ae1846fbe672064c9af99b7dc6865d37b)
- refactor(cactus-web): make FileInput accept JSX [a18c794](https://github.com/repaygithub/cactus/commit/a18c7947cc8d6f059a1ae7c9b8eefd7c41023310)
- refactor(cactus-web): make DataGrid accept JSX [7dda2b2](https://github.com/repaygithub/cactus/commit/7dda2b2c632eb974ec8ae55821c14884146cd962)
- refactor(cactus-web): make PrevNext accept JSX [42e1009](https://github.com/repaygithub/cactus/commit/42e1009159878a528006d72e6e39aa02c3fdb9c3)
- refactor(cactus-web): simplify MenuButton CSS calls [b345297](https://github.com/repaygithub/cactus/commit/b345297e8c857f1f7667e73dfdaa748db962888f)
- refactor(cactus-web): remove redundant props definition from FieldWrapper [d394571](https://github.com/repaygithub/cactus/commit/d3945711aca5a51281a86950c714676b01923162)
- refactor(cactus-web): make ConfirmModal accept JSX [6720032](https://github.com/repaygithub/cactus/commit/672003243b7b63673f9549e46b744d83d22b3139)
  - 🧨 BREAKING: Removed unused `description` prop.
- refactor(cactus-web): tweak the CheckBox types a bit [704eb12](https://github.com/repaygithub/cactus/commit/704eb123d1aa027bc80f0f856e17b2ec7d46c0db)
- refactor(cactus-web): tweak the Button types a bit [414a9a8](https://github.com/repaygithub/cactus/commit/414a9a8841503c1b130e33d92be8c74e3f9bc23c)
- refactor(cactus-web): make Breadcrumb.Item accept JSX [0bca0a2](https://github.com/repaygithub/cactus/commit/0bca0a2318be008a83a61683e57d6e176d47df8c)
- refactor(cactus-web): remove `ref` prop from Alert [c2c1ba1](https://github.com/repaygithub/cactus/commit/c2c1ba1717d79b0b336252b465a305fc515a67db)
- refactor(cactus-web): tweak the Accordion types a bit [a580c8c](https://github.com/repaygithub/cactus/commit/a580c8c8329d232e6e328b74c4e2498fc6fefa6a)
- refactor(cactus-web): make StatusMessage accept JSX [258d161](https://github.com/repaygithub/cactus/commit/258d1610e0e2f0e2e389451190ce9dad45d6204a)
- refactor(cactus-web): Adjust MenuButton width calculation [d8c6a30](https://github.com/repaygithub/cactus/commit/d8c6a306f8183ecf30d472366ea08a977051cd75)
- chore(cactus-web): Add cardBreakpoint to prop types [b91eb4f](https://github.com/repaygithub/cactus/commit/b91eb4f2863bf64c1252fec9fadbed255a1c4dce)
- fix(cactus-web): make Tooltip accept JSX; stop ignoring `position` prop [01a9866](https://github.com/repaygithub/cactus/commit/01a98666caff173d255be6793017c42b97bf25ac)
  - 🧨 BREAKING: Removed unused props from Tooltip; the component's behavior is unchanged so it
shouldn't break anything functionally, but the type signature is different so it could break
Typescript builds.
- fix(cactus-web): Better MenuButton width calculation, add variant to proptypes [0b61f59](https://github.com/repaygithub/cactus/commit/0b61f591666ea833ba9cef630997df43aea25bb6)
- fix(cactus-web): Use useMemo instead of state, add sort labels to proptypes [9490f58](https://github.com/repaygithub/cactus/commit/9490f582d048e28e65d1335b5c9e1d3b2c9957fa)
- chore(cactus-web): update changelog [428f752](https://github.com/repaygithub/cactus/commit/428f7520ca25407639b0a5e074eb0d05b276db1b)

## [@repay/cactus-web@v1.1.2](https://github.com/repaygithub/cactus/commit/ddcc9062b6b16e47e5b9cddc53eda68850af8bf6)

- fix(cactus-web): add console warning for invalid props [9858f73](https://github.com/repaygithub/cactus/commit/9858f73dde153eb945bf9268c64a44c0dda9a23d)
- fix(cactus-web): fix types when using `as` prop [9ce1eda](https://github.com/repaygithub/cactus/commit/9ce1eda7bc439d3f1675e4796a09607b0de49659)
- refactor(cactus-web): fix Typescript linting errors [817f382](https://github.com/repaygithub/cactus/commit/817f3823b3e670a9e7ecd8bdc40c3da8665a720b)
- fix(cactus-web): get rid of console warning triggered by SplitButton drop-down [993c118](https://github.com/repaygithub/cactus/commit/993c1180c5a063b9e271579f823b93002707cb8d)
- fix(cactus-web): extend border across entire width of nav [31eaecb](https://github.com/repaygithub/cactus/commit/31eaecbb14ec1dfcc5f454e2711120dd24c2ee80)
- fix(cactus-web): close menu when item is clicked [c7cf1fa](https://github.com/repaygithub/cactus/commit/c7cf1fad8900eaa76dc8417732c78c3b3be0aac5)
- fix(cactus-web): fix scrolling algorithm [a347e9e](https://github.com/repaygithub/cactus/commit/a347e9e4e7fae379d2a924a15ff7b349e3113f3b)
- refactor(cactus-web): Apply TS linting rules [09ae435](https://github.com/repaygithub/cactus/commit/09ae43557ca906619a5d39a271e981d883ece933)
- chore(cactus-web): upgrade Styled System [796d52f](https://github.com/repaygithub/cactus/commit/796d52f0ecc40ff9dd73856978a41893c870a1a0)
- chore(cactus-web): upgrade Reach dependencies [c5a7f54](https://github.com/repaygithub/cactus/commit/c5a7f5478723a88ab8062e8e69d6258d7b6adf72)
- refactor(cactus-web): upgrade @types/lodash and adjust omit calls accordingly [99a1b6d](https://github.com/repaygithub/cactus/commit/99a1b6d3e3869da1c3a203c74a965dca754dcb30)
- chore(cactus-web): fix changelog [13fdd55](https://github.com/repaygithub/cactus/commit/13fdd5509d3c3abed4258ea61964efdb9ba32274)
- chore(cactus-web): update changelog [761c54d](https://github.com/repaygithub/cactus/commit/761c54dcea106c736cab75871ef54a38d6c29335)

## [@repay/cactus-icons@v1.0.2](https://github.com/repaygithub/cactus/commit/41fed40cf29a35bff3db0e1c808f85e49178db1f)

- refactor(cactus-icons): Apply TS linting rules [5ccc80e](https://github.com/repaygithub/cactus/commit/5ccc80e3af88913f0fb5890042b7ccf6c8f55af6)
- chore(cactus-icons): upgrade Styled System [7656b9c](https://github.com/repaygithub/cactus/commit/7656b9c5f91b9177590743c9134ef4a52db4681e)
- chore(cactus-icons): update changelog [6caffde](https://github.com/repaygithub/cactus/commit/6caffde34ae39f6e38cd088ab6fe68715fec9175)

## [@repay/cactus-i18n@v1.0.0](https://github.com/repaygithub/cactus/commit/e840b9e5c3cbf48442281025fe13e1039dfffc38)

- refactor(cactus-i18n): Apply TS linting rules [1fac605](https://github.com/repaygithub/cactus/commit/1fac605d8aac9a05ef962486549b07a7a539987e)
- docs(cactus-i18n): add args to the base controller API docs [824bdcc](https://github.com/repaygithub/cactus/commit/824bdcc28c45ea65ef71e533c00048ac83f174f2)
- chore(cactus-i18n): upgrade intl-pluralrules [b54a019](https://github.com/repaygithub/cactus/commit/b54a019eda6db0a385f589c46b82e3c20f7cecdd)
- chore(cactus-i18n): upgrade Fluent packages [bb25712](https://github.com/repaygithub/cactus/commit/bb257120ab57d37b0acf2165215923a416ad893a)
- docs(cactus-i18n): fixed example for i18nController action in docs [847ddb7](https://github.com/repaygithub/cactus/commit/847ddb7d9e7309fd1d77f6c91ae3a22b186ff286)
- docs(cactus-i18n): fixed example for i18Ncontroller action in docs [d73164e](https://github.com/repaygithub/cactus/commit/d73164e0d05a7cace4b95205d101c14e981611d1)
- chore(cactus-i18n): update changelog [cda6e38](https://github.com/repaygithub/cactus/commit/cda6e38f7830c4adaf09a0d6f05473e5367d22a0)

## [@repay/cactus-web@v1.0.2](https://github.com/repaygithub/cactus/commit/8251b7529188ab2faa8f5cf58f1c4e2e6f53f667)

- chore(cactus-web): upgrade @repay/cactus-icons [ddc1673](https://github.com/repaygithub/cactus/commit/ddc167382455ab12eec612596bbfdf63ac89b1c1)
- chore(cactus-web): upgrade @repay/cactus-theme [9a8ef74](https://github.com/repaygithub/cactus/commit/9a8ef74363d464bcd5371333c34ed592a551c3b9)
- fix(cactus-web): fix ConfirmModal text overflow [8c348c9](https://github.com/repaygithub/cactus/commit/8c348c99f4e4f0db1447038308d33a7dfd27c9f1)
- fix(cactus-web): fixed text overfow on IE (again) [9a28839](https://github.com/repaygithub/cactus/commit/9a28839f04c384bb7d9cc6aca39ff3add86784da)
- fix(cactus-web): change word-break to overflow-wrap [a1252bd](https://github.com/repaygithub/cactus/commit/a1252bd0a9752e76684956c82261dbc0790ff3ef)
- fix(cactus-web): fix ConfirmModal text overflow [e400532](https://github.com/repaygithub/cactus/commit/e40053205fe542dc24ea383872eaaaff6d839686)
- feat(cactus-web): upgrade to Styled Components v5 -- peer dependency is now  ^4.1.4 || ^5.0.0 [c90a616](https://github.com/repaygithub/cactus/commit/c90a6163e0a35c5f561768284dcc310e95f0cf34)
- feat(cactus-web): make FileInput border shape follow the setting in the theme [8bae654](https://github.com/repaygithub/cactus/commit/8bae6540adb990fcb18ad57fac99029cd0eafa41)
- fix(cactus-web): Fix space-evenly in IE, define which values are acceptable for Flex props [3f85fa8](https://github.com/repaygithub/cactus/commit/3f85fa8568359a27d9e19b40f87e21b62b7e3cf8)
- feat(cactus-web): decrease font size for header text styles when on a mobile device [06e6beb](https://github.com/repaygithub/cactus/commit/06e6beb9171e50a3e8f4c5199087ffebe34816a4)
- feat(cactus-web): ensure all font weights match the style guide [e4aa1bc](https://github.com/repaygithub/cactus/commit/e4aa1bcd9d44e2c0e3340a5a5cb0edb660256bfb)
- feat(cactus-web): alter line heights to unitless values that match style guide [3364d88](https://github.com/repaygithub/cactus/commit/3364d88675b1bb843d460ae057edd101d72b8a85)
- refactor(cactus-web): Standardize box shadows using boxShadow helper [19d9921](https://github.com/repaygithub/cactus/commit/19d9921c6c4fd1b7793f487915b24ea70d98c7e2)
- fix(cactus-web): change FileInput error/disabled border thickness to respond to theme settings [be302ab](https://github.com/repaygithub/cactus/commit/be302ab3896786c885a6c3bf338faa4d876093cd)
- refactor(cactus-web): Standardize box shadows using boxShadow helper [cffaedf](https://github.com/repaygithub/cactus/commit/cffaedf9c95a6ea16c46b6f5fe3d7917ea4c0433)
- fix(cactus-web): Add overflow: visible to HeaderButton for IE [4e92332](https://github.com/repaygithub/cactus/commit/4e923327ad63a5a06bb9284d0605c59c7e38aa8b)
- fix(cactus-web): removed min-width in textarea for tiny screens [8a094eb](https://github.com/repaygithub/cactus/commit/8a094eb77c6931ae0500ff2e52a52448b3050998)
- refactor(cactus-web): position: relative the button instead of putting it in a div...duh [47d900a](https://github.com/repaygithub/cactus/commit/47d900a8835ca89faab2195edc45284a01a7e45f)
- feat(cactus-web): Apply our own focus styles to header buttons [604ecf9](https://github.com/repaygithub/cactus/commit/604ecf923307e28e4746a381f597cad38391ee75)
- fix(cactus-web): implemented colorStyles in other components. Refctor avatar Component [f182290](https://github.com/repaygithub/cactus/commit/f182290ab946306c160d34774a7aa3892adfcdde)
- fix(cactus-web): Make pagination & sort options optional, fix cursor pointer area [66026fe](https://github.com/repaygithub/cactus/commit/66026feaf31f1af568533161e70b22cb739b4a40)
- fix(cactus-web): Allow DataGrid to be rendered inside a display: block element [4ac860e](https://github.com/repaygithub/cactus/commit/4ac860ef1369b9ba90b361c4a242152f76ee9439)
- fix(cactus-web): Fix keyboard event handler on page size selection. Add prop type for column title [e7993c3](https://github.com/repaygithub/cactus/commit/e7993c3bc5c4a6ae48fe95da35255ebfbd4883f7)
- chore(cactus-web): Fix storybook so disableNext doesn't get passed unless it's checked [8f91573](https://github.com/repaygithub/cactus/commit/8f9157345e3a678510380140a32832a49f70fb6d)
- fix(cactus-web): Use button for sortable headers so keyboard events work [841ede7](https://github.com/repaygithub/cactus/commit/841ede74a5b78e31b4f14bbd81e16e5fb01d4f27)
- fix(cactus-web): Don't call onSort on first render. Fix bug if no sortOptions are provided [9c1d3e2](https://github.com/repaygithub/cactus/commit/9c1d3e21be27217c0c2b712056d525a64538cea7)
- docs(cactus-web): Update DataGrid docs [fd87511](https://github.com/repaygithub/cactus/commit/fd875113b13919fc2b7befa8157baeb71e816c2a)
- feat(cactus-web): Allow title on DataGrid.Column [ff816b0](https://github.com/repaygithub/cactus/commit/ff816b053540691f0c71754a38efa7426881c88f)
- fix(cactus-web): fix avaColor background and disabled status [3579a22](https://github.com/repaygithub/cactus/commit/3579a229694bb51eeb786bf6b8914211f24b030a)
- fix(cactus-web): ensure that focus outline for Button shows up in IE11 [8853790](https://github.com/repaygithub/cactus/commit/88537904d4a2265502056ebf659e3844545f8ed6)
- docs(cactus-web): Add DataGrid docs [d94a9e9](https://github.com/repaygithub/cactus/commit/d94a9e97510163bd00fc51ac6caa6ca437d1f894)
- refactor(cactus-web): Finalize storybook & propTypes, remove DataGrid from exports [79eac81](https://github.com/repaygithub/cactus/commit/79eac81c96f626ac83b98dd89a1079f6bc1a394c)
- refactor(cactus-web): Add prop-types, update how column data is stored, fix IE issue [5216bed](https://github.com/repaygithub/cactus/commit/5216bed700c2c0438934dd79f4c4cc76281ee50c)
- fix(cactus-web): fixed issues with width and overlow in IE11. Other theme changes [4893835](https://github.com/repaygithub/cactus/commit/48938353edb6e22466b35954169904bcdbe812db)
- chore(cactus-web): Revert change to Pagination [09043c1](https://github.com/repaygithub/cactus/commit/09043c11be74ddf3d07e758a3350d7d62fe6e72e)
- feat(cactus-web): ensure better usage of colorstyles from the theme on the components [f035fc0](https://github.com/repaygithub/cactus/commit/f035fc077d9c41b610bcc2ae0eb410a993112a96)
- chore(cactus-web): update changelog [c25fa53](https://github.com/repaygithub/cactus/commit/c25fa533964ca06b59539bb4426abc0b6ee43afd)
- style(cactus-theme): changed cta opacity values, implemented colorStyles in some components [f83d1fd](https://github.com/repaygithub/cactus/commit/f83d1fd60681e8dd37da149b8f0dc223dbbdaded)
- feat(cactus-web): added warning and succes colors to theme [0453b8c](https://github.com/repaygithub/cactus/commit/0453b8c41aa55e8e72580b525e8c51ea36a268a4)

## [@repay/cactus-icons@v1.0.1](https://github.com/repaygithub/cactus/commit/f9dfc97f378caa22cb4e359394d302e504383c5a)

- chore(cactus-icons): upgrade @repay/cactus-theme [1ae4a04](https://github.com/repaygithub/cactus/commit/1ae4a041044a6bc0b8e213be9ee9edd40254b0da)
- fix(cactus-icons): fix bug with icons in storybook [fcce9dd](https://github.com/repaygithub/cactus/commit/fcce9dde6d6e5399b3f4a3ef1b92477f4d447e5b)
- feat(cactus-icons): upgrade to Styled Components v5 -- peer dependency is now ^4.1.4 || ^5.0.0 [647225d](https://github.com/repaygithub/cactus/commit/647225dad08cc3218315ed32b1471ab523eee7f0)
- fix(cactus-icons): fix bug with icons in storybook [7aba9ca](https://github.com/repaygithub/cactus/commit/7aba9ca4e0c5c9d176e1e3741fde31e2626e1603)

## [@repay/cactus-theme@v1.0.1](https://github.com/repaygithub/cactus/commit/821ebb40329a772512398378266eefd8a6e2cee6)

- feat(cactus-theme): add tiny to fontSizes in theme and reference fontSizes directly from textStyles [6a1b812](https://github.com/repaygithub/cactus/commit/6a1b812693bf9dea139feb4b50317593504a752c)
  - 🧨 BREAKING: The fontSizes array on the theme has changed to include the "tiny" size.  All
    sizes have shifted up one index value in the array.
- feat(cactus-theme): add mobile font sizes and text styles to the theme [9a69281](https://github.com/repaygithub/cactus/commit/9a692811170e512c9e35dc3e1fc3df9893772328)
- feat(cactus-theme): added warning and success colors to theme [0453b8c](https://github.com/repaygithub/cactus/commit/0453b8c41aa55e8e72580b525e8c51ea36a268a4)
- style(cactus-theme): reference callToActionText [b504818](https://github.com/repaygithub/cactus/commit/b5048188cf96dd6f6dca09bbe2e0ddf6ee517af5)
- chore(cactus-theme): update changelog [446a829](https://github.com/repaygithub/cactus/commit/446a8298dd3d0cd25faff61e266562555ab7b585)

## [@repay/cactus-web@v0.9.1](https://github.com/repaygithub/cactus/commit/05c7e15a8169c97f3d1246c01fdc4f0284d5c31c)

- feat(cactus-web): rework disabled styles for FileInput [eb4a728](https://github.com/repaygithub/cactus/commit/eb4a728fc54ab1fd50c3c251cad7b421315a6a5e)
- refactor(cactus-web): remove relics of the deleted retry button [0eb2711](https://github.com/repaygithub/cactus/commit/0eb27113be9b564813c78223ed8de3c2f863e520)
- refactor(cactus-web): remove ts-ignore from FileInput [c8e0129](https://github.com/repaygithub/cactus/commit/c8e0129c5fd72276a96f27b8a814387421051937)
- fix(cactus-web): prevent drag-and-drop file uploads when FileInput is disabled [dfffba6](https://github.com/repaygithub/cactus/commit/dfffba6cd133e5f0d52a258b33dc8f4488b389c1)
- feat(cactus-web): allow forwarding of ref props to HTML table components [c878310](https://github.com/repaygithub/cactus/commit/c878310116ae136f3c9d530fc5d682b157bb0b1f)
- refactor(cactus-web): remove the ts-ignores and TSWorkaround [505102b](https://github.com/repaygithub/cactus/commit/505102bd87e72d2bc7e7a4d7339f6fdef876894e)
- feat(cactus-web): change FileInput text color to improve accessibility (and match style guide) [daa56cd](https://github.com/repaygithub/cactus/commit/daa56cd07ac26b695c26279de524b53c90c74880)
- feat(cactus-web): add disabled state to FileInput [adefe93](https://github.com/repaygithub/cactus/commit/adefe93b06643bb0aacb98dc07f2e4812ad27613)
- feat(cactus-web): remove retry button from FileInput error message [7aef93d](https://github.com/repaygithub/cactus/commit/7aef93df059978cdfe44c2269dec9a36ebc10fb3)
- feat(cactus-web): add div wrapper to PrevNext so margin props could take effect [c32beef](https://github.com/repaygithub/cactus/commit/c32beef0844d05a6a87a78398c98886c80ff242e)
- refactor(cactus-web): alphabetize index exports [3e53c57](https://github.com/repaygithub/cactus/commit/3e53c57a97ae91a418629d22583ce95a549ff693)
- fix(cactus-web): fix labels for modal [1f0dc31](https://github.com/repaygithub/cactus/commit/1f0dc3199e0a93b784961a9e31b9cf3b579d3bac)
- fix(cactus-web): fixed bug in IE11 [8bb8f2d](https://github.com/repaygithub/cactus/commit/8bb8f2d27d39e8f6eaaab96e250a29dce54984be)
- docs(cactus-web): fixed docs page for modal [d2f1eeb](https://github.com/repaygithub/cactus/commit/d2f1eebf5279d592a645ceaaad11d392f7eb938b)
- feat(cactus-web): add "card" variant to table component [c4ccca6](https://github.com/repaygithub/cactus/commit/c4ccca693761ae97ed75948860052c7d42c82ffb)
- feat(cactus-web): add ScreenSizeContext & related components [7d55428](https://github.com/repaygithub/cactus/commit/7d55428eb76c67b429f47585c7d8e8b5c544da5b)
- fix(cactus-web): change breakpoints to include "px" [b81da58](https://github.com/repaygithub/cactus/commit/b81da58f3a73f39a0c736e72fa9f5c2aeccb26c2)
  - 🧨 BREAKING: Anything that relied on the breakpoints being just digits could stop working
correctly.
- fix(cactus-web): ensure prev/next links fire on Enter key press event [6e88fd5](https://github.com/repaygithub/cactus/commit/6e88fd509e9eebf04555a992d25b751d120da5d3)
- fix(cactus-web): removed aria-label dash, converted box-shadow color to the theme equivalent [97df060](https://github.com/repaygithub/cactus/commit/97df06061b37e33c611c6afff5614c48372b17f6)
- fix(cactus-web): remove bad VSCode auto-import [c3f0c3a](https://github.com/repaygithub/cactus/commit/c3f0c3a10e6a49bea6c46b803f3e015cd6c27aa0)
- fix(cactus-web): verify mediaquery exist, refactor Modal in examples docs [82ea7cb](https://github.com/repaygithub/cactus/commit/82ea7cb960872138a29958b97cc7d546406a7049)
- feat(cactus-web): add PrevNext component for unbounded pagination [7727283](https://github.com/repaygithub/cactus/commit/772728339a99825b8b5e7acd02cf9ec073f94a91)
- feat(cactus-web): redesign the modal to be a Container [e8e6be3](https://github.com/repaygithub/cactus/commit/e8e6be3b2c2efc71aa80763bcdfa2ce9e6fc59e5)
- refactor(cactus-web): rewrite Table to use default table displays instead of flexbox [5551728](https://github.com/repaygithub/cactus/commit/55517288333124cce08083d802a433b3110c61da)
- fix(cactus-web): make sure cactus theme addon is published with storybooks [d880515](https://github.com/repaygithub/cactus/commit/d8805158979406b724b40cab24af7e676f7f4e18)
- chore(cactus-web): Pull master & fix merge conflicts [3c99d9c](https://github.com/repaygithub/cactus/commit/3c99d9cae3d799ab977a37ade7790ce8bece3edf)
- chore(cactus-web): Pull master & fix merge conflict [356b0a5](https://github.com/repaygithub/cactus/commit/356b0a5b6b8d3d0d531101701614c0a69cd943a2)
- fix(cactus-web): set correct prop-type for mainActionIcon [ed34234](https://github.com/repaygithub/cactus/commit/ed3423485f3c9bdde98628eed63e9d5d4f5297b6)
- docs(cactus-web): add Storybook knob for the align table cell property [43ccb41](https://github.com/repaygithub/cactus/commit/43ccb414432e18287f7edaf80f525766ab1ae70b)
- refactor(cactus-web): replace deprecated align attribute with text-align css property [d0b23e9](https://github.com/repaygithub/cactus/commit/d0b23e9deccc7ade6c29b178c9fdd22e0b7c85b8)
- fix(cactus-web): changed width of ReachMenuPopover [03f2208](https://github.com/repaygithub/cactus/commit/03f2208a84cebd2fedcb3af51396f35507f71858)
- fix(cactus-web): fix table display in IE11 [67b3f32](https://github.com/repaygithub/cactus/commit/67b3f32aae930f053af8694a98151e0e25c4d4d6)
- feat(cactus-web): add fullWidth prop to tables to control width [322b416](https://github.com/repaygithub/cactus/commit/322b41662d502be09ec51c066ad0e5d55c424977)
- feat(cactus-web): remove spacing between table rows [ba9c168](https://github.com/repaygithub/cactus/commit/ba9c168834deb9e39065b84b57bd2475d8a4d672)
- chore(cactus-web): upgrade @reach deps to 0.10.4 [88f542b](https://github.com/repaygithub/cactus/commit/88f542b13cbd983b7754bcfd8a1fa8564ed7bf00)
- refactor(cactus-web): extend styled-components DefaultTheme to enable type checking on theme [c6b2ddd](https://github.com/repaygithub/cactus/commit/c6b2ddd3c8b6d7fd40e51bfec6c7cff911e7b45f)
- fix(cactus-web): Fix types so we don't need ts-ignore [258cd81](https://github.com/repaygithub/cactus/commit/258cd81ebfc1afcb04c2fbdf352b702c4320b9a5)
- chore(cactus-web): add some SplitButton functionality to mock-ebpp test app [0036a57](https://github.com/repaygithub/cactus/commit/0036a572d527cd82ab0935860ff0a27669bddeb2)
- fix(cactus-web): Fix transparent dropdowns [a8e006d](https://github.com/repaygithub/cactus/commit/a8e006d44375ae1d8567b4243f6ec17e05644bd8)
- refactor(cactus-web): moved keypress accessibility helper to separate file [5a33934](https://github.com/repaygithub/cactus/commit/5a339344768044281138f2df5b7b5fb9b9c5ac19)
- feat(cactus-web): Add Pagination component [1a807a4](https://github.com/repaygithub/cactus/commit/1a807a46321f587456a64f52aa4a6bc082b71d07)
- docs(cactus-web): Explain when SplitButton & MenuButton should be used & how they're different [9c2a41b](https://github.com/repaygithub/cactus/commit/9c2a41baece509324f5ba78c0c8682475ce2d7b2)
- fix(cactus-web): Add aria-label prop to dropdown button, get rid of inner border in firefox [30140c6](https://github.com/repaygithub/cactus/commit/30140c65f883fdc21b7435285150e4571d6ad453)
- docs(cactus-web): Fix props tables & add some instruction in collision storybook [104d2f1](https://github.com/repaygithub/cactus/commit/104d2f1979570e28fe358cff7568f21f9087defd)
- refactor(cactus-web): fix TS errors with Status propType in StatusMessage [4e6fa56](https://github.com/repaygithub/cactus/commit/4e6fa56396968479090bfe78bf22b3a733ac676c)
- docs(cactus-web): Add storybook & docs for SplitButton [47d7e18](https://github.com/repaygithub/cactus/commit/47d7e18a1d69464040cf7fafde8a35c195a7ae85)
- feat(cactus-web): Add SplitButton component [6eef048](https://github.com/repaygithub/cactus/commit/6eef04803a3efe60e1a40cb05e33259388d76443)
- refactor(cactus-web): update @reach/menu-button & other reach deps so we can position dropdown [2e7c019](https://github.com/repaygithub/cactus/commit/2e7c01991c12f0315f420af49863bae5f4bfb9e8)
- fix(cactus-web): extend html attributs and css fixes [93fc197](https://github.com/repaygithub/cactus/commit/93fc197130b6ffb77e595755ac3c1dd4ebe2c6fc)
- fix(cactus-web): add wrapper div to StatusMessage in AccessibleField [1690ec4](https://github.com/repaygithub/cactus/commit/1690ec4597f4e1b610fffeb429a23c829566b0f4)
- feat(cactus-web): implement new styling for StatusMessage component [604fcee](https://github.com/repaygithub/cactus/commit/604fceec99a0d4edf5286a482967ea2c052f043e)
- feat(cactus-web): added context to Table [99358a0](https://github.com/repaygithub/cactus/commit/99358a0f525548943face68fd46565ab79641732)
- chore(cactus-web): update changelog [f364a9c](https://github.com/repaygithub/cactus/commit/f364a9c3f30c4acf8320c92b3085d3a6cde4fe1c)

## [@repay/cactus-i18n@v0.3.12](https://github.com/repaygithub/cactus/commit/cf4a156c1a814130866436b4896fafd77bcfa95f)

- feat(cactus-i18n): i18nContext importable from @repay/cactus-i18n [9ef3bf5](https://github.com/repaygithub/cactus/commit/9ef3bf5eeb07c8adc03e0ddd8369a876481928cc)
- feat(cactus-i18n): i18nContext importable from @repay/cactus-i18n [31a3d67](https://github.com/repaygithub/cactus/commit/31a3d67992c419aa294832423f95898d55b6cf76)
- chore(cactus-i18n): update changelog [d8981c8](https://github.com/repaygithub/cactus/commit/d8981c811e1a850df15c45bf095a2a74d85f96ed)

## [@repay/cactus-web@v0.8.0](https://github.com/repaygithub/cactus/commit/4bd12b5ead02919bf9833479be58d3a7c0e2186b)

- build(cactus-web): upgrade cactus-theme dependency [f636468](https://github.com/repaygithub/cactus/commit/f636468f8695a66989906bfe68f0c3ae880b17c9)
- fix(cactus-web): fix issue where contents render outside modal [27d8e55](https://github.com/repaygithub/cactus/commit/27d8e5549354b69066db7757c67df7e58446c42e)
- feat(cactus-web): update bottom border on outline accordion header to match theme border [551bf54](https://github.com/repaygithub/cactus/commit/551bf54d159315ab9528d9afaf91f1b89cbf4241)
- feat(cactus-web): Fix weird two color border in combobox input [083e41e](https://github.com/repaygithub/cactus/commit/083e41e355798d5b88150fe17dac532a2d1d5b1e)
- feat(cactus-web): apply theme customization to cards & accordions [9cac4e8](https://github.com/repaygithub/cactus/commit/9cac4e85986343a6b58aebd22f27b3e69ef071ea)
- chore(cactus-web): Use map for value tag shapes [4fa917e](https://github.com/repaygithub/cactus/commit/4fa917ebb772555cacf01c4a0b90e07b87e622b3)
- chore(cactus-web): Change how value tag shapes are applied to make typescript happy [be42f4d](https://github.com/repaygithub/cactus/commit/be42f4d026277f7c5977495239f0651f83b5d2bb)
- feat(cactus-web): Apply theme customization to combo input & multiselect tags [702c9e5](https://github.com/repaygithub/cactus/commit/702c9e5e5f8c5123a81f0b5572ba3adfb6811e7e)
- chore(cactus-web): Update snapshots for switching to 1px default border [42647cf](https://github.com/repaygithub/cactus/commit/42647cfbe92fb2b9a89d909732d910c7676abbf6)
- feat(cactus-web): Update shape of date input dropdown to be more square [43f062b](https://github.com/repaygithub/cactus/commit/43f062bb0cda73d5e3e1ab8fabae24a86e8a5484)
- chore(cactus-web): Update form element snapshots [4b5498e](https://github.com/repaygithub/cactus/commit/4b5498ee17811a5d4aa5eaa09722b5782074fd94)
- feat(cactus-web): Apply theme customization to applicable form elements [ec7fa43](https://github.com/repaygithub/cactus/commit/ec7fa43b249e4160bdde5385f255ab1e20b3f3f8)
- feat(cactus-web): Component theme changes phase one [6cd3937](https://github.com/repaygithub/cactus/commit/6cd3937c747258862060d252ab59f37a57f2dba5)
- fix(cactus-web):  More covergae in Buttons tests [c5bf9de](https://github.com/repaygithub/cactus/commit/c5bf9de1abb8597234849a879d28ce5d4d0d2f74)
- fix(cactus-web): Fixed borders and shape on Buttons [a38eda2](https://github.com/repaygithub/cactus/commit/a38eda22fa2a39894cafae04e1e3ea79a6ef792a)
- feate(cactus-web): Component theme changes phase one [4617c92](https://github.com/repaygithub/cactus/commit/4617c92a10715306a6b40e865aea3e5ef1f4ac02)
- feat(cactus-web): Form Elements Documentation [f7facbb](https://github.com/repaygithub/cactus/commit/f7facbbc386427a9ca0bb678e041d0f93a3ddda3)
- feat(cactus-web): Form Elements Documentation [785300c](https://github.com/repaygithub/cactus/commit/785300c80f220e873b3cc7a66113c5d78a31ea3d)
- chore(cactus-web): Update theme widget for storybook to handle new theme properties [a08082d](https://github.com/repaygithub/cactus/commit/a08082dadb67c8a9cb5c2d181629f6101fe85a24)
- chore(cactus-web): update changelog [313c09b](https://github.com/repaygithub/cactus/commit/313c09b9df47d1e6d0b2929c247832f9674133bb)

## [@repay/cactus-theme@v0.5.0](https://github.com/repaygithub/cactus/commit/b9245e055454a23078c16c3678199944d188fdc7)

- feat(cactus-theme): Default theme border to thin [c5bd1d2](https://github.com/repaygithub/cactus/commit/c5bd1d2f2b143485544eeaa1000ee82e960faceb)
- feat(cactus-theme): Add border, shape, font & box-shadow customization to theme [2430d59](https://github.com/repaygithub/cactus/commit/2430d59d51511c04dca4e564aeb0daac62c1d8ec)
- chore(cactus-theme): update changelog [6441f6f](https://github.com/repaygithub/cactus/commit/6441f6f08de103c474e8ccfc4bf8dc52b06f266a)

## [@repay/cactus-web@v0.7.4](https://github.com/repaygithub/cactus/commit/12696a58c04344f8a9b7e0e8410662d3638f68df)

- fix(cactus-web): Add @reach/menu-button styles [77cd9b1](https://github.com/repaygithub/cactus/commit/77cd9b1f743251304c449c9acf44514dd30628e1)
- chore(cactus-web): Add css loaders & jest css mocks for packages that need it [227e62b](https://github.com/repaygithub/cactus/commit/227e62b469aca1e17785b8e955ecc4200f3b21c4)
- fix(cactus-web): Add @reach/menu-button styles [1d0beb5](https://github.com/repaygithub/cactus/commit/1d0beb5702a9c7c7e22edeae68f2c173cea3439f)
- fix(cactus-web): Fixed tootltip z-index [c41b0c3](https://github.com/repaygithub/cactus/commit/c41b0c3d61d15d6643aa125a8bddd6616b6f3309)
- fix(cactus-web): Fixed modal [a613b4b](https://github.com/repaygithub/cactus/commit/a613b4b474ee345e8332e1719a471650f68bfd7e)
- feat(cactus-web): Added in-browser coding examples [454b6aa](https://github.com/repaygithub/cactus/commit/454b6aa86ad5a61a23f0d92571acf8650eeeb1ea)
- feat(cactus-web): Added Breadcrumb component [308c07e](https://github.com/repaygithub/cactus/commit/308c07e8b287589f8855f3eeb34c114f744392c4)
- feat(cactus-web): Added rendered components to docs pages. [CACTUS-236] [2f7e10b](https://github.com/repaygithub/cactus/commit/2f7e10bd51d4fc64d83e1951d3119a7190f9b609)
- feat(cactus-web): Added rendered components to docs pages. [CACTUS-236] [21f209b](https://github.com/repaygithub/cactus/commit/21f209b4c9efdef61d78b6d8fae06559ccf9fdd1)
- fix(cactus-web): Fix overlay issue in sidebar [2159278](https://github.com/repaygithub/cactus/commit/215927874cd4985c26bbe6b92e1653052e391337)
- fix(cactus-web): Fix overlay issue in sidebar [fd44a1a](https://github.com/repaygithub/cactus/commit/fd44a1a8469c03282fe98ffbf6cf76df2c40f281)
- feat(cactus-web): allow ReactNode for label prop on Fields [6b50ffc](https://github.com/repaygithub/cactus/commit/6b50ffce24cc4defa179e1dc78c5d1e5d636b48c)
- chore(cactus-web): update changelog [dd3a913](https://github.com/repaygithub/cactus/commit/dd3a91348647ecf0937f3c37b4128174b14e486e)

## [@repay/cactus-i18n@v0.3.11](https://github.com/repaygithub/cactus/commit/241aeb830a4fd4e2c6b69b71a538f8410f002378)

- fix(cactus-i18n): Import locales needed for intl & intl-pluralrules [2a1408b](https://github.com/repaygithub/cactus/commit/2a1408b80ac7330183c34b703b4d4f6289718ebe)
- fix(cactus-i18n): Import locales needed for intl & intl-pluralrules [035ddee](https://github.com/repaygithub/cactus/commit/035ddee67cecf828a2a8c22a41dad8882a911e9a)
- docs(cactus-i18n): documentation for new features [6c32eac](https://github.com/repaygithub/cactus/commit/6c32eac8a2179706dc1a6a5f2d11e36600c22c28)
- chore(cactus-i18n): update changelog [0c5520c](https://github.com/repaygithub/cactus/commit/0c5520ca746c888549536608d72f95792269f430)

## [@repay/cactus-i18n@v0.3.9](https://github.com/repaygithub/cactus/commit/4f62cf2f2f8043665437c46af3ba0a6a643e291f)

- fix(cactus-i18n): Add plural rules polyfill to support IE11 [77c51e9](https://github.com/repaygithub/cactus/commit/77c51e9ccdc6ef157b3bba5a6a5033ef51d56a65)
- fix(cactus-i18n): Add plural rules polyfill to support IE11 [c9652cd](https://github.com/repaygithub/cactus/commit/c9652cd7b7df75a282a74367d81b02124241fb7e)
- chore(cactus-i18n): update changelog [25e9a6b](https://github.com/repaygithub/cactus/commit/25e9a6bc8508010127793156e203597f50b98c5d)

## [@repay/cactus-web@v0.7.3](https://github.com/repaygithub/cactus/commit/1819b12156821ced25a3931dcb47aad553ecba4e)

- fix(cactus-web): MenuButton text color for light themes [a03801a](https://github.com/repaygithub/cactus/commit/a03801aa94f0ac7d1c36b9f0bc5516ec164a14aa)
- docs(cactus-web): add two color option to storybook addon [fbc679e](https://github.com/repaygithub/cactus/commit/fbc679e300766b55272e5ec2d670b47d4a42aef1)
- fix(cactus-web): Add overflow ellipsis to select [fc63c0e](https://github.com/repaygithub/cactus/commit/fc63c0ef95a9aa1db2bd1ee5c522dc124f94a689)
- docs(cactus-web): Update select story so we can demonstrate the overflow ellipsis [1ae6213](https://github.com/repaygithub/cactus/commit/1ae621349e35cc13479a865bc5d1d377165a1efb)
- fix(cactus-web): Add overflow ellipsis to select [ff927a1](https://github.com/repaygithub/cactus/commit/ff927a1924470d52000be74c0e15e54a427b0e0c)
- fix(cactus-web): Get page title using wait() in integration tests [d073ae9](https://github.com/repaygithub/cactus/commit/d073ae9e0bde8462f1aececdd17628dbfc28943c)
- chore(cactus-web): update changelog [30927ca](https://github.com/repaygithub/cactus/commit/30927ca70cb6c208d856b622aa0a83af3ee5cfe4)

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
