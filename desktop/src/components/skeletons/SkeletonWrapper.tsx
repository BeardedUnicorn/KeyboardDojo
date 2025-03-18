import { Box, Skeleton, useTheme } from '@mui/material';

import { TRANSITIONS } from '@/theme';

import type { FC, ReactNode } from 'react';

interface SkeletonWrapperProps {
  loading: boolean;
  children?: ReactNode;
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave';
  className?: string;
}

export const SkeletonWrapper: FC<SkeletonWrapperProps> = ({
  loading,
  children,
  variant = 'rounded',
  width = '100%',
  height = '100%',
  animation = 'wave',
  className,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        sx={{
          width,
          height,
          transition: TRANSITIONS.medium,
          opacity: loading ? 1 : 0,
        }}
        className={className}
      >
        <Skeleton
          variant={variant}
          width={width}
          height={height}
          animation={animation}
          sx={{
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.05)',
            '&::after': {
              background: `linear-gradient(90deg, transparent, ${
                theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.08)' 
                  : 'rgba(0, 0, 0, 0.04)'
              }, transparent)`,
            },
          }}
        />
      </Box>
    );
  }

  return <>{children}</>;
};

export default SkeletonWrapper;
