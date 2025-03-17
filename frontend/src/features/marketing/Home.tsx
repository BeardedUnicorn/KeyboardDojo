import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Stack,
  Divider,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SEO from '../../components/SEO';
import DesktopAppBanner from '../../components/DesktopAppBanner';

const Home: React.FC = () => {
  const theme = useTheme();

  // Schema.org structured data for the homepage
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Keyboard Dojo',
    url: import.meta.env.VITE_APP_URL || 'https://keyboarddojo.com',
    description: 'Master keyboard shortcuts for your favorite applications and boost your productivity with interactive lessons and practice sessions.',
    potentialAction: {
      '@type': 'SearchAction',
      target: '{search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  // Statistics data
  const stats = [
    { value: '300+', label: 'Keyboard Shortcuts', icon: KeyboardIcon },
    { value: '10,000+', label: 'Active Users', icon: TrendingUpIcon },
    { value: '40%', label: 'Productivity Boost', icon: SpeedIcon },
    { value: '15+', label: 'Supported Applications', icon: DevicesIcon },
  ];

  // Application categories
  const appCategories = [
    { 
      name: 'Development', 
      icon: CodeIcon, 
      color: theme.palette.primary.main,
      apps: ['VS Code', 'IntelliJ', 'Sublime Text', 'Terminal'] 
    },
    { 
      name: 'Design', 
      icon: BrushIcon, 
      color: theme.palette.secondary.main,
      apps: ['Photoshop', 'Figma', 'Illustrator', 'Sketch'] 
    },
    { 
      name: 'Productivity', 
      icon: BusinessCenterIcon, 
      color: theme.palette.success.main,
      apps: ['Gmail', 'Slack', 'Notion', 'Excel'] 
    },
    { 
      name: 'Creative', 
      icon: DesignServicesIcon, 
      color: theme.palette.warning.main,
      apps: ['Premiere Pro', 'After Effects', 'Blender', 'Audition'] 
    },
  ];

  return (
    <Box>
      <SEO 
        title="Keyboard Dojo - Master Keyboard Shortcuts & Boost Productivity"
        description="Learn and master keyboard shortcuts for your favorite applications. Boost your productivity with interactive lessons and practice sessions."
        canonical="/"
        keywords="keyboard shortcuts, productivity, keyboard dojo, learn shortcuts, vscode shortcuts, photoshop shortcuts"
        schema={homeSchema}
      />
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.dark',
          color: 'white',
          pt: { xs: 12, md: 16 },
          pb: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h1" 
                fontSize={{ xs: '2.5rem', md: '3.5rem', lg: '4rem' }}
                fontWeight="bold"
                mb={2}
                sx={{ 
                  lineHeight: 1.2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Become a Keyboard Shortcut Master
              </Typography>
              
              <Typography 
                variant="h6" 
                color="grey.300" 
                mb={4} 
                maxWidth="600px"
                fontSize={{ xs: '1rem', md: '1.25rem' }}
                lineHeight={1.6}
              >
                Learn, practice, and master keyboard shortcuts for your favorite applications. 
                Cut your workflow time in half and boost your productivity with interactive lessons 
                and real-time feedback.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={4}>
                <Button 
                  variant="contained" 
                  size="large"
                  color="secondary"
                  component={RouterLink}
                  to="/signup"
                  sx={{ 
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 4,
                    fontWeight: 'bold',
                  }}
                >
                  Start Free Training
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  color="inherit"
                  component={RouterLink}
                  to="/features"
                  sx={{ 
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 4,
                  }}
                >
                  Explore Features
                </Button>
              </Stack>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography variant="body2" color="grey.300">
                  No credit card required
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: 'grey.700' }} />
                <AccessTimeIcon fontSize="small" sx={{ color: 'grey.300' }} />
                <Typography variant="body2" color="grey.300">
                  Learn in just 5 minutes a day
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                sx={{ 
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    right: 20,
                    bottom: 20,
                    borderRadius: 4,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    opacity: 0.7,
                    zIndex: 0,
                  }
                }}
              >
                <Box 
                  component="img" 
                  src="/keyboard-illustration.svg" 
                  alt="Keyboard Illustration"
                  sx={{ 
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 3,
                    position: 'relative',
                    zIndex: 1,
                    filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.3))',
                    bgcolor: 'background.paper',
                    p: 2,
                  }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400?text=Keyboard+Dojo';
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mt: -5 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            py: 4,
            px: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-around',
            gap: { xs: 4, md: 2 },
          }}
        >
          {stats.map((stat, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                <stat.icon fontSize="large" />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {stat.value}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Paper>
        
        {/* Desktop App Banner */}
        <Box sx={{ mt: 4 }}>
          <DesktopAppBanner />
        </Box>
      </Container>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" fontWeight="bold" mb={2}>
            Why Choose Keyboard Dojo?
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth={700} mx="auto">
            Our platform is designed to help you build muscle memory through interactive practice sessions and real-time feedback.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {[
            {
              icon: <KeyboardIcon fontSize="large" />,
              title: 'Interactive Learning',
              description: 'Practice shortcuts in a real-time environment with immediate feedback on your progress.'
            },
            {
              icon: <SpeedIcon fontSize="large" />,
              title: 'Track Progress',
              description: 'Monitor your improvement over time with detailed statistics and personalized insights.'
            },
            {
              icon: <DevicesIcon fontSize="large" />,
              title: 'Multi-Platform',
              description: 'Learn shortcuts for Windows, macOS, and popular applications like VS Code, Photoshop, and more.'
            },
            {
              icon: <SchoolIcon fontSize="large" />,
              title: 'Structured Curriculum',
              description: 'Follow a carefully designed learning path from basic to advanced shortcuts.'
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  height: '100%',
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                    borderColor: 'primary.main',
                  }
                }}
              >
                <Box color="primary.main" mb={2}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* App Categories Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h2" fontWeight="bold" mb={2}>
              Master Shortcuts for Any Application
            </Typography>
            <Typography variant="h6" color="text.secondary" maxWidth={700} mx="auto">
              From development tools to design software, we've got you covered with comprehensive shortcut libraries.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {appCategories.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 3, 
                      bgcolor: alpha(category.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: category.color,
                        width: 50,
                        height: 50
                      }}
                    >
                      <category.icon fontSize="medium" />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      {category.name}
                    </Typography>
                  </Box>
                  <CardContent>
                    <Stack spacing={1}>
                      {category.apps.map((app, i) => (
                        <Box 
                          key={i} 
                          sx={{ 
                            p: 1.5, 
                            borderRadius: 1,
                            bgcolor: i % 2 === 0 ? 'grey.50' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <CheckCircleIcon fontSize="small" sx={{ color: category.color }} />
                          <Typography variant="body2">{app}</Typography>
                        </Box>
                      ))}
                    </Stack>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      sx={{ mt: 2 }}
                      component={RouterLink}
                      to="/lessons"
                    >
                      View Lessons
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" fontWeight="bold" mb={2}>
            How Keyboard Dojo Works
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth={700} mx="auto">
            Our simple 3-step process will have you mastering keyboard shortcuts in no time.
          </Typography>
        </Box>
        
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box 
              component="img" 
              src="/app-screenshot.png" 
              alt="Keyboard Dojo App Screenshot"
              sx={{ 
                width: '100%',
                borderRadius: 3,
                boxShadow: 3,
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/600x400?text=App+Screenshot';
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              {[
                {
                  number: 1,
                  title: 'Choose Your Application',
                  description: 'Select from our library of popular applications and tools to start learning their shortcuts.'
                },
                {
                  number: 2,
                  title: 'Practice Interactively',
                  description: 'Follow guided lessons and practice shortcuts with real-time feedback and corrections.'
                },
                {
                  number: 3,
                  title: 'Track Your Progress',
                  description: 'Monitor your improvement over time and earn achievements as you master new shortcuts.'
                }
              ].map((step, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex',
                    gap: 3,
                    alignItems: 'flex-start'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.5rem',
                      flexShrink: 0,
                    }}
                  >
                    {step.number}
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold" mb={1}>
                      {step.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
              
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                component={RouterLink}
                to="/signup"
                sx={{ 
                  mt: 2,
                  alignSelf: 'flex-start',
                  fontWeight: 'bold',
                }}
              >
                Start Learning Now
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
      
      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h2" fontWeight="bold" mb={2}>
              What Our Users Say
            </Typography>
            <Typography variant="h6" color="text.secondary" maxWidth={700} mx="auto">
              Keyboard Dojo has helped professionals across various industries improve their productivity.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {[
              {
                name: 'Alex Johnson',
                role: 'Software Developer',
                company: 'TechCorp',
                avatar: '/avatars/user1.jpg',
                quote: 'After using Keyboard Dojo for just two weeks, my coding speed increased dramatically. The VS Code shortcuts section is fantastic!'
              },
              {
                name: 'Sarah Miller',
                role: 'UX Designer',
                company: 'DesignHub',
                avatar: '/avatars/user2.jpg',
                quote: 'Learning Figma shortcuts through Keyboard Dojo has made my design workflow so much smoother. The interactive practice mode is brilliant.'
              },
              {
                name: 'David Chen',
                role: 'Product Manager',
                company: 'InnovateTech',
                avatar: '/avatars/user3.jpg',
                quote: 'As someone who works across multiple tools daily, Keyboard Dojo has been a game-changer for my productivity. Highly recommended!'
              }
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 3, display: 'flex', gap: 0.5 }}>
                      {[...Array(5)].map((_, i) => (
                        <Box 
                          key={i} 
                          component="span" 
                          sx={{ 
                            color: theme.palette.warning.main,
                            fontSize: '1.5rem',
                          }}
                        >
                          ★
                        </Box>
                      ))}
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 3,
                        flexGrow: 1,
                        fontStyle: 'italic',
                        color: 'text.primary',
                      }}
                    >
                      "{testimonial.quote}"
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        sx={{ width: 56, height: 56 }}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${testimonial.name.replace(' ', '+')}&background=random`;
                        }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role} at {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Call to Action */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="md">
          <Paper
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              color: 'white',
              textAlign: 'center',
              boxShadow: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background Pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <EmojiEventsIcon sx={{ fontSize: 60, mb: 2, color: theme.palette.secondary.light }} />
              <Typography variant="h3" fontWeight="bold" mb={2}>
                Ready to Boost Your Productivity?
              </Typography>
              <Typography variant="h6" color="grey.300" mb={4}>
                Join thousands of professionals who have improved their workflow efficiency with Keyboard Dojo.
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 4,
                    fontWeight: 'bold',
                  }}
                >
                  Start Free Training
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  component={RouterLink}
                  to="/pricing"
                  sx={{
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 4,
                  }}
                >
                  View Pricing
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 