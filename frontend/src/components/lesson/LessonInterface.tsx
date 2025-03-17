import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button, 
  styled, 
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ArrowBack as BackIcon,
  Help as HelpIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { 
  SimulatedEditor, 
  KeyboardVisualization, 
  Feedback, 
  NinjaMascot, 
  MascotDialogue 
} from '../ui';
import { KeyData } from '../ui/KeyboardVisualization';
import { FeedbackType } from '../ui/Feedback';
import { MascotEmotion } from '../ui/NinjaMascot';
import { DialogueType } from '../ui/MascotDialogue';

// Define lesson step interface
export interface LessonStep {
  id: string;
  instruction: string;
  expectedKeys: KeyData[];
  editorContent?: string;
  editorLanguage?: string;
  cursorPosition?: { line: number; column: number };
  hint?: string;
  explanation?: string;
}

// Define lesson interface
export interface LessonData {
  id: string;
  title: string;
  description: string;
  steps: LessonStep[];
  xpReward: number;
  estimatedTime: number; // in minutes
}

// Define props interface
interface LessonInterfaceProps {
  lesson: LessonData;
  onComplete: (lessonId: string) => void;
  onExit: () => void;
  className?: string;
}

// Styled components
const LessonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const HeaderTitle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const HeaderControls = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

const EditorContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

const PromptContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const PromptHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
});

const KeyboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  marginTop: theme.spacing(2),
}));

const BottomContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  position: 'relative',
  zIndex: 5,
}));

const MascotContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 10,
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const ProgressIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ProgressDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'completed',
})<{ active: boolean; completed: boolean }>(({ theme, active, completed }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: completed 
    ? theme.palette.success.main 
    : active 
      ? theme.palette.primary.main 
      : theme.palette.grey[300],
  transition: 'all 0.3s ease',
}));

