import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useUserProgressRedux } from '@hooks/useUserProgressRedux';

import { vscodePath } from '../data/paths';

import type { FC } from 'react';

interface CheckpointParams {
  trackId: string;
  nodeId: string;
}

const CheckpointPage: FC = () => {
  const { trackId, nodeId } = useParams<keyof CheckpointParams>() as CheckpointParams;
  const navigate = useNavigate();
  const theme = useTheme();
  const { refreshProgress } = useUserProgressRedux();
  const [loading, setLoading] = useState(true);
  const [checkpoint, setCheckpoint] = useState<any>(null);

  useEffect(() => {
    // Load checkpoint data
    const loadCheckpoint = async () => {
      setLoading(true);
      try {
        // For now, we'll just use the VS Code path data
        // In the future, this would come from a service
        if (trackId === 'vscode') {
          const node = vscodePath.nodes.find((n) => n.id === nodeId);
          if (node) {
            // In a real implementation, we would load the checkpoint content
            // based on the node.content ID
            setCheckpoint({
              id: node.id,
              title: node.title,
              description: node.description,
              shortcuts: [
                // Sample shortcuts for the checkpoint
                {
                  id: 'vscode-shortcut-1',
                  name: 'Open File',
                  description: 'Quickly open a file by name',
                  shortcutWindows: 'Ctrl+P',
                  shortcutMac: 'Cmd+P',
                  category: 'navigation',
                  difficulty: 'beginner',
                  xpValue: 10,
                },
                {
                  id: 'vscode-shortcut-2',
                  name: 'Save File',
                  description: 'Save the current file',
                  shortcutWindows: 'Ctrl+S',
                  shortcutMac: 'Cmd+S',
                  category: 'navigation',
                  difficulty: 'beginner',
                  xpValue: 10,
                },
              ],
              timeLimit: 120, // seconds
              passingScore: 70, // percentage
              xpReward: 50,
            });
          } else {
            console.error('Checkpoint not found:', nodeId);
          }
        } else {
          console.error('Invalid track ID:', trackId);
        }
      } catch (error) {
        console.error('Error loading checkpoint:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCheckpoint();
  }, [trackId, nodeId]);

  const handleBack = () => {
    navigate('/curriculum');
  };

  const handleComplete = () => {
    // In a real implementation, we would mark the checkpoint as completed
    // and update the user's progress
    refreshProgress();
    navigate('/curriculum');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!checkpoint) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Checkpoint Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            The requested checkpoint could not be found.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to Curriculum
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            {checkpoint.title}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back
          </Button>
        </Box>

        <Typography variant="body1" paragraph>
          {checkpoint.description}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Challenge Details:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Time Limit:
              </Typography>
              <Typography variant="body1">
                {Math.floor(checkpoint.timeLimit / 60)}:{(checkpoint.timeLimit % 60).toString().padStart(2, '0')}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Passing Score:
              </Typography>
              <Typography variant="body1">
                {checkpoint.passingScore}%
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                XP Reward:
              </Typography>
              <Typography variant="body1">
                {checkpoint.xpReward} XP
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Checkpoint Challenge */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Mastery Challenge
        </Typography>
        <Typography variant="body1" paragraph>
          Complete the following shortcuts to pass the checkpoint.
        </Typography>

        {/* In a real implementation, we would use the ShortcutChallenge component */}
        <Box sx={{ my: 4, p: 3, bgcolor: theme.palette.background.default, borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom align="center">
            Challenge Placeholder
          </Typography>
          <Typography variant="body1" paragraph align="center">
            This is where the actual challenge would be implemented.
          </Typography>

          {/* Simulated completion button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<CheckCircleIcon />}
              onClick={handleComplete}
            >
              Complete Challenge
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CheckpointPage;
