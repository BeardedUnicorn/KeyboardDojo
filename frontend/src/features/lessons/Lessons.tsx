import { Box, Typography, Card, CardContent, CardActions, Button, Grid } from '@mui/material';

const Lessons = () => {
  // Placeholder lesson data
  const lessons = [
    {
      id: 1,
      title: 'VSCode Basics',
      description: 'Learn the essential keyboard shortcuts for VSCode.',
      difficulty: 'Beginner',
    },
    {
      id: 2,
      title: 'Photoshop Essentials',
      description: 'Master the most common Photoshop keyboard shortcuts.',
      difficulty: 'Intermediate',
    },
    {
      id: 3,
      title: 'Terminal Power User',
      description: 'Become efficient with terminal keyboard shortcuts.',
      difficulty: 'Advanced',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Lessons
      </Typography>
      <Typography variant="body1" paragraph>
        Browse our collection of keyboard shortcut lessons for various applications.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {lessons.map((lesson) => (
          <Grid item xs={12} md={4} key={lesson.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {lesson.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {lesson.description}
                </Typography>
                <Typography variant="caption" color="primary">
                  Difficulty: {lesson.difficulty}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Start Lesson</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Lessons; 