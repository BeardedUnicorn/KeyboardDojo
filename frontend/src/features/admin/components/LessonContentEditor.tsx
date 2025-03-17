import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Button, Alert } from '@mui/material';
import Editor from '@monaco-editor/react';
import ReactJson from 'react-json-view';

interface LessonContentEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`lesson-content-tabpanel-${index}`}
      aria-labelledby={`lesson-content-tab-${index}`}
      {...other}
      style={{ height: '100%' }}
    >
      {value === index && <Box sx={{ p: 2, height: '100%' }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `lesson-content-tab-${index}`,
    'aria-controls': `lesson-content-tabpanel-${index}`,
  };
}

const LessonContentEditor: React.FC<LessonContentEditorProps> = ({ initialContent, onChange }) => {
  const [tabValue, setTabValue] = useState(0);
  const [editorContent, setEditorContent] = useState(initialContent || '{}');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonView, setJsonView] = useState<Record<string, unknown> | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 1) {
      // When switching to JSON view tab, validate the JSON
      try {
        const parsedJson = JSON.parse(editorContent);
        setJsonView(parsedJson);
        setJsonError(null);
      } catch (error) {
        if (error instanceof Error) {
          setJsonError(error.message);
        } else {
          setJsonError('Invalid JSON format');
        }
        setJsonView(null);
      }
    }
    setTabValue(newValue);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorContent(value);
      onChange(value);
    }
  };

  // Using any for the ReactJson callbacks since the library doesn't provide proper TypeScript definitions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleJsonViewChange = (updated: any) => {
    try {
      const updatedJson = JSON.stringify(updated.updated_src, null, 2);
      setEditorContent(updatedJson);
      onChange(updatedJson);
      setJsonError(null);
    } catch (error) {
      if (error instanceof Error) {
        setJsonError(error.message);
      } else {
        setJsonError('Error updating JSON');
      }
    }
  };

  const handleFormatJson = () => {
    try {
      const parsedJson = JSON.parse(editorContent);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setEditorContent(formattedJson);
      onChange(formattedJson);
      setJsonError(null);
    } catch (error) {
      if (error instanceof Error) {
        setJsonError(error.message);
      } else {
        setJsonError('Invalid JSON format');
      }
    }
  };

  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    automaticLayout: true,
  };

  return (
    <Paper sx={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="lesson content editor tabs">
          <Tab label="JSON Editor" {...a11yProps(0)} />
          <Tab label="Visual Editor" {...a11yProps(1)} />
        </Tabs>
      </Box>

      {jsonError && (
        <Alert severity="error" sx={{ m: 1 }}>
          {jsonError}
        </Alert>
      )}

      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ height: '300px', mb: 2 }}>
            <Editor
              height="100%"
              defaultLanguage="json"
              value={editorContent}
              onChange={handleEditorChange}
              options={editorOptions}
            />
          </Box>
          <Button variant="outlined" onClick={handleFormatJson}>
            Format JSON
          </Button>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {jsonView ? (
            <ReactJson
              src={jsonView}
              onEdit={handleJsonViewChange}
              onAdd={handleJsonViewChange}
              onDelete={handleJsonViewChange}
              displayDataTypes={false}
              enableClipboard={false}
              style={{ maxHeight: '300px', overflow: 'auto' }}
            />
          ) : (
            <Typography color="error">
              Please fix the JSON errors in the editor tab before using the visual editor.
            </Typography>
          )}
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default LessonContentEditor; 