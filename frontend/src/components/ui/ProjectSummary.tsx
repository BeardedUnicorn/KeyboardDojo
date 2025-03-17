import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Button,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  Devices as DevicesIcon,
  Accessibility as AccessibilityIcon,
  Speed as SpeedIcon,
  BugReport as BugIcon
} from '@mui/icons-material';

export interface ProjectSummaryProps {
  showDetails?: boolean;
}

const ProjectSummary: React.FC<ProjectSummaryProps> = ({
  showDetails = true
}) => {
  const [expanded, setExpanded] = useState<string | false>('phase1');
  const theme = useTheme();
  
  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const phases = [
    {
      id: 'phase1',
      title: 'Phase 1: Foundation',
      icon: <PaletteIcon />,
      description: 'Theme updates and basic component styling',
      components: [
        'AppTheme.ts',
        'Button',
        'Card',
        'Section',
        'GradientText'
      ],
      features: [
        'Royal blue/purple primary color scheme',
        'Consistent spacing and typography',
        'Animation durations and easing functions',
        'Updated color palette for feedback',
        'Tech-themed styling variations'
      ]
    },
    {
      id: 'phase2',
      title: 'Phase 2: Core UI Components',
      icon: <CodeIcon />,
      description: 'Key interactive components for the application',
      components: [
        'NinjaMascot',
        'ProgressPath',
        'LessonCard',
        'SimulatedEditor',
        'KeyboardVisualization',
        'Feedback',
        'StatsDisplay'
      ],
      features: [
        'Mascot with configurable states/emotions',
        'Progress visualization with skill tree',
        'Interactive lesson cards',
        'Simulated editor environment',
        'Keyboard visualization for shortcuts',
        'Feedback system for user actions'
      ]
    },
    {
      id: 'phase3',
      title: 'Phase 3: Layout Integration',
      icon: <DevicesIcon />,
      description: 'Complete page layouts and navigation',
      components: [
        'Dashboard',
        'LessonInterface',
        'LessonSelection'
      ],
      features: [
        'Course overview section',
        'User stats display',
        'Daily quote/tip feature',
        'Integrated mascot character',
        'Clean, focused learning layout',
        'Simulated application view'
      ]
    },
    {
      id: 'phase4',
      title: 'Phase 4: Animation and Polish',
      icon: <PaletteIcon />,
      description: 'Visual refinements and animations',
      components: [
        'AnimationProvider',
        'BackgroundPattern',
        'Celebration'
      ],
      features: [
        'Answer animations',
        'Level completion celebrations',
        'Smooth screen transitions',
        'Mascot interactions',
        'UI feedback animations',
        'Consistent styling',
        'Optimized contrast and readability'
      ]
    },
    {
      id: 'phase5',
      title: 'Phase 5: Responsive Design and Accessibility',
      icon: <AccessibilityIcon />,
      description: 'Ensuring the application works for all users',
      components: [
        'ResponsiveContainer',
        'AccessibilityProvider',
        'AccessibilityMenu'
      ],
      features: [
        'Mobile-optimized layouts',
        'Complete keyboard navigation',
        'ARIA attributes',
        'Sufficient color contrast',
        'Text alternatives for visual elements',
        'Screen reader compatibility'
      ]
    },
    {
      id: 'phase6',
      title: 'Phase 6: Testing and Optimization',
      icon: <SpeedIcon />,
      description: 'Performance monitoring and testing tools',
      components: [
        'PerformanceMonitor',
        'VisualRegressionTester'
      ],
      features: [
        'Visual regression testing',
        'Performance metrics tracking',
        'Asset loading optimization',
        'Code splitting',
        'Animation performance',
        'Load time optimization'
      ]
    }
  ];
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CheckCircleIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
          <Typography variant="h4">
            Keyboard Dojo Redesign
          </Typography>
        </Box>
        
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          All phases of the frontend redesign have been successfully completed!
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip 
            icon={<CodeIcon />} 
            label="30+ Components" 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            icon={<PaletteIcon />} 
            label="Modern UI" 
            color="secondary" 
            variant="outlined" 
          />
          <Chip 
            icon={<AccessibilityIcon />} 
            label="Accessible" 
            color="success" 
            variant="outlined" 
          />
          <Chip 
            icon={<DevicesIcon />} 
            label="Responsive" 
            color="info" 
            variant="outlined" 
          />
          <Chip 
            icon={<SpeedIcon />} 
            label="Optimized" 
            color="warning" 
            variant="outlined" 
          />
          <Chip 
            icon={<BugIcon />} 
            label="Tested" 
            color="error" 
            variant="outlined" 
          />
        </Box>
      </Paper>
      
      {showDetails && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Project Phases
          </Typography>
          
          {phases.map((phase) => (
            <Accordion 
              key={phase.id}
              expanded={expanded === phase.id}
              onChange={handleChange(phase.id)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${phase.id}-content`}
                id={`${phase.id}-header`}
                sx={{ 
                  bgcolor: expanded === phase.id ? 'action.selected' : 'background.paper',
                  borderLeft: `4px solid ${theme.palette.primary.main}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2, color: theme.palette.primary.main }}>
                    {phase.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6">{phase.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {phase.description}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Components
                    </Typography>
                    <List dense>
                      {phase.components.map((component) => (
                        <ListItem key={component}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CodeIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={component} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  
                  <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                  <Divider sx={{ display: { xs: 'block', md: 'none' } }} />
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Features
                    </Typography>
                    <List dense>
                      {phase.features.map((feature) => (
                        <ListItem key={feature}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              startIcon={<CheckCircleIcon />}
            >
              View Completed Application
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProjectSummary; 