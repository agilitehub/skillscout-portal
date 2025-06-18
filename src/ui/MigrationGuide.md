# Migration Guide: From core.css to Tailwind-Only

This guide helps you migrate from the old `core.css` custom classes to the new Tailwind-only approach.

## What Changed

We've eliminated `core.css` and replaced it with:
- `tailwind.css` - Only contains Tailwind directives
- `GlobalStyles` component - Applies global styles programmatically
- `TailwindComponents.js` - Reusable Tailwind utility classes

## Migration Map

### Button Classes
| Old CSS Class | New Utility | Import |
|---------------|-------------|---------|
| `btn` | `BUTTON_BASE_CLASSES` | `import { BUTTON_BASE_CLASSES } from './ui/styles'` |
| `btn-primary` | `getButtonClasses('primary')` | `import { getButtonClasses } from './ui/styles'` |
| `btn-secondary` | `getButtonClasses('secondary')` | `import { getButtonClasses } from './ui/styles'` |
| `btn-outline` | `getButtonClasses('outline')` | `import { getButtonClasses } from './ui/styles'` |
| `btn-ghost` | `getButtonClasses('ghost')` | `import { getButtonClasses } from './ui/styles'` |

### Container Classes
| Old CSS Class | New Utility | Import |
|---------------|-------------|---------|
| `container` | `getContainerClasses('default')` | `import { getContainerClasses } from './ui/styles'` |
| `container-padded` | `getContainerClasses('padded')` | `import { getContainerClasses } from './ui/styles'` |

### Transition Classes
| Old CSS Class | New Utility | Import |
|---------------|-------------|---------|
| `transition-all-fast` | `TRANSITION_CLASSES.fast` | `import { TRANSITION_CLASSES } from './ui/styles'` |
| `transition-all-medium` | `TRANSITION_CLASSES.medium` | `import { TRANSITION_CLASSES } from './ui/styles'` |
| `transition-all-slow` | `TRANSITION_CLASSES.slow` | `import { TRANSITION_CLASSES } from './ui/styles'` |

## Example Migration

### Before (using CSS classes):
```jsx
<button className="btn btn-primary">
  Click me
</button>

<div className="container-padded">
  <h1>Title</h1>
</div>
```

### After (using Tailwind utilities):
```jsx
import { getButtonClasses, getContainerClasses, getTypographyClasses } from './ui/styles'

<button className={getButtonClasses('primary')}>
  Click me
</button>

<div className={getContainerClasses('padded')}>
  <h1 className={getTypographyClasses('h1')}>Title</h1>
</div>
```

## Global Styles

All global styles (body background, scrollbars, etc.) are now applied by the `GlobalStyles` component, which is automatically included in your app.

## Typography

Instead of relying on global CSS for headings, use the typography utility classes:

```jsx
import { getTypographyClasses } from './ui/styles'

<h1 className={getTypographyClasses('h1')}>Main Title</h1>
<h2 className={getTypographyClasses('h2')}>Subtitle</h2>
```

## Benefits

1. **Fully Tailwind-based** - No custom CSS resources
2. **Tree-shakable** - Only import what you use
3. **Type-safe** - JavaScript constants instead of string classes
4. **Consistent** - All styles follow the same pattern
5. **Maintainable** - Centralized color and style definitions

## Quick Migration Tool

Use the `migrateClassNames` object for quick replacements:

```jsx
import { migrateClassNames } from './ui/styles'

// Replace old classes with new ones
const className = migrateClassNames['btn-primary'] // Returns full Tailwind classes
``` 