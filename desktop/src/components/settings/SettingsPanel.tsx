import CloseIcon from '@mui/icons-material/Close';
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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';

import { loggerService } from '../../services';

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

const DEFAULT_SETTINGS: Settings = {
  startWithSystem: true,
  minimizeToTray: true,
  showNotifications: true,
  fontSize: 14,
  keyboardLayout: 'qwerty',
  autoSave: true,
  autoUpdate: true,
};

// Type guard to validate if the parsed object is a valid Settings object
function isValidSettings(obj: unknown): obj is Settings {
  if (!obj || typeof obj !== 'object') return false;
  
  const settings = obj as Record<string, unknown>;
  
  // Check for required properties and their types
  return (
    typeof settings.startWithSystem === 'boolean' &&
    typeof settings.minimizeToTray === 'boolean' &&
    typeof settings.showNotifications === 'boolean' &&
    typeof settings.fontSize === 'number' &&
    typeof settings.keyboardLayout === 'string' &&
    typeof settings.autoSave === 'boolean' &&
    typeof settings.autoUpdate === 'boolean'
  );
}

const SettingsPanel = ({ open, onClose }: SettingsPanelProps) => {
  const theme = useTheme();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = localStorage.getItem('app-settings');
        if (savedSettings) {
          try {
            // Safely parse JSON in a separate try-catch block
            const parsedSettings = JSON.parse(savedSettings);
            
            // Validate the structure with our type guard
            if (isValidSettings(parsedSettings)) {
              setSettings(parsedSettings);
            } else {
              // Log warning if settings are invalid and fallback to defaults
              loggerService.warn('Invalid settings structure detected, using defaults');
              setSettings(DEFAULT_SETTINGS);
            }
          } catch (parseError) {
            // Handle JSON parsing errors separately
            loggerService.error('Failed to parse settings JSON:', { error: parseError });
            setSettings(DEFAULT_SETTINGS);
          }
        }
      } catch (error) {
        loggerService.error('Failed to load settings from storage:', { error });
        // Fallback to defaults on error
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadSettings();
    }
  }, [open]);

  // Handle settings change with proper typing
  const handleChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save settings
  const handleSave = async () => {
    try {
      localStorage.setItem('app-settings', JSON.stringify(settings));
      loggerService.info('Settings saved successfully');
      onClose();
    } catch (error) {
      loggerService.error('Failed to save settings:', { error });
    }
  };

  // Reset to defaults
  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1,
      }}>
        <Typography variant="h5" component="div" fontWeight="bold">
          Settings
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography>Loading settings...</Typography>
          </Box>
        ) : (
          <Box sx={{ py: 1 }}>
            {/* Application Settings */}
            <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
              Application
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.startWithSystem}
                  onChange={(e) => handleChange('startWithSystem', e.target.checked)}
                  color="primary"
                />
              }
              label="Start with system"
              sx={{ display: 'block', mb: 1 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.minimizeToTray}
                  onChange={(e) => handleChange('minimizeToTray', e.target.checked)}
                  color="primary"
                />
              }
              label="Minimize to system tray"
              sx={{ display: 'block', mb: 1 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.showNotifications}
                  onChange={(e) => handleChange('showNotifications', e.target.checked)}
                  color="primary"
                />
              }
              label="Show desktop notifications"
              sx={{ display: 'block', mb: 1 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoUpdate}
                  onChange={(e) => handleChange('autoUpdate', e.target.checked)}
                  color="primary"
                />
              }
              label="Automatically check for updates"
              sx={{ display: 'block', mb: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            {/* Display Settings */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Display
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography id="font-size-slider" gutterBottom>
                Font Size: {settings.fontSize}px
              </Typography>
              <Slider
                value={settings.fontSize}
                onChange={(_, value) => handleChange('fontSize', value as number)}
                aria-labelledby="font-size-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={10}
                max={20}
                sx={{ maxWidth: 300 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Keyboard Settings */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Keyboard
            </Typography>

            <FormControl sx={{ minWidth: 200, mb: 2 }}>
              <InputLabel id="keyboard-layout-label">Keyboard Layout</InputLabel>
              <Select
                labelId="keyboard-layout-label"
                value={settings.keyboardLayout}
                label="Keyboard Layout"
                onChange={(e) => handleChange('keyboardLayout', e.target.value as string)}
              >
                <MenuItem value="qwerty">QWERTY</MenuItem>
                <MenuItem value="dvorak">Dvorak</MenuItem>
                <MenuItem value="colemak">Colemak</MenuItem>
                <MenuItem value="azerty">AZERTY</MenuItem>
              </Select>
            </FormControl>

            <Divider sx={{ my: 2 }} />

            {/* Editor Settings */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Editor
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoSave}
                  onChange={(e) => handleChange('autoSave', e.target.checked)}
                  color="primary"
                />
              }
              label="Auto-save progress"
              sx={{ display: 'block', mb: 1 }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleReset} color="inherit">
          Reset to Defaults
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsPanel;
