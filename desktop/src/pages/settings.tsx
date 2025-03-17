import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Slider,
  Button,
  Stack,
  Alert,
  Container,
  Divider,
  CircularProgress,
} from '@mui/material';
import { storageService, updaterService } from '../../../shared/src/utils';
import HeartsDisplay from '../components/HeartsDisplay';
import { useHearts } from '../contexts/HeartsContext';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

interface Settings {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  keyboardLayout: string;
  startWithSystem: boolean;
  minimizeToTray: boolean;
  showNotifications: boolean;
  autoSave: boolean;
  checkForUpdates: boolean;
  updateChannel: 'stable' | 'beta';
}

const defaultSettings: Settings = {
  theme: 'system',
  fontSize: 16,
  keyboardLayout: 'qwerty',
  startWithSystem: false,
  minimizeToTray: true,
  showNotifications: true,
  autoSave: true,
  checkForUpdates: true,
  updateChannel: 'stable',
};

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Hearts context
  const { currentHearts, maxHearts, refillHearts, addHearts } = useHearts();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await storageService.getItem<Settings>('app-settings', defaultSettings);
        if (savedSettings) {
          setSettings(savedSettings);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load settings:', error);
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await storageService.setItem('app-settings', settings);
      setSaveSuccess(true);
      setSaveError(null);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveError('Failed to save settings. Please try again.');
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  // General settings section
  const renderGeneralSettings = () => {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          General Settings
        </Typography>
        
        <Stack spacing={3}>
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
        </Stack>
      </Paper>
    );
  };

  // Appearance settings section
  const renderAppearanceSettings = () => {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>
        
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel id="theme-label">Theme</InputLabel>
            <Select
              labelId="theme-label"
              value={settings.theme}
              label="Theme"
              onChange={e => handleChange('theme', e.target.value)}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </Select>
          </FormControl>

          <Box>
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
        </Stack>
      </Paper>
    );
  };

  // Keyboard settings section
  const renderKeyboardSettings = () => {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Keyboard Settings
        </Typography>
        
        <Stack spacing={3}>
          <FormControl fullWidth>
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
        </Stack>
      </Paper>
    );
  };

  // Hearts management section
  const renderHeartsSection = () => {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Lives Management
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Current Lives:
          </Typography>
          <HeartsDisplay size="medium" showLabel={false} />
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Lives are used when attempting challenges. They regenerate over time, or you can refill them instantly.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => addHearts(1)}
            disabled={currentHearts >= maxHearts}
          >
            Add 1 Life
          </Button>
          
          <Button 
            variant="contained" 
            color="secondary"
            startIcon={<RefreshIcon />}
            onClick={refillHearts}
            disabled={currentHearts >= maxHearts}
          >
            Refill All Lives
          </Button>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            In the full version, you can purchase additional lives or earn them by completing daily challenges.
          </Typography>
        </Box>
      </Paper>
    );
  };

  // About section
  const renderAboutSection = () => {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          About Keyboard Dojo
        </Typography>
        
        <Typography variant="body1" paragraph>
          Version: 1.0.0
        </Typography>
        
        <Typography variant="body2" paragraph>
          Keyboard Dojo is an application designed to help you master keyboard shortcuts for your favorite IDEs and applications.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Updates
        </Typography>
        
        <Stack spacing={3}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.checkForUpdates}
                onChange={e => handleChange('checkForUpdates', e.target.checked)}
              />
            }
            label="Automatically check for updates"
          />
          
          <FormControl fullWidth>
            <InputLabel id="update-channel-label">Update Channel</InputLabel>
            <Select
              labelId="update-channel-label"
              value={settings.updateChannel}
              label="Update Channel"
              onChange={e => handleChange('updateChannel', e.target.value)}
            >
              <MenuItem value="stable">Stable</MenuItem>
              <MenuItem value="beta">Beta</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="outlined" 
            onClick={() => updaterService.checkForUpdates()}
          >
            Check for Updates
          </Button>
        </Stack>
      </Paper>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="settings tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="General" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="Appearance" id="tab-1" aria-controls="tabpanel-1" />
        <Tab label="Keyboard" id="tab-2" aria-controls="tabpanel-2" />
        <Tab label="Lives" id="tab-3" aria-controls="tabpanel-3" />
        <Tab label="About" id="tab-4" aria-controls="tabpanel-4" />
      </Tabs>
      
      <TabPanel value={tabValue} index={0}>
        {renderGeneralSettings()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        {renderAppearanceSettings()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        {renderKeyboardSettings()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        {renderHeartsSection()}
      </TabPanel>
      
      <TabPanel value={tabValue} index={4}>
        {renderAboutSection()}
      </TabPanel>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="outlined" color="error" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </Box>
      
      {saveSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Settings saved successfully!
        </Alert>
      )}
      
      {saveError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {saveError}
        </Alert>
      )}
    </Container>
  );
};

export default SettingsPage; 