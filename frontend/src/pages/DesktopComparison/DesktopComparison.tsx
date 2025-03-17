import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Divider,
  Card,
  CardContent,
  CardActions,
  Stack,
  useTheme
} from '@mui/material';
import { 
  Check as CheckIcon, 
  Close as CloseIcon, 
  DesktopWindows as DesktopIcon,
  Language as WebIcon,
  Apple as AppleIcon,
  Window as WindowsIcon,
  Computer as LinuxIcon,
  Speed as SpeedIcon,
  WifiOff as OfflineIcon,
  Security as SecurityIcon,
  Keyboard as KeyboardIcon
} from '@mui/icons-material';

// Define gtag for analytics
declare global {
  interface Window {
    gtag: (command: string, action: string, params: Record<string, string | number>) => void;
  }
}

interface FeatureComparison {
  feature: string;
  description: string;
  web: boolean | string;
  desktop: boolean | string;
  category: 'performance' | 'functionality' | 'offline' | 'security';
}

/**
 * Desktop Comparison Page
 * 
 * This page compares the features of the web and desktop versions
 * It includes a feature comparison table and download links
 */
const DesktopComparison = () => {
  const theme = useTheme();
  const [selectedOS, setSelectedOS] = useState<'macos' | 'windows' | 'linux' | null>(null);
  
  // Handle download button click
  const handleDownload = (os: 'macos' | 'windows' | 'linux') => {
    setSelectedOS(os);
    
    // Track download event
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'download_desktop_app', {
        os,
        source: 'comparison_page'
      });
    }
    
    // Open download page
    window.open(`https://keyboarddojo.com/download/${os}`, '_blank');
  };
  
  // Feature comparison data
  const features: FeatureComparison[] = [
    {
      feature: 'Typing Practice',
      description: 'Basic typing practice with WPM and accuracy tracking',
      web: true,
      desktop: true,
      category: 'functionality'
    },
    {
      feature: 'Speed Tests',
      description: 'Timed typing tests with performance metrics',
      web: true,
      desktop: true,
      category: 'functionality'
    },
    {
      feature: 'Progress Tracking',
      description: 'Track your typing progress over time',
      web: true,
      desktop: true,
      category: 'functionality'
    },
    {
      feature: 'Achievements',
      description: 'Earn achievements for reaching typing milestones',
      web: true,
      desktop: true,
      category: 'functionality'
    },
    {
      feature: 'Keyboard Shortcuts',
      description: 'Full keyboard shortcut support',
      web: 'Limited',
      desktop: true,
      category: 'functionality'
    },
    {
      feature: 'Offline Mode',
      description: 'Use the app without an internet connection',
      web: false,
      desktop: true,
      category: 'offline'
    },
    {
      feature: 'Data Synchronization',
      description: 'Sync your data between devices',
      web: true,
      desktop: true,
      category: 'functionality'
    },
    {
      feature: 'Performance',
      description: 'Application performance and responsiveness',
      web: 'Good',
      desktop: 'Excellent',
      category: 'performance'
    },
    {
      feature: 'Native Keyboard Integration',
      description: 'Direct access to keyboard events',
      web: false,
      desktop: true,
      category: 'functionality'
    },
    {
      feature: 'System Notifications',
      description: 'Native system notifications',
      web: 'Limited',
      desktop: true,
      category: 'functionality'
    },
    {
      feature: 'Auto-Updates',
      description: 'Automatic application updates',
      web: true,
      desktop: true,
      category: 'functionality'
    },
    {
      feature: 'Local Data Storage',
      description: 'Secure local data storage',
      web: 'Browser Storage',
      desktop: 'Encrypted File System',
      category: 'security'
    }
  ];
  
  // Filter features by category
  const getFeaturesByCategory = (category: string) => {
    return features.filter(feature => feature.category === category);
  };
  
  // Render feature value
  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckIcon sx={{ color: 'success.main' }} />
      ) : (
        <CloseIcon sx={{ color: 'error.main' }} />
      );
    }
    
    return value;
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Web vs Desktop
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Compare the features of our web and desktop applications
        </Typography>
        
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
          <Grid item xs={12} md={5}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                borderRadius: 2,
                position: 'relative',
                overflow: 'visible',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -8,
                  left: -8,
                  right: -8,
                  bottom: -8,
                  background: 'transparent',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 3,
                  zIndex: -1,
                  opacity: 0.5,
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', pt: 4 }}>
                <WebIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" component="h2" gutterBottom>
                  Web App
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Access from any browser, no installation required
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ textAlign: 'left', mb: 2 }}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', mr: 1 }} />
                    No installation required
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', mr: 1 }} />
                    Access from any device
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', mr: 1 }} />
                    Always up to date
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CloseIcon sx={{ color: 'error.main', mr: 1 }} />
                    Limited keyboard support
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CloseIcon sx={{ color: 'error.main', mr: 1 }} />
                    No offline access
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="large"
                  href="/app"
                >
                  Use Web App
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Card 
              elevation={6}
              sx={{ 
                height: '100%',
                borderRadius: 2,
                border: '2px solid',
                borderColor: 'primary.main',
                position: 'relative',
                overflow: 'visible',
                '&::after': {
                  content: '"RECOMMENDED"',
                  position: 'absolute',
                  top: -12,
                  right: 24,
                  background: 'primary.main',
                  color: 'primary.contrastText',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', pt: 4 }}>
                <DesktopIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" component="h2" gutterBottom>
                  Desktop App
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Enhanced performance and features for serious typists
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ textAlign: 'left', mb: 2 }}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', mr: 1 }} />
                    Full keyboard shortcut support
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', mr: 1 }} />
                    Works offline
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', mr: 1 }} />
                    Better performance
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ color: 'success.main', mr: 1 }} />
                    Native system integration
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon sx={{ color: 'success.main', mr: 1 }} />
                    Enhanced security
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Stack direction="row" spacing={1}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    startIcon={<AppleIcon />}
                    onClick={() => handleDownload('macos')}
                  >
                    macOS
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    startIcon={<WindowsIcon />}
                    onClick={() => handleDownload('windows')}
                  >
                    Windows
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    startIcon={<LinuxIcon />}
                    onClick={() => handleDownload('linux')}
                  >
                    Linux
                  </Button>
                </Stack>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Detailed Feature Comparison
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <KeyboardIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h5" component="h3">
                Functionality
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Feature</TableCell>
                    <TableCell align="center">Web</TableCell>
                    <TableCell align="center">Desktop</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFeaturesByCategory('functionality').map((feature) => (
                    <TableRow key={feature.feature}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {feature.feature}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {renderFeatureValue(feature.web)}
                      </TableCell>
                      <TableCell align="center">
                        {renderFeatureValue(feature.desktop)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SpeedIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" component="h3">
                    Performance
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Feature</TableCell>
                        <TableCell align="center">Web</TableCell>
                        <TableCell align="center">Desktop</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getFeaturesByCategory('performance').map((feature) => (
                        <TableRow key={feature.feature}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {feature.feature}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {feature.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {renderFeatureValue(feature.web)}
                          </TableCell>
                          <TableCell align="center">
                            {renderFeatureValue(feature.desktop)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <OfflineIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" component="h3">
                    Offline Capabilities
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Feature</TableCell>
                        <TableCell align="center">Web</TableCell>
                        <TableCell align="center">Desktop</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getFeaturesByCategory('offline').map((feature) => (
                        <TableRow key={feature.feature}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {feature.feature}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {feature.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {renderFeatureValue(feature.web)}
                          </TableCell>
                          <TableCell align="center">
                            {renderFeatureValue(feature.desktop)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" component="h3">
                    Security
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Feature</TableCell>
                        <TableCell align="center">Web</TableCell>
                        <TableCell align="center">Desktop</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getFeaturesByCategory('security').map((feature) => (
                        <TableRow key={feature.feature}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {feature.feature}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {feature.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {renderFeatureValue(feature.web)}
                          </TableCell>
                          <TableCell align="center">
                            {renderFeatureValue(feature.desktop)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to try the Desktop App?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Download Keyboard Dojo Desktop for your platform and experience the difference
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<AppleIcon />}
            onClick={() => handleDownload('macos')}
            sx={{ px: 4 }}
          >
            Download for macOS
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<WindowsIcon />}
            onClick={() => handleDownload('windows')}
            sx={{ px: 4 }}
          >
            Download for Windows
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<LinuxIcon />}
            onClick={() => handleDownload('linux')}
            sx={{ px: 4 }}
          >
            Download for Linux
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default DesktopComparison; 