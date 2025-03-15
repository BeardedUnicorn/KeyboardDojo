import { Box, Typography, Paper, Switch, FormControlLabel, FormGroup, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleDarkMode, toggleSound, setKeyboardLayout, resetSettings } from './settingsSlice';

const Settings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  
  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };
  
  const handleSoundToggle = () => {
    dispatch(toggleSound());
  };
  
  const handleKeyboardLayoutChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(setKeyboardLayout(event.target.value as 'qwerty' | 'dvorak' | 'colemak'));
  };
  
  const handleResetSettings = () => {
    dispatch(resetSettings());
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" paragraph>
        Customize your Keyboard Dojo experience.
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3, maxWidth: 600, mx: 'auto' }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch 
                checked={settings.darkMode} 
                onChange={handleDarkModeToggle} 
              />
            }
            label="Dark Mode"
          />
          
          <FormControlLabel
            control={
              <Switch 
                checked={settings.soundEnabled} 
                onChange={handleSoundToggle} 
              />
            }
            label="Sound Effects"
          />
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="keyboard-layout-label">Keyboard Layout</InputLabel>
            <Select
              labelId="keyboard-layout-label"
              value={settings.keyboardLayout}
              label="Keyboard Layout"
              onChange={handleKeyboardLayoutChange}
            >
              <MenuItem value="qwerty">QWERTY</MenuItem>
              <MenuItem value="dvorak">Dvorak</MenuItem>
              <MenuItem value="colemak">Colemak</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleResetSettings}
            >
              Reset to Defaults
            </Button>
          </Box>
        </FormGroup>
      </Paper>
    </Box>
  );
};

export default Settings; 