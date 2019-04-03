# Cactus Design System Icons

The Cactus Design System contains a set of icons as React components to use within projects.

## Getting Started

Install via node based package manager

```
yarn add --dev @repay/cactus-icons
```

Import all the icons or each icon individually and render as jsx elements.

```jsx
import ActionAdd from '@repay/cactus-icons/actions-add'
import { ActionsDelete, ActionsGear } from '@repay/cactus-icons'

export default props => (
  <div>
    <button>
      <ActionsAdd />
    </button>
    <button>
      <ActionsDelete />
    </button>
    <button>
      <ActionsGear />
    </button>
  </div>
)
```

See [Available Icons](./Available_Icons.md) for the published icons in the set.
