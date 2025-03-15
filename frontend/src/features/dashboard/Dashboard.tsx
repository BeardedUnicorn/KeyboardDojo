import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to Keyboard Dojo! Track your progress and continue your learning journey.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Progress
              </Typography>
              <Typography variant="body2">
                You've completed 0 lessons so far. Keep going!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2">
                No recent activity. Start practicing to see your activity here.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Streak
              </Typography>
              <Typography variant="body2">
                Current streak: 0 days. Practice daily to build your streak!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 