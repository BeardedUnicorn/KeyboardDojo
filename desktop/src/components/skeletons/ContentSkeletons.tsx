import { Box, Stack } from '@mui/material';

import { SPACING } from '@/theme';

import SkeletonWrapper from './SkeletonWrapper';

import type { FC, ReactNode } from 'react';

interface ContentSkeletonProps {
  loading?: boolean;
  children?: ReactNode;
}

export const LessonSkeleton: FC<ContentSkeletonProps> = ({ loading = true }) => (
  <SkeletonWrapper loading={loading}>
    <Stack spacing={SPACING.md}>
      {/* Title */}
      <SkeletonWrapper loading={loading} height={48} width="60%" />

      {/* Description */}
      <Stack spacing={SPACING.sm}>
        <SkeletonWrapper loading={loading} height={20} width="90%" />
        <SkeletonWrapper loading={loading} height={20} width="85%" />
        <SkeletonWrapper loading={loading} height={20} width="40%" />
      </Stack>

      {/* Exercise Area */}
      <Box sx={{ mt: SPACING.lg }}>
        <SkeletonWrapper loading={loading} height={200} />
      </Box>

      {/* Navigation */}
      <Stack direction="row" justifyContent="space-between" sx={{ mt: SPACING.lg }}>
        <SkeletonWrapper loading={loading} width={120} height={40} />
        <SkeletonWrapper loading={loading} width={120} height={40} />
      </Stack>
    </Stack>
  </SkeletonWrapper>
);

export const PathSkeleton: FC<ContentSkeletonProps> = ({ loading = true }) => (
  <SkeletonWrapper loading={loading}>
    <Stack spacing={SPACING.md}>
      {/* Path Header */}
      <Stack direction="row" spacing={SPACING.md} alignItems="center">
        <SkeletonWrapper loading={loading} variant="circular" width={48} height={48} />
        <SkeletonWrapper loading={loading} height={32} width={200} />
      </Stack>

      {/* Path Description */}
      <Stack spacing={SPACING.sm}>
        <SkeletonWrapper loading={loading} height={20} width="95%" />
        <SkeletonWrapper loading={loading} height={20} width="90%" />
      </Stack>

      {/* Path Progress */}
      <Box sx={{ mt: SPACING.md }}>
        <SkeletonWrapper loading={loading} height={8} />
      </Box>

      {/* Path Nodes */}
      <Stack spacing={SPACING.sm} sx={{ mt: SPACING.lg }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Stack key={index} direction="row" spacing={SPACING.md} alignItems="center">
            <SkeletonWrapper loading={loading} variant="circular" width={32} height={32} />
            <SkeletonWrapper loading={loading} height={24} width={`${80 - index * 10}%`} />
          </Stack>
        ))}
      </Stack>
    </Stack>
  </SkeletonWrapper>
);

export const CardSkeleton: FC<ContentSkeletonProps> = ({ loading = true }) => (
  <SkeletonWrapper loading={loading}>
    <Stack spacing={SPACING.sm}>
      {/* Card Header */}
      <SkeletonWrapper loading={loading} height={24} width="80%" />

      {/* Card Content */}
      <Stack spacing={SPACING.xs}>
        <SkeletonWrapper loading={loading} height={16} width="95%" />
        <SkeletonWrapper loading={loading} height={16} width="90%" />
        <SkeletonWrapper loading={loading} height={16} width="60%" />
      </Stack>

      {/* Card Footer */}
      <Box sx={{ mt: SPACING.sm }}>
        <SkeletonWrapper loading={loading} height={32} width={120} />
      </Box>
    </Stack>
  </SkeletonWrapper>
);

export const GridSkeleton: FC<ContentSkeletonProps & { count?: number }> = ({
  loading = true,
  count = 6,
}) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: SPACING.md,
    }}
  >
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index} sx={{ p: SPACING.md }}>
        <CardSkeleton loading={loading} />
      </Box>
    ))}
  </Box>
);

export default {
  LessonSkeleton,
  PathSkeleton,
  CardSkeleton,
  GridSkeleton,
};
