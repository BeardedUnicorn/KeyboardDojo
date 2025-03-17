import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
  FormControl,
  RadioGroup,
  Radio,
  Divider,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Accessibility as AccessibilityIcon,
  Contrast as ContrastIcon,
  Animation as AnimationIcon,
  Keyboard as KeyboardIcon,
  ColorLens as ColorLensIcon,
  Refresh as ResetIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAccessibility, AccessibilityOptions } from './AccessibilityProvider';

// Define props interface
interface AccessibilityMenuProps {
  buttonVariant?: 'icon' | 'text' | 'fab';
  buttonPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
  buttonLabel?: string;
  className?: string;
}

// AccessibilityMenu component
const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({
  buttonVariant = 'icon',
  buttonPosition = 'bottom-right',
  buttonLabel = 'Accessibility',
  className,
}) => {
  const [open, setOpen] = useState(false);
  const { options, setOption, resetOptions } = useAccessibility();
  const theme = useTheme();
  
  // Handle dialog open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  // Handle option change
  const handleOptionChange = <K extends keyof AccessibilityOptions>(
    option: K,
    value: AccessibilityOptions[K]
  ) => {
    setOption(option, value);
  };
  
  // Handle reset
  const handleReset = () => {
    resetOptions();
  };
  
  // Get button position styles
  const getButtonPositionStyles = () => {
    if (buttonPosition === 'inline') {
      return {};
    }
    
    const styles = {
      position: 'fixed',
      zIndex: 1000,
    };
    
    switch (buttonPosition) {
      case 'top-right':
        return {
          ...styles,
          top: theme.spacing(2),
          right: theme.spacing(2),
        };
      case 'top-left':
        return {
          ...styles,
          top: theme.spacing(2),
          left: theme.spacing(2),
        };
      case 'bottom-right':
        return {
          ...styles,
          bottom: theme.spacing(2),
          right: theme.spacing(2),
        };
      case 'bottom-left':
        return {
          ...styles,
          bottom: theme.spacing(2),
          left: theme.spacing(2),
        };
      default:
        return styles;
    }
  };
  
  // Render button based on variant
  const renderButton = () => {
    switch (buttonVariant) {
      case 'text':
        return (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AccessibilityIcon />}
            onClick={handleOpen}
            sx={getButtonPositionStyles()}
            className={className}
          >
            {buttonLabel}
          </Button>
        );
      case 'fab':
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            sx={{
              ...getButtonPositionStyles(),
              minWidth: 'auto',
              width: 56,
              height: 56,
              borderRadius: '50%',
            }}
            className={className}
          >
            <AccessibilityIcon />
          </Button>
        );
      case 'icon':
      default:
        return (
          <Tooltip title={buttonLabel}>
            <IconButton
              color="primary"
              onClick={handleOpen}
              sx={getButtonPositionStyles()}
              className={className}
              aria-label="Open accessibility menu"
            >
              <AccessibilityIcon />
            </IconButton>
          </Tooltip>
        );
    }
  };
  
  return (
    <>
      {renderButton()}
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="accessibility-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="accessibility-dialog-title">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <AccessibilityIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Accessibility Settings</Typography>
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Adjust these settings to make the application more accessible for your needs.
            </Typography>
          </Box>
          
          <FormGroup>
            {/* High Contrast */}
            <Box sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <ContrastIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="subtitle1">Display</Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.highContrast}
                    onChange={(e) => handleOptionChange('highContrast', e.target.checked)}
                    color="primary"
                  />
                }
                label="High contrast mode"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                Increases contrast for better readability
              </Typography>
            </Box>
            
            {/* Large Text */}
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.largeText}
                    onChange={(e) => handleOptionChange('largeText', e.target.checked)}
                    color="primary"
                  />
                }
                label="Large text"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                Increases text size throughout the application
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Reduced Motion */}
            <Box sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <AnimationIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="subtitle1">Motion</Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.reducedMotion}
                    onChange={(e) => handleOptionChange('reducedMotion', e.target.checked)}
                    color="primary"
                  />
                }
                label="Reduced motion"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                Reduces or eliminates animations and transitions
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Keyboard Mode */}
            <Box sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <KeyboardIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="subtitle1">Navigation</Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.keyboardMode}
                    onChange={(e) => handleOptionChange('keyboardMode', e.target.checked)}
                    color="primary"
                  />
                }
                label="Keyboard navigation mode"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                Enhances focus indicators for keyboard navigation
              </Typography>
            </Box>
            
            {/* Screen Reader Mode */}
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.screenReaderMode}
                    onChange={(e) => handleOptionChange('screenReaderMode', e.target.checked)}
                    color="primary"
                  />
                }
                label="Screen reader optimized"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: 0.5 }}>
                Provides additional context for screen readers
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Color Blind Mode */}
            <Box sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <ColorLensIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="subtitle1">Color Vision</Typography>
              </Box>
              <FormControl component="fieldset">
                <RadioGroup
                  value={options.colorBlindMode}
                  onChange={(e) => handleOptionChange('colorBlindMode', e.target.value as AccessibilityOptions['colorBlindMode'])}
                >
                  <FormControlLabel value="none" control={<Radio color="primary" />} label="Normal color vision" />
                  <FormControlLabel value="protanopia" control={<Radio color="primary" />} label="Protanopia (red-blind)" />
                  <FormControlLabel value="deuteranopia" control={<Radio color="primary" />} label="Deuteranopia (green-blind)" />
                  <FormControlLabel value="tritanopia" control={<Radio color="primary" />} label="Tritanopia (blue-blind)" />
                  <FormControlLabel value="achromatopsia" control={<Radio color="primary" />} label="Achromatopsia (monochromacy)" />
                </RadioGroup>
              </FormControl>
            </Box>
          </FormGroup>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          <Button
            startIcon={<ResetIcon />}
            onClick={handleReset}
            color="inherit"
            variant="outlined"
          >
            Reset to Defaults
          </Button>
          <Button
            onClick={handleClose}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AccessibilityMenu; 