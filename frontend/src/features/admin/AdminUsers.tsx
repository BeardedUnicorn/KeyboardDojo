import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Tooltip,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Mock data for users
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joinDate: '2023-05-15', subscription: 'premium' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin', status: 'active', joinDate: '2023-04-20', subscription: 'premium' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'inactive', joinDate: '2023-03-10', subscription: 'free' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'active', joinDate: '2023-06-01', subscription: 'free' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'user', status: 'active', joinDate: '2023-05-22', subscription: 'premium' },
  { id: 6, name: 'Diana Miller', email: 'diana@example.com', role: 'user', status: 'active', joinDate: '2023-04-15', subscription: 'free' },
  { id: 7, name: 'Edward Davis', email: 'edward@example.com', role: 'user', status: 'inactive', joinDate: '2023-03-05', subscription: 'free' },
  { id: 8, name: 'Fiona Clark', email: 'fiona@example.com', role: 'user', status: 'active', joinDate: '2023-06-10', subscription: 'premium' },
  { id: 9, name: 'George White', email: 'george@example.com', role: 'user', status: 'active', joinDate: '2023-05-30', subscription: 'free' },
  { id: 10, name: 'Hannah Green', email: 'hannah@example.com', role: 'user', status: 'inactive', joinDate: '2023-04-25', subscription: 'premium' },
];

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  subscription: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubscription, setFilterSubscription] = useState('all');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (user: User | null = null) => {
    setEditingUser(user);
    setOpenDialog(true);
    if (user) {
      formik.setValues({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        subscription: user.subscription,
      });
    } else {
      formik.resetForm();
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    formik.resetForm();
  };

  const handleOpenDeleteConfirm = (userId: number) => {
    setUserToDelete(userId);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = () => {
    if (userToDelete !== null) {
      setUsers(users.filter(user => user.id !== userToDelete));
      handleCloseDeleteConfirm();
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      subscription: 'free',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      role: Yup.string().oneOf(['user', 'admin'], 'Invalid role').required('Role is required'),
      status: Yup.string().oneOf(['active', 'inactive'], 'Invalid status').required('Status is required'),
      subscription: Yup.string().oneOf(['free', 'premium'], 'Invalid subscription').required('Subscription is required'),
    }),
    onSubmit: (values) => {
      if (editingUser) {
        // Update existing user
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...values } : user
        ));
      } else {
        // Add new user
        const newUser = {
          id: Math.max(...users.map(u => u.id)) + 1,
          ...values,
          joinDate: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);
      }
      handleCloseDialog();
    },
  });

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesSubscription = filterSubscription === 'all' || user.subscription === filterSubscription;
    
    return matchesSearch && matchesRole && matchesStatus && matchesSubscription;
  });

  // Pagination
  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>User Management</Typography>
      
      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: '200px' }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: '120px' }}>
            <InputLabel id="role-filter-label">Role</InputLabel>
            <Select
              labelId="role-filter-label"
              value={filterRole}
              label="Role"
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: '120px' }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: '140px' }}>
            <InputLabel id="subscription-filter-label">Subscription</InputLabel>
            <Select
              labelId="subscription-filter-label"
              value={filterSubscription}
              label="Subscription"
              onChange={(e) => setFilterSubscription(e.target.value)}
            >
              <MenuItem value="all">All Plans</MenuItem>
              <MenuItem value="free">Free</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Reset Filters">
            <IconButton 
              onClick={() => {
                setSearchTerm('');
                setFilterRole('all');
                setFilterStatus('all');
                setFilterSubscription('all');
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          
          <Button 
            variant="contained" 
            onClick={() => handleOpenDialog()}
            sx={{ ml: 'auto' }}
          >
            Add User
          </Button>
        </Box>
      </Paper>
      
      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Subscription</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell component="th" scope="row">
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={user.role === 'admin' ? 'secondary' : 'default'} 
                      size="small" 
                      variant={user.role === 'admin' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status} 
                      color={user.status === 'active' ? 'success' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.subscription} 
                      color={user.subscription === 'premium' ? 'primary' : 'default'} 
                      size="small" 
                      variant={user.subscription === 'premium' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpenDialog(user)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleOpenDeleteConfirm(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Alert severity="info">No users found matching the current filters.</Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      
      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <FormControl fullWidth error={formik.touched.role && Boolean(formik.errors.role)}>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  label="Role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
                {formik.touched.role && formik.errors.role && (
                  <FormHelperText>{formik.errors.role}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText>{formik.errors.status}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth error={formik.touched.subscription && Boolean(formik.errors.subscription)}>
                <InputLabel id="subscription-label">Subscription</InputLabel>
                <Select
                  labelId="subscription-label"
                  id="subscription"
                  name="subscription"
                  value={formik.values.subscription}
                  onChange={formik.handleChange}
                  label="Subscription"
                >
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
                {formik.touched.subscription && formik.errors.subscription && (
                  <FormHelperText>{formik.errors.subscription}</FormHelperText>
                )}
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers; 