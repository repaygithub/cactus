---
title: Cactus Icons
order: 5
---

# Cactus Design System Icons

The Cactus Design System contains a set of icons as React components to use within projects.

## Quick Links

- <a to='./available-icons'>Available Icons</a>
- [Source Code](../../modules/cactus-icons)

## Getting Started

Install via node based package manager

```
yarn add --dev @repay/cactus-icons
```

Import all the icons or each icon individually and render as jsx elements.

```jsx
import ActionAdd from '@repay/cactus-icons/i/actions-add'
import { ActionsDelete, ActionsGear } from '@repay/cactus-icons'

export default (props) => (
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

Next see the <a to='./available-icons'>Available Icons</a> for the published icons in the set.
