import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';

import type { ChangeEvent, FC } from 'react';

interface CodeExerciseProps {
  instructions: string;
  initialCode: string;
  expectedOutput: string;
  onSuccess: () => void;
  onFailure: () => void;
}

const CodeExercise: FC<CodeExerciseProps> = ({
  instructions,
  initialCode,
  expectedOutput,
  onSuccess,
  onFailure,
}) => {
  const theme = useTheme();
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle code change
  const handleCodeChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
    setError(null);
    setSuccess(false);
  };

  // Handle code execution
  const handleRunCode = () => {
    try {
      // In a real app, this would execute the code safely
      // For this demo, we'll just simulate execution

      // Simple evaluation for demonstration purposes
      // WARNING: Never use eval in production code without proper sandboxing
      let result;
      try {
        // This is just for demo purposes - in a real app, use a proper sandbox
        const consoleOutput: string[] = [];
        const mockConsole = {
          log: (...args: (string | number | boolean | object)[]) => {
            consoleOutput.push(args.join(' '));
          },
        };

        // Create a safe execution context
        const execFunc = new Function('console', code);
        execFunc(mockConsole);

        result = consoleOutput.join('\n');
      } catch (execError) {
        throw new Error(`Execution error: ${execError instanceof Error ? execError.message : String(execError)}`);
      }

      setOutput(result);

      // Check if output matches expected output
      if (result.trim() === expectedOutput.trim()) {
        setSuccess(true);
        setError(null);
        onSuccess();
      } else {
        setSuccess(false);
        setError('Output does not match the expected result. Try again!');
        onFailure();
      }
    } catch (err) {
      setSuccess(false);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      onFailure();
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: theme.palette.background.default }}>
        <Typography variant="subtitle2" gutterBottom>
          Instructions:
        </Typography>
        <Typography variant="body2" paragraph>
          {instructions}
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Expected Output:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
            p: 1,
            borderRadius: 1,
          }}
        >
          {expectedOutput}
        </Typography>
      </Paper>

      <TextField
        fullWidth
        multiline
        minRows={8}
        maxRows={15}
        value={code}
        onChange={handleCodeChange}
        variant="outlined"
        sx={{
          mb: 2,
          fontFamily: 'monospace',
          '& .MuiInputBase-input': {
            fontFamily: 'monospace',
          },
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon />}
          onClick={handleRunCode}
        >
          Run Code
        </Button>
      </Box>

      {output && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
            borderLeft: '4px solid',
            borderColor: success ? theme.palette.success.main : theme.palette.primary.main,
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Output:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
            }}
          >
            {output}
          </Typography>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Great job! Your code produced the expected output.
        </Alert>
      )}
    </Box>
  );
};

export default CodeExercise;
