import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Divider,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CurriculumView from '../components/CurriculumView';
import { LevelProgressBar, StreakDisplay } from '../components';
import { ApplicationType } from '../types/curriculum';
import { useUserProgress } from '../contexts/UserProgressContext';

const CurriculumPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { progress, refreshProgress } = useUserProgress();
  
  // Refresh progress when the page loads
  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);
  
  // Handle lesson selection
  const handleLessonSelect = (trackId: ApplicationType, moduleId: string, lessonId: string) => {
    console.log('Lesson selected:', { trackId, moduleId, lessonId });
    
    // Navigate to the lesson page
    navigate(`/lesson/${trackId}/${moduleId}/${lessonId}`);
  };
  
  // Handle challenge selection
  const handleChallengeSelect = (trackId: ApplicationType, challengeId: string) => {
    console.log('Challenge selected:', { trackId, challengeId });
    
    // Navigate to the challenge page
    navigate(`/challenge/${trackId}/${challengeId}`);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Keyboard Shortcut Curriculum
        </Typography>
        <Typography variant="body1">
          Master keyboard shortcuts for your favorite code editors through structured lessons and challenges.
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Main curriculum view */}
          <CurriculumView 
            onSelectLesson={handleLessonSelect}
            onSelectChallenge={handleChallengeSelect}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Sidebar */}
          <Box sx={{ position: 'sticky', top: 24 }}>
            {/* User progress card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Progress
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <LevelProgressBar />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <StreakDisplay />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Completed
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">
                        {progress?.completedLessons.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Lessons
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">
                        {progress?.completedModules.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Modules
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" align="center">
                        0
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Challenges
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
            
            {/* Tips card */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tips
                </Typography>
                
                <Typography variant="body2" paragraph>
                  • Complete lessons in order to unlock more advanced content.
                </Typography>
                
                <Typography variant="body2" paragraph>
                  • Practice regularly to build muscle memory for shortcuts.
                </Typography>
                
                <Typography variant="body2" paragraph>
                  • Try to maintain a daily streak for maximum learning efficiency.
                </Typography>
                
                <Typography variant="body2">
                  • Mastery challenges test your knowledge across multiple shortcuts.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CurriculumPage; 