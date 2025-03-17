import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  styled, 
  Tabs,
  Tab,
  Grid,
  Button,
  Chip,
  InputBase,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import { LessonCard } from '../ui';
import { ProgressPath, PathNode } from '../ui';

// Define track interface
export interface Track {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
}

// Define lesson interface
export interface LessonItem {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  xp: number;
  isCompleted: boolean;
  isLocked: boolean;
  trackId: string;
  level: number;
  icon?: React.ReactNode;
  tags?: string[];
  parentId?: string;
  childrenIds?: string[];
}

// Define filter options
export interface FilterOptions {
  track?: string;
  level?: number;
  tags?: string[];
  completed?: boolean;
  search?: string;
}

// Define sort options
export type SortOption = 'recommended' | 'newest' | 'level-asc' | 'level-desc' | 'xp-asc' | 'xp-desc';

// Define view mode
export type ViewMode = 'grid' | 'list' | 'path';

// Define props interface
interface LessonSelectionProps {
  tracks: Track[];
  lessons: LessonItem[];
  onLessonSelect: (lessonId: string) => void;
  className?: string;
}

// Styled components
const SelectionContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  overflow: 'hidden',
}));

const SearchBar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(0.5, 2),
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(2),
  },
}));

const ViewControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0, 0.5),
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    height: 3,
  },
}));

const StyledTab = styled(Tab)({
  textTransform: 'none',
  fontWeight: 'bold',
  minWidth: 100,
});

const NoResultsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
}));

// Helper function to convert lessons to path nodes
const lessonsToPathNodes = (lessons: LessonItem[]): PathNode[] => {
  return lessons.map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    status: lesson.isLocked ? 'locked' : lesson.isCompleted ? 'completed' : 'available',
    icon: lesson.icon,
    parentId: lesson.parentId,
    children: lesson.childrenIds || [],
    xp: lesson.xp,
    level: lesson.level,
  }));
};

