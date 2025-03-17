import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Typography,
  Divider,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { LessonInput, Shortcut } from '../../../api/lessonsService';

interface LessonFormProps {
  initialValues?: Partial<LessonInput>;
  onSubmit: (values: LessonInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const defaultInitialValues: LessonInput = {
  title: '',
  description: '',
  category: '',
  difficulty: 'beginner',
  order: 1,
  content: {
    introduction: '',
    shortcuts: [],
    tips: [],
  },
  shortcuts: [],
  isPremium: false,
};

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  difficulty: Yup.string().required('Difficulty is required'),
  order: Yup.number().required('Order is required').min(1, 'Order must be at least 1'),
  content: Yup.object({
    introduction: Yup.string().required('Introduction is required'),
    shortcuts: Yup.array().of(
      Yup.object({
        id: Yup.string().required(),
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        keyCombination: Yup.array().of(Yup.string()).min(1, 'At least one key is required'),
      })
    ),
    tips: Yup.array().of(Yup.string()),
  }),
  isPremium: Yup.boolean(),
});

const LessonForm: React.FC<LessonFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [newTip, setNewTip] = useState('');

  const formik = useFormik({
    initialValues: { ...defaultInitialValues, ...initialValues },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleAddShortcut = () => {
    const newShortcut: Shortcut = {
      id: uuidv4(),
      name: '',
      description: '',
      keyCombination: [''],
      operatingSystem: 'all',
      context: '',
    };

    formik.setFieldValue('content.shortcuts', [
      ...formik.values.content.shortcuts,
      newShortcut,
    ]);
    
    // Also add to the shortcuts array
    formik.setFieldValue('shortcuts', [
      ...formik.values.shortcuts,
      newShortcut,
    ]);
  };

  const handleRemoveShortcut = (index: number) => {
    const updatedShortcuts = [...formik.values.content.shortcuts];
    updatedShortcuts.splice(index, 1);
    formik.setFieldValue('content.shortcuts', updatedShortcuts);
    
    // Also update the shortcuts array
    const updatedMainShortcuts = [...formik.values.shortcuts];
    updatedMainShortcuts.splice(index, 1);
    formik.setFieldValue('shortcuts', updatedMainShortcuts);
  };

  const handleAddTip = () => {
    if (newTip.trim()) {
      formik.setFieldValue('content.tips', [...formik.values.content.tips, newTip]);
      setNewTip('');
    }
  };

  const handleRemoveTip = (index: number) => {
    const updatedTips = [...formik.values.content.tips];
    updatedTips.splice(index, 1);
    formik.setFieldValue('content.tips', updatedTips);
  };

  const handleShortcutChange = (index: number, field: keyof Shortcut, value: string | string[] | 'windows' | 'mac' | 'linux' | 'all' | undefined) => {
    const updatedShortcuts = [...formik.values.content.shortcuts];
    updatedShortcuts[index] = {
      ...updatedShortcuts[index],
      [field]: value,
    };
    formik.setFieldValue('content.shortcuts', updatedShortcuts);
    
    // Also update the shortcuts array
    formik.setFieldValue('shortcuts', updatedShortcuts);
  };

  const handleKeyCombinationChange = (shortcutIndex: number, keyIndex: number, value: string) => {
    const updatedShortcuts = [...formik.values.content.shortcuts];
    const keyCombination = [...updatedShortcuts[shortcutIndex].keyCombination];
    keyCombination[keyIndex] = value;
    updatedShortcuts[shortcutIndex] = {
      ...updatedShortcuts[shortcutIndex],
      keyCombination,
    };
    formik.setFieldValue('content.shortcuts', updatedShortcuts);
    
    // Also update the shortcuts array
    formik.setFieldValue('shortcuts', updatedShortcuts);
  };

  const handleAddKey = (shortcutIndex: number) => {
    const updatedShortcuts = [...formik.values.content.shortcuts];
    updatedShortcuts[shortcutIndex] = {
      ...updatedShortcuts[shortcutIndex],
      keyCombination: [...updatedShortcuts[shortcutIndex].keyCombination, ''],
    };
    formik.setFieldValue('content.shortcuts', updatedShortcuts);
    
    // Also update the shortcuts array
    formik.setFieldValue('shortcuts', updatedShortcuts);
  };

  const handleRemoveKey = (shortcutIndex: number, keyIndex: number) => {
    const updatedShortcuts = [...formik.values.content.shortcuts];
    const keyCombination = [...updatedShortcuts[shortcutIndex].keyCombination];
    keyCombination.splice(keyIndex, 1);
    updatedShortcuts[shortcutIndex] = {
      ...updatedShortcuts[shortcutIndex],
      keyCombination,
    };
    formik.setFieldValue('content.shortcuts', updatedShortcuts);
    
    // Also update the shortcuts array
    formik.setFieldValue('shortcuts', updatedShortcuts);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="category"
            name="category"
            label="Category"
            value={formik.values.category}
            onChange={formik.handleChange}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={2}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
        </Grid>

        <Grid item xs={12} md={6}>
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
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
            {formik.touched.difficulty && formik.errors.difficulty && (
              <FormHelperText>{formik.errors.difficulty as string}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="order"
            name="order"
            label="Order"
            type="number"
            value={formik.values.order}
            onChange={formik.handleChange}
            error={formik.touched.order && Boolean(formik.errors.order)}
            helperText={formik.touched.order && formik.errors.order}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.isPremium}
                onChange={(e) => formik.setFieldValue('isPremium', e.target.checked)}
                name="isPremium"
                color="primary"
              />
            }
            label="Premium Content"
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Content
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="content.introduction"
            name="content.introduction"
            label="Introduction"
            multiline
            rows={4}
            value={formik.values.content.introduction}
            onChange={formik.handleChange}
            error={
              formik.touched.content?.introduction &&
              Boolean(formik.errors.content?.introduction)
            }
            helperText={
              formik.touched.content?.introduction &&
              formik.errors.content?.introduction as string
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Shortcuts</Typography>
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={handleAddShortcut}
            >
              Add Shortcut
            </Button>
          </Box>
        </Grid>

        {formik.values.content.shortcuts.map((shortcut, index) => (
          <Grid item xs={12} key={shortcut.id || index}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">Shortcut #{index + 1}</Typography>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveShortcut(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={shortcut.name}
                    onChange={(e) => handleShortcutChange(index, 'name', e.target.value)}
                    error={
                      formik.touched.content?.shortcuts?.[index]?.name &&
                      Boolean(formik.errors.content?.shortcuts?.[index]?.name)
                    }
                    helperText={
                      formik.touched.content?.shortcuts?.[index]?.name &&
                      (formik.errors.content?.shortcuts?.[index]?.name as string)
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Operating System</InputLabel>
                    <Select
                      value={shortcut.operatingSystem || 'all'}
                      onChange={(e) => handleShortcutChange(index, 'operatingSystem', e.target.value)}
                      label="Operating System"
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="windows">Windows</MenuItem>
                      <MenuItem value="mac">Mac</MenuItem>
                      <MenuItem value="linux">Linux</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={shortcut.description}
                    onChange={(e) => handleShortcutChange(index, 'description', e.target.value)}
                    error={
                      formik.touched.content?.shortcuts?.[index]?.description &&
                      Boolean(formik.errors.content?.shortcuts?.[index]?.description)
                    }
                    helperText={
                      formik.touched.content?.shortcuts?.[index]?.description &&
                      (formik.errors.content?.shortcuts?.[index]?.description as string)
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Context (optional)"
                    value={shortcut.context || ''}
                    onChange={(e) => handleShortcutChange(index, 'context', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Key Combination
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                    {shortcut.keyCombination.map((key, keyIndex) => (
                      <Box key={keyIndex} sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          size="small"
                          value={key}
                          onChange={(e) =>
                            handleKeyCombinationChange(index, keyIndex, e.target.value)
                          }
                          sx={{ width: '100px' }}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveKey(index, keyIndex)}
                          disabled={shortcut.keyCombination.length <= 1}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        {keyIndex < shortcut.keyCombination.length - 1 && (
                          <Typography sx={{ mx: 1 }}>+</Typography>
                        )}
                      </Box>
                    ))}
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddKey(index)}
                    >
                      Add Key
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Tips
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="Add a tip"
              value={newTip}
              onChange={(e) => setNewTip(e.target.value)}
            />
            <Button variant="outlined" onClick={handleAddTip}>
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formik.values.content.tips.map((tip, index) => (
              <Chip
                key={index}
                label={tip}
                onDelete={() => handleRemoveTip(index)}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Lesson'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default LessonForm; 