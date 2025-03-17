import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Slider,
  Switch,
  FormControlLabel,
  Paper,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  BugReport as BugIcon,
  Compare as CompareIcon,
  Camera as ScreenshotIcon,
  Save as SaveIcon,
  Refresh as ResetIcon,
  Close as CloseIcon,
  Visibility as ShowIcon
} from '@mui/icons-material';

// Define types
export interface ScreenshotData {
  id: string;
  name: string;
  dataUrl: string;
  timestamp: number;
  viewport: {
    width: number;
    height: number;
  };
  path: string;
}

export interface VisualRegressionTesterProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showOnlyInDevelopment?: boolean;
}

const VisualRegressionTester: React.FC<VisualRegressionTesterProps> = ({
  position = 'top-right',
  showOnlyInDevelopment = true
}) => {
  const [open, setOpen] = useState(false);
  const [screenshots, setScreenshots] = useState<ScreenshotData[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareOpacity, setCompareOpacity] = useState(0.5);
  const [screenshotName, setScreenshotName] = useState('');
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [showOverlay, setShowOverlay] = useState(true);
  const [gridSize, setGridSize] = useState(16);
  const theme = useTheme();
  
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Get position styles
  const getPositionStyles = () => {
    const styles = {
      position: 'fixed',
      zIndex: 9999,
    } as const;
    
    switch (position) {
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
  
  // Handle dialog open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  // Take a screenshot
  const takeScreenshot = useCallback(() => {
    if (!screenshotName.trim()) {
      alert('Please enter a name for the screenshot');
      return;
    }
    
    // Create a unique ID
    const id = `screenshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();
    const path = window.location.pathname;
    
    // Use html2canvas to capture the page
    // @ts-ignore - Ignore html2canvas import error
    import('html2canvas').then((module: { default: any }) => {
      const html2canvas = module.default;
      html2canvas(document.body, {
        width: viewportWidth,
        height: viewportHeight,
        scale: window.devicePixelRatio,
        logging: false,
        allowTaint: true,
        useCORS: true
      }).then((canvas: HTMLCanvasElement) => {
        const dataUrl = canvas.toDataURL('image/png');
        
        // Add to screenshots
        const newScreenshot: ScreenshotData = {
          id,
          name: screenshotName,
          dataUrl,
          timestamp,
          viewport: {
            width: viewportWidth,
            height: viewportHeight
          },
          path
        };
        
        setScreenshots(prev => [...prev, newScreenshot]);
        setSelectedScreenshot(id);
        setScreenshotName('');
        
        // Save to localStorage
        saveScreenshotsToStorage([...screenshots, newScreenshot]);
      });
    });
  }, [screenshotName, viewportWidth, viewportHeight, screenshots]);
  
  // Save screenshots to localStorage
  const saveScreenshotsToStorage = (shots: ScreenshotData[]) => {
    try {
      localStorage.setItem('visual-regression-screenshots', JSON.stringify(shots));
    } catch (error) {
      console.error('Failed to save screenshots to localStorage:', error);
    }
  };
  
  // Load screenshots from localStorage
  const loadScreenshotsFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem('visual-regression-screenshots');
      if (saved) {
        const parsed = JSON.parse(saved) as ScreenshotData[];
        setScreenshots(parsed);
      }
    } catch (error) {
      console.error('Failed to load screenshots from localStorage:', error);
    }
  }, []);
  
  // Initialize by loading saved screenshots
  useEffect(() => {
    loadScreenshotsFromStorage();
  }, [loadScreenshotsFromStorage]);
  
  // Handle screenshot selection
  const handleSelectScreenshot = (id: string) => {
    setSelectedScreenshot(id);
    setCompareMode(false);
  };
  
  // Handle screenshot deletion
  const handleDeleteScreenshot = (id: string) => {
    const updatedScreenshots = screenshots.filter(s => s.id !== id);
    setScreenshots(updatedScreenshots);
    saveScreenshotsToStorage(updatedScreenshots);
    
    if (selectedScreenshot === id) {
      setSelectedScreenshot(updatedScreenshots.length > 0 ? updatedScreenshots[0].id : null);
    }
  };
  
  // Toggle compare mode
  const handleToggleCompareMode = () => {
    setCompareMode(!compareMode);
  };
  
  // Handle opacity change
  const handleOpacityChange = (_event: Event, newValue: number | number[]) => {
    setCompareOpacity(newValue as number);
  };
  
  // Handle grid size change
  const handleGridSizeChange = (_event: Event, newValue: number | number[]) => {
    setGridSize(newValue as number);
  };
  
  // Toggle overlay
  const handleToggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };
  
  // Export all screenshots
  const handleExportAll = () => {
    const exportData = {
      screenshots,
      exportDate: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `visual-regression-screenshots-${new Date().toISOString().replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Clear all screenshots
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all screenshots?')) {
      setScreenshots([]);
      setSelectedScreenshot(null);
      localStorage.removeItem('visual-regression-screenshots');
    }
  };
  
  // Render screenshot comparison
  const renderComparison = () => {
    if (!selectedScreenshot || !compareMode) return null;
    
    const selected = screenshots.find(s => s.id === selectedScreenshot);
    if (!selected) return null;
    
    // Find other screenshots from the same path
    const samePathScreenshots = screenshots.filter(
      s => s.path === selected.path && s.id !== selected.id
    );
    
    if (samePathScreenshots.length === 0) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No other screenshots found for this path to compare with.
          </Typography>
        </Box>
      );
    }
    
    // Sort by timestamp (newest first)
    samePathScreenshots.sort((a, b) => b.timestamp - a.timestamp);
    
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Compare with:
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {samePathScreenshots.slice(0, 3).map(screenshot => (
            <Paper key={screenshot.id} variant="outlined" sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {screenshot.name} ({new Date(screenshot.timestamp).toLocaleString()})
                </Typography>
              </Box>
              
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={selected.dataUrl}
                  alt={selected.name}
                  sx={{ 
                    width: '100%', 
                    height: 'auto',
                    display: 'block'
                  }}
                />
                <Box
                  component="img"
                  src={screenshot.dataUrl}
                  alt={screenshot.name}
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: compareOpacity,
                    mixBlendMode: 'difference'
                  }}
                />
              </Box>
              
              <Box sx={{ mt: 1 }}>
                <Typography id="opacity-slider" gutterBottom>
                  Overlay Opacity
                </Typography>
                <Slider
                  value={compareOpacity}
                  onChange={handleOpacityChange}
                  aria-labelledby="opacity-slider"
                  step={0.05}
                  marks
                  min={0}
                  max={1}
                />
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    );
  };
  
  // Render grid overlay
  const renderGridOverlay = () => {
    if (!showOverlay) return null;
    
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(to right, rgba(255,0,0,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          zIndex: 1
        }}
      />
    );
  };
  
  // If showOnlyInDevelopment is true and we're not in development, don't render
  if (showOnlyInDevelopment && !isDevelopment) {
    return null;
  }
  
  return (
    <>
      <Tooltip title="Visual Regression Tester">
        <IconButton
          color="primary"
          onClick={handleOpen}
          sx={getPositionStyles()}
          aria-label="Open visual regression tester"
        >
          <BugIcon />
        </IconButton>
      </Tooltip>
      
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <BugIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Visual Regression Tester</Typography>
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
              Take screenshots and compare them to detect visual regressions
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
              <TextField
                label="Screenshot Name"
                value={screenshotName}
                onChange={(e) => setScreenshotName(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
              />
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<ScreenshotIcon />}
                onClick={takeScreenshot}
                disabled={!screenshotName.trim()}
              >
                Take Screenshot
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                label="Viewport Width"
                type="number"
                value={viewportWidth}
                onChange={(e) => setViewportWidth(Number(e.target.value))}
                variant="outlined"
                size="small"
                InputProps={{ inputProps: { min: 320, max: 3840 } }}
              />
              
              <TextField
                label="Viewport Height"
                type="number"
                value={viewportHeight}
                onChange={(e) => setViewportHeight(Number(e.target.value))}
                variant="outlined"
                size="small"
                InputProps={{ inputProps: { min: 240, max: 2160 } }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={showOverlay}
                    onChange={handleToggleOverlay}
                    color="primary"
                  />
                }
                label="Show Grid"
              />
            </Box>
            
            {showOverlay && (
              <Box sx={{ mt: 2 }}>
                <Typography id="grid-size-slider" gutterBottom>
                  Grid Size: {gridSize}px
                </Typography>
                <Slider
                  value={gridSize}
                  onChange={handleGridSizeChange}
                  aria-labelledby="grid-size-slider"
                  step={4}
                  marks
                  min={4}
                  max={64}
                />
              </Box>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleExportAll}
              disabled={screenshots.length === 0}
            >
              Export All
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<ResetIcon />}
              onClick={handleClearAll}
              disabled={screenshots.length === 0}
            >
              Clear All
            </Button>
            
            {selectedScreenshot && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={compareMode ? <ShowIcon /> : <CompareIcon />}
                onClick={handleToggleCompareMode}
              >
                {compareMode ? 'View Single' : 'Compare'}
              </Button>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: '30%', borderRight: `1px solid ${theme.palette.divider}`, pr: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Screenshots ({screenshots.length})
              </Typography>
              
              {screenshots.length === 0 ? (
                <Typography color="text.secondary">
                  No screenshots taken yet.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 400, overflow: 'auto' }}>
                  {screenshots.map(screenshot => (
                    <Paper
                      key={screenshot.id}
                      variant="outlined"
                      sx={{
                        p: 1,
                        cursor: 'pointer',
                        bgcolor: selectedScreenshot === screenshot.id ? 'action.selected' : 'background.paper'
                      }}
                      onClick={() => handleSelectScreenshot(screenshot.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" noWrap>
                            {screenshot.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {new Date(screenshot.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteScreenshot(screenshot.id);
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
            
            <Box sx={{ width: '70%' }}>
              {selectedScreenshot && !compareMode ? (
                <Box sx={{ position: 'relative' }}>
                  <Box
                    component="img"
                    src={screenshots.find(s => s.id === selectedScreenshot)?.dataUrl}
                    alt="Selected screenshot"
                    sx={{ 
                      width: '100%', 
                      height: 'auto',
                      display: 'block'
                    }}
                  />
                  {renderGridOverlay()}
                </Box>
              ) : compareMode ? (
                renderComparison()
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <Typography color="text.secondary">
                    Select a screenshot to view or compare
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
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

export default VisualRegressionTester; 