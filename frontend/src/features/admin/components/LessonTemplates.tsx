import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';

interface LessonTemplatesProps {
  onSelectTemplate: (template: string) => void;
}

const LessonTemplates: React.FC<LessonTemplatesProps> = ({ onSelectTemplate }) => {
  const templates = [
    {
      name: 'Basic Shortcuts',
      description: 'A simple template with basic keyboard shortcuts',
      template: {
        title: 'Basic Keyboard Shortcuts',
        description: 'Learn these essential keyboard shortcuts to improve your productivity.',
        shortcuts: [
          {
            key: 'C',
            modifiers: ['Ctrl'],
            description: 'Copy the selected text or item'
          },
          {
            key: 'V',
            modifiers: ['Ctrl'],
            description: 'Paste the copied text or item'
          },
          {
            key: 'Z',
            modifiers: ['Ctrl'],
            description: 'Undo the last action'
          },
          {
            key: 'S',
            modifiers: ['Ctrl'],
            description: 'Save the current document'
          }
        ],
        notes: 'These shortcuts work in most applications across Windows, macOS, and Linux.'
      }
    },
    {
      name: 'Categorized Shortcuts',
      description: 'A template with shortcuts organized by categories',
      template: {
        title: 'VS Code Essential Shortcuts',
        description: 'Master these VS Code shortcuts to code more efficiently.',
        sections: [
          {
            title: 'Editor Navigation',
            shortcuts: [
              {
                key: 'Home',
                description: 'Go to beginning of line'
              },
              {
                key: 'End',
                description: 'Go to end of line'
              },
              {
                key: 'PageUp',
                description: 'Scroll page up'
              },
              {
                key: 'PageDown',
                description: 'Scroll page down'
              }
            ]
          },
          {
            title: 'Code Editing',
            shortcuts: [
              {
                key: 'D',
                modifiers: ['Ctrl'],
                description: 'Add selection to next find match'
              },
              {
                key: '/',
                modifiers: ['Ctrl'],
                description: 'Toggle line comment'
              },
              {
                key: 'F',
                modifiers: ['Ctrl'],
                description: 'Find in file'
              },
              {
                key: 'H',
                modifiers: ['Ctrl'],
                description: 'Replace in file'
              }
            ]
          }
        ],
        notes: 'These shortcuts are specific to Visual Studio Code on Windows. Mac users should use Cmd instead of Ctrl.'
      }
    },
    {
      name: 'Advanced Shortcuts',
      description: 'A comprehensive template with advanced shortcuts',
      template: {
        title: 'Advanced Photoshop Shortcuts',
        description: 'Take your Photoshop skills to the next level with these advanced shortcuts.',
        shortcuts: [
          {
            key: '[',
            description: 'Decrease brush size'
          },
          {
            key: ']',
            description: 'Increase brush size'
          }
        ],
        sections: [
          {
            title: 'Layer Management',
            shortcuts: [
              {
                key: 'J',
                modifiers: ['Ctrl'],
                description: 'Copy layer'
              },
              {
                key: 'E',
                modifiers: ['Ctrl', 'Shift'],
                description: 'Merge visible layers'
              },
              {
                key: 'G',
                modifiers: ['Ctrl'],
                description: 'Group layers'
              }
            ]
          },
          {
            title: 'Selection Tools',
            shortcuts: [
              {
                key: 'D',
                modifiers: ['Ctrl'],
                description: 'Deselect'
              },
              {
                key: 'I',
                modifiers: ['Ctrl', 'Shift'],
                description: 'Invert selection'
              }
            ]
          },
          {
            title: 'View Controls',
            shortcuts: [
              {
                key: '+',
                modifiers: ['Ctrl'],
                description: 'Zoom in'
              },
              {
                key: '-',
                modifiers: ['Ctrl'],
                description: 'Zoom out'
              },
              {
                key: '0',
                modifiers: ['Ctrl'],
                description: 'Fit on screen'
              }
            ]
          }
        ],
        notes: 'These shortcuts are for Photoshop on Windows. Mac users should use Cmd instead of Ctrl.'
      }
    }
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectTemplate = (template: any) => {
    onSelectTemplate(JSON.stringify(template, null, 2));
  };

  return (
    <Paper sx={{ height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        Lesson Templates
      </Typography>
      <List sx={{ p: 0 }}>
        {templates.map((template, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleSelectTemplate(template.template)}>
                <ListItemText 
                  primary={template.name} 
                  secondary={template.description}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
              </ListItemButton>
            </ListItem>
            {index < templates.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Select a template to get started quickly. You can customize it after loading.
        </Typography>
      </Box>
    </Paper>
  );
};

export default LessonTemplates; 