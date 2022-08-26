---
title: Hooks
order: -99
---

# Hooks

## useRefState

This is functionally similar to React's built-in `useState`/`useReducer` hook;
however its return value is more similar to the `useRef` hook in that it's a stable
object which always has the current state. It has two call signature overloads:
one that takes the same args as `useState`, and one that takes the same args as `useReducer`.
The ref returned by the function also has an attached `setState` function, which
behaves the same as the state setter/dispatch function returned by the React hooks,
with one difference: it sets `ref.current` synchronously before triggering a re-render,
and returns the new state.

```jsx
function Component(props) {
  const ref = useRefState(42)
  React.useEffect(() => {
    const newState = ref.setState(13)
    // You can also just set the value directly
    // if you don't want to trigger a re-render.
    ref.current = newState + 7
  }, [])
  return <span {...props}>{ref.current}</span>
}
```

## useControllableValue

Use this hook to manage state for a value that can either be controlled by props
or left as internal state, i.e. like an `<input>` element's `value` prop.
The return value is the same as `useState`: an array containing the current value
(either that passed in props, or the internal state value) and a dispatcher.
If it pulls a value from props, it will update the internal state to match
during the effect phase of the render cycle.

It takes several arguments:
- First is always an object containing component props.
- Second can be one of two things:
  - A prop name: the state will be pulled from props, unless it's undefined in which case the internal state is used.
  - An extractor function that takes two args: the props, and the internal state; and returns the new state.
- Finally, it takes the args for `useState` or `useReducer`: either an initial value, or a reducer + initial arg + initializer function.

```typescript
type UseControllableValue = <Props, State, Action>(
  props: Props,
  key: keyof Props | ((p: Props, s: State) => State),
  ...args: Parameters<typeof useState> | Parameters<typeof useReducer>
): [State, Dispatch<State, Action>]
```

It uses `useRefState` under the hood, so the dispatcher is synchronous and
returns the new state, in case you need it to raise an event.

```jsx
function SimpleInput({ onChange, ...props }) {
  const [value, setValue] = useControllableValue(props, 'value', props.defaultValue)
  const handleChange = (event) => {
    const newValue = setValue(event.target.value)
    onChange(newValue)
  }
  return <input {...props} value={value} onChange={handleChange} />
}
```

## useScrollTrap

In the case you have a popup, modal, or drop-down with it's own scrolling context, you often want to prevent scrolling from propagating up to the main page: it can be disconcerting when you're scrolling in a drop-down and suddenly the entire page is moving. `useScrollTrap` takes in a ref to a scrollable HTML element (an element styled with `overflow: auto` or `overflow: scroll`) and ensures scrolling doesn't "escape".

There are two caveats in browsers that don't support the `overscroll-behavior` CSS property:

1. The Javascript backup is only implemented for vertical scrolling.
2. The Javascript backup is based on the "wheel" event, since (to my knowledge) other methods of scrolling don't propagate.

For situations where a hook isn't appropriate, or if you have more complex logic about how to apply the scroll trap, there's a `trapScroll` function with the same arguments: it will either return nothing for the CSS implementation, or a "cleanup" function for the backup implementation.

```jsx
function ScrollTrap(props) {
  const ref = useRef()
  useScrollTrap(ref)
  // Is equivalent to:
  // useEffect(() => trapScroll(ref), [ref])
  return <div {...props} ref={ref} style={{ overflow: 'auto' }} />
}
```

## usePopup

This hook is designed to help set up popup menus & dialogs, or basically any situation where it's appropriate to use the `aria-haspopup` attribute. It provides helpers for opening/closing, and for managing the focus of elements within the popup.

It's expected that the popup will consist of at least two, preferably three elements: a button to toggle visibility (required); a div or other block element to serve as the popup (required); and a div to serve as a wrapper around the two (recommended). The wrapper semantically groups the button and popup as a unit, and handles events that bubble up from either, so it's much more convenient to have one than not.

Styling these elements is of course up to the developer, but generally speaking the wrapper should be unstyled, or in other words, the button should look the same whether or not the wrapper is there. The popup will usually use absolute or fixed positioning, and should control visibility using the `aria-hidden` attribute, using a CSS rule like the following:

```css
.my-popup-class {
  display: block;
}
.my-popup-class[aria-hidden] {
  display: none;
}
```

### Arguments

The `usePopup` hook has one required argument and several options:

```js
const popup = usePopup(popupType, { ...options })
```

| Arg                  | Type     | Required | Description                                                                                               |
| -------------------- | -------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `popupType`          | string   | Y        | Must be a valid value for the `aria-haspopup` attribute                                                   |
| `id`                 | string   | N        | The HTML ID for the wrapper                                                                               |
| `popupId`            | string   | N        | The HTML ID for the popup; if nothing is passed, an ID will be generated                                  |
| `buttonId`           | string   | N        | The HTML ID for the button; if nothing is passed, an ID will be generated                                 |
| `onWrapperBlur`      | function | N        | See below                                                                                                 |
| `onWrapperKeyDown`   | function | N        | See below                                                                                                 |
| `onButtonClick`      | function | N        | See below                                                                                                 |
| `onButtonKeyDown`    | function | N        | See below                                                                                                 |
| `positionPopup`      | function | N        | Callback used to tweak popup's position styles                                                            |
| `focusControl`       | function | N        | Callback used to manage focus within the popup                                                            |
| `initialExpanded`    | boolean  | N        | Whether the popup is initially visible; default false                                                     |
| `focusOnClickExpand` | boolean  | N        | Whether clicking the button will move focus to the popup; default true for `popupType=dialog`, else false |

