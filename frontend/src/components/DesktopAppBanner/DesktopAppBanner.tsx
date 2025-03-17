import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  IconButton, 
  Stack,
  Collapse,
  useTheme
} from '@mui/material';
import { 
  Close as CloseIcon,
  DesktopWindows as DesktopIcon,
  Apple as AppleIcon,
  Window as WindowsIcon,
  Computer as LinuxIcon
} from '@mui/icons-material';

/**
 * Desktop App Banner Component
 * 
 * Displays a banner promoting the desktop app with download buttons
 * based on the user's operating system. The banner can be dismissed
 * and the dismissal is remembered in localStorage.
 */
const DesktopAppBanner = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [os, setOs] = useState<'macos' | 'windows' | 'linux' | null>(null);
  
  useEffect(() => {
    // Check if banner has been dismissed
    const dismissed = localStorage.getItem('desktopBannerDismissed');
    if (dismissed) {
      setOpen(false);
    }
    
    // Detect OS
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('mac') !== -1) {
      setOs('macos');
    } else if (userAgent.indexOf('win') !== -1) {
      setOs('windows');
    } else if (userAgent.indexOf('linux') !== -1) {
      setOs('linux');
    }
  }, []);
  
  const handleDismiss = () => {
    setOpen(false);
    localStorage.setItem('desktopBannerDismissed', 'true');
  };
  
  const handleDownload = (downloadOs: 'macos' | 'windows' | 'linux') => {
    // Track download event
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'download_desktop_app', {
        os: downloadOs,
        source: 'banner'
      });
    }
    
    // Open download page
    window.open(`https://keyboarddojo.com/download/${downloadOs}`, '_blank');
  };
  
  // Don't render if banner is closed
  if (!open) return null;
  
  return (
    <Collapse in={open}>
      <Paper 
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}22 0%, ${theme.palette.primary.main}44 100%)`,
          border: '1px solid',
          borderColor: 'primary.main',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <IconButton 
          size="small" 
          onClick={handleDismiss}
          sx={{ position: 'absolute', top: 8, right: 8 }}
          aria-label="Close banner"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DesktopIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant="h6" component="h2" fontWeight="bold">
                Try our Desktop App
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enhanced performance, offline mode, and native keyboard support
              </Typography>
            </Box>
          </Box>
          
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ 
              ml: { xs: 0, md: 'auto' },
              mt: { xs: 2, md: 0 },
              width: { xs: '100%', md: 'auto' },
              justifyContent: { xs: 'center', md: 'flex-end' }
            }}
          >
            {os === 'macos' ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AppleIcon />}
                onClick={() => handleDownload('macos')}
              >
                Download for macOS
              </Button>
            ) : os === 'windows' ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<WindowsIcon />}
                onClick={() => handleDownload('windows')}
              >
                Download for Windows
              </Button>
            ) : os === 'linux' ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<LinuxIcon />}
                onClick={() => handleDownload('linux')}
              >
                Download for Linux
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AppleIcon />}
                  onClick={() => handleDownload('macos')}
                  size="small"
                >
                  macOS
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<WindowsIcon />}
                  onClick={() => handleDownload('windows')}
                  size="small"
                >
                  Windows
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<LinuxIcon />}
                  onClick={() => handleDownload('linux')}
                  size="small"
                >
                  Linux
                </Button>
              </>
            )}
            <Button
              variant="text"
              color="primary"
              onClick={() => window.location.href = '/desktop-comparison'}
            >
              Learn More
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Collapse>
  );
};

// Define gtag for analytics
declare global {
  interface Window {
    gtag: (command: string, action: string, params: Record<string, string | number>) => void;
  }
}

export default DesktopAppBanner; 