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
  CircularProgress,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { 
  getAllLessons, 
  createLesson, 
  updateLesson, 
  deleteLesson, 
  seedLessons,
  Lesson,
  LessonInput
} from '../../api/lessonsService';
import LessonForm from './components/LessonForm';

const AdminLessonsManager: React.FC = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'delete'>('add');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllLessons();
      setLessons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (type: 'add' | 'edit' | 'delete', lesson?: Lesson) => {
    setDialogType(type);
    setCurrentLesson(lesson || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentLesson(null);
  };

  const handleSubmit = async (values: LessonInput) => {
    setSubmitting(true);
    try {
      if (dialogType === 'add') {
        await createLesson(values);
        setSnackbar({
          open: true,
          message: 'Lesson created successfully',
          severity: 'success',
        });
      } else if (dialogType === 'edit' && currentLesson) {
        await updateLesson(currentLesson.lessonId, values);
        setSnackbar({
          open: true,
          message: 'Lesson updated successfully',
          severity: 'success',
        });
      }
      handleCloseDialog();
      fetchLessons();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'An error occurred',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentLesson) return;
    
    setSubmitting(true);
    try {
      await deleteLesson(currentLesson.lessonId);
      setSnackbar({
        open: true,
        message: 'Lesson deleted successfully',
        severity: 'success',
      });
      handleCloseDialog();
      fetchLessons();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'An error occurred',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeedLessons = async () => {
    setLoading(true);
    try {
      const result = await seedLessons();
      setSnackbar({
        open: true,
        message: `${result.results.length} lessons seeded successfully`,
        severity: 'success',
      });
      fetchLessons();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to seed lessons',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewLesson = (lessonId: string) => {
    navigate(`/lessons/${lessonId}`);
  };

  const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' => {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'success';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Lessons
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleSeedLessons()}
            sx={{ mr: 2 }}
          >
            Seed Lessons
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
          >
            Add Lesson
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : lessons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No lessons found
                  </TableCell>
                </TableRow>
              ) : (
                lessons
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((lesson) => (
                    <TableRow key={lesson.lessonId} hover>
                      <TableCell>{lesson.title}</TableCell>
                      <TableCell>{lesson.category}</TableCell>
                      <TableCell>
                        <Chip
                          label={lesson.difficulty}
                          color={getDifficultyColor(lesson.difficulty)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{lesson.order}</TableCell>
                      <TableCell>
                        {lesson.isPremium ? (
                          <Chip label="Premium" color="primary" size="small" />
                        ) : (
                          <Chip label="Free" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(lesson.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Lesson">
                          <IconButton
                            size="small"
                            onClick={() => handleViewLesson(lesson.lessonId)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Lesson">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog('edit', lesson)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Lesson">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDialog('delete', lesson)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
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
      <Dialog
        open={openDialog && (dialogType === 'add' || dialogType === 'edit')}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'add' ? 'Add New Lesson' : 'Edit Lesson'}
        </DialogTitle>
        <DialogContent dividers>
          {openDialog && (dialogType === 'add' || dialogType === 'edit') && (
            <LessonForm
              initialValues={currentLesson || {}}
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
              isSubmitting={submitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog && dialogType === 'delete'}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Lesson</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the lesson "{currentLesson?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLessonsManager; 