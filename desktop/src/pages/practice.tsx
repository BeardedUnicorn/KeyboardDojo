import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  LinearProgress,
  Stack,
  Chip,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
  Speed as SpeedIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import KeyboardVisualizer from '../components/KeyboardVisualizer';
import { isDesktop } from '../../../shared/src/utils';

// Sample texts for practice
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "Pack my box with five dozen liquor jugs.",
  "How vexingly quick daft zebras jump!",
  "Sphinx of black quartz, judge my vow.",
  "Jackdaws love my big sphinx of quartz.",
];

const Practice: React.FC = () => {
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [showKeyboard, setShowKeyboard] = useState(isDesktop());
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Get current target character
  const currentCharIndex = input.length;
  const currentChar = text.charAt(currentCharIndex);
  
  // Initialize with a random text
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setText(sampleTexts[randomIndex]);
  }, []);
  
  // Calculate WPM and accuracy
  useEffect(() => {
    if (!isStarted || !startTime) return;
    
    const calculateStats = () => {
      const currentTime = Date.now();
      const elapsedMinutes = (currentTime - startTime) / 60000;
      
      // Calculate WPM (standard is 5 characters per word)
      const words = input.length / 5;
      const currentWpm = Math.round(words / elapsedMinutes);
      setWpm(currentWpm);
      
      // Calculate accuracy
      let errorCount = 0;
      for (let i = 0; i < input.length; i++) {
        if (input[i] !== text[i]) {
          errorCount++;
        }
      }
      setErrors(errorCount);
      const currentAccuracy = Math.max(0, Math.round(100 - (errorCount / input.length * 100)));
      setAccuracy(currentAccuracy);
    };
    
    const intervalId = setInterval(calculateStats, 500);
    return () => clearInterval(intervalId);
  }, [isStarted, startTime, input, text]);
  
  // Check if finished
  useEffect(() => {
    if (input.length === text.length && input.length > 0) {
      setIsFinished(true);
      setEndTime(Date.now());
      setIsStarted(false);
    }
  }, [input, text]);
  
  const handleStart = () => {
    setInput('');
    setIsStarted(true);
    setIsFinished(false);
    setStartTime(Date.now());
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    
    // Focus the input field
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  
  const handleReset = () => {
    setInput('');
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    
    // Get a new random text
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setText(sampleTexts[randomIndex]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
    }
    
    setInput(e.target.value);
  };
  
  // Calculate progress percentage
  const progress = (input.length / text.length) * 100;
  
  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Typing Practice
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Type the text below:
          </Typography>
          
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 1, 
              bgcolor: 'background.default',
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              lineHeight: 1.5,
              letterSpacing: 0.5,
              position: 'relative',
              minHeight: '4rem',
            }}
          >
            {text.split('').map((char, index) => {
              let color = 'text.primary';
              let bgcolor = 'transparent';
              
              if (index < input.length) {
                // Already typed
                color = input[index] === char ? 'success.main' : 'error.main';
              } else if (index === input.length) {
                // Current character
                bgcolor = 'action.selected';
              }
              
              return (
                <Typography
                  key={index}
                  component="span"
                  sx={{
                    color,
                    bgcolor,
                    p: index === input.length ? 0.5 : 0,
                    borderRadius: 0.5,
                  }}
                >
                  {char}
                </Typography>
              );
            })}
          </Box>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ mb: 3, height: 8, borderRadius: 4 }} 
        />
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Start typing here..."
          value={input}
          onChange={handleInputChange}
          disabled={!isStarted || isFinished}
          inputRef={inputRef}
          sx={{ mb: 3 }}
        />
        
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={handleStart}
            disabled={isStarted && !isFinished}
          >
            Start
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Stack>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Chip
          icon={<SpeedIcon />}
          label={`WPM: ${wpm}`}
          color="primary"
          variant="outlined"
          sx={{ fontSize: '1rem', p: 1 }}
        />
        
        <Chip
          icon={accuracy >= 90 ? <CheckIcon /> : <CloseIcon />}
          label={`Accuracy: ${accuracy}%`}
          color={accuracy >= 90 ? 'success' : 'error'}
          variant="outlined"
          sx={{ fontSize: '1rem', p: 1 }}
        />
        
        <Chip
          icon={<CloseIcon />}
          label={`Errors: ${errors}`}
          color="error"
          variant="outlined"
          sx={{ fontSize: '1rem', p: 1 }}
        />
      </Box>
      
      {isFinished && (
        <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'success.light' }}>
          <Typography variant="h6" gutterBottom>
            Practice Complete!
          </Typography>
          
          <Typography variant="body1">
            Time: {((endTime! - startTime!) / 1000).toFixed(2)} seconds
          </Typography>
          
          <Typography variant="body1">
            WPM: {wpm}
          </Typography>
          
          <Typography variant="body1">
            Accuracy: {accuracy}%
          </Typography>
          
          <Typography variant="body1">
            Errors: {errors}
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Paper>
      )}
      
      {isDesktop() && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Keyboard Visualization
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={showKeyboard}
                  onChange={(e) => setShowKeyboard(e.target.checked)}
                  color="primary"
                />
              }
              label="Show Keyboard"
            />
          </Box>
          
          {showKeyboard && (
            <Paper elevation={3} sx={{ p: 2, mb: 4, overflow: 'auto' }}>
              <KeyboardVisualizer
                targetKey={currentChar}
                showPressed={true}
                highlightTarget={true}
              />
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default Practice; 