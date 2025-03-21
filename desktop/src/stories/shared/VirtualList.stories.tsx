import React, { useMemo } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Box, Typography, Paper, Divider, Avatar, ListItem, ListItemText, ListItemAvatar, Chip } from '@mui/material';

import VirtualList from '../../components/shared/VirtualList';

// Define a more flexible story type
type FlexibleStory = StoryObj<typeof VirtualList>;

const meta = {
  title: 'Shared/VirtualList',
  component: VirtualList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A virtualized list component that efficiently renders large lists by only rendering items that are visible in the viewport.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object', description: 'Array of items to render' },
    renderItem: { control: false, description: 'Function to render each item' },
    itemHeight: { control: 'number', description: 'Height of each item in pixels' },
    height: { control: 'number', description: 'Height of the container in pixels' },
    width: { control: 'text', description: 'Width of the container' },
    overscan: { control: 'number', description: 'Number of items to render beyond visible area' }
  }
} satisfies Meta<typeof VirtualList>;

export default meta;

// Generate mock data for the examples
const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    title: `Item ${index + 1}`,
    description: `Description for item ${index + 1}`
  }));
};

// Generate mock user data for more complex examples
const generateUsers = (count: number) => {
  const statuses = ['active', 'offline', 'busy', 'away'];
  const names = [
    'Alice Smith', 'Bob Johnson', 'Carol Williams', 'David Brown', 
    'Eva Davis', 'Frank Miller', 'Grace Wilson', 'Henry Moore',
    'Ivy Taylor', 'Jack Anderson', 'Kate Thomas', 'Leo Jackson',
    'Mia White', 'Noah Harris', 'Olivia Martin', 'Peter Thompson'
  ];
  
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    name: names[index % names.length],
    email: `${names[index % names.length].split(' ')[0].toLowerCase()}@example.com`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000))
  }));
};

