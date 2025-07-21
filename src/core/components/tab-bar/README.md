# Reusable TabBar Component

A flexible, customizable TabBar component based on Ant Design that can be used for both navigation and content organization within forms and other UI components.

## Features

- Supports closable tabs with customizable close behavior
- Optional "Close All" button
- Can be used for navigation (no content) or content organization (with rendered content)
- Full dark mode support
- Responsive design
- Supports both form-style and navigation-style tabs

## Usage

### Basic Usage (Navigation Tabs)

```jsx
import TabBar from 'src/ui/components/tab-bar'

const MyComponent = () => {
  const [activeTab, setActiveTab] = useState('tab1')
  
  const items = [
    { key: 'tab1', title: 'Dashboard', closeable: false },
    { key: 'tab2', title: 'Users', closeable: true },
    { key: 'tab3', title: 'Settings', closeable: true }
  ]
  
  const handleClose = (key) => {
    // Handle tab close logic
  }
  
  return (
    <TabBar
      items={items}
      activeKey={activeTab}
      onChange={setActiveTab}
      onClose={handleClose}
      showCloseAll={false}
      renderTabContent={false}
    />
  )
}
```

### Form Tabs (with Content)

```jsx
import TabBar from 'src/ui/components/tab-bar'

const MyFormComponent = () => {
  const [activeTab, setActiveTab] = useState('details')
  
  const items = [
    { 
      key: 'details', 
      title: 'Details', 
      closeable: false,
      content: <DetailsForm />
    },
    { 
      key: 'settings', 
      title: 'Settings', 
      closeable: false,
      content: <SettingsForm />
    }
  ]
  
  return (
    <div className="form-tabs">
      <TabBar
        items={items}
        activeKey={activeTab}
        onChange={setActiveTab}
        renderTabContent={true}
        showCloseAll={false}
      />
    </div>
  )
}
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `items` | `Array` | `[]` | Array of tab items with `key`, `title`, `closeable`, and `content` properties |
| `activeKey` | `string` | - | Key of the currently active tab |
| `onChange` | `function` | - | Callback when tab is changed, receives key of new tab |
| `onClose` | `function` | - | Callback when tab is closed, receives key of closed tab and event |
| `onCloseAll` | `function` | - | Callback when all tabs are closed |
| `showCloseAll` | `boolean` | `false` | Whether to show the "Close All" button |
| `renderTabContent` | `boolean` | `false` | Whether to render tab content inside the component |
| `showTabs` | `boolean` | `true` | Whether to show tab navigation |
| `containerClassName` | `string` | `''` | Additional class name for the container |
| `tabBarExtraContent` | `React.ReactNode` | `null` | Content to render on the right side of the tab bar |

## CSS Customization

To customize the appearance further, you can add your own CSS targeting the following classes:

- `.tab-bar-container` - The main container
- `.antd-tabs-custom` - The tabs component
- `.close-all-btn` - The close all button

For form-specific styling, wrap your TabBar in a container with the `.form-tabs` class:

```jsx
<div className="form-tabs">
  <TabBar {...props} />
</div>
``` 