import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Speed as SpeedIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Delete as ClearIcon
} from '@mui/icons-material';

// Define performance metric types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

export interface PerformanceEntry {
  entryType: string;
  name: string;
  startTime: number;
  duration: number;
  [key: string]: unknown;
}

// Extended Performance interface to handle memory property
interface ExtendedPerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

export interface PerformanceMonitorProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  initiallyExpanded?: boolean;
  refreshInterval?: number; // in milliseconds
  maxEntries?: number;
  showOnlyInDevelopment?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  position = 'bottom-right',
  initiallyExpanded = false,
  refreshInterval = 2000,
  maxEntries = 20,
  showOnlyInDevelopment = true
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [entries, setEntries] = useState<PerformanceEntry[]>([]);
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
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // Collect performance metrics
  const collectMetrics = useCallback(() => {
    if (!window.performance) return;
    
    const now = Date.now();
    
    // Basic timing metrics
    const navigationTiming = window.performance.timing;
    const newMetrics: PerformanceMetric[] = [];
    
    if (navigationTiming) {
      // Calculate page load time
      const loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
      if (loadTime > 0) {
        newMetrics.push({
          name: 'Page Load',
          value: loadTime,
          unit: 'ms',
          timestamp: now
        });
      }
      
      // Calculate DOM content loaded time
      const domContentLoaded = navigationTiming.domContentLoadedEventEnd - navigationTiming.navigationStart;
      if (domContentLoaded > 0) {
        newMetrics.push({
          name: 'DOM Content Loaded',
          value: domContentLoaded,
          unit: 'ms',
          timestamp: now
        });
      }
    }
    
    // Memory usage if available
    const extendedPerformance = window.performance as ExtendedPerformance;
    if (extendedPerformance.memory) {
      const memory = extendedPerformance.memory;
      newMetrics.push({
        name: 'Used JS Heap',
        value: Math.round(memory.usedJSHeapSize / (1024 * 1024)),
        unit: 'MB',
        timestamp: now
      });
      
      newMetrics.push({
        name: 'Total JS Heap',
        value: Math.round(memory.totalJSHeapSize / (1024 * 1024)),
        unit: 'MB',
        timestamp: now
      });
    }
    
    // FPS calculation (simplified)
    let fps = 0;
    if (window.requestAnimationFrame) {
      let lastTime = performance.now();
      let frame = 0;
      
      const calculateFPS = () => {
        const time = performance.now();
        frame++;
        
        if (time > lastTime + 1000) {
          fps = Math.round((frame * 1000) / (time - lastTime));
          lastTime = time;
          frame = 0;
        }
        
        window.requestAnimationFrame(calculateFPS);
      };
      
      calculateFPS();
    }
    
    if (fps > 0) {
      newMetrics.push({
        name: 'FPS',
        value: fps,
        unit: 'fps',
        timestamp: now
      });
    }
    
    // Get performance entries
    const performanceEntries = window.performance.getEntriesByType('resource')
      .slice(-maxEntries)
      .map(entry => ({
        entryType: entry.entryType,
        name: entry.name,
        startTime: Math.round(entry.startTime),
        duration: Math.round(entry.duration),
        ...(entry as unknown as Record<string, unknown>)
      }));
    
    setMetrics(prevMetrics => {
      // Combine with previous metrics, keeping only the most recent for each name
      const metricMap = new Map();
      [...prevMetrics, ...newMetrics].forEach(metric => {
        if (!metricMap.has(metric.name) || metricMap.get(metric.name).timestamp < metric.timestamp) {
          metricMap.set(metric.name, metric);
        }
      });
      return Array.from(metricMap.values());
    });
    
    setEntries(performanceEntries);
  }, [maxEntries]);
  
  // Refresh metrics on interval
  useEffect(() => {
    // If showOnlyInDevelopment is true and we're not in development, don't run the effect
    if (showOnlyInDevelopment && !isDevelopment) {
      return;
    }
    
    collectMetrics();
    
    const intervalId = setInterval(collectMetrics, refreshInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [collectMetrics, refreshInterval, showOnlyInDevelopment, isDevelopment]);
  
  // Handle refresh button click
  const handleRefresh = () => {
    collectMetrics();
  };
  
  // Handle save metrics
  const handleSave = () => {
    const data = {
      metrics,
      entries,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${new Date().toISOString().replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Handle clear metrics
  const handleClear = () => {
    if (window.performance && window.performance.clearResourceTimings) {
      window.performance.clearResourceTimings();
    }
    setEntries([]);
  };
  
  // If showOnlyInDevelopment is true and we're not in development, don't render
  if (showOnlyInDevelopment && !isDevelopment) {
    return null;
  }
  
  return (
    <Box sx={{ ...getPositionStyles() }}>
      <Paper 
        elevation={3} 
        sx={{ 
          overflow: 'hidden',
          width: expanded ? 'auto' : 'auto',
          maxWidth: expanded ? '600px' : 'auto',
          transition: theme.transitions.create(['width', 'max-width']),
          opacity: 0.9,
          '&:hover': {
            opacity: 1
          }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 1, 
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            cursor: 'pointer'
          }}
          onClick={toggleExpanded}
        >
          <SpeedIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
            Performance Monitor
          </Typography>
          <IconButton 
            size="small" 
            color="inherit"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded();
            }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        
        <Collapse in={expanded}>
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Key Metrics
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell align="right">Unit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.map((metric) => (
                      <TableRow key={metric.name}>
                        <TableCell component="th" scope="row">
                          {metric.name}
                        </TableCell>
                        <TableCell align="right">{metric.value}</TableCell>
                        <TableCell align="right">{metric.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">
                  Resource Timings
                </Typography>
                <Box>
                  <Tooltip title="Refresh">
                    <IconButton size="small" onClick={handleRefresh}>
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Save Metrics">
                    <IconButton size="small" onClick={handleSave}>
                      <SaveIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear">
                    <IconButton size="small" onClick={handleClear}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Resource</TableCell>
                      <TableCell align="right">Start Time (ms)</TableCell>
                      <TableCell align="right">Duration (ms)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entries.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Tooltip title={entry.name}>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                              {entry.name.split('/').pop() || entry.name}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">{entry.startTime}</TableCell>
                        <TableCell 
                          align="right"
                          sx={{
                            color: entry.duration > 500 
                              ? theme.palette.error.main 
                              : entry.duration > 200 
                                ? theme.palette.warning.main 
                                : theme.palette.success.main
                          }}
                        >
                          {entry.duration}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default PerformanceMonitor; 