// Basic example with simple items
export const Default: FlexibleStory = {
  args: {},
  render: () => {
    const items = useMemo(() => generateItems(1000), []);
    
    return (
      <Box sx={{ width: 400 }}>
        <Typography variant="h6" gutterBottom>Virtual List Example</Typography>
        <Typography variant="body2" paragraph>
          This list contains 1,000 items but only renders the visible ones.
        </Typography>
        <Paper elevation={1}>
          <VirtualList
            items={items}
            renderItem={(item) => (
              <Box 
                sx={{ 
                  p: 2,
                  borderBottom: '1px solid #eee',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <Typography variant="subtitle1">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">{item.description}</Typography>
              </Box>
            )}
            itemHeight={80}
            height={400}
            width="100%"
            overscan={2}
          />
        </Paper>
      </Box>
    );
  }
};

// Example with different item heights
export const VariableContent: FlexibleStory = {
  args: {},
  render: () => {
    const items = useMemo(() => {
      return Array.from({ length: 100 }, (_, index) => ({
        id: index,
        title: `Item ${index + 1}`,
        description: `Description that is ${index % 3 === 0 ? 'short' : (index % 3 === 1 ? 'medium length with some additional text' : 'really long with a lot of content that might wrap to multiple lines depending on the width of the container')}`,
      }));
    }, []);
    
    return (
      <Box sx={{ width: 400 }}>
        <Typography variant="h6" gutterBottom>Fixed Height Items</Typography>
        <Typography variant="body2" paragraph>
          Even though content varies in length, each item has a fixed height (80px).
        </Typography>
        <Paper elevation={1}>
          <VirtualList
            items={items}
            renderItem={(item) => (
              <Box 
                sx={{ 
                  p: 2,
                  height: '100%',
                  overflow: 'hidden',
                  borderBottom: '1px solid #eee'
                }}
              >
                <Typography variant="subtitle1">{item.title}</Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            )}
            itemHeight={80}
            height={400}
            width="100%"
          />
        </Paper>
      </Box>
    );
  }
};

// User list example with avatars and status indicators
export const UserList: FlexibleStory = {
  args: {},
  render: () => {
    const users = useMemo(() => generateUsers(500), []);
    
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active': return 'success.main';
        case 'busy': return 'error.main';
        case 'away': return 'warning.main';
        default: return 'text.disabled';
      }
    };
    
    return (
      <Box sx={{ width: 400 }}>
        <Typography variant="h6" gutterBottom>User List Example</Typography>
        <Typography variant="body2" paragraph>
          A more complex example with user avatars and status indicators.
        </Typography>
        <Paper elevation={1}>
          <VirtualList
            items={users}
            renderItem={(user) => (
              <ListItem 
                sx={{ 
                  borderBottom: '1px solid #eee',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <ListItemAvatar>
                  <Avatar>{user.name.split(' ').map(n => n[0]).join('')}</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={user.name}
                  secondary={user.email}
                />
                <Chip 
                  label={user.status}
                  size="small"
                  sx={{ 
                    backgroundColor: getStatusColor(user.status),
                    color: 'white',
                    textTransform: 'capitalize'
                  }}
                />
              </ListItem>
            )}
            itemHeight={72}
            height={500}
            width="100%"
            overscan={5}
          />
        </Paper>
      </Box>
    );
  }
};

// Example with custom key extractor
export const WithCustomKeys: FlexibleStory = {
  args: {},
  render: () => {
    const items = useMemo(() => {
      return Array.from({ length: 100 }, (_, index) => ({
        uniqueId: `item-${index}`,
        title: `Item ${index + 1}`,
        description: `Item with custom key: item-${index}`
      }));
    }, []);
    
    return (
      <Box sx={{ width: 400 }}>
        <Typography variant="h6" gutterBottom>Custom Key Extractor</Typography>
        <Typography variant="body2" paragraph>
          Using a custom key extractor function to generate unique keys.
        </Typography>
        <Paper elevation={1}>
          <VirtualList
            items={items}
            renderItem={(item) => (
              <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                <Typography variant="subtitle1">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">{item.description}</Typography>
              </Box>
            )}
            itemHeight={80}
            height={400}
            width="100%"
            getKey={(item) => item.uniqueId}
          />
        </Paper>
      </Box>
    );
  }
};

// Performance demonstration with many items
export const LargeDataSet: FlexibleStory = {
  args: {},
  render: () => {
    const items = useMemo(() => generateItems(10000), []);
    
    return (
      <Box sx={{ width: 400 }}>
        <Typography variant="h6" gutterBottom>Large Data Set</Typography>
        <Typography variant="body2" paragraph>
          Efficiently rendering 10,000 items with virtualization.
        </Typography>
        <Paper elevation={1}>
          <VirtualList
            items={items}
            renderItem={(item, index) => (
              <Box 
                sx={{ 
                  p: 2, 
                  borderBottom: '1px solid #eee',
                  backgroundColor: index % 2 === 0 ? 'background.default' : 'background.paper'
                }}
              >
                <Typography variant="subtitle2">Row {index + 1} of 10,000</Typography>
                <Typography variant="body2">{item.title}</Typography>
              </Box>
            )}
            itemHeight={60}
            height={400}
            width="100%"
            overscan={5}
          />
        </Paper>
      </Box>
    );
  }
};

// Usage documentation
export const UsageDocumentation: FlexibleStory = {
  args: {},
  parameters: {
    docs: {
      source: { code: null },
      description: {
        story: `
### Using the VirtualList Component

The \`VirtualList\` component is a performance optimization tool for rendering large lists efficiently by only rendering the items that are currently visible in the viewport.

#### Basic Usage

\`\`\`jsx
import { VirtualList } from '../components/shared/VirtualList';

function MyList() {
  const items = [...] // Your array of items
  
  return (
    <VirtualList
      items={items}
      renderItem={(item, index) => (
        <div key={index}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      )}
      itemHeight={80} // Height of each item in pixels
      height={400}    // Height of the viewport
      width="100%"    // Width of the list
    />
  );
}
\`\`\`

#### With Custom Key Extractor

When your items have unique identifiers, use the \`getKey\` prop to provide a custom key function:

\`\`\`jsx
<VirtualList
  items={users}
  renderItem={(user) => (
    <UserItem user={user} />
  )}
  itemHeight={60}
  height={400}
  getKey={(user) => user.id}
/>
\`\`\`

#### Performance Considerations

1. **Fixed Item Height**: The component expects all items to have the same height. For variable height items, you would need a more complex virtualization solution.

2. **Memoize Items**: To prevent unnecessary re-renders, wrap your items array with \`useMemo\` if it doesn't change frequently.

3. **Overscan**: The \`overscan\` prop (default: 3) controls how many items beyond the visible area are rendered. Increase this for smoother scrolling at the cost of rendering more items.

4. **Item Component**: Optimize your item rendering function for performance. Consider memoizing complex item components.

#### Accessibility

When using VirtualList, keep these accessibility considerations in mind:

- The scrollable container receives keyboard focus
- Screen readers will announce items as they come into view
- Consider adding appropriate ARIA attributes to your list items
`
      }
    }
  },
  render: () => null
}; 