The event handlers correspond to the handlers returned by the hook, to make it easier to combine the default handlers with custom behavior: the default handlers run first and then call the optional handlers. In addition to the normal `event` argument, they can also take as a second argument the `toggle` function, described in the Return Value section below.

#### Callbacks

**positionPopup** is called each time the popup becomes visible, in a `useLayoutEffect` hook. The first parameter is the popup div itself, and the second is the toggle button. Ideally, positioning styles can be determined statically, but some cases (e.g. to ensure the popup doesn't go offscreen) may require dynamic fine-tuning. There is no return value: it's assumed that you'll either directly set the popup's styles, or that you can use something in the callback's closure to set the styles indirectly.

**focusControl** is used to determine how focus is handled when the popup is visible. The first parameter is the popup div, and the second is an object containing "search state":

```js
function focusControl(popupDiv: HTMLElement, searchState: {
  focusHint: string | number; // Described in the "Update State" section
  focusIndex: number; // The array index of the element that was focused last
  shift: boolean; // Described in the "Update State" section
}): HTMLElement[] | HTMLElement | undefined;
```

There are three basic ways the control can be used:
- Return an array of focusable elements, and the element to be focused will be selected for you based on the focusHint; the default `focusControl` does this, returning all _tab-focusable_ elements within the popup
- Return a single HTMLElement to be focused; modifications made to `searchState.focusIndex` will be preserved to the next call
- Return undefined, which will result in no element being focused

Using the default focusControl for example, if the popup is toggled to visible using the keyboard (or by clicking when `focusOnClickExpand=true`), focus will automatically move to the first tab-focusable element in the popup.

Because `focusControl` is a required argument to an underlying function, to disable control entirely you should pass a no-op function, rather than null or undefined.

### Return Value

The `usePopup` hook returns a single object with several properties:

| Property       | Type     | Description                                   |
| -------------- | -------- | --------------------------------------------- |
| `expanded`     | boolean  | The current visibilty state of the popup      |
| `toggle`       | function | A function used to control visibility & focus |
| `setFocus`     | function | A function used to control focus              |
| `wrapperProps` | object   | Props for the wrapper component               |
| `buttonProps`  | object   | Props for the button component                |
| `popupProps`   | object   | Props for the popup component                 |

The props all contain convenient defaults, but you can change or remove them on a case-by-case basis if needed.

`wrapperProps` contains:
- the `id` that was passed in with the options
- role="none", so screen readers know the wrapper is purely structural
- an `onBlur` handler that closes the popup when focus is outside the wrapper
- tabIndex=-1, necessary for the `onBlur` handler to work on Safari, which doesn't focus buttons on click
- an `onKeyDown` handler that closes the popup when the &lt;Escape&gt; key is pressed

`buttonProps` contains:
- id=[?] either the `buttonId` option, or a generated ID; this **must** be set on the button for the default event handlers and the `positionPopup` callback to work
- role="button"
- aria-haspopup=[popupType]
- aria-controls=[popupId]
- aria-expanded="true" if the popup is visible, `undefined if it's hidden
- an `onClick` handler that toggles the popup's visibility
- an `onKeyDown` handler that toggles the popup's visibility when &lt;Enter&gt; or &lt;Space&gt; is pressed
- an `onKeyUp` handler that calls `event.preventDefault()` when &lt;Enter&gt; or &lt;Space&gt; is pressed (because HTML button elements treat those two keys as a "click" event; onKeyDown toggles the popup to visible and then onClick toggles it off again)

`popupProps` contains:
- id=[?] either the `popupId` option, or a generated ID; this **must** be set on the popup for focus control and the `positionPopup` callback to work
- tabIndex=-1, helps the wrapper's `onBlur` handler work better, and keeps the popup out of the tab order if it has a scroll bar
- role=[popupType], matches the `aria-haspopup` on the buttonProps
- aria-labelledby=[buttonId]; by default, the label on the button is used to label the popup as well
- aria-hidden="true" if the popup is hidden, `undefined` if it's visible

#### Update State: `toggle` & `setFocus`

`toggle` is used to change the visibility of the popup. Called with no arguments (or the first argument as `undefined`), it's a normal toggle: on to off, off to on. You can also pass a boolean indicating what the new state should be (true = visible), in which case it will only update if the new state is different from the current state.

For convenience, `toggle` also accepts second and third arguments, `focusHint` and `focusOpts`, corresponding to the arguments for `setFocus`. Setting the focus through `toggle` has some advantages: if the popup is being opened, the `delay` option is automatically set so the popup has time to become visible before attempting to set the focus; and if the popup is closed, numeric/string focus hints are automatically changed to null since they can't be calculated on hidden elements.

```js
toggle(true, focusHint, { ...focusOpts })
```

If you need to control the focus without changing the visibility, you can call `setFocus` directly. `focusHint` should be one of the following:

- An HTMLElement object that should receive focus; this unsets the current focus index
- A number, which is either an index into the array returned by the `focusControl` callback, or an offset from the current array index (see `shift` option)
- A string, which can be used to search the text contents of the `focusControl` array elements and focus on the first match
- null, which unsets the current focus index

There are also three options:

- `delay` - if true, the element will be focused in a `useEffect` hook; with false (the default), the element is focused immediately
- `shift` - if true, indicates that a numeric `focusHint` is an offset in the focus control array from the currently-focused element (e.g. -1 would be analagous to pressing shift+tab); false (the default) indicates an absolute array index (e.g. -1 would focus on the last element in the array, regardless of the current focus)
- `focusControl` - override the default focus control callback for just this update
