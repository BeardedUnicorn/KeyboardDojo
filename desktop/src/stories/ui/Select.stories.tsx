import { Select, MenuItem, FormControl, InputLabel, FormHelperText, Box, Stack } from '@mui/material';
import React, { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import type { SelectChangeEvent } from '@mui/material';

// Define metadata for the Select stories
const meta = {
  title: 'UI/Input/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Select is a form control component that allows users to select an option from a dropdown list.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'standard'],
      description: 'The variant of the Select',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'info', 'success', 'warning'],
      description: 'The color of the Select',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'The size of the Select',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the Select should take up the full width of its container',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the Select is disabled',
    },
    error: {
      control: 'boolean',
      description: 'Whether to show the Select in an error state',
    },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple options can be selected',
    },
    native: {
      control: 'boolean',
      description: 'Whether to use the native select element',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

// For controlled examples
const BasicSelectExample = () => {
  const [value, setValue] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Age</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Age"
        onChange={handleChange}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
};

export const Default: Story = {
  render: () => <BasicSelectExample />,
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Select comes in three variants: outlined (default), filled, and standard.',
      },
    },
  },
  render: () => (
    <Stack spacing={3} sx={{ width: 300 }}>
      <FormControl fullWidth>
        <InputLabel id="variant-outlined-label">Outlined</InputLabel>
        <Select
          labelId="variant-outlined-label"
          id="variant-outlined"
          defaultValue=""
          label="Outlined"
          variant="outlined"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="variant-filled-label">Filled</InputLabel>
        <Select
          labelId="variant-filled-label"
          id="variant-filled"
          defaultValue=""
          label="Filled"
          variant="filled"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="variant-standard-label">Standard</InputLabel>
        <Select
          labelId="variant-standard-label"
          id="variant-standard"
          defaultValue=""
          label="Standard"
          variant="standard"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Select comes in two sizes: medium (default) and small.',
      },
    },
  },
  render: () => (
    <Stack spacing={3} sx={{ width: 300 }}>
      <FormControl fullWidth>
        <InputLabel id="size-medium-label">Medium</InputLabel>
        <Select
          labelId="size-medium-label"
          id="size-medium"
          defaultValue=""
          label="Medium"
          size="medium"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="size-small-label">Small</InputLabel>
        <Select
          labelId="size-small-label"
          id="size-small"
          defaultValue=""
          label="Small"
          size="small"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  ),
};

export const ValidationStates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Select can show different validation states.',
      },
    },
  },
  render: () => (
    <Stack spacing={3} sx={{ width: 300 }}>
      <FormControl fullWidth>
        <InputLabel id="validation-default-label">Default</InputLabel>
        <Select
          labelId="validation-default-label"
          id="validation-default"
          defaultValue=""
          label="Default"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>

      <FormControl required fullWidth>
        <InputLabel id="validation-required-label">Required</InputLabel>
        <Select
          labelId="validation-required-label"
          id="validation-required"
          defaultValue=""
          label="Required"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Required</FormHelperText>
      </FormControl>

      <FormControl error fullWidth>
        <InputLabel id="validation-error-label">Error</InputLabel>
        <Select
          labelId="validation-error-label"
          id="validation-error"
          defaultValue=""
          label="Error"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Error message</FormHelperText>
      </FormControl>

      <FormControl disabled fullWidth>
        <InputLabel id="validation-disabled-label">Disabled</InputLabel>
        <Select
          labelId="validation-disabled-label"
          id="validation-disabled"
          defaultValue={10}
          label="Disabled"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  ),
};

export const MultipleSelect: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Select can allow multiple selections.',
      },
    },
  },
  render: () => {
    const MultipleSelectExample = () => {
      const [selected, setSelected] = useState<string[]>([]);

      const handleChange = (event: SelectChangeEvent<string[]>) => {
        setSelected(event.target.value as string[]);
      };

      return (
        <FormControl fullWidth>
          <InputLabel id="multiple-select-label">Multiple Select</InputLabel>
          <Select
            labelId="multiple-select-label"
            id="multiple-select"
            multiple
            value={selected}
            onChange={handleChange}
            label="Multiple Select"
          >
            <MenuItem value="react">React</MenuItem>
            <MenuItem value="vue">Vue</MenuItem>
            <MenuItem value="angular">Angular</MenuItem>
            <MenuItem value="svelte">Svelte</MenuItem>
            <MenuItem value="ember">Ember</MenuItem>
          </Select>
        </FormControl>
      );
    };

    return <MultipleSelectExample />;
  },
};

export const GroupedSelect: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Options can be grouped for better organization.',
      },
    },
  },
  render: () => (
    <FormControl sx={{ width: 300 }}>
      <InputLabel id="grouped-select-label">Grouped</InputLabel>
      <Select
        labelId="grouped-select-label"
        id="grouped-select"
        defaultValue=""
        label="Grouped"
      >
        <MenuItem value=""><em>None</em></MenuItem>
        <MenuItem disabled value="header-frontend">Frontend</MenuItem>
        <MenuItem value="react">React</MenuItem>
        <MenuItem value="vue">Vue</MenuItem>
        <MenuItem value="angular">Angular</MenuItem>
        <MenuItem disabled value="header-backend">Backend</MenuItem>
        <MenuItem value="node">Node.js</MenuItem>
        <MenuItem value="python">Python</MenuItem>
        <MenuItem value="java">Java</MenuItem>
      </Select>
    </FormControl>
  ),
};

export const FullWidth: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Select can take up the full width of its container.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth>
        <InputLabel id="fullwidth-select-label">Full Width</InputLabel>
        <Select
          labelId="fullwidth-select-label"
          id="fullwidth-select"
          defaultValue=""
          label="Full Width"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  ),
};
