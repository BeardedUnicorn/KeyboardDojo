import React, { useState } from 'react';
import type {
  StepIconProps } from '@mui/material';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepButton,
  Button,
  Paper,
  Typography,
  Box,
  Stack,
  StepConnector,
  stepConnectorClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';

import type { Meta, StoryObj } from '@storybook/react';

// Define metadata for the Stepper stories
const meta = {
  title: 'UI/Navigation/Stepper',
  component: Stepper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Steppers convey progress through numbered steps. They provide a wizard-like workflow.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'select', options: ['horizontal', 'vertical'] },
      description: 'The stepper orientation (horizontal or vertical)',
    },
    activeStep: {
      control: { type: 'number', min: 0, max: 5 },
      description: 'The active step index',
    },
    alternativeLabel: {
      control: 'boolean',
      description: 'If set to true, the step label will be placed under the step icon',
    },
    nonLinear: {
      control: 'boolean',
      description: 'If set to true, the Stepper will not enforce a specific order of completion',
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof Stepper>;

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

export const HorizontalStepper: Story = {
  render: () => {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());

    const isStepOptional = (step: number) => step === 1;
    const isStepSkipped = (step: number) => skipped.has(step);

    const handleNext = () => {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
      if (!isStepOptional(activeStep)) {
        throw new Error("You can't skip a step that isn't optional.");
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped((prevSkipped) => {
        const newSkipped = new Set(prevSkipped.values());
        newSkipped.add(activeStep);
        return newSkipped;
      });
    };

    const handleReset = () => {
      setActiveStep(0);
      setSkipped(new Set<number>());
    };

    return (
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: { optional?: React.ReactNode } = {};

            if (isStepOptional(index)) {
              labelProps.optional = <Typography variant="caption">Optional</Typography>;
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Paper square elevation={0} sx={{ p: 3, mt: 2 }}>
              <Typography>All steps completed - you&apos;re finished</Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Reset
              </Button>
            </Paper>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Paper square elevation={0} sx={{ p: 3, mt: 2 }}>
              <Typography>{`Step ${activeStep + 1}: ${steps[activeStep]}`}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </Paper>
          </React.Fragment>
        )}
      </Box>
    );
  },
};

export const VerticalStepper: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Vertical steppers are designed for narrow screen sizes. They are ideal for mobile.',
      },
    },
  },
  render: () => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
      setActiveStep(0);
    };

    return (
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                optional={
                  index === 2 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                {label}
              </StepLabel>
              <StepContent>
                <Typography>{`Content for step ${index + 1}. ${label}`}</Typography>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Box>
    );
  },
};

export const NonLinearStepper: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Non-linear steppers allow users to enter a multi-step flow at any point.',
      },
    },
  },
  render: () => {
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});

    const totalSteps = () => steps.length;
    const completedSteps = () => Object.keys(completed).length;
    const isLastStep = () => activeStep === totalSteps() - 1;
    const allStepsCompleted = () => completedSteps() === totalSteps();

    const handleNext = () => {
      const newActiveStep =
        isLastStep() && !allStepsCompleted()
          ? // Find the first uncompleted step
            steps.findIndex((step, i) => !(i in completed))
          : activeStep + 1;
      setActiveStep(newActiveStep);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step: number) => () => {
      setActiveStep(step);
    };

    const handleComplete = () => {
      const newCompleted = completed;
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      handleNext();
    };

    const handleReset = () => {
      setActiveStep(0);
      setCompleted({});
    };

    return (
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <div>
          {allStepsCompleted() ? (
            <React.Fragment>
              <Paper square elevation={0} sx={{ p: 3, mt: 2 }}>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </Paper>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Paper square elevation={0} sx={{ p: 3, mt: 2 }}>
                <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleNext} sx={{ mr: 1 }}>
                    Next
                  </Button>
                  {activeStep !== steps.length &&
                    (completed[activeStep] ? (
                      <Typography variant="caption" sx={{ display: 'inline-block' }}>
                        Step {activeStep + 1} already completed
                      </Typography>
                    ) : (
                      <Button onClick={handleComplete}>
                        {completedSteps() === totalSteps() - 1
                          ? 'Finish'
                          : 'Complete Step'}
                      </Button>
                    ))}
                </Box>
              </Paper>
            </React.Fragment>
          )}
        </div>
      </Box>
    );
  },
};

export const AlternativeLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Labels can be placed below the step icon by setting the `alternativeLabel` prop.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <Stepper alternativeLabel activeStep={1}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  ),
};

// Custom styled stepper with QontoConnector
export const CustomizedStepper: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Steppers can be customized to match your design system.',
      },
    },
  },
  render: () => {
    const QontoConnector = styled(StepConnector)(({ theme }) => ({
      [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
      },
      [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          borderColor: theme.palette.primary.main,
        },
      },
      [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          borderColor: theme.palette.primary.main,
        },
      },
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
      },
    }));

    const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
      ({ theme, ownerState }) => ({
        color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
        ...(ownerState.active && {
          color: theme.palette.primary.main,
        }),
        '& .QontoStepIcon-completedIcon': {
          color: theme.palette.primary.main,
          zIndex: 1,
          fontSize: 18,
        },
        '& .QontoStepIcon-circle': {
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'currentColor',
        },
      }),
    );

    function QontoStepIcon(props: StepIconProps) {
      const { active, completed, className } = props;

      return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
          {completed ? (
            <Check className="QontoStepIcon-completedIcon" />
          ) : (
            <div className="QontoStepIcon-circle" />
          )}
        </QontoStepIconRoot>
      );
    }

    // ColorlibConnector style (for the second example)
    const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
      [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
      },
      [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          backgroundImage:
            'linear-gradient( 95deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        },
      },
      [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          backgroundImage:
            'linear-gradient( 95deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        },
      },
      [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
          theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
      },
    }));

    const ColorlibStepIconRoot = styled('div')<{
      ownerState: { completed?: boolean; active?: boolean };
    }>(({ theme, ownerState }) => ({
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
      zIndex: 1,
      color: '#fff',
      width: 50,
      height: 50,
      display: 'flex',
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center',
      ...(ownerState.active && {
        backgroundImage:
          'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      }),
      ...(ownerState.completed && {
        backgroundImage:
          'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      }),
    }));

    function ColorlibStepIcon(props: StepIconProps) {
      const { active, completed, className } = props;

      const icons: { [index: string]: React.ReactElement } = {
        1: <SettingsIcon />,
        2: <GroupAddIcon />,
        3: <VideoLabelIcon />,
      };

      return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
          {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
      );
    }

    return (
      <Stack spacing={5} sx={{ width: '100%', maxWidth: 600 }}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Custom Connector and Icons (Qonto Style)
          </Typography>
          <Stepper alternativeLabel activeStep={1} connector={<QontoConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Custom Connector and Icons (Colorlib Style)
          </Typography>
          <Stepper alternativeLabel activeStep={1} connector={<ColorlibConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Stack>
    );
  },
};

export const MobileStepper: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Mobile Steppers are designed for a mobile first experience.',
      },
    },
  },
  render: () => {
    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = steps.length;

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Paper
          square
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: 50,
            pl: 2,
            bgcolor: 'background.default',
          }}
        >
          <Typography>{steps[activeStep]}</Typography>
        </Paper>
        <Box sx={{ height: 100, maxWidth: 400, width: '100%', p: 2 }}>
          <Typography>Step {activeStep + 1} content goes here</Typography>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Button
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2">
              {activeStep + 1} / {maxSteps}
            </Typography>
          </Box>
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
          </Button>
        </Box>
      </Box>
    );
  },
};
