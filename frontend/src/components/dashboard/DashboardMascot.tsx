import React, { useState, useEffect } from 'react';
import { 
  Box, 
  styled, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import { NinjaMascot, MascotDialogue } from '../ui';
import { MascotEmotion, MascotAnimation, MascotInteraction } from '../ui/NinjaMascot';
import { DialoguePosition, DialogueType } from '../ui/MascotDialogue';

// Define message interface
export interface MascotMessage {
  id: string;
  text: string;
  type: DialogueType;
  emotion: MascotEmotion;
  animation?: MascotAnimation;
  interaction?: MascotInteraction;
  duration?: number; // in milliseconds
  position?: DialoguePosition;
  dismissible?: boolean;
}

// Define context types
export type MascotContext = 
  | 'welcome' 
  | 'streak' 
  | 'achievement' 
  | 'new_lesson' 
  | 'progress' 
  | 'idle';

// Define props interface
interface DashboardMascotProps {
  context?: MascotContext;
  userStreak?: number;
  userName?: string;
  completedLessons?: number;
  totalLessons?: number;
  recentAchievement?: string;
  customMessages?: MascotMessage[];
  onMascotClick?: () => void;
  className?: string;
}

// Styled components
const MascotContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(2),
  height: '100%',
}));

// Helper function to get random item from array
const getRandomItem = <T extends unknown>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// DashboardMascot component
const DashboardMascot: React.FC<DashboardMascotProps> = ({
  context = 'idle',
  userStreak = 0,
  userName,
  completedLessons = 0,
  totalLessons = 0,
  recentAchievement,
  customMessages = [],
  onMascotClick,
  className,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for current message and mascot properties
  const [currentMessage, setCurrentMessage] = useState<MascotMessage | null>(null);
  const [emotion, setEmotion] = useState<MascotEmotion>('neutral');
  const [animation, setAnimation] = useState<MascotAnimation>('idle');
  const [interaction, setInteraction] = useState<MascotInteraction>('none');
  const [showDialogue, setShowDialogue] = useState(false);
  
  // Generate context-based messages
  const generateContextMessages = (): MascotMessage[] => {
    const messages: MascotMessage[] = [];
    const greeting = userName ? `Hey ${userName}!` : 'Hey there!';
    
    switch (context) {
      case 'welcome':
        messages.push({
          id: 'welcome-1',
          text: `${greeting} Ready to level up your keyboard skills today?`,
          type: 'speech',
          emotion: 'happy',
          animation: 'wave',
          position: 'top',
        });
        messages.push({
          id: 'welcome-2',
          text: 'Choose a lesson to get started or continue where you left off!',
          type: 'speech',
          emotion: 'excited',
          animation: 'point',
          position: 'right',
        });
        break;
        
      case 'streak':
        if (userStreak === 1) {
          messages.push({
            id: 'streak-first',
            text: `${greeting} You've started your streak! Come back tomorrow to keep it going!`,
            type: 'speech',
            emotion: 'excited',
            animation: 'celebrate',
            position: 'top',
          });
        } else if (userStreak >= 7) {
          messages.push({
            id: 'streak-awesome',
            text: `${userStreak} day streak! You're on fire! 🔥`,
            type: 'speech',
            emotion: 'excited',
            animation: 'celebrate',
            position: 'top',
          });
        } else if (userStreak > 1) {
          messages.push({
            id: 'streak-good',
            text: `${greeting} You're on a ${userStreak} day streak! Keep it up!`,
            type: 'speech',
            emotion: 'happy',
            animation: 'thumbsUp',
            position: 'top',
          });
        }
        break;
        
      case 'achievement':
        if (recentAchievement) {
          messages.push({
            id: 'achievement-congrats',
            text: `Congratulations on earning "${recentAchievement}"! Keep up the great work!`,
            type: 'speech',
            emotion: 'excited',
            animation: 'celebrate',
            position: 'top',
          });
        }
        break;
        
      case 'new_lesson':
        messages.push({
          id: 'new-lesson',
          text: 'New lessons have been unlocked! Check them out!',
          type: 'speech',
          emotion: 'excited',
          animation: 'point',
          position: 'right',
        });
        break;
        
      case 'progress':
        const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
        
        if (progressPercentage === 0) {
          messages.push({
            id: 'progress-start',
            text: 'Ready to begin your keyboard mastery journey? Let\'s get started!',
            type: 'speech',
            emotion: 'happy',
            animation: 'wave',
            position: 'top',
          });
        } else if (progressPercentage < 25) {
          messages.push({
            id: 'progress-early',
            text: `You've completed ${completedLessons} lessons so far. Great start!`,
            type: 'speech',
            emotion: 'happy',
            animation: 'thumbsUp',
            position: 'top',
          });
        } else if (progressPercentage < 50) {
          messages.push({
            id: 'progress-quarter',
            text: `${progressPercentage}% complete! You're making steady progress!`,
            type: 'speech',
            emotion: 'happy',
            animation: 'thumbsUp',
            position: 'top',
          });
        } else if (progressPercentage < 75) {
          messages.push({
            id: 'progress-half',
            text: `You're halfway to becoming a keyboard ninja! Keep going!`,
            type: 'speech',
            emotion: 'excited',
            animation: 'celebrate',
            position: 'top',
          });
        } else if (progressPercentage < 100) {
          messages.push({
            id: 'progress-almost',
            text: `Almost there! Just ${totalLessons - completedLessons} more lessons to complete!`,
            type: 'speech',
            emotion: 'excited',
            animation: 'point',
            position: 'top',
          });
        } else {
          messages.push({
            id: 'progress-complete',
            text: 'You\'ve completed all lessons! You\'re a true keyboard ninja now!',
            type: 'speech',
            emotion: 'excited',
            animation: 'celebrate',
            position: 'top',
          });
        }
        break;
        
      case 'idle':
      default:
        const idleMessages = [
          {
            id: 'idle-1',
            text: 'Did you know? The QWERTY keyboard layout was designed to slow typists down!',
            type: 'tip' as DialogueType,
            emotion: 'neutral',
            position: 'top',
          },
          {
            id: 'idle-2',
            text: 'Keyboard shortcuts can save you up to 8 days per year in productivity!',
            type: 'tip' as DialogueType,
            emotion: 'happy',
            position: 'top',
          },
          {
            id: 'idle-3',
            text: 'Regular practice is the key to keyboard mastery. Even 10 minutes a day helps!',
            type: 'tip' as DialogueType,
            emotion: 'neutral',
            position: 'top',
          },
          {
            id: 'idle-4',
            text: 'Click on me for a random keyboard tip!',
            type: 'speech' as DialogueType,
            emotion: 'happy',
            animation: 'wave',
            position: 'top',
          },
        ];
        
        messages.push(...idleMessages);
        break;
    }
    
    // Add custom messages if provided
    if (customMessages.length > 0) {
      messages.push(...customMessages);
    }
    
    return messages;
  };
  
  // Handle mascot click
  const handleMascotClick = () => {
    // Show a random tip when clicked
    const tips = [
      'Use Ctrl+Shift+T to reopen closed tabs in most browsers.',
      'Alt+Tab lets you quickly switch between applications.',
      'Ctrl+Z, Ctrl+Y for undo and redo in most applications.',
      'Ctrl+A selects all text in a document or field.',
      'Ctrl+S saves your work - do this often!',
      'F2 renames selected files in most file explorers.',
      'Ctrl+C, Ctrl+X, Ctrl+V for copy, cut, and paste.',
      'Ctrl+F opens the find dialog in most applications.',
      'Alt+F4 closes the current application window.',
      'Windows+D shows the desktop by minimizing all windows.',
    ];
    
    const randomTip = getRandomItem(tips);
    
    setCurrentMessage({
      id: 'click-tip',
      text: randomTip,
      type: 'tip',
      emotion: 'happy',
      animation: 'point',
      position: 'top',
      dismissible: true,
    });
    
    setEmotion('happy');
    setAnimation('point');
    setShowDialogue(true);
    
    // Reset animation after a delay
    setTimeout(() => {
      setAnimation('idle');
    }, 2000);
    
    // Call the provided click handler if available
    if (onMascotClick) {
      onMascotClick();
    }
  };
  
  // Handle dialogue close
  const handleDialogueClose = () => {
    setShowDialogue(false);
    setAnimation('idle');
    setEmotion('neutral');
  };
  
  // Effect to set initial message based on context
  useEffect(() => {
    const contextMessages = generateContextMessages();
    
    if (contextMessages.length > 0) {
      const message = getRandomItem(contextMessages);
      setCurrentMessage(message);
      setEmotion(message.emotion);
      setAnimation(message.animation || 'idle');
      setInteraction(message.interaction || 'none');
      setShowDialogue(true);
      
      // Auto-hide dialogue after duration if specified
      if (message.duration) {
        const timer = setTimeout(() => {
          setShowDialogue(false);
          setAnimation('idle');
          setEmotion('neutral');
        }, message.duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [context, userStreak, recentAchievement, userName, completedLessons, totalLessons]);
  
  return (
    <MascotContainer className={className}>
      {currentMessage && showDialogue && (
        <MascotDialogue
          text={currentMessage.text}
          type={currentMessage.type}
          position={currentMessage.position || 'top'}
          onClose={currentMessage.dismissible ? handleDialogueClose : undefined}
        />
      )}
      
      <NinjaMascot
        emotion={emotion}
        size={isMobile ? 'medium' : 'large'}
        animation={animation}
        interaction={interaction}
        onClick={handleMascotClick}
      />
    </MascotContainer>
  );
};

export default DashboardMascot; 