import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Switch, 
  FormControlLabel,
  Grid,
  LinearProgress,
  Divider,
  Chip,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SchoolIcon from '@mui/icons-material/School';
import SpeedIcon from '@mui/icons-material/Speed';
import ExploreIcon from '@mui/icons-material/Explore';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import html2canvas from 'html2canvas';
import { AchievementsList } from '../components';
import { useAchievements } from '../hooks';

const AchievementsPage: React.FC = () => {
  const theme = useTheme();
  const { achievements, completedAchievements, refreshAchievements, isLoading } = useAchievements();
  const [showSecret, setShowSecret] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [rarityFilter, setRarityFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    refreshAchievements();
  }, [refreshAchievements]);
  
  // Calculate achievement statistics
  const totalAchievements = achievements.length;
  const totalCompleted = completedAchievements.length;
  const percentComplete = totalAchievements > 0 ? (totalCompleted / totalAchievements) * 100 : 0;
  
  // Calculate category statistics
  const categoryStats = [
    {
      name: 'practice',
      displayName: 'Practice',
      icon: <EmojiEventsIcon />,
      color: theme.palette.primary.main,
      count: completedAchievements.filter(a => a.achievement.category === 'practice').length,
      total: achievements.filter(a => a.achievement.category === 'practice').length
    },
    {
      name: 'streak',
      displayName: 'Streak',
      icon: <LocalFireDepartmentIcon />,
      color: theme.palette.error.main,
      count: completedAchievements.filter(a => a.achievement.category === 'streak').length,
      total: achievements.filter(a => a.achievement.category === 'streak').length
    },
    {
      name: 'mastery',
      displayName: 'Mastery',
      icon: <SchoolIcon />,
      color: theme.palette.secondary.main,
      count: completedAchievements.filter(a => a.achievement.category === 'mastery').length,
      total: achievements.filter(a => a.achievement.category === 'mastery').length
    },
    {
      name: 'speed',
      displayName: 'Speed',
      icon: <SpeedIcon />,
      color: theme.palette.info.main,
      count: completedAchievements.filter(a => a.achievement.category === 'speed').length,
      total: achievements.filter(a => a.achievement.category === 'speed').length
    },
    {
      name: 'exploration',
      displayName: 'Exploration',
      icon: <ExploreIcon />,
      color: theme.palette.success.main,
      count: completedAchievements.filter(a => a.achievement.category === 'exploration').length,
      total: achievements.filter(a => a.achievement.category === 'exploration').length
    }
  ];
  
  // Calculate rarity statistics
  const rarityStats = [
    {
      name: 'legendary',
      displayName: 'Legendary',
      color: theme.palette.error.main,
      count: completedAchievements.filter(a => a.achievement.rarity === 'legendary').length,
      total: achievements.filter(a => a.achievement.rarity === 'legendary').length
    },
    {
      name: 'epic',
      displayName: 'Epic',
      color: theme.palette.secondary.main,
      count: completedAchievements.filter(a => a.achievement.rarity === 'epic').length,
      total: achievements.filter(a => a.achievement.rarity === 'epic').length
    },
    {
      name: 'rare',
      displayName: 'Rare',
      color: theme.palette.info.main,
      count: completedAchievements.filter(a => a.achievement.rarity === 'rare').length,
      total: achievements.filter(a => a.achievement.rarity === 'rare').length
    },
    {
      name: 'uncommon',
      displayName: 'Uncommon',
      color: theme.palette.success.main,
      count: completedAchievements.filter(a => a.achievement.rarity === 'uncommon').length,
      total: achievements.filter(a => a.achievement.rarity === 'uncommon').length
    },
    {
      name: 'common',
      displayName: 'Common',
      color: theme.palette.primary.main,
      count: completedAchievements.filter(a => a.achievement.rarity === 'common').length,
      total: achievements.filter(a => a.achievement.rarity === 'common').length
    }
  ];
  
  // Calculate total XP earned from achievements
  const totalXpEarned = completedAchievements.reduce((sum, a) => sum + a.achievement.xpReward, 0);
  
  const handleCategoryFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newCategory: string | null,
  ) => {
    setCategoryFilter(newCategory);
  };
  
  const handleRarityFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newRarity: string | null,
  ) => {
    setRarityFilter(newRarity);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const clearFilters = () => {
    setCategoryFilter(null);
    setRarityFilter(null);
    setSearchQuery('');
  };
  
  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setShareAnchorEl(event.currentTarget);
  };
  
  const handleShareClose = () => {
    setShareAnchorEl(null);
  };
  
  const handleExportImage = async () => {
    if (achievementsRef.current) {
      try {
        const canvas = await html2canvas(achievementsRef.current, {
          backgroundColor: theme.palette.background.default,
          scale: 2, // Higher quality
        });
        
        const imageUrl = canvas.toDataURL('image/png');
        setShareImage(imageUrl);
        setShowShareDialog(true);
        handleShareClose();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };
  
  const handleDownloadImage = () => {
    if (shareImage) {
      const link = document.createElement('a');
      link.download = 'keyboard-dojo-achievements.png';
      link.href = shareImage;
      link.click();
    }
  };
  
  const handleShareSocial = (platform: string) => {
    let shareUrl = '';
    const text = `I've unlocked ${totalCompleted} out of ${totalAchievements} achievements in Keyboard Dojo! #KeyboardDojo #ShortcutMastery`;
    const url = window.location.href;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    handleShareClose();
  };
  
  const hasActiveFilters = categoryFilter || rarityFilter || searchQuery;
  
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 36, mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h4">Achievements</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShareClick}
              sx={{ mr: 2 }}
            >
              Share
            </Button>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={showSecret} 
                  onChange={(e) => setShowSecret(e.target.checked)} 
                />
              }
              label="Show Secret Achievements"
            />
          </Box>
        </Box>
        
        <Typography variant="body1" paragraph>
          Track your progress and unlock achievements as you master keyboard shortcuts.
          You've unlocked {totalCompleted} out of {totalAchievements} achievements.
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Overall Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalCompleted}/{totalAchievements} ({Math.round(percentComplete)}%)
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={percentComplete} 
            sx={{ height: 10, borderRadius: 5 }} 
          />
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            placeholder="Search achievements by title or description"
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Chip 
            label={`${totalXpEarned} XP Earned`} 
            color="success" 
            sx={{ fontWeight: 'medium' }} 
          />
          
          {hasActiveFilters && (
            <Chip 
              label="Clear Filters" 
              color="default" 
              onDelete={clearFilters}
              deleteIcon={<FilterListIcon />}
            />
          )}
        </Box>
      </Paper>
      
      <div ref={achievementsRef}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Achievements by Category
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <ToggleButtonGroup
                value={categoryFilter}
                exclusive
                onChange={handleCategoryFilterChange}
                aria-label="category filter"
                size="small"
                sx={{ mb: 3, flexWrap: 'wrap' }}
              >
                {categoryStats.map((category) => (
                  <ToggleButton 
                    key={category.name} 
                    value={category.name}
                    sx={{ 
                      borderColor: category.color,
                      color: categoryFilter === category.name ? 'white' : category.color,
                      bgcolor: categoryFilter === category.name ? category.color : 'transparent',
                      '&:hover': {
                        bgcolor: categoryFilter === category.name 
                          ? category.color 
                          : `${category.color}22`
                      },
                      '&.Mui-selected': {
                        bgcolor: category.color,
                        '&:hover': {
                          bgcolor: category.color
                        }
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ mr: 0.5 }}>
                        {category.icon}
                      </Box>
                      {category.displayName}
                    </Box>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              
              {categoryStats.map((category) => (
                <Box key={category.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ color: category.color, mr: 1 }}>
                      {category.icon}
                    </Box>
                    <Typography variant="body2">
                      {category.displayName}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {category.count}/{category.total}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={category.total > 0 ? (category.count / category.total) * 100 : 0} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: category.color
                      }
                    }} 
                  />
                </Box>
              ))}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Achievements by Rarity
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <ToggleButtonGroup
                value={rarityFilter}
                exclusive
                onChange={handleRarityFilterChange}
                aria-label="rarity filter"
                size="small"
                sx={{ mb: 3, flexWrap: 'wrap' }}
              >
                {rarityStats.map((rarity) => (
                  <ToggleButton 
                    key={rarity.name} 
                    value={rarity.name}
                    sx={{ 
                      borderColor: rarity.color,
                      color: rarityFilter === rarity.name ? 'white' : rarity.color,
                      bgcolor: rarityFilter === rarity.name ? rarity.color : 'transparent',
                      '&:hover': {
                        bgcolor: rarityFilter === rarity.name 
                          ? rarity.color 
                          : `${rarity.color}22`
                      },
                      '&.Mui-selected': {
                        bgcolor: rarity.color,
                        '&:hover': {
                          bgcolor: rarity.color
                        }
                      }
                    }}
                  >
                    {rarity.displayName}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              
              {rarityStats.map((rarity) => (
                <Box key={rarity.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: rarity.color,
                        mr: 1
                      }} 
                    />
                    <Typography variant="body2">
                      {rarity.displayName}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {rarity.count}/{rarity.total}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={rarity.total > 0 ? (rarity.count / rarity.total) * 100 : 0} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: rarity.color
                      }
                    }} 
                  />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
        
        <Paper sx={{ p: 3 }}>
          <AchievementsList 
            showSecret={showSecret} 
            categoryFilter={categoryFilter}
            rarityFilter={rarityFilter}
            searchQuery={searchQuery}
          />
        </Paper>
      </div>
      
      {/* Share Menu */}
      <Menu
        anchorEl={shareAnchorEl}
        open={Boolean(shareAnchorEl)}
        onClose={handleShareClose}
      >
        <MenuItem onClick={handleExportImage}>
          <DownloadIcon sx={{ mr: 1 }} /> Export as Image
        </MenuItem>
        <MenuItem onClick={() => handleShareSocial('twitter')}>
          <TwitterIcon sx={{ mr: 1 }} /> Share on Twitter
        </MenuItem>
        <MenuItem onClick={() => handleShareSocial('facebook')}>
          <FacebookIcon sx={{ mr: 1 }} /> Share on Facebook
        </MenuItem>
        <MenuItem onClick={() => handleShareSocial('linkedin')}>
          <LinkedInIcon sx={{ mr: 1 }} /> Share on LinkedIn
        </MenuItem>
      </Menu>
      
      {/* Share Dialog */}
      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Share Your Achievements</DialogTitle>
        <DialogContent>
          {shareImage && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <img 
                src={shareImage} 
                alt="Your Achievements" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  borderRadius: '8px'
                }} 
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Close</Button>
          <Button 
            onClick={handleDownloadImage} 
            variant="contained" 
            startIcon={<DownloadIcon />}
            disabled={!shareImage}
          >
            Download
          </Button>
          <Button 
            onClick={() => handleShareSocial('twitter')} 
            variant="contained" 
            color="info"
            startIcon={<TwitterIcon />}
          >
            Twitter
          </Button>
          <Button 
            onClick={() => handleShareSocial('facebook')} 
            variant="contained" 
            color="primary"
            startIcon={<FacebookIcon />}
          >
            Facebook
          </Button>
          <Button 
            onClick={() => handleShareSocial('linkedin')} 
            variant="contained" 
            color="info"
            startIcon={<LinkedInIcon />}
          >
            LinkedIn
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AchievementsPage; 