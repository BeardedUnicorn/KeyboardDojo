import { Box, Typography, Paper, Avatar, Divider, List, ListItem, ListItemText, Button } from '@mui/material';

const Profile = () => {
  // Placeholder user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 1, 2023',
    lessonsCompleted: 0,
    streak: 0,
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Profile
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3, maxWidth: 600, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{ width: 80, height: 80, mr: 3 }}
          >
            {user.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Typography variant="caption">
              Member since: {user.joinDate}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Your Statistics
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText 
              primary="Lessons Completed" 
              secondary={user.lessonsCompleted} 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Current Streak" 
              secondary={`${user.streak} days`} 
            />
          </ListItem>
        </List>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" color="primary">
            Edit Profile
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile; 