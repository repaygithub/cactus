# `@repay/babel-preset`

Babel preset used by [@repaygithub](https://github.com/repaygithub/)

## EcmaScript Features Supported

- All Proposals that have reached stage-4 and are implemented by `@babel/preset-env`
- Class Properties (does not include private fields)

  ```jsx
  class Accordian extends Component {
    state = { isOpen: this.props.openOnMount || false }

    // using assignment like below,
    // `this` references the class instance always
    toggleOpen = () =>
      this.setState(s => {
        isOpen: !s.isOpen
      })
  }
  ```

- Object rest spread (e.g. `let obj = {...props}`)

## Usage

Install via the command line using yarn or npm

```bash
yarn add --dev @repay/babel-preset
// OR
npm install --save-dev @repay/babel-preset
```

Add the preset to your .babelrc or equivalent

```.babelrc
{
  "presets": ["@repay/babel-preset"]
}
```
