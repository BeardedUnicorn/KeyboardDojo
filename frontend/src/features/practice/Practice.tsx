import { Box, Typography, Paper, TextField, Button, Stack } from '@mui/material';
import { useState } from 'react';

const Practice = () => {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  
  // Placeholder shortcut to practice
  const currentShortcut = {
    name: 'Save File',
    keys: 'Ctrl+S',
    description: 'Save the current file',
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };
  
  const handleSubmit = () => {
    if (userInput.toLowerCase() === currentShortcut.keys.toLowerCase()) {
      setFeedback('Correct! Well done.');
    } else {
      setFeedback(`Incorrect. The correct shortcut is ${currentShortcut.keys}`);
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Practice Mode
      </Typography>
      <Typography variant="body1" paragraph>
        Test your knowledge of keyboard shortcuts by typing the correct key combination.
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          What is the shortcut for: {currentShortcut.name}
        </Typography>
        <Typography variant="body2" paragraph>
          {currentShortcut.description}
        </Typography>
        
        <Stack spacing={2} sx={{ mt: 3 }}>
          <TextField
            label="Enter shortcut"
            variant="outlined"
            fullWidth
            value={userInput}
            onChange={handleInputChange}
            placeholder="e.g. Ctrl+C"
          />
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmit}
          >
            Check Answer
          </Button>
          
          {feedback && (
            <Typography 
              variant="body1" 
              color={feedback.startsWith('Correct') ? 'success.main' : 'error.main'}
              sx={{ mt: 2 }}
            >
              {feedback}
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default Practice; 