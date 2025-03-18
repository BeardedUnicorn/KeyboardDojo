import { Box, useTheme } from '@mui/material';
import React from 'react';

import { useWindowSize, WindowSize } from '../utils/responsive';

import type { ReactNode ,FC } from 'react';

interface ResponsiveLayoutProps {
  children: ReactNode;
  spacing?: number;
  minContentWidth?: number;
  maxContentWidth?: number;
  sidebarWidth?: number | Record<WindowSize, number>;
  showSidebar?: boolean | Record<WindowSize, boolean>;
  sidebar?: ReactNode;
  sidebarPosition?: 'left' | 'right';
}

/**
 * A responsive layout component that adapts to desktop window constraints
 */
const ResponsiveLayout: FC<ResponsiveLayoutProps> = ({
  children,
  spacing = 2,
  minContentWidth = 320,
  maxContentWidth = 1200,
  sidebarWidth = { [WindowSize.XS]: 0, [WindowSize.SM]: 240, [WindowSize.MD]: 280 },
  showSidebar = { [WindowSize.XS]: false, [WindowSize.SM]: true },
  sidebar,
  sidebarPosition = 'left',
}) => {
  const theme = useTheme();
  const { width, size } = useWindowSize();

  // Calculate effective sidebar width based on window size
  const effectiveSidebarWidth = typeof sidebarWidth === 'number'
    ? sidebarWidth
    : sidebarWidth[size] ?? sidebarWidth[WindowSize.MD] ?? 280;

  // Determine if sidebar should be shown based on window size
  const shouldShowSidebar = typeof showSidebar === 'boolean'
    ? showSidebar
    : showSidebar[size] ?? showSidebar[WindowSize.MD] ?? true;

  // Calculate content width
  const paddingSpace = theme.spacing(spacing * 2).replace('px', '');
  const contentWidth = Math.min(
    Math.max(
      width - (shouldShowSidebar ? effectiveSidebarWidth : 0) - parseInt(paddingSpace, 10),
      minContentWidth,
    ),
    maxContentWidth,
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: sidebarPosition === 'left' ? 'row' : 'row-reverse',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      {sidebar && shouldShowSidebar && (
        <Box
          sx={{
            width: effectiveSidebarWidth,
            height: '100%',
            overflow: 'auto',
            borderRight: sidebarPosition === 'left' ? 1 : 0,
            borderLeft: sidebarPosition === 'right' ? 1 : 0,
            borderColor: 'divider',
            flexShrink: 0,
          }}
        >
          {sidebar}
        </Box>
      )}

      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          height: '100%',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: spacing,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: contentWidth,
            height: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default ResponsiveLayout;