// LessonInterface component
const LessonInterface: React.FC<LessonInterfaceProps> = ({
  lesson,
  onComplete,
  onExit,
  className,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for current step, user input, feedback, and settings
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userKeyPresses, setUserKeyPresses] = useState<KeyData[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('success');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [mascotEmotion, setMascotEmotion] = useState<MascotEmotion>('neutral');
  const [showMascotDialogue, setShowMascotDialogue] = useState(false);
  const [mascotDialogue, setMascotDialogue] = useState('');
  const [dialogueType, setDialogueType] = useState<DialogueType>('speech');
  
  // Get current step
  const currentStep = lesson.steps[currentStepIndex];
  
  // Handle key press
  const handleKeyPress = (key: KeyData) => {
    const newUserKeyPresses = [...userKeyPresses, key];
    setUserKeyPresses(newUserKeyPresses);
    
    // Check if the sequence is complete
    if (newUserKeyPresses.length === currentStep.expectedKeys.length) {
      const isCorrect = newUserKeyPresses.every(
        (key, index) => key.key === currentStep.expectedKeys[index].key
      );
      
      if (isCorrect) {
        handleCorrectAnswer();
      } else {
        handleIncorrectAnswer();
      }
    }
  };
  
  // Handle correct answer
  const handleCorrectAnswer = () => {
    setFeedbackType('success');
    setFeedbackMessage('Great job! That\'s correct!');
    setShowFeedback(true);
    setMascotEmotion('happy');
    setShowMascotDialogue(true);
    setMascotDialogue('Excellent work! You\'re getting better!');
    setDialogueType('speech');
    
    // Move to next step after a delay
    setTimeout(() => {
      if (currentStepIndex < lesson.steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
        setUserKeyPresses([]);
        setShowFeedback(false);
        setShowMascotDialogue(false);
      } else {
        // Lesson complete
        handleLessonComplete();
      }
    }, 2000);
  };
  
  // Handle incorrect answer
  const handleIncorrectAnswer = () => {
    setFeedbackType('error');
    setFeedbackMessage('Not quite right. Try again!');
    setShowFeedback(true);
    setMascotEmotion('sad');
    setShowMascotDialogue(true);
    setMascotDialogue('Don\'t worry, try again! You\'ll get it!');
    setDialogueType('speech');
    
    // Reset after a delay
    setTimeout(() => {
      setUserKeyPresses([]);
      setShowFeedback(false);
      setShowMascotDialogue(false);
      setMascotEmotion('neutral');
    }, 2000);
  };
  
  // Handle lesson complete
  const handleLessonComplete = () => {
    setFeedbackType('success');
    setFeedbackMessage(`Congratulations! You've completed the lesson and earned ${lesson.xpReward} XP!`);
    setShowFeedback(true);
    setMascotEmotion('excited');
    setShowMascotDialogue(true);
    setMascotDialogue('Amazing job! You\'ve mastered this lesson!');
    setDialogueType('speech');
    
    // Call onComplete after a delay
    setTimeout(() => {
      onComplete(lesson.id);
    }, 3000);
  };
  
  // Handle hint toggle
  const handleHintToggle = () => {
    setShowHint(!showHint);
    
    if (!showHint) {
      setMascotEmotion('neutral');
      setShowMascotDialogue(true);
      setMascotDialogue(currentStep.hint || 'Try using the keyboard shortcut shown below.');
      setDialogueType('tip');
    } else {
      setShowMascotDialogue(false);
    }
  };
  
  // Handle fullscreen toggle
  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    
    // In a real app, you would implement actual fullscreen functionality
  };
  
  // Handle mute toggle
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    
    // In a real app, you would implement actual mute functionality
  };
  
  // Handle exit
  const handleExit = () => {
    onExit();
  };
  
  // Reset state when step changes
  useEffect(() => {
    setUserKeyPresses([]);
    setShowFeedback(false);
    setShowHint(false);
    setShowMascotDialogue(false);
    setMascotEmotion('neutral');
  }, [currentStepIndex]);
  
  return (
    <LessonContainer className={className}>
      {/* Header */}
      <Header>
        <HeaderTitle>
          <IconButton onClick={handleExit} edge="start" sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            {lesson.title}
          </Typography>
        </HeaderTitle>
        
        <ProgressIndicator>
          {lesson.steps.map((step, index) => (
            <ProgressDot 
              key={step.id}
              active={index === currentStepIndex}
              completed={index < currentStepIndex}
            />
          ))}
        </ProgressIndicator>
        
        <HeaderControls>
          <Tooltip title={isMuted ? "Unmute" : "Mute"}>
            <IconButton onClick={handleMuteToggle}>
              {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton onClick={handleFullscreenToggle}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Settings">
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </HeaderControls>
      </Header>
      
      {/* Main content */}
      <EditorContainer>
        <Container maxWidth="xl" sx={{ height: '100%', py: 3 }}>
          {/* Simulated editor */}
          <SimulatedEditor
            content={currentStep.editorContent || ''}
            language={currentStep.editorLanguage || 'javascript'}
            cursorPosition={currentStep.cursorPosition}
            height="60vh"
          />
          
          {/* Bottom prompt */}
          <BottomContainer>
            <Container maxWidth="lg">
              <PromptContainer>
                <PromptHeader>
                  <Typography variant="h6" fontWeight="bold">
                    Step {currentStepIndex + 1}: {currentStep.instruction}
                  </Typography>
                  
                  <Tooltip title={showHint ? "Hide Hint" : "Show Hint"}>
                    <IconButton onClick={handleHintToggle}>
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                </PromptHeader>
                
                {showHint && currentStep.hint && (
                  <Box sx={{ 
                    backgroundColor: `${theme.palette.info.main}10`, 
                    p: 2, 
                    borderRadius: 1,
                    borderLeft: `4px solid ${theme.palette.info.main}`
                  }}>
                    <Typography variant="body2">
                      <strong>Hint:</strong> {currentStep.hint}
                    </Typography>
                  </Box>
                )}
                
                <Divider />
                
                <Typography variant="body2" color="text.secondary">
                  Press the following keys:
                </Typography>
                
                <KeyboardContainer>
                  <KeyboardVisualization
                    highlightedKeys={currentStep.expectedKeys}
                    pressedKeys={userKeyPresses}
                    onKeyPress={handleKeyPress}
                    showLabels
                  />
                </KeyboardContainer>
              </PromptContainer>
            </Container>
          </BottomContainer>
        </Container>
      </EditorContainer>
      
      {/* Mascot */}
      <MascotContainer>
        {showMascotDialogue && (
          <MascotDialogue
            text={mascotDialogue}
            type={dialogueType}
            position="left"
            onClose={() => setShowMascotDialogue(false)}
          />
        )}
        <NinjaMascot
          emotion={mascotEmotion}
          size="medium"
          onClick={() => {
            setShowMascotDialogue(!showMascotDialogue);
            setMascotDialogue('Need help? Try using the hint button!');
            setDialogueType('tip');
          }}
        />
      </MascotContainer>
      
      {/* Feedback */}
      {showFeedback && (
        <Feedback
          type={feedbackType}
          message={feedbackMessage}
          position="top"
          autoHideDuration={2000}
          showIcon
        />
      )}
    </LessonContainer>
  );
};

export default LessonInterface; 