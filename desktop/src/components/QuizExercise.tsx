import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert,
  useTheme
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface QuizExerciseProps {
  question: string;
  options: string[];
  correctAnswer: number;
  onSuccess: () => void;
  onFailure: () => void;
}

const QuizExercise: React.FC<QuizExerciseProps> = ({
  question,
  options,
  correctAnswer,
  onSuccess,
  onFailure
}) => {
  const theme = useTheme();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Handle option selection
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(parseInt(event.target.value, 10));
    setError(null);
    setSuccess(false);
    setSubmitted(false);
  };
  
  // Handle submit
  const handleSubmit = () => {
    if (selectedOption === null) {
      setError('Please select an answer before submitting.');
      return;
    }
    
    setSubmitted(true);
    
    if (selectedOption === correctAnswer) {
      setSuccess(true);
      setError(null);
      onSuccess();
    } else {
      setSuccess(false);
      setError('Incorrect answer. Try again!');
      onFailure();
    }
  };
  
  return (
    <Box sx={{ mb: 3 }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: theme.palette.background.default }}>
        <Typography variant="subtitle1" gutterBottom>
          {question}
        </Typography>
        
        <RadioGroup
          value={selectedOption !== null ? selectedOption.toString() : ''}
          onChange={handleOptionChange}
        >
          {options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={index.toString()}
              control={<Radio />}
              label={option}
              disabled={submitted && success}
              sx={{
                mb: 1,
                ...(submitted && index === correctAnswer && {
                  color: theme.palette.success.main,
                  fontWeight: 'bold',
                }),
                ...(submitted && selectedOption === index && selectedOption !== correctAnswer && {
                  color: theme.palette.error.main,
                }),
              }}
            />
          ))}
        </RadioGroup>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckIcon />}
          onClick={handleSubmit}
          disabled={submitted && success}
        >
          {submitted && success ? 'Correct!' : 'Submit Answer'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Correct! You selected the right answer.
        </Alert>
      )}
      
      {submitted && !success && (
        <Alert severity="info" sx={{ mb: 2 }}>
          The correct answer is: {options[correctAnswer]}
        </Alert>
      )}
    </Box>
  );
};

export default QuizExercise; 