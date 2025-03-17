import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Stack,
  Paper,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { storageService } from '../../../shared/src/utils';
import { useThemeContext } from '../contexts/ThemeContext';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

interface Settings {
  startWithSystem: boolean;
  minimizeToTray: boolean;
  showNotifications: boolean;
  fontSize: number;
  keyboardLayout: string;
  autoSave: boolean;
  autoUpdate: boolean;
}

const defaultSettings: Settings = {
  startWithSystem: false,
  minimizeToTray: true,
  showNotifications: true,
  fontSize: 16,
  keyboardLayout: 'qwerty',
  autoSave: true,
  autoUpdate: true,
};

const SettingsPanel = ({ open, onClose }: SettingsPanelProps) => {
  const { theme, mode, toggleTheme } = useThemeContext();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const savedSettings = await storageService.getItem<Settings>('settings');
        if (savedSettings) {
          setSettings(savedSettings);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      loadSettings();
    }
  }, [open]);

  const handleChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await storageService.setItem('settings', settings);
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[4],
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6">Settings</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {isLoading ? (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography>Loading settings...</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
            <Stack spacing={3}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Appearance
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {mode === 'dark' ? <DarkModeIcon sx={{ mr: 1 }} /> : <LightModeIcon sx={{ mr: 1 }} />}
                    <Typography>
                      {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </Typography>
                  </Box>
                  <Switch
                    checked={mode === 'dark'}
                    onChange={toggleTheme}
                    color="primary"
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography gutterBottom>Font Size: {settings.fontSize}px</Typography>
                  <Slider
                    value={settings.fontSize}
                    min={12}
                    max={24}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                    onChange={(_, value) => handleChange('fontSize', value)}
                  />
                </Box>
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Keyboard
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="keyboard-layout-label">Keyboard Layout</InputLabel>
                  <Select
                    labelId="keyboard-layout-label"
                    value={settings.keyboardLayout}
                    label="Keyboard Layout"
                    onChange={e => handleChange('keyboardLayout', e.target.value)}
                  >
                    <MenuItem value="qwerty">QWERTY</MenuItem>
                    <MenuItem value="dvorak">Dvorak</MenuItem>
                    <MenuItem value="colemak">Colemak</MenuItem>
                    <MenuItem value="workman">Workman</MenuItem>
                  </Select>
                </FormControl>
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Application
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.startWithSystem}
                      onChange={e => handleChange('startWithSystem', e.target.checked)}
                    />
                  }
                  label="Start with system"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.minimizeToTray}
                      onChange={e => handleChange('minimizeToTray', e.target.checked)}
                    />
                  }
                  label="Minimize to tray"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.showNotifications}
                      onChange={e => handleChange('showNotifications', e.target.checked)}
                    />
                  }
                  label="Show notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoSave}
                      onChange={e => handleChange('autoSave', e.target.checked)}
                    />
                  }
                  label="Auto-save progress"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoUpdate}
                      onChange={e => handleChange('autoUpdate', e.target.checked)}
                    />
                  }
                  label="Auto-update application"
                />
              </Paper>
            </Stack>
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <Button variant="outlined" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default SettingsPanel; 