import React, { useState } from 'react';
import {
  Pagination,
  PaginationItem,
  Stack,
  Typography,
  Box,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

import type { Meta, StoryObj } from '@storybook/react';

// Define metadata for the Pagination stories
const meta = {
  title: 'UI/Navigation/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Pagination component enables users to navigate through large sets of data across multiple pages.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'Number of pages',
    },
    defaultPage: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'The default page selected',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the pagination component will be disabled',
    },
    hideNextButton: {
      control: 'boolean',
      description: 'If true, hide the next-page button',
    },
    hidePrevButton: {
      control: 'boolean',
      description: 'If true, hide the previous-page button',
    },
    shape: {
      control: { type: 'select', options: ['circular', 'rounded'] },
      description: 'The shape of the pagination items',
    },
    showFirstButton: {
      control: 'boolean',
      description: 'If true, show the first-page button',
    },
    showLastButton: {
      control: 'boolean',
      description: 'If true, show the last-page button',
    },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
      description: 'The size of the pagination component',
    },
    variant: {
      control: { type: 'select', options: ['text', 'outlined'] },
      description: 'The variant to use',
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    count: 10,
    shape: 'rounded',
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <Pagination {...args} />
    </Box>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pagination is available in three sizes: small, medium, and large.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
      <Typography variant="subtitle2">Small</Typography>
      <Pagination count={10} size="small" />

      <Typography variant="subtitle2">Medium (default)</Typography>
      <Pagination count={10} size="medium" />

      <Typography variant="subtitle2">Large</Typography>
      <Pagination count={10} size="large" />
    </Stack>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pagination comes in two variants: text and outlined.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
      <Typography variant="subtitle2">Text (default)</Typography>
      <Pagination count={10} variant="text" />

      <Typography variant="subtitle2">Outlined</Typography>
      <Pagination count={10} variant="outlined" />
    </Stack>
  ),
};

export const Shapes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pagination items can be circular or rounded.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
      <Typography variant="subtitle2">Rounded (default)</Typography>
      <Pagination count={10} shape="rounded" />

      <Typography variant="subtitle2">Circular</Typography>
      <Pagination count={10} shape="circular" />
    </Stack>
  ),
};

export const WithButtons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Navigation buttons can be shown or hidden.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
      <Typography variant="subtitle2">Default (no first/last)</Typography>
      <Pagination count={10} />

      <Typography variant="subtitle2">With first/last buttons</Typography>
      <Pagination count={10} showFirstButton showLastButton />

      <Typography variant="subtitle2">Without prev/next buttons</Typography>
      <Pagination count={10} hidePrevButton hideNextButton />

      <Typography variant="subtitle2">With all navigation buttons</Typography>
      <Pagination count={10} showFirstButton showLastButton />
    </Stack>
  ),
};

export const CustomIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Navigation icons can be customized.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <Pagination
        count={10}
        renderItem={(item) => (
          <PaginationItem
            slots={{
              previous: ArrowBackIcon,
              next: ArrowForwardIcon,
              first: FirstPageIcon,
              last: LastPageIcon,
            }}
            {...item}
          />
        )}
      />
    </Box>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Disabled pagination cannot be interacted with.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <Pagination count={10} disabled />
    </Box>
  ),
};

export const TablePaginationExample: Story = {
  parameters: {
    docs: {
      description: {
        story: 'TablePagination is a different component optimized for data tables.',
      },
    },
  },
  render: () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    return (
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <TablePagination
          component="div"
          count={100}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>
    );
  },
};

export const ColoredPagination: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Pagination can be customized with different colors.',
      },
    },
  },
  render: () => {
    const theme = useTheme();

    const ColoredPagination = styled(Pagination)(({ theme }) => ({
      '& .MuiPaginationItem-root': {
        '&.Mui-selected': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        },
      },
    }));

    return (
      <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
        <Typography variant="subtitle2">Default (with theme colors)</Typography>
        <Pagination
          count={10}
          color="primary"
        />

        <Typography variant="subtitle2">Secondary color</Typography>
        <Pagination
          count={10}
          color="secondary"
        />

        <Typography variant="subtitle2">Custom styled pagination</Typography>
        <ColoredPagination count={10} />
      </Stack>
    );
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Interactive example with page selection.',
      },
    },
  },
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const totalItems = 237;
    const totalPages = Math.ceil(totalItems / pageSize);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    };

    const handlePageSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setPageSize(event.target.value as number);
      setPage(1);
    };

    return (
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">
            Showing items {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, totalItems)} of {totalItems}
          </Typography>

          <FormControl size="small" sx={{ width: 120 }}>
            <InputLabel id="items-per-page-select-label">Items per page</InputLabel>
            <Select
              labelId="items-per-page-select-label"
              id="items-per-page-select"
              value={pageSize}
              label="Items per page"
              onChange={handlePageSizeChange as any}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChange}
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Box>
    );
  },
};