// LessonSelection component
const LessonSelection: React.FC<LessonSelectionProps> = ({
  tracks,
  lessons,
  onLessonSelect,
  className,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for current track, filters, sort, and view mode
  const [currentTrackId, setCurrentTrackId] = useState<string>(tracks[0]?.id || '');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  
  // Get current track
  const currentTrack = tracks.find(track => track.id === currentTrackId) || tracks[0];
  
  // Filter lessons by track and search query
  const filteredLessons = lessons.filter(lesson => {
    // Filter by track
    if (currentTrackId && lesson.trackId !== currentTrackId) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = lesson.title.toLowerCase().includes(query);
      const matchesDescription = lesson.description.toLowerCase().includes(query);
      const matchesTags = lesson.tags?.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesTitle && !matchesDescription && !matchesTags) {
        return false;
      }
    }
    
    // Filter by completion status
    if (filters.completed !== undefined) {
      if (filters.completed && !lesson.isCompleted) {
        return false;
      }
      if (!filters.completed && lesson.isCompleted) {
        return false;
      }
    }
    
    // Filter by level
    if (filters.level !== undefined && lesson.level !== filters.level) {
      return false;
    }
    
    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      if (!lesson.tags || !filters.tags.some(tag => lesson.tags?.includes(tag))) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort lessons
  const sortedLessons = [...filteredLessons].sort((a, b) => {
    switch (sortOption) {
      case 'level-asc':
        return a.level - b.level;
      case 'level-desc':
        return b.level - a.level;
      case 'xp-asc':
        return a.xp - b.xp;
      case 'xp-desc':
        return b.xp - a.xp;
      case 'newest':
        // In a real app, you would sort by creation date
        return 0;
      case 'recommended':
      default:
        // Sort by locked status, then by level
        if (a.isLocked !== b.isLocked) {
          return a.isLocked ? 1 : -1;
        }
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }
        return a.level - b.level;
    }
  });
  
  // Handle track change
  const handleTrackChange = (_: React.SyntheticEvent, newTrackId: string) => {
    setCurrentTrackId(newTrackId);
  };
  
  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };
  
  // Handle sort option change
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };
  
  // Handle search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  // Handle filter clear
  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };
  
  // Handle lesson click
  const handleLessonClick = (lessonId: string) => {
    onLessonSelect(lessonId);
  };
  
  // Render grid view
  const renderGridView = () => (
    <Grid container spacing={3}>
      {sortedLessons.map(lesson => (
        <Grid item xs={12} sm={6} md={4} key={lesson.id}>
          <LessonCard
            title={lesson.title}
            description={lesson.description}
            duration={lesson.duration}
            xp={lesson.xp}
            isCompleted={lesson.isCompleted}
            isLocked={lesson.isLocked}
            icon={lesson.icon}
            tags={lesson.tags}
            onClick={() => handleLessonClick(lesson.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
  
  // Render list view
  const renderListView = () => (
    <Box>
      {sortedLessons.map(lesson => (
        <Box key={lesson.id} mb={2}>
          <LessonCard
            title={lesson.title}
            description={lesson.description}
            duration={lesson.duration}
            xp={lesson.xp}
            isCompleted={lesson.isCompleted}
            isLocked={lesson.isLocked}
            icon={lesson.icon}
            tags={lesson.tags}
            onClick={() => handleLessonClick(lesson.id)}
          />
        </Box>
      ))}
    </Box>
  );
  
  // Render path view
  const renderPathView = () => (
    <Box mt={2}>
      <ProgressPath
        nodes={lessonsToPathNodes(sortedLessons)}
        layout="tree"
        onNodeClick={handleLessonClick}
      />
    </Box>
  );
  
  // Render no results
  const renderNoResults = () => (
    <NoResultsContainer>
      <Typography variant="h6" gutterBottom>
        No lessons found
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Try adjusting your filters or search query
      </Typography>
      <Button variant="outlined" onClick={handleClearFilters}>
        Clear Filters
      </Button>
    </NoResultsContainer>
  );
  
  return (
    <SelectionContainer className={className}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Available Lessons
      </Typography>
      
      {/* Track tabs */}
      <StyledTabs
        value={currentTrackId}
        onChange={handleTrackChange}
        variant={isMobile ? 'scrollable' : 'standard'}
        scrollButtons={isMobile ? 'auto' : false}
      >
        {tracks.map(track => (
          <StyledTab 
            key={track.id} 
            value={track.id} 
            label={track.name} 
            icon={track.icon || undefined} 
            iconPosition="start"
          />
        ))}
      </StyledTabs>
      
      {/* Controls */}
      <ControlsContainer>
        <SearchBar>
          <SearchIcon color="action" />
          <StyledInputBase
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
          />
          {searchQuery && (
            <IconButton size="small" onClick={() => setSearchQuery('')}>
              ×
            </IconButton>
          )}
        </SearchBar>
        
        <ViewControls>
          <Button
            size="small"
            startIcon={<SortIcon />}
            endIcon={<ArrowDownIcon />}
            variant="outlined"
            onClick={() => {
              // In a real app, this would open a sort menu
              const nextSort: Record<SortOption, SortOption> = {
                'recommended': 'level-asc',
                'level-asc': 'level-desc',
                'level-desc': 'xp-asc',
                'xp-asc': 'xp-desc',
                'xp-desc': 'newest',
                'newest': 'recommended',
              };
              handleSortChange(nextSort[sortOption]);
            }}
          >
            {sortOption.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
          </Button>
          
          <IconButton
            color={viewMode === 'grid' ? 'primary' : 'default'}
            onClick={() => handleViewModeChange('grid')}
          >
            <GridViewIcon />
          </IconButton>
          
          <IconButton
            color={viewMode === 'list' ? 'primary' : 'default'}
            onClick={() => handleViewModeChange('list')}
          >
            <ListViewIcon />
          </IconButton>
          
          <IconButton
            color={viewMode === 'path' ? 'primary' : 'default'}
            onClick={() => handleViewModeChange('path')}
          >
            <FilterIcon />
          </IconButton>
        </ViewControls>
      </ControlsContainer>
      
      {/* Active filters */}
      {(Object.keys(filters).length > 0 || searchQuery) && (
        <Box mb={3} display="flex" flexWrap="wrap" alignItems="center">
          <Typography variant="body2" color="text.secondary" mr={1}>
            Active filters:
          </Typography>
          
          {searchQuery && (
            <FilterChip
              label={`Search: ${searchQuery}`}
              onDelete={() => setSearchQuery('')}
              size="small"
            />
          )}
          
          {filters.completed !== undefined && (
            <FilterChip
              label={`Status: ${filters.completed ? 'Completed' : 'Incomplete'}`}
              onDelete={() => handleFilterChange({ completed: undefined })}
              size="small"
            />
          )}
          
          {filters.level !== undefined && (
            <FilterChip
              label={`Level: ${filters.level}`}
              onDelete={() => handleFilterChange({ level: undefined })}
              size="small"
            />
          )}
          
          {filters.tags && filters.tags.length > 0 && filters.tags.map(tag => (
            <FilterChip
              key={tag}
              label={`Tag: ${tag}`}
              onDelete={() => handleFilterChange({ 
                tags: filters.tags?.filter(t => t !== tag) 
              })}
              size="small"
            />
          ))}
          
          <Button 
            size="small" 
            variant="text" 
            onClick={handleClearFilters}
            sx={{ ml: 1 }}
          >
            Clear All
          </Button>
        </Box>
      )}
      
      {/* Track description */}
      <Box mb={3}>
        <Typography variant="body2" color="text.secondary">
          {currentTrack?.description}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Lessons */}
      {sortedLessons.length > 0 ? (
        <>
          {viewMode === 'grid' && renderGridView()}
          {viewMode === 'list' && renderListView()}
          {viewMode === 'path' && renderPathView()}
        </>
      ) : (
        renderNoResults()
      )}
    </SelectionContainer>
  );
};

export default LessonSelection; 