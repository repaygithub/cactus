# `@repay/cactus-web`

UI component library build for React, used by REPAY.

## Usage

For usage, see the documentation for [Cactus Web](../../docs/Components/README.md)

## Contributing

Running storybook for local development

```
yarn start
```

Testing the build

```
yarn test
```

Creating a new component

```
yarn new ComponentName
```

This will generate skeleton files for the component, tests, story, and documentation (.mdx) using the provided ComponentName.

```
Usage: node make-component.js [...options] ComponentName
- component name must be the last argument, contain no spaces,
  and should be pascal case.

  Options:
  --help, -h      display this information
  --force, -f     overwrite component if it exists
```

Building the repository

```
yarn build
```

Running the build in watch mode which will re-build on changes

```
yarn dev
```

## Best Practices

### Development

Components should have associated stories so that you as a developer can test the component in an active situation. The convention is to create an primary story called "Basic Usage" which allows the user to control the required properties. Then additional stories are created for optional properties.

Components are ideally exported as a `styled` component. This allows them to be styled directly by a parent component such as:

```tsx
import styled from 'styled-components'
import { Button } from '@repay/cactus-web'

const Container = styled.div`
  padding: ${p => p.theme.space[0]};

  ${Button} {
    margin-left: ${p => p.theme.space[4]};
  }
`
```

If the component is not a static tag like `styled.div`, you can create a "base" component and style that:

```tsx
import * as React from 'react'
import styled from 'styled-components'
import CloseIcon from '@repay/cactus-icons/i/actions-close'

interface ComponentProps & React.HTMLProps<HTMLDivElement> {
  showIcon: boolean
}

const ComponentBase = ({ showIcon, children, className, ...props }) => {
  return (
    <div className={className} {...props}>
      {showIcon && <CloseIcon />}
      {children}
    </div>
  )
}

export const Component = styled(ComponentBase)`
  padding: 8px;
`

export default Component
```

The requirement here, is that the `className` prop must be provided to the element that is being styled.

#### Styled System

We use [Styled System](https://styled-system.com/) to help ensure theme value adherence and decrease the difficulty of proper customizations. Most components should provide the `margin` properties.

### Writing Documentation

Stories are both for development and documentation.

Documentation can be added directly to the mdx files alongside the components. You can also use the `'website-src'` source alias which will point to the source root in the website directory.

The _best practices_ section should include information related to accessibility or other critical information when using the component. However this section can be removed if there are none.

Basic usage section should have at least one example of usage as JSX. If usage in TypeScript is complex or interesting include that as well. Ideally any code written as basic usage can be copied and used directly.

A description can be added to a property via comment above the property definition. To force the inclusion of a property in the Properties section that is not showing up, add the prop to the definition with a comment above and type `!important` in the comment.

### Testing

Components should be tested from the perspective of the end-user as possible; this means using the `user-event` library in combination with `fireEvent()` from `react-testing-library`. Additionally, when a label is rendered with text, it should be used to select the input element. This will best mimic the user's actions of reading the text to find the element and clicking or typing from there and enforces best practices for accessibility.

Example:

```tsx
test('should trigger onChange event', () => {
  const onChange = jest.fn()
  const { getByLabelText } = render(
    <ThemeProvider theme={cactusTheme}>
      <CheckBoxField label="Katastro" name="katastro" onChange={onChange} />
    </ThemeProvider>
  )

  // Select the checkbox by label text, and fire the click event on it.
  fireEvent.click(getByLabelText('Katastro'))
  expect(onChange).toHaveBeenCalledWith('katastro', true)
})
```

Also, be sure to test the negative cases alongside the positive, such as when there is a `diabled` property:

```tsx
test('should not trigger onChange event', () => {
  const onChange = jest.fn()
  const { getByLabelText } = render(
    <ThemeProvider theme={cactusTheme}>
      <CheckBoxField label="Flow" name="flow" onChange={onChange} disabled />
    </ThemeProvider>
  )

  userEvent.click(getByLabelText('Flow'))
  expect(onChange).not.toHaveBeenCalled()
})
```

### Accessing Local Storybooks on iOS

Sometimes it may be necessary to view the storybooks on a mobile device to test/debug features like accessibility. To do this, you can follow these steps:

1. Plug an iPhone in to your Mac & make sure the phone is on the same network as the computer.
2. In the iPhone's settings, navigate to Safari > Advanced and make sure "Web Inspector" is turned on.
3. On your Mac, open Safari > Preferences > Advanced and make sure "Show develop menu in menu bar" is checked.
4. In the Safari search bar on the iPhone, type your computer's IP address followed by the port the storybooks are running on, which defaults to 9001.
(Ex: 10.1.2.345:9001)
5. You can view the development console on Mac by clicking Develop > (your iPhone's name) > and selecting the browser window from the list of open windows
on the iOS device.

Note: If you don't know your computer's IP address, you can get it by running `ifconfig` in your terminal. The IP address you'll want will be directly after `inet`
in the last result returned from `ifconfig`. 
