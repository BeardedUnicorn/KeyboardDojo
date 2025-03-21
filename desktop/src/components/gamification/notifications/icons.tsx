import { Box, Fade, keyframes, useTheme } from '@mui/material';
import React, { ReactNode, FC } from 'react';

// Animation keyframes
const successPulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const errorShake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
`;

const loadingRotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

interface FeedbackAnimationProps {
  type: 'success' | 'error' | 'loading';
  size?: number;
  color?: string;
  children?: ReactNode;
  className?: string;
}

export const FeedbackIcon: FC<FeedbackAnimationProps> = ({
  type,
  size = 40,
  color,
  children,
  className,
}) => {
  const theme = useTheme();
  const defaultColor = color || theme.palette[type === 'loading' ? 'primary' : type].main;

  const getAnimation = () => {
    switch (type) {
      case 'success':
        return `${successPulse} 0.5s ease-in-out`;
      case 'error':
        return `${errorShake} 0.5s ease-in-out`;
      case 'loading':
        return `${loadingRotate} 1s linear infinite`;
      default:
        return 'none';
    }
  };

  return (
    <Fade in timeout={300}>
      <Box
        className={className}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          color: defaultColor,
          animation: getAnimation(),
          transition: theme.transitions.create('all', {
            duration: 300,
          }),
          position: 'relative',
        }}
      >
        {children}
      </Box>
    </Fade>
  );
};

// Feedback Icons
export const SuccessIcon: FC<{ size?: number; color?: string }> = ({ size = 24, color }) => (
  <FeedbackIcon type="success" size={size} color={color}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  </FeedbackIcon>
);

export const ErrorIcon: FC<{ size?: number; color?: string }> = ({ size = 24, color }) => (
  <FeedbackIcon type="error" size={size} color={color}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  </FeedbackIcon>
);

export const LoadingIcon: FC<{ size?: number; color?: string }> = ({ size = 24, color }) => (
  <FeedbackIcon type="loading" size={size} color={color}>
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeDasharray="40" strokeDashoffset="20" />
    </svg>
  </FeedbackIcon>
);