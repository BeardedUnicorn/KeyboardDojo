import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Avatar,
  Card,
  CardContent,
  Divider,
  Link,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import CodeIcon from '@mui/icons-material/Code';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SEO from '../../components/SEO';

const About: React.FC = () => {
  const theme = useTheme();

  // Schema.org structured data for the about page
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Keyboard Dojo',
    description: 'Learn about the Keyboard Dojo team and our mission to help users master keyboard shortcuts and boost productivity.',
    publisher: {
      '@type': 'Organization',
      name: 'Keyboard Dojo',
      logo: {
        '@type': 'ImageObject',
        url: import.meta.env.VITE_APP_URL + '/images/keyboard-dojo-logo.png'
      }
    }
  };

  // Company timeline data
  const timelineEvents = [
    {
      year: '2021',
      title: 'The Idea',
      description: 'Our founder recognized the productivity gap caused by inefficient navigation in software applications.',
      icon: <LightbulbIcon />,
      color: theme.palette.primary.light,
    },
    {
      year: '2022',
      title: 'Research & Development',
      description: 'We conducted extensive research on learning methodologies and built the first prototype of our interactive learning platform.',
      icon: <CodeIcon />,
      color: theme.palette.primary.main,
    },
    {
      year: '2023',
      title: 'Official Launch',
      description: 'Keyboard Dojo was officially launched with support for 5 popular applications and over 100 shortcuts.',
      icon: <StarIcon />,
      color: theme.palette.secondary.main,
    },
    {
      year: '2024',
      title: 'Rapid Growth',
      description: 'Our user base grew to over 10,000 active users, and we expanded our shortcut library to cover 15+ applications.',
      icon: <PeopleIcon />,
      color: theme.palette.success.main,
    },
  ];

  // Company achievements
  const achievements = [
    {
      title: '10,000+ Active Users',
      description: 'Helping professionals across industries work more efficiently',
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: '300+ Keyboard Shortcuts',
      description: 'Comprehensive library covering the most popular applications',
      icon: <CodeIcon />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Product Hunt Featured',
      description: 'Recognized as a top productivity tool by the Product Hunt community',
      icon: <StarIcon />,
      color: theme.palette.warning.main,
    },
    {
      title: '40% Average Productivity Boost',
      description: 'Reported by users after completing our core learning paths',
      icon: <EmojiEventsIcon />,
      color: theme.palette.success.main,
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: 'What makes Keyboard Dojo different from other shortcut guides?',
      answer: 'Unlike static cheat sheets or reference guides, Keyboard Dojo offers interactive practice with real-time feedback. Our platform is designed to build muscle memory through active learning, helping you truly master shortcuts rather than just memorizing them temporarily.'
    },
    {
      question: 'Do I need any special equipment to use Keyboard Dojo?',
      answer: 'No special equipment is needed! Keyboard Dojo works with any standard keyboard on desktop computers. Our platform automatically detects your operating system and shows the appropriate shortcuts for your setup.'
    },
    {
      question: 'How long does it take to see results?',
      answer: 'Most users report noticeable improvements in their workflow efficiency within just 2 weeks of consistent practice (5-10 minutes daily). The key is regular practice to build muscle memory, which is why we\'ve designed our lessons to be quick but effective.'
    },
    {
      question: 'Do you offer shortcuts for my specific application?',
      answer: 'We currently support shortcuts for 15+ popular applications including VS Code, Photoshop, Figma, Excel, Gmail, and more. We\'re constantly expanding our library based on user requests. If you don\'t see your application, let us know and we\'ll prioritize adding it!'
    },
    {
      question: 'Is Keyboard Dojo suitable for beginners?',
      answer: 'Absolutely! We\'ve designed our learning paths to accommodate all skill levels. Beginners can start with basic navigation shortcuts and gradually progress to more advanced combinations. Our step-by-step approach ensures you\'re never overwhelmed.'
    },
  ];

  return (
    <Box>
      <SEO 
        title="About Keyboard Dojo - Our Mission & Team"
        description="Learn about the Keyboard Dojo team and our mission to help users master keyboard shortcuts and boost productivity."
        canonical="/about"
        keywords="keyboard dojo team, about keyboard dojo, keyboard shortcuts mission, productivity training"
        schema={aboutSchema}
      />

      {/* Page Header */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 10,
          mb: 6,
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
        
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight="bold" 
            gutterBottom
            sx={{
              position: 'relative',
              zIndex: 1,
              background: `linear-gradient(45deg, ${theme.palette.common.white}, ${theme.palette.secondary.light})`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            About Keyboard Dojo
          </Typography>
          <Typography 
            variant="h5" 
            maxWidth="800px"
            sx={{
              position: 'relative',
              zIndex: 1,
            }}
          >
            We're on a mission to help professionals save time and work more efficiently by mastering keyboard shortcuts.
          </Typography>
        </Container>
      </Box>

      {/* Our Story */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              Keyboard Dojo was born out of frustration. Our founder, a software developer, noticed how much time he and his colleagues were wasting by navigating applications with a mouse instead of using keyboard shortcuts.
            </Typography>
            <Typography variant="body1" paragraph>
              The lightbulb moment came during a coding session when a senior developer demonstrated how to complete in seconds what had been taking minutes. The difference? Mastery of keyboard shortcuts.
            </Typography>
            <Typography variant="body1" paragraph>
              Founded in 2023, Keyboard Dojo has grown from a simple collection of shortcut guides to an interactive learning platform that helps thousands of professionals work more efficiently every day.
            </Typography>
            <Typography variant="body1" paragraph>
              Our team of developers, designers, and productivity experts is dedicated to creating the most effective learning experience for keyboard shortcuts. We believe that small efficiency gains, when applied consistently, lead to significant productivity improvements over time.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box 
              component="img"
              src="/about-illustration.svg"
              alt="About Keyboard Dojo"
              sx={{ 
                width: '100%',
                borderRadius: 2,
                boxShadow: 3,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -15,
                  left: -15,
                  right: 15,
                  bottom: 15,
                  borderRadius: 4,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  opacity: 0.7,
                  zIndex: -1,
                }
              }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/600x400?text=Our+Story';
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Company Timeline */}
      <Box sx={{ bgcolor: 'grey.50', py: 10, mb: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Our Journey
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            textAlign="center" 
            maxWidth={800} 
            mx="auto"
            mb={8}
          >
            From idea to thriving platform, here's how Keyboard Dojo has evolved.
          </Typography>
          
          <Box sx={{ position: 'relative' }}>
            {/* Vertical line */}
            <Box 
              sx={{ 
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: 4,
                bgcolor: 'grey.200',
                transform: 'translateX(-50%)',
                display: { xs: 'none', md: 'block' },
              }}
            />
            
            {timelineEvents.map((event, index) => (
              <Grid 
                container 
                key={index} 
                spacing={4} 
                sx={{ 
                  mb: 4,
                  flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                  position: 'relative',
                }}
              >
                {/* Year */}
                <Grid item xs={12} md={5} sx={{ textAlign: index % 2 === 0 ? 'right' : 'left' }}>
                  <Typography variant="h5" fontWeight="bold" color={event.color}>
                    {event.year}
                  </Typography>
                </Grid>
                
                {/* Center dot */}
                <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <Box 
                    sx={{ 
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: event.color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                      boxShadow: 2,
                    }}
                  >
                    {event.icon}
                  </Box>
                </Grid>
                
                {/* Content */}
                <Grid item xs={12} md={5}>
                  <Paper 
                    elevation={1}
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      borderLeft: `4px solid ${event.color}`,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.description}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Achievements Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
          Our Achievements
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          textAlign="center" 
          maxWidth={800} 
          mx="auto"
          mb={6}
        >
          Milestones we've reached in our mission to boost productivity worldwide.
        </Typography>
        
        <Grid container spacing={4}>
          {achievements.map((achievement, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Box 
                  sx={{ 
                    p: 3, 
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
                      width: 70,
                      height: 70,
                      borderRadius: '50%',
                      bgcolor: alpha(achievement.color, 0.1),
                      color: achievement.color,
                      mb: 2,
                    }}
                  >
                    {React.cloneElement(achievement.icon, { fontSize: 'large' })}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {achievement.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {achievement.description}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Our Mission */}
      <Box sx={{ bgcolor: 'grey.100', py: 10, mb: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Our Mission
          </Typography>
          <Typography 
            variant="h5" 
            textAlign="center" 
            maxWidth={800} 
            mx="auto"
            mb={6}
          >
            We believe that mastering keyboard shortcuts isn't just about saving time—it's about working smarter.
          </Typography>
          
          <Grid container spacing={4}>
            {[
              {
                title: 'Save Time',
                description: 'Our goal is to help you reclaim hours of your workweek by eliminating unnecessary mouse movements and menu navigation.'
              },
              {
                title: 'Reduce Strain',
                description: 'Keyboard shortcuts can significantly reduce repetitive strain injuries by minimizing mouse usage and optimizing your workflow.'
              },
              {
                title: 'Boost Productivity',
                description: 'We aim to increase your productivity by making shortcut learning engaging, effective, and tailored to your needs.'
              },
              {
                title: 'Empower Users',
                description: 'We want to empower users of all skill levels to become power users of the applications they use every day.'
              }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 2,
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2">
                    {item.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
          Meet Our Team
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          textAlign="center" 
          maxWidth={800} 
          mx="auto"
          mb={6}
        >
          We're a passionate group of developers, designers, and educators committed to helping you work more efficiently.
        </Typography>
        
        <Grid container spacing={4}>
          {[
            {
              name: 'Alex Johnson',
              role: 'Founder & CEO',
              bio: 'Former software engineer with a passion for productivity and user experience. Alex founded Keyboard Dojo after realizing how much time could be saved with proper shortcut knowledge.',
              avatar: '/team/alex.jpg',
              skills: ['Product Strategy', 'UX Design', 'Software Development'],
              social: {
                github: 'https://github.com',
                linkedin: 'https://linkedin.com',
                twitter: 'https://twitter.com',
              }
            },
            {
              name: 'Maya Rodriguez',
              role: 'Chief Product Officer',
              bio: 'Maya has over 10 years of experience in product management and user experience design. She leads our product strategy and ensures our platform delivers real value.',
              avatar: '/team/maya.jpg',
              skills: ['Product Management', 'User Research', 'Design Thinking'],
              social: {
                github: 'https://github.com',
                linkedin: 'https://linkedin.com',
                twitter: 'https://twitter.com',
              }
            },
            {
              name: 'David Chen',
              role: 'Lead Developer',
              bio: 'Full-stack developer with expertise in React and serverless architecture. David is responsible for building and maintaining our interactive learning platform.',
              avatar: '/team/david.jpg',
              skills: ['React', 'TypeScript', 'AWS', 'Node.js'],
              social: {
                github: 'https://github.com',
                linkedin: 'https://linkedin.com',
              }
            },
            {
              name: 'Sarah Miller',
              role: 'Content Strategist',
              bio: 'Sarah curates our shortcut libraries and develops learning paths. With a background in educational technology, she ensures our content is both comprehensive and accessible.',
              avatar: '/team/sarah.jpg',
              skills: ['Content Strategy', 'Educational Design', 'Technical Writing'],
              social: {
                linkedin: 'https://linkedin.com',
                twitter: 'https://twitter.com',
              }
            },
            {
              name: 'Michael Lee',
              role: 'UX/UI Designer',
              bio: 'Michael crafts intuitive and engaging user experiences. His background in cognitive psychology helps him design interfaces that are both beautiful and functional.',
              avatar: '/team/michael.jpg',
              skills: ['UI Design', 'Prototyping', 'User Testing', 'Figma'],
              social: {
                linkedin: 'https://linkedin.com',
                twitter: 'https://twitter.com',
              }
            },
            {
              name: 'Priya Patel',
              role: 'Marketing Director',
              bio: 'Priya leads our marketing efforts with a focus on community building and user acquisition. She\'s passionate about helping people discover tools that improve their workflow.',
              avatar: '/team/priya.jpg',
              skills: ['Digital Marketing', 'Content Strategy', 'Analytics'],
              social: {
                linkedin: 'https://linkedin.com',
                twitter: 'https://twitter.com',
              }
            },
            {
              name: 'James Wilson',
              role: 'Customer Success',
              bio: 'James ensures our users get the most out of Keyboard Dojo. He develops onboarding materials and provides support to help users achieve their productivity goals.',
              avatar: '/team/james.jpg',
              skills: ['Customer Support', 'Technical Writing', 'User Onboarding'],
              social: {
                linkedin: 'https://linkedin.com',
              }
            },
            {
              name: 'Emma Garcia',
              role: 'Software Engineer',
              bio: 'Emma specializes in frontend development and performance optimization. She\'s committed to creating smooth, responsive experiences for our users.',
              avatar: '/team/emma.jpg',
              skills: ['JavaScript', 'React', 'Performance Optimization'],
              social: {
                github: 'https://github.com',
                linkedin: 'https://linkedin.com',
              }
            },
          ].map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  borderRadius: 2,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3,
                  },
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar 
                    src={member.avatar}
                    alt={member.name}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto',
                      mb: 2,
                      border: '4px solid',
                      borderColor: 'primary.main',
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${member.name.replace(' ', '+')}&size=120&background=random`;
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle2" color="primary.main" gutterBottom>
                    {member.role}
                  </Typography>
                  
                  <Box sx={{ my: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                    {member.social.github && (
                      <Link href={member.social.github} target="_blank" color="inherit">
                        <GitHubIcon fontSize="small" />
                      </Link>
                    )}
                    {member.social.linkedin && (
                      <Link href={member.social.linkedin} target="_blank" color="inherit">
                        <LinkedInIcon fontSize="small" />
                      </Link>
                    )}
                    {member.social.twitter && (
                      <Link href={member.social.twitter} target="_blank" color="inherit">
                        <TwitterIcon fontSize="small" />
                      </Link>
                    )}
                  </Box>
                  
                  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" sx={{ mt: 2 }}>
                    {member.skills.map((skill, i) => (
                      <Chip 
                        key={i} 
                        label={skill} 
                        size="small" 
                        sx={{ 
                          m: 0.5,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                        }} 
                      />
                    ))}
                  </Stack>
                </Box>
                
                <Divider />
                
                <CardContent>
                  <Typography variant="body2">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* FAQ Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 10, mb: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            textAlign="center" 
            maxWidth={800} 
            mx="auto"
            mb={6}
          >
            Got questions? We've got answers.
          </Typography>
          
          <Grid container justifyContent="center">
            <Grid item xs={12} md={10} lg={8}>
              {faqs.map((faq, index) => (
                <Accordion 
                  key={index}
                  sx={{ 
                    mb: 2,
                    borderRadius: '8px !important',
                    overflow: 'hidden',
                    '&:before': {
                      display: 'none',
                    },
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.03),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      }
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
          
          <Box textAlign="center" mt={6}>
            <Typography variant="h6" gutterBottom>
              Still have questions?
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              We're here to help! Reach out to our team for personalized assistance.
            </Typography>
            <Link href="/contact" sx={{ textDecoration: 'none' }}>
              <Chip 
                icon={<QuestionAnswerIcon />} 
                label="Contact Us" 
                clickable 
                color="primary" 
                sx={{ 
                  px: 2,
                  py: 2.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }} 
              />
            </Link>
          </Box>
        </Container>
      </Box>
      
      {/* Company Values */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Our Values
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            maxWidth={800} 
            mx="auto"
            mb={6}
            color="grey.300"
          >
            These core principles guide everything we do at Keyboard Dojo.
          </Typography>
          
          <Grid container spacing={4}>
            {[
              {
                title: 'Learning Through Practice',
                description: 'We believe the best way to learn is by doing. Our interactive approach emphasizes practical application over rote memorization.'
              },
              {
                title: 'User-Centered Design',
                description: 'We design our platform with users in mind, constantly improving based on feedback and usage patterns.'
              },
              {
                title: 'Continuous Improvement',
                description: 'We\'re always enhancing our platform, adding new shortcuts, and refining our learning methodologies.'
              },
              {
                title: 'Accessibility for All',
                description: 'We\'re committed to making our platform accessible to everyone, regardless of experience level or background.'
              }
            ].map((value, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {value.title}
                  </Typography>
                  <Typography variant="body1" color="grey.300">
                    {value.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default About; 