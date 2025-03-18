import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { heartsService } from '../../../services';

import HeartsDisplay from './HeartsDisplay';

import type { FC } from 'react';

interface HeartRequirementProps {
  required: number;
  onContinue: () => void;
  onCancel: () => void;
  lessonTitle?: string;
}

const HeartRequirement: FC<HeartRequirementProps> = ({
  required,
  onContinue,
  onCancel,
  lessonTitle,
}) => {
  const [hasEnoughHearts, setHasEnoughHearts] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Check if user has enough hearts
  useEffect(() => {
    const checkHearts = () => {
      const heartsData = heartsService.getHeartsData();
      setHasEnoughHearts(heartsData.current >= required || heartsData.isPremium);
      setIsPremium(heartsData.isPremium);
    };

    checkHearts();

    // Subscribe to hearts changes
    const heartsListener = () => {
      checkHearts();
    };

    heartsService.subscribe(heartsListener);

    return () => {
      heartsService.unsubscribe(heartsListener);
    };
  }, [required]);

  // Handle continue button click
  const handleContinue = () => {
    if (hasEnoughHearts) {
      // If not premium, use hearts
      if (!isPremium) {
        heartsService.useHearts(required, 'lesson_start');
      }
      onContinue();
    } else {
      setShowDialog(true);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 2,
          boxShadow: 1,
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FavoriteIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="body1">
            {isPremium ? (
              'Premium: No hearts required'
            ) : (
              `This ${lessonTitle ? 'lesson' : 'activity'} requires ${required} ${required === 1 ? 'heart' : 'hearts'}`
            )}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <HeartsDisplay size="small" showRefill />

          <Button
            variant="contained"
            color="primary"
            onClick={handleContinue}
            disabled={!hasEnoughHearts}
          >
            Continue
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Box>
      </Box>

      {/* Not enough hearts dialog */}
      <Dialog open={showDialog} onClose={handleCloseDialog}>
        <DialogTitle>Not Enough Hearts</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You need {required} {required === 1 ? 'heart' : 'hearts'} to start this {lessonTitle ? 'lesson' : 'activity'}.
            </Typography>

            <HeartsDisplay size="large" showRefill vertical />

            <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
              Hearts regenerate over time, or you can refill them instantly with gems.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HeartRequirement;
