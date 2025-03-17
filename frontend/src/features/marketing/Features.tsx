import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import QuizIcon from '@mui/icons-material/Quiz';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import SEO from '../../components/SEO';

const Features: React.FC = () => {
  // Schema.org structured data for the features page
  const featuresSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Keyboard Dojo Features',
    description: 'Explore the features of Keyboard Dojo that help you master keyboard shortcuts and boost your productivity.',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Interactive Learning',
        description: 'Practice keyboard shortcuts in an interactive environment with real-time feedback.'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Progress Tracking',
        description: 'Track your learning progress and improvement over time with detailed analytics.'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Customized Learning Paths',
        description: 'Focus on shortcuts for specific applications and create personalized learning paths.'
      }
    ]
  };

  return (
    <Box>
      <SEO 
        title="Keyboard Dojo Features - Interactive Shortcut Learning"
        description="Explore the features of Keyboard Dojo that help you master keyboard shortcuts and boost your productivity with interactive lessons and progress tracking."
        canonical="/features"
        keywords="keyboard shortcuts features, interactive learning, progress tracking, customized learning paths"
        schema={featuresSchema}
      />

      {/* Page Header */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
            Features
          </Typography>
          <Typography variant="h5" maxWidth="800px">
            Discover all the tools and capabilities that make Keyboard Dojo the ultimate platform for mastering keyboard shortcuts.
          </Typography>
        </Container>
      </Box>

      {/* Main Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {[
            {
              title: 'Interactive Learning',
              description: 'Practice shortcuts in a real-time environment with immediate feedback. Our interactive system helps you build muscle memory faster than traditional learning methods.',
              icon: <KeyboardIcon fontSize="large" />,
              details: [
                'Real-time key detection and validation',
                'Visual keyboard display for reference',
                'Step-by-step guidance for complex shortcuts',
                'Adaptive difficulty based on your skill level'
              ]
            },
            {
              title: 'Progress Tracking',
              description: 'Monitor your improvement with detailed statistics. Our progress tracking system shows you exactly where you\'re excelling and where you need more practice.',
              icon: <SpeedIcon fontSize="large" />,
              details: [
                'Detailed performance analytics',
                'Progress visualization across different applications',
                'Speed and accuracy metrics',
                'Streak tracking for consistent practice'
              ]
            },
            {
              title: 'Multi-Platform Support',
              description: 'Learn shortcuts for all your favorite applications. We cover Windows, macOS, and popular applications like VS Code, Photoshop, Figma, and many more.',
              icon: <DevicesIcon fontSize="large" />,
              details: [
                'Cross-platform shortcut libraries',
                'OS-specific shortcut variants',
                'Application-specific shortcut collections',
                'Regular updates for newest software versions'
              ]
            },
            {
              title: 'Structured Learning Paths',
              description: 'Follow carefully designed learning paths from basic to advanced shortcuts. Our curriculum is designed by productivity experts to ensure you learn the most useful shortcuts first.',
              icon: <SchoolIcon fontSize="large" />,
              details: [
                'Beginner to advanced progression',
                'Role-specific learning tracks',
                'Application-focused lessons',
                'Customizable learning sequences'
              ]
            }
          ].map((feature, index) => (
            <Grid item xs={12} key={index}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box color="primary.main" mr={2}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h4" fontWeight="bold">
                        {feature.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" paragraph>
                      {feature.description}
                    </Typography>
                    
                    <List>
                      {feature.details.map((detail, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={detail} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  
                  <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Box 
                      component="img" 
                      src={`/features/feature-${index+1}.svg`}
                      alt={feature.title}
                      sx={{ 
                        width: '100%', 
                        borderRadius: 2,
                        boxShadow: 2,
                      }}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://placehold.co/600x400?text=${feature.title.replace(' ', '+')}`;
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Additional Features */}
      <Box sx={{ bgcolor: 'grey.100', py: 8, mb: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Additional Features
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            textAlign="center" 
            maxWidth={800} 
            mx="auto"
            mb={6}
          >
            Keyboard Dojo goes beyond basic shortcut learning with these powerful features.
          </Typography>
          
          <Grid container spacing={3}>
            {[
              {
                title: 'Challenge Mode',
                description: 'Test your skills with timed challenges designed to improve your speed and recall under pressure.',
                icon: <TrackChangesIcon />
              },
              {
                title: 'Daily Tips',
                description: 'Receive daily shortcut tips based on your most-used applications and learning history.',
                icon: <TipsAndUpdatesIcon />
              },
              {
                title: 'Shortcut Quizzes',
                description: 'Reinforce your knowledge with interactive quizzes that test your recall and understanding.',
                icon: <QuizIcon />
              },
              {
                title: 'Quick Reference',
                description: 'Access a comprehensive cheat sheet of shortcuts for quick reference during your work.',
                icon: <FlashOnIcon />
              },
              {
                title: 'Custom Lists',
                description: 'Create personalized lists of shortcuts you want to focus on or use most frequently.',
                icon: <FormatListNumberedIcon />
              },
              {
                title: 'Achievement System',
                description: 'Earn badges and track achievements as you master new shortcuts and complete challenges.',
                icon: <EmojiEventsIcon />
              }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 2,
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box 
                        sx={{ 
                          mr: 2, 
                          bgcolor: 'primary.main', 
                          color: 'white',
                          borderRadius: '50%',
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Premium Features */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
          Premium Features
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          textAlign="center" 
          maxWidth={800} 
          mx="auto"
          mb={6}
        >
          Upgrade to unlock these powerful productivity-enhancing features.
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'primary.light',
                boxShadow: 3,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 20,
                  right: -30,
                  transform: 'rotate(45deg)',
                  bgcolor: 'primary.main',
                  color: 'white',
                  py: 0.5,
                  px: 4,
                  fontWeight: 'bold',
                  zIndex: 1,
                }}
              >
                PREMIUM
              </Box>
              
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                  Advanced Features
                </Typography>
                
                <List>
                  {[
                    'Complete access to all application shortcut libraries',
                    'Advanced analytics and progress tracking',
                    'Personalized learning recommendations',
                    'Custom practice sessions',
                    'Challenge mode with competitive leaderboards',
                    'Offline mode for practicing anywhere',
                    'Priority support from our team'
                  ].map((feature, index) => (
                    <ListItem key={index} sx={{ py: 1 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature} 
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Divider sx={{ my: 3 }} />
                
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  component={RouterLink}
                  to="/subscription"
                  sx={{ 
                    py: 1.5,
                    fontWeight: 'bold',
                  }}
                >
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Customization Options
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Premium members can tailor their learning experience with these customization features:
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SettingsIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Personalize Your Experience
                    </Typography>
                  </Box>
                  
                  <List>
                    {[
                      'Custom keyboard layouts and visualization',
                      'Application-specific focus modes',
                      'Advanced difficulty settings',
                      'Custom practice intervals',
                      'Daily practice reminders',
                      'Dark/light mode toggles',
                      'Export progress reports'
                    ].map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/pricing"
                  sx={{ 
                    fontWeight: 'medium',
                  }}
                >
                  View Pricing Plans
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      
      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 8 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Ready to Master Keyboard Shortcuts?
          </Typography>
          <Typography 
            variant="h6" 
            maxWidth={800} 
            mx="auto"
            mb={4}
            color="grey.300"
          >
            Join thousands of professionals who have boosted their productivity with Keyboard Dojo.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/auth/register"
              sx={{ 
                py: 1.5,
                px: 4,
                fontWeight: 'bold',
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              component={RouterLink}
              to="/subscription"
              sx={{ 
                py: 1.5,
                px: 4,
              }}
            >
              View Premium Plans
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Features; 