import React, { useState, useEffect } from 'react';
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
  Button,
  IconButton,
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
  CircularProgress,
  Tooltip,
  Alert,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LessonContentEditor from './components/LessonContentEditor';
import LessonContentPreview from './components/LessonContentPreview';
import LessonTemplates from './components/LessonTemplates';

// Mock data for lessons
const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'VS Code Essentials',
    category: 'Development',
    difficulty: 'Beginner',
    isPremium: false,
    createdAt: '2023-03-12',
  },
  {
    id: '2',
    title: 'Photoshop Shortcuts',
    category: 'Design',
    difficulty: 'Intermediate',
    isPremium: true,
    createdAt: '2023-03-11',
  },
  {
    id: '3',
    title: 'Excel Power User',
    category: 'Productivity',
    difficulty: 'Advanced',
    isPremium: true,
    createdAt: '2023-03-10',
  },
  {
    id: '4',
    title: 'Terminal Commands',
    category: 'Development',
    difficulty: 'Intermediate',
    isPremium: false,
    createdAt: '2023-03-09',
  },
  {
    id: '5',
    title: 'Figma Shortcuts',
    category: 'Design',
    difficulty: 'Beginner',
    isPremium: false,
    createdAt: '2023-03-08',
  },
  {
    id: '6',
    title: 'IntelliJ IDEA Mastery',
    category: 'Development',
    difficulty: 'Advanced',
    isPremium: true,
    createdAt: '2023-03-07',
  },
  {
    id: '7',
    title: 'Slack Productivity',
    category: 'Productivity',
    difficulty: 'Beginner',
    isPremium: false,
    createdAt: '2023-03-06',
  },
  {
    id: '8',
    title: 'Illustrator Essentials',
    category: 'Design',
    difficulty: 'Intermediate',
    isPremium: true,
    createdAt: '2023-03-05',
  },
];

// Types
interface Lesson {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isPremium: boolean;
  createdAt: string;
}

interface LessonFormValues {
  title: string;
  category: string;
  difficulty: string;
  isPremium: boolean;
  content?: string;
}

const AdminLessons: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // In a real app, you would fetch this data from an API
  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // In a real app, you would fetch data from an API
        // const response = await fetch('/api/admin/lessons');
        // const data = await response.json();
        // setLessons(data);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (lesson?: Lesson) => {
    if (lesson) {
      setEditingLesson(lesson);
      formik.setValues({
        title: lesson.title,
        category: lesson.category,
        difficulty: lesson.difficulty,
        isPremium: lesson.isPremium,
        content: '',
      });
    } else {
      setEditingLesson(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  const handleDeleteClick = (lesson: Lesson) => {
    setLessonToDelete(lesson);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (lessonToDelete) {
      // In a real app, you would call an API to delete the lesson
      setLessons(lessons.filter((l) => l.id !== lessonToDelete.id));
      setSuccessMessage(`Lesson "${lessonToDelete.title}" has been deleted.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    setDeleteConfirmOpen(false);
    setLessonToDelete(null);
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required').max(100, 'Title must be at most 100 characters'),
    category: Yup.string().required('Category is required'),
    difficulty: Yup.string().required('Difficulty is required'),
    isPremium: Yup.boolean(),
    content: Yup.string(),
  });

  const formik = useFormik<LessonFormValues>({
    initialValues: {
      title: '',
      category: '',
      difficulty: '',
      isPremium: false,
      content: '',
    },
    validationSchema,
    onSubmit: (values: LessonFormValues) => {
      // In a real app, you would call an API to create/update the lesson
      if (editingLesson) {
        // Update existing lesson
        const updatedLessons = lessons.map((lesson) =>
          lesson.id === editingLesson.id
            ? {
                ...lesson,
                title: values.title,
                category: values.category,
                difficulty: values.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
                isPremium: values.isPremium,
              }
            : lesson
        );
        setLessons(updatedLessons);
        setSuccessMessage(`Lesson "${values.title}" has been updated.`);
      } else {
        // Create new lesson
        const newLesson: Lesson = {
          id: Date.now().toString(), // In a real app, the ID would come from the backend
          title: values.title,
          category: values.category,
          difficulty: values.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
          isPremium: values.isPremium,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setLessons([newLesson, ...lessons]);
        setSuccessMessage(`Lesson "${values.title}" has been created.`);
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
      handleCloseDialog();
    },
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Manage Lessons
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Lesson
        </Button>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lessons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell>{lesson.title}</TableCell>
                  <TableCell>{lesson.category}</TableCell>
                  <TableCell>
                    <Chip
                      label={lesson.difficulty}
                      color={
                        lesson.difficulty === 'Beginner'
                          ? 'success'
                          : lesson.difficulty === 'Intermediate'
                          ? 'primary'
                          : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={lesson.isPremium ? 'Premium' : 'Free'}
                      color={lesson.isPremium ? 'warning' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(lesson.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View">
                      <IconButton size="small" color="info">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(lesson)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(lesson)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={lessons.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add/Edit Lesson Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Add New Lesson'}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="title"
                    name="title"
                    label="Lesson Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                          labelId="category-label"
                          id="category"
                          name="category"
                          value={formik.values.category}
                          onChange={formik.handleChange}
                          label="Category"
                        >
                          <MenuItem value="Development">Development</MenuItem>
                          <MenuItem value="Design">Design</MenuItem>
                          <MenuItem value="Productivity">Productivity</MenuItem>
                          <MenuItem value="Creative">Creative</MenuItem>
                        </Select>
                        {formik.touched.category && formik.errors.category && (
                          <FormHelperText>{formik.errors.category}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={formik.touched.difficulty && Boolean(formik.errors.difficulty)}>
                        <InputLabel id="difficulty-label">Difficulty</InputLabel>
                        <Select
                          labelId="difficulty-label"
                          id="difficulty"
                          name="difficulty"
                          value={formik.values.difficulty}
                          onChange={formik.handleChange}
                          label="Difficulty"
                        >
                          <MenuItem value="Beginner">Beginner</MenuItem>
                          <MenuItem value="Intermediate">Intermediate</MenuItem>
                          <MenuItem value="Advanced">Advanced</MenuItem>
                        </Select>
                        {formik.touched.difficulty && formik.errors.difficulty && (
                          <FormHelperText>{formik.errors.difficulty}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="premium-label">Premium Status</InputLabel>
                    <Select
                      labelId="premium-label"
                      id="isPremium"
                      name="isPremium"
                      value={formik.values.isPremium}
                      onChange={formik.handleChange}
                      label="Premium Status"
                    >
                      <MenuItem value="false">Free</MenuItem>
                      <MenuItem value="true">Premium</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 2 }}>Lesson Content</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <LessonContentEditor
                    initialContent={formik.values.content || '{}'}
                    onChange={(content) => formik.setFieldValue('content', content)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <LessonTemplates
                    onSelectTemplate={(template) => {
                      formik.setFieldValue('content', template);
                    }}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 2 }}>Preview</Typography>
              <LessonContentPreview content={formik.values.content || '{}'}/>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingLesson ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the lesson "{lessonToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLessons; 