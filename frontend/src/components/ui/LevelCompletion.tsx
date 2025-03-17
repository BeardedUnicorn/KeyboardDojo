import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  styled, 
  keyframes, 
  useTheme,
  Modal,
  Backdrop,
  Fade,
  Theme
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  ArrowForward as NextIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { NinjaMascot } from './';
import { MascotEmotion } from './NinjaMascot';

// Define celebration types
export type CelebrationType = 'level' | 'course' | 'achievement' | 'streak';

// Define props interface
interface LevelCompletionProps {
  open: boolean;
  onClose: () => void;
  type?: CelebrationType;
  title: string;
  message: string;
  xpEarned: number;
  nextLevel?: string;
  onNext?: () => void;
  onShare?: () => void;
  showMascot?: boolean;
  className?: string;
}

// Define keyframes animations
const confettiAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
`;

const popIn = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
`;

const shine = keyframes`
  0% { background-position: -100px; }
  40% { background-position: 200px; }
  100% { background-position: 200px; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Styled components
const CelebrationContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[10],
  overflow: 'hidden',
  maxWidth: 500,
  width: '100%',
  textAlign: 'center',
  animation: `${popIn} 0.5s ease-out`,
}));

const ConfettiPiece = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== 'color' && 
    prop !== 'delay' && 
    prop !== 'size' &&
    prop !== 'left',
})<{ 
  color: string; 
  delay: number;
  size: number;
  left: number;
}>(({ color, delay, size, left }) => ({
  position: 'absolute',
  backgroundColor: color,
  width: size,
  height: size,
  top: -20,
  left: `${left}%`,
  animation: `${confettiAnimation} 2s ease-out ${delay}ms forwards`,
  opacity: 0,
}));

const TrophyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  animation: `${float} 3s ease-in-out infinite`,
}));

const XpBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: 20,
  backgroundColor: `${theme.palette.success.main}20`,
  color: theme.palette.success.main,
  fontWeight: 'bold',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
    animation: `${shine} 2s infinite`,
  },
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const MascotContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(-3),
  right: theme.spacing(-3),
  transform: 'scale(0.8)',
  zIndex: 10,
}));

// Confetti component
const Confetti: React.FC = () => {
  const theme = useTheme();
  const confettiColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];
  
  // Generate random confetti pieces
  const pieces = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: Math.random() * 1500,
    size: Math.random() * 10 + 5,
    left: Math.random() * 100,
  }));
  
  return (
    <Box sx={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
      {pieces.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          color={piece.color}
          delay={piece.delay}
          size={piece.size}
          left={piece.left}
        />
      ))}
    </Box>
  );
};

// Get trophy icon based on celebration type
const getTrophyIcon = (type: CelebrationType, theme: Theme) => {
  switch (type) {
    case 'course':
      return <TrophyIcon sx={{ fontSize: 80, color: theme.palette.warning.main }} />;
    case 'achievement':
      return <StarIcon sx={{ fontSize: 80, color: theme.palette.secondary.main }} />;
    case 'streak':
      return <TrophyIcon sx={{ fontSize: 80, color: theme.palette.error.main }} />;
    case 'level':
    default:
      return <TrophyIcon sx={{ fontSize: 80, color: theme.palette.primary.main }} />;
  }
};

// LevelCompletion component
const LevelCompletion: React.FC<LevelCompletionProps> = ({
  open,
  onClose,
  type = 'level',
  title,
  message,
  xpEarned,
  nextLevel,
  onNext,
  onShare,
  showMascot = true,
  className,
}) => {
  const theme = useTheme();
  const [playConfetti, setPlayConfetti] = useState(false);
  
  // Start confetti animation when modal opens
  useEffect(() => {
    if (open) {
      setPlayConfetti(true);
    } else {
      setPlayConfetti(false);
    }
  }, [open]);
  
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 500,
            outline: 'none',
          }}
          className={className}
        >
          {playConfetti && <Confetti />}
          
          <CelebrationContainer>
            <TrophyContainer>
              {getTrophyIcon(type, theme)}
            </TrophyContainer>
            
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {title}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              {message}
            </Typography>
            
            <XpBadge>
              <StarIcon fontSize="small" sx={{ mr: 0.5 }} />
              {xpEarned} XP Earned
            </XpBadge>
            
            <ButtonContainer>
              {onNext && nextLevel && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  endIcon={<NextIcon />}
                  onClick={onNext}
                >
                  {nextLevel}
                </Button>
              )}
              
              {onShare && (
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<ShareIcon />}
                  onClick={onShare}
                >
                  Share
                </Button>
              )}
            </ButtonContainer>
            
            {showMascot && (
              <MascotContainer>
                <NinjaMascot emotion="celebrating" size="medium" />
              </MascotContainer>
            )}
          </CelebrationContainer>
        </Box>
      </Fade>
    </Modal>
  );
};

export default LevelCompletion; 