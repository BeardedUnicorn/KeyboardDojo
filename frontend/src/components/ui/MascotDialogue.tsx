import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, styled, IconButton } from '@mui/material';
import { fadeIn, fadeOut } from './NinjaMascotAnimations';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';

// Define dialogue types
export type DialogueType = 'info' | 'success' | 'error' | 'warning' | 'tip';

// Define dialogue positions
export type DialoguePosition = 'top' | 'bottom' | 'left' | 'right';

// Define dialogue message interface
export interface DialogueMessage {
  text: string;
  type?: DialogueType;
  duration?: number; // in milliseconds, if auto-advancing
}

// Define props interface
interface MascotDialogueProps {
  messages: DialogueMessage[];
  position?: DialoguePosition;
  autoAdvance?: boolean;
  onComplete?: () => void;
  maxWidth?: number | string;
  className?: string;
}

// Dialogue bubble component
const DialogueBubble = styled(Box, {
  shouldForwardProp: (prop) => !['dialogueType', 'dialoguePosition', 'isVisible', 'isExiting'].includes(prop as string),
})<{ 
  dialogueType: DialogueType; 
  dialoguePosition: DialoguePosition;
  isVisible: boolean;
  isExiting: boolean;
}>(({ theme, dialogueType, dialoguePosition, isVisible, isExiting }) => {
  // Set position styles based on dialoguePosition
  let positionStyles = {};
  
  switch (dialoguePosition) {
    case 'top':
      positionStyles = {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '10px',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '10px 10px 0',
          borderStyle: 'solid',
          borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
        },
      };
      break;
    case 'bottom':
      positionStyles = {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '10px',
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '0 10px 10px',
          borderStyle: 'solid',
          borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
        },
      };
      break;
    case 'left':
      positionStyles = {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginRight: '10px',
        '&:after': {
          content: '""',
          position: 'absolute',
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '10px 0 10px 10px',
          borderStyle: 'solid',
          borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
        },
      };
      break;
    case 'right':
      positionStyles = {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: '10px',
        '&:after': {
          content: '""',
          position: 'absolute',
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '10px 10px 10px 0',
          borderStyle: 'solid',
          borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
        },
      };
      break;
    default:
      positionStyles = {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '10px',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '10px 10px 0',
          borderStyle: 'solid',
          borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
        },
      };
  }
  
  // Set color based on dialogueType
  let typeStyles = {};
  
  switch (dialogueType) {
    case 'success':
      typeStyles = {
        borderLeft: `4px solid ${theme.palette.success.main}`,
      };
      break;
    case 'error':
      typeStyles = {
        borderLeft: `4px solid ${theme.palette.error.main}`,
      };
      break;
    case 'warning':
      typeStyles = {
        borderLeft: `4px solid ${theme.palette.warning.main}`,
      };
      break;
    case 'tip':
      typeStyles = {
        borderLeft: `4px solid ${theme.palette.info.main}`,
      };
      break;
    default:
      typeStyles = {
        borderLeft: `4px solid ${theme.palette.primary.main}`,
      };
  }
  
  return {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '12px',
    padding: theme.spacing(2),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 10,
    maxWidth: '300px',
    opacity: 0,
    visibility: 'hidden',
    animation: isExiting 
      ? `${fadeOut} 0.3s ease-out forwards`
      : isVisible ? `${fadeIn} 0.3s ease-out forwards` : 'none',
    ...positionStyles,
    ...typeStyles,
  };
});

// Dialogue content
const DialogueContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

// Dialogue controls
const DialogueControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(1),
}));

// MascotDialogue component
const MascotDialogue: React.FC<MascotDialogueProps> = ({
  messages,
  position = 'top',
  autoAdvance = false,
  onComplete,
  maxWidth = 300,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  
  // Get current message
  const currentMessage = messages[currentIndex];
  
  // Handle advancing to next message
  const advanceToNext = useCallback(() => {
    if (currentIndex < messages.length - 1) {
      setIsExiting(true);
      
      // Wait for exit animation to complete
      setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
        setCurrentIndex(prev => prev + 1);
        
        // Show next message after a brief delay
        setTimeout(() => {
          setIsVisible(true);
        }, 100);
      }, 300);
    } else {
      // Last message, trigger onComplete
      setIsExiting(true);
      
      setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, 300);
    }
  }, [currentIndex, messages.length, onComplete]);
  
  // Handle auto-advancing
  useEffect(() => {
    if (autoAdvance && currentMessage?.duration) {
      const timer = setTimeout(() => {
        advanceToNext();
      }, currentMessage.duration);
      
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [autoAdvance, currentMessage, advanceToNext]);
  
  // Handle close
  const handleClose = () => {
    setIsExiting(true);
    
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, 300);
  };
  
  if (!currentMessage || !isVisible) {
    return null;
  }
  
  return (
    <DialogueBubble
      dialogueType={currentMessage.type || 'info'}
      dialoguePosition={position}
      isVisible={isVisible}
      isExiting={isExiting}
      className={className}
      sx={{ maxWidth }}
    >
      <DialogueContent>
        <Typography variant="body2">{currentMessage.text}</Typography>
        
        <DialogueControls>
          <Typography variant="caption" color="text.secondary">
            {currentIndex + 1} / {messages.length}
          </Typography>
          
          <Box>
            {currentIndex < messages.length - 1 && (
              <IconButton 
                size="small" 
                onClick={advanceToNext}
                color="primary"
                aria-label="Next message"
              >
                <ArrowForwardIcon fontSize="small" />
              </IconButton>
            )}
            
            <IconButton 
              size="small" 
              onClick={handleClose}
              color="default"
              aria-label="Close dialogue"
              sx={{ ml: 0.5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogueControls>
      </DialogueContent>
    </DialogueBubble>
  );
};

export default MascotDialogue; 