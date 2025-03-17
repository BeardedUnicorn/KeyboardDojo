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
  SelectChangeEvent,
} from '@mui/material';
import { storageService, updaterService } from '../../../shared/src/utils';
import { useSubscription } from '../contexts/SubscriptionContext';
import RefreshIcon from '@mui/icons-material/Refresh';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
};

const SettingsPage: React.FC = () => {
  const [value, setValue] = useState(0);
  const [theme, setTheme] = useState('system');
  const [fontSize, setFontSize] = useState(14);
  const [autoSave, setAutoSave] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateVersion, setUpdateVersion] = useState<string | null>(null);
  const [appVersion, setAppVersion] = useState('1.0.0');
  
  const { hasPremium } = useSubscription();
  const [isPremiumLoading, setIsPremiumLoading] = useState(false);
  
  // Load settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await storageService.getItem<string>('theme', 'system');
        const savedFontSize = await storageService.getItem<number>('fontSize', 14);
        const savedAutoSave = await storageService.getItem<boolean>('autoSave', true);
        const savedShowLineNumbers = await storageService.getItem<boolean>('showLineNumbers', true);
        const savedShowMinimap = await storageService.getItem<boolean>('showMinimap', true);
        
        setTheme(savedTheme || 'system');
        setFontSize(savedFontSize || 14);
        setAutoSave(savedAutoSave !== false);
        setShowLineNumbers(savedShowLineNumbers !== false);
        setShowMinimap(savedShowMinimap !== false);
        
        // Get app version
        try {
          // Fallback if getAppVersion doesn't exist
          const version = await storageService.getItem<string>('app-version', '1.0.0');
          setAppVersion(version || '1.0.0');
        } catch (error) {
          console.error('Failed to get app version:', error);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  // Handle tab change
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  
  // Handle theme change
  const handleThemeChange = (event: SelectChangeEvent) => {
    const newTheme = event.target.value;
    setTheme(newTheme);
    storageService.setItem('theme', newTheme);
  };
  
  // Handle font size change
  const handleFontSizeChange = (_event: Event, newValue: number | number[]) => {
    const newSize = newValue as number;
    setFontSize(newSize);
    storageService.setItem('fontSize', newSize);
  };
  
  // Handle auto save change
  const handleAutoSaveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setAutoSave(newValue);
    storageService.setItem('autoSave', newValue);
  };
  
  // Handle line numbers change
  const handleLineNumbersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setShowLineNumbers(newValue);
    storageService.setItem('showLineNumbers', newValue);
  };
  
  // Handle minimap change
  const handleMinimapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setShowMinimap(newValue);
    storageService.setItem('showMinimap', newValue);
  };
  
  // Check for updates
  const checkForUpdates = async () => {
    setIsCheckingForUpdates(true);
    setUpdateError(null);
    
    try {
      // Simplified update check - in a real app, this would call the actual updater service
      const updateCheckResult = await new Promise<{available: boolean, version?: string}>((resolve) => {
        setTimeout(() => {
          resolve({ available: false });
        }, 1000);
      });
      
      if (updateCheckResult.available) {
        setUpdateAvailable(true);
        setUpdateVersion(updateCheckResult.version || null);
      } else {
        setUpdateAvailable(false);
      }
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Failed to check for updates');
    } finally {
      setIsCheckingForUpdates(false);
    }
  };
  
  // Install update
  const installUpdate = async () => {
    try {
      // Simplified update installation - in a real app, this would call the actual updater service
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Failed to install update');
    }
  };
  
  // Appearance settings section
  const renderAppearanceSection = () => {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="theme-select-label">Theme</InputLabel>
          <Select
            labelId="theme-select-label"
            id="theme-select"
            value={theme}
            label="Theme"
            onChange={handleThemeChange}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="system">System</MenuItem>
          </Select>
        </FormControl>
        
        <Typography id="font-size-slider" gutterBottom>
          Font Size: {fontSize}px
        </Typography>
        <Slider
          value={fontSize}
          onChange={handleFontSizeChange}
          aria-labelledby="font-size-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={10}
          max={24}
          sx={{ mb: 3 }}
        />
      </Paper>
    );
  };
  
  // Editor settings section
  const renderEditorSection = () => {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Editor
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={autoSave}
              onChange={handleAutoSaveChange}
              name="autoSave"
              color="primary"
            />
          }
          label="Auto Save"
          sx={{ display: 'block', mb: 2 }}
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={showLineNumbers}
              onChange={handleLineNumbersChange}
              name="showLineNumbers"
              color="primary"
            />
          }
          label="Show Line Numbers"
          sx={{ display: 'block', mb: 2 }}
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={showMinimap}
              onChange={handleMinimapChange}
              name="showMinimap"
              color="primary"
            />
          }
          label="Show Minimap"
          sx={{ display: 'block', mb: 2 }}
        />
      </Paper>
    );
  };
  
  // Subscription section
  const renderSubscriptionSection = () => {
    if (isPremiumLoading) {
      return (
        <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <CircularProgress size={24} sx={{ mb: 2 }} />
          <Typography>Loading subscription status...</Typography>
        </Paper>
      );
    }
    
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Subscription
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            Current Plan:
          </Typography>
          <Typography variant="body1">
            {hasPremium ? 'Premium' : 'Free'}
          </Typography>
        </Box>
        
        {!hasPremium && (
          <Button 
            variant="contained" 
            color="primary"
            fullWidth
            sx={{ mb: 2 }}
          >
            Upgrade to Premium
          </Button>
        )}
        
        <Typography variant="body2" color="text.secondary">
          Premium features include unlimited practice sessions, advanced analytics, and more.
        </Typography>
      </Paper>
    );
  };
  
  // Updates section
  const renderUpdatesSection = () => {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Updates
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            Current Version:
          </Typography>
          <Typography variant="body1">
            {appVersion}
          </Typography>
        </Box>
        
        {updateError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {updateError}
          </Alert>
        )}
        
        {updateAvailable ? (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Update available: v{updateVersion}
            </Alert>
            
            <Button 
              variant="contained" 
              color="primary"
              onClick={installUpdate}
              sx={{ mb: 2 }}
            >
              Install Update
            </Button>
          </Box>
        ) : (
          <Button 
            variant="outlined" 
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={checkForUpdates}
            disabled={isCheckingForUpdates}
            sx={{ mb: 2 }}
          >
            {isCheckingForUpdates ? 'Checking...' : 'Check for Updates'}
          </Button>
        )}
      </Paper>
    );
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={value} onChange={handleChange} aria-label="settings tabs">
          <Tab label="General" {...a11yProps(0)} />
          <Tab label="Account" {...a11yProps(1)} />
          <Tab label="Advanced" {...a11yProps(2)} />
        </Tabs>
      </Box>
      
      <TabPanel value={value} index={0}>
        {renderAppearanceSection()}
        {renderEditorSection()}
      </TabPanel>
      
      <TabPanel value={value} index={1}>
        {renderSubscriptionSection()}
      </TabPanel>
      
      <TabPanel value={value} index={2}>
        {renderUpdatesSection()}
      </TabPanel>
    </Container>
  );
};

export default SettingsPage; 