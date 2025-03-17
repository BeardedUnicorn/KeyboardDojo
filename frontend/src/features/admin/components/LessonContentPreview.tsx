import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Divider, Alert } from '@mui/material';
import KeyboardIcon from '@mui/icons-material/Keyboard';

interface LessonContentPreviewProps {
  content: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface KeyboardShortcut {
  key: string;
  description: string;
  modifiers?: string[];
}

interface LessonContent {
  title?: string;
  description?: string;
  shortcuts?: KeyboardShortcut[];
  sections?: {
    title: string;
    shortcuts: KeyboardShortcut[];
  }[];
  notes?: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lesson-preview-tabpanel-${index}`}
      aria-labelledby={`lesson-preview-tab-${index}`}
      {...other}
      style={{ height: '100%' }}
    >
      {value === index && <Box sx={{ p: 2, height: '100%' }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `lesson-preview-tab-${index}`,
    'aria-controls': `lesson-preview-tabpanel-${index}`,
  };
}

const LessonContentPreview: React.FC<LessonContentPreviewProps> = ({ content }) => {
  const [tabValue, setTabValue] = useState(0);
  const [parsedContent, setParsedContent] = useState<LessonContent | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(content) as LessonContent;
      setParsedContent(parsed);
      setParseError(null);
    } catch (error) {
      if (error instanceof Error) {
        setParseError(error.message);
      } else {
        setParseError('Invalid JSON format');
      }
      setParsedContent(null);
    }
  }, [content]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderShortcut = (shortcut: KeyboardShortcut, index: number) => {
    return (
      <Box 
        key={index} 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1, 
          p: 1, 
          borderRadius: 1,
          bgcolor: 'background.paper',
          boxShadow: 1
        }}
      >
        <KeyboardIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            {shortcut.modifiers?.map((modifier, i) => (
              <React.Fragment key={i}>
                <Typography 
                  component="span" 
                  sx={{ 
                    px: 1, 
                    py: 0.5, 
                    bgcolor: 'grey.200', 
                    borderRadius: 1, 
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    mr: 0.5
                  }}
                >
                  {modifier}
                </Typography>
                <Typography component="span" sx={{ mx: 0.5 }}>+</Typography>
              </React.Fragment>
            ))}
            <Typography 
              component="span" 
              sx={{ 
                px: 1, 
                py: 0.5, 
                bgcolor: 'primary.light', 
                color: 'primary.contrastText',
                borderRadius: 1, 
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}
            >
              {shortcut.key}
            </Typography>
          </Box>
          <Typography variant="body2">{shortcut.description}</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Paper sx={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="lesson preview tabs">
          <Tab label="Preview" {...a11yProps(0)} />
          <Tab label="Raw JSON" {...a11yProps(1)} />
        </Tabs>
      </Box>

      {parseError && (
        <Alert severity="error" sx={{ m: 1 }}>
          {parseError}
        </Alert>
      )}

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <TabPanel value={tabValue} index={0}>
          {parsedContent ? (
            <Box>
              {parsedContent.title && (
                <Typography variant="h5" gutterBottom>
                  {parsedContent.title}
                </Typography>
              )}
              
              {parsedContent.description && (
                <Typography variant="body1" paragraph>
                  {parsedContent.description}
                </Typography>
              )}
              
              {parsedContent.shortcuts && parsedContent.shortcuts.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Shortcuts
                  </Typography>
                  {parsedContent.shortcuts.map((shortcut, index) => renderShortcut(shortcut, index))}
                </Box>
              )}
              
              {parsedContent.sections && parsedContent.sections.map((section, sectionIndex) => (
                <Box key={sectionIndex} sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {section.title}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {section.shortcuts.map((shortcut, shortcutIndex) => 
                    renderShortcut(shortcut, `${sectionIndex}-${shortcutIndex}` as unknown as number)
                  )}
                </Box>
              ))}
              
              {parsedContent.notes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Notes:
                  </Typography>
                  <Typography variant="body2">
                    {parsedContent.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ p: 2 }}>
              {parseError ? 'Please fix the JSON errors to see the preview' : 'No content to preview'}
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box 
            component="pre" 
            sx={{ 
              p: 2, 
              bgcolor: 'grey.100', 
              borderRadius: 1, 
              overflow: 'auto',
              fontSize: '0.875rem',
              height: '100%'
            }}
          >
            {content}
          </Box>
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default LessonContentPreview; 