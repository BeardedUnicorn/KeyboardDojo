import { Box, Button, Card, CardContent, Typography } from '@mui/material';

interface TestComponentProps {
  title: string;
}

const TestComponent = ({ title }: TestComponentProps) => {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" paragraph>
            This is a test component using MUI v6 components. It demonstrates that MUI has been correctly
            installed and configured with our custom theme.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary">
              Primary Button
            </Button>
            <Button variant="contained" color="secondary">
              Secondary Button
            </Button>
            <Button variant="outlined" color="primary">
              Outlined Button
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestComponent; 