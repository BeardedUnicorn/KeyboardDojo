import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SpeedIcon from '@mui/icons-material/Speed';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';

const Home = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Keyboard Dojo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Improve your typing skills with personalized practice sessions
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CodeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Shortcut Challenge</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Master keyboard shortcuts for VS Code, IntelliJ, and Cursor with interactive challenges.
              </Typography>
              <Button
                component={Link}
                to="/shortcuts"
                variant="contained"
                color="secondary"
                fullWidth
              >
                Start Challenge
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Structured Curriculum</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Follow a structured learning path with progressive lessons and challenges.
              </Typography>
              <Button
                component={Link}
                to="/curriculum"
                variant="contained"
                color="primary"
                fullWidth
              >
                View Curriculum
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Progress</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                View your typing statistics and track your improvement over time.
              </Typography>
              <Button
                component={Link}
                to="/progress-dashboard"
                variant="contained"
                color="primary"
                fullWidth
              >
                View Progress
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiEventsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Achievements</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Unlock achievements as you improve your typing skills and complete challenges.
              </Typography>
              <Button
                component={Link}
                to="/achievements"
                variant="contained"
                color="secondary"
                fullWidth
              >
                View Achievements
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 