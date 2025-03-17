import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  LinearProgress,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SchoolIcon from '@mui/icons-material/School';
import SpeedIcon from '@mui/icons-material/Speed';
import ExploreIcon from '@mui/icons-material/Explore';
import SortIcon from '@mui/icons-material/Sort';
import { useAchievements } from '../hooks';
import { AchievementCategory } from '../services/achievementsService';
import { AchievementBadge } from './';
import { AchievementWithProgress } from '../contexts/AchievementsContext';

// Define sort options
type SortOption = 'default' | 'name' | 'rarity' | 'completion' | 'progress';

interface AchievementsListProps {
  showSecret?: boolean;
  categoryFilter?: string | null;
  rarityFilter?: string | null;
  searchQuery?: string;
}

const AchievementsList: React.FC<AchievementsListProps> = ({ 
  showSecret = false,
  categoryFilter = null,
  rarityFilter = null,
  searchQuery = ''
}) => {
  const theme = useTheme();
  const { achievements, completedAchievements, refreshAchievements, isLoading } = useAchievements();
  const [activeTab, setActiveTab] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  
  // Update active tab when categoryFilter changes
  useEffect(() => {
    if (categoryFilter) {
      setActiveTab(categoryFilter);
    } else {
      setActiveTab('all');
    }
  }, [categoryFilter]);
  
  useEffect(() => {
    refreshAchievements();
  }, [refreshAchievements]);
  
  // Filter achievements based on active tab, rarity filter, search query, and secret setting
  const filteredAchievements = completedAchievements.filter(a => {
    // Filter by category
    const categoryMatch = activeTab === 'all' || a.achievement.category === activeTab;
    
    // Filter by rarity
    const rarityMatch = !rarityFilter || a.achievement.rarity === rarityFilter;
    
    // Filter secret achievements
    const secretMatch = showSecret || !a.achievement.secret;
    
    // Filter by search query
    const searchMatch = !searchQuery || 
      a.achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && rarityMatch && secretMatch && searchMatch;
  });
  
  // Sort achievements based on selected sort option
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.achievement.title.localeCompare(b.achievement.title);
      
      case 'rarity': {
        const rarityOrder: Record<string, number> = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
        const rarityA = a.achievement.rarity || 'common';
        const rarityB = b.achievement.rarity || 'common';
        return rarityOrder[rarityA] - rarityOrder[rarityB];
      }
      
      case 'completion': {
        // Sort by completion status (completed first), then by completion date (newest first)
        if (a.completed && !b.completed) return -1;
        if (!a.completed && b.completed) return 1;
        
        if (a.completed && b.completed && a.completedDate && b.completedDate) {
          return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
        }
        
        return 0;
      }
      
      case 'progress': {
        // Sort by progress percentage (highest first)
        const progressA = a.progress || 0;
        const progressB = b.progress || 0;
        return progressB - progressA;
      }
      
      default:
        // Default sorting: completed first, then by ID
        if (a.completed && !b.completed) return -1;
        if (!a.completed && b.completed) return 1;
        return a.achievement.id.localeCompare(b.achievement.id);
    }
  });
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: string | 'all') => {
    setActiveTab(newValue);
  };
  
  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
    setSortBy(event.target.value as SortOption);
  };
  
  // Calculate overall progress
  const overallProgress = achievements.length > 0
    ? (completedAchievements.length / achievements.length) * 100
    : 0;
  
  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        {!categoryFilter && (
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ flexGrow: 1 }}
          >
            <Tab 
              icon={<EmojiEventsIcon />} 
              label="All" 
              value="all" 
            />
            <Tab 
              icon={<EmojiEventsIcon />} 
              label="Practice" 
              value="practice" 
            />
            <Tab 
              icon={<LocalFireDepartmentIcon />} 
              label="Streaks" 
              value="streak" 
            />
            <Tab 
              icon={<SchoolIcon />} 
              label="Mastery" 
              value="mastery" 
            />
            <Tab 
              icon={<SpeedIcon />} 
              label="Speed" 
              value="speed" 
            />
            <Tab 
              icon={<ExploreIcon />} 
              label="Exploration" 
              value="exploration" 
            />
          </Tabs>
        )}
        
        <FormControl sx={{ minWidth: 150, ml: 2 }}>
          <InputLabel id="sort-achievements-label">Sort By</InputLabel>
          <Select
            labelId="sort-achievements-label"
            id="sort-achievements"
            value={sortBy}
            label="Sort By"
            onChange={handleSortChange}
            size="small"
            startAdornment={<SortIcon sx={{ mr: 1, color: 'action.active' }} />}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="rarity">Rarity</MenuItem>
            <MenuItem value="completion">Completion Date</MenuItem>
            <MenuItem value="progress">Progress</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {categoryFilter || rarityFilter || searchQuery ? 'Filtered Results' : 'Overall Progress'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredAchievements.filter(a => a.completed).length}/{filteredAchievements.length} 
            {categoryFilter || rarityFilter || searchQuery ? ' achievements' : ` (${Math.round(overallProgress)}%)`}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={filteredAchievements.length > 0 
            ? (filteredAchievements.filter(a => a.completed).length / filteredAchievements.length) * 100 
            : 0
          } 
          sx={{ height: 8, borderRadius: 4 }} 
        />
      </Box>
      
      <Grid container spacing={2}>
        {sortedAchievements.map(({ achievement, progress, completed, completedDate }) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            <Card 
              sx={{ 
                height: '100%',
                opacity: completed ? 1 : 0.7,
                borderTop: `3px solid ${completed ? theme.palette.primary.main : theme.palette.grey[300]}`,
              }}
            >
              <CardContent>
                <AchievementBadge 
                  achievement={achievement} 
                  completed={completed}
                  showDescription={true}
                />
                
                <Box sx={{ mb: 1, mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.min(progress || 0, achievement.criteria?.value || 100)}/{achievement.criteria?.value || 100}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={completed ? 100 : ((progress || 0) / (achievement.criteria?.value || 100)) * 100} 
                    sx={{ height: 6, borderRadius: 3 }} 
                  />
                </Box>
                
                {completed && completedDate && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Completed: {new Date(completedDate).toLocaleDateString()}
                  </Typography>
                )}
                
                {achievement.xpReward && achievement.xpReward > 0 && (
                  <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>
                    +{achievement.xpReward} XP
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AchievementsList; 