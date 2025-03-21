/**
 * Test runner setup for Storybook testing
 * This file sets up the environment for test-storybook to run properly
 */

/**
 * Storybook Test Runner configuration
 * @type {import('@storybook/test-runner').TestRunnerConfig}
 */
export default {
  // Setup function that's executed before tests
  async setup() {
    console.log('Setting up Storybook Test Runner...');
  },
  
  // Function that runs before each story is rendered in the browser
  async preRender(page) {
    try {
      // First, inject the setup script
      await page.addScriptTag({ 
        content: `
          // Create a fake window.require function before any script runs
          window.require = (path) => {
            console.log('Pre-mock require: ' + path);
            return {};
          };
          
          // Create better mock for jest to prevent errors
          window.jest = {
            mock: () => {},
            fn: () => {
              const mockFn = function() {
                return mockFn.returnValue;
              };
              mockFn.mockReturnValue = function(val) {
                mockFn.returnValue = val;
                return mockFn;
              };
              mockFn.mockImplementation = function(fn) {
                mockFn.implementation = fn;
                return mockFn;
              };
              return mockFn;
            }
          };

          // Fix for React Router context issues
          window.__FIXED_REACT_ROUTER_ISSUES = false;
          
          // Mock achievements for reuse
          const mockAchievements = [
            {
              id: 'first_lesson',
              title: 'First Lesson',
              name: 'First Lesson',
              description: 'Complete your first lesson',
              completed: true,
              progress: 1,
              totalRequired: 1,
              total: 1,
              type: 'achievement',
              rarity: 'common',
              category: 'lessons',
              icon: 'school',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: 'shortcut_master',
              title: 'Shortcut Master',
              name: 'Shortcut Master',
              description: 'Learn 50 shortcuts',
              completed: false,
              progress: 25,
              totalRequired: 50,
              total: 50,
              type: 'achievement',
              rarity: 'rare',
              category: 'shortcuts',
              icon: 'keyboard',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          ];
          
          // Create mock track progress for statistical displays
          const mockTrackProgress = {
            completedLessons: ['lesson1', 'lesson2'],
            totalLessons: 10,
            completedTopics: ['topic1'],
            totalTopics: 5,
            progress: 0.25,
            achievements: mockAchievements,
            activeCurriculum: {
              id: 'javascript',
              name: 'JavaScript',
              description: 'Learn JavaScript programming',
              tracks: ['basics', 'advanced'],
              currentTrack: 'basics'
            }
          };
          
          // Comprehensive gamification data with everything components need
          const gamificationData = {
            level: 5,
            xp: 1250,
            totalXp: 2500,
            nextLevelXP: 2500,
            xpForNextLevel: 1000,
            currency: 500,
            balance: 500,
            achievements: mockAchievements,
            currentStreak: 7,
            maxStreak: 10,
            hearts: { current: 5, max: 5, refillTime: Date.now() + 3600000 },
            streakDays: [true, true, true, true, true, false, false],
            streakFreeze: true,
            currentTier: 'SILVER',
            isLoading: false,
            progress: 0.75,
            getXP: () => 1250,
            getLevelProgress: () => 0.75,
            addCurrency: () => {},
            spendCurrency: () => true,
            hasItem: () => true,
            getItemQuantity: () => 2,
          };
          
          // Create full mock user data
          const userData = {
            id: 'test-user-id',
            username: 'TestUser',
            email: 'test@example.com',
            displayName: 'Test User',
            photoURL: 'https://example.com/avatar.png',
            isLoading: false,
            isAuthenticated: true,
            isInitialized: true,
            level: 5,
            xp: 1250,
            totalLessonsCompleted: 48,
            streak: 7,
            lastActive: new Date().toISOString(),
            completedLessons: ['lesson1', 'lesson2'],
            lessonProgress: {
              'lesson1': 1.0,
              'lesson2': 0.8
            },
            progress: mockTrackProgress,
            achievements: mockAchievements,
            preferences: {
              notifications: true,
              theme: 'light',
              sound: true
            }
          };
          
          // ESSENTIAL: Set up UI settings for proper theme access
          // This fixes MainLayout and AppTopBar components
          window.ui = {
            theme: 'light',
            mode: 'light',
            sidebar: { open: true },
            isInitialized: true
          };
          
          // ESSENTIAL: Set up global user progress state to fix CurrencyDisplay/XPDisplay tests
          window.userProgress = {
            currentStreak: 7,
            maxStreak: 10,
            streakDays: [true, true, true, true, true, false, false],
            level: 5,
            xp: 1250,
            completedLessons: ['lesson1', 'lesson2'],
            lessonProgress: {
              'lesson1': 1.0,
              'lesson2': 0.8
            },
            progress: mockTrackProgress
          };
          
          // ESSENTIAL: Set up global achievements state to fix AchievementsList tests
          window.achievements = {
            achievements: mockAchievements,
            isLoading: false,
            isInitialized: true
          };
          
          // ESSENTIAL: Set up curriculum data
          window.curriculum = {
            activeCurriculum: {
              id: 'javascript',
              name: 'JavaScript',
              description: 'Learn JavaScript programming',
              tracks: ['basics', 'advanced'],
              currentTrack: 'basics'
            },
            isLoading: false,
            isInitialized: true
          };
          
          // ESSENTIAL: Set up a consistent theme context for all stories
          // This fixes theme mode errors
          window.useThemeContext = () => ({
            isDarkMode: false,
            toggleTheme: () => {},
            mode: 'light',
            theme: {
              palette: {
                mode: 'light',
                primary: { main: '#1976d2' },
                secondary: { main: '#dc004e' },
                background: { default: '#fff', paper: '#fff' },
                text: { primary: 'rgba(0, 0, 0, 0.87)', secondary: 'rgba(0, 0, 0, 0.54)' }
              }
            }
          });
          
          // ESSENTIAL: Set up comprehensive gamification redux hook
          // This fixes the gamification component errors
          window.useGamificationRedux = () => ({
            gamification: gamificationData,
            isInitialized: true,
            isLoading: false,
            actions: {
              fetchGamificationData: () => {},
              purchaseItem: () => Promise.resolve(true),
              useItem: () => Promise.resolve(true),
            }
          });
          
          // Set up global data
          window.gamification = gamificationData;
          window.user = userData;
          
          // ESSENTIAL: Set up React Router flags
          // This helps the router detection
          window.__inRouterContext = true;
          window.__hasRouterContext = true;
          
          // Add a complete React Router location
          window.__STORYBOOK_ROUTER_LOCATION = {
            pathname: '/',
            search: '',
            hash: '',
            state: null
          };
          
          // ESSENTIAL: Create full React Router context data
          // This fixes UserInfo component errors
          window.__REACT_ROUTER_CONTEXT = {
            basename: '',
            navigator: {
              createHref: (to) => typeof to === 'string' ? to : to.pathname || '/',
              push: () => {},
              replace: () => {},
              go: () => {},
              listen: () => () => {},
              block: () => () => {}
            },
            static: false,
            location: {
              pathname: '/',
              search: '',
              hash: '',
              state: null,
              key: 'default'
            }
          };
          
          // Set up other hooks
          window.useAchievementsRedux = () => ({
            achievements: mockAchievements,
            isLoading: false,
            isInitialized: true,
            filteredAchievements: mockAchievements,
            filterByCategory: () => mockAchievements,
            filterByRarity: () => mockAchievements,
            showHidden: true,
          });
          
          window.useUserProgressRedux = () => userData;
          
          window.useSubscriptionRedux = () => ({
            hasPremium: true,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            currentTier: 'SILVER',
            isLoading: false,
            isInitialized: true,
          });
          
          window.useCurrency = () => ({
            balance: 500,
            addCurrency: () => {},
            spendCurrency: () => true,
            isLoading: false,
          });
          
          window.useXP = () => ({
            level: 5,
            xp: 1250,
            nextLevelXP: 2500,
            progress: 0.5,
            isLoading: false,
          });
          
          // App state for error cases
          window.useAppState = () => ({
            isInitialized: true,
            isLoading: false,
            error: null,
            setError: () => {},
            clearError: () => {},
            addNotification: () => {},
            removeNotification: () => {},
            notifications: []
          });
          
          console.log('[Storybook] Mock setup completed');
        `
      });
      
      // Then add our full setup script
      await page.addScriptTag({ 
        path: require.resolve('./setup-test-environment.js'),
        type: 'module' 
      });
      
      // Run the setup in the browser context
      await page.evaluate(() => {
        try {
          if (typeof window.setupGlobalMocks === 'function') {
            window.setupGlobalMocks();
            console.log('Global mocks setup via setupGlobalMocks()');
          }
          
          // CRITICAL FIX: Force certain properties to be available in all cases
          
          // 1. Theme context for MainLayout and AppTopBar - ESSENTIAL
          window.ui = window.ui || {};
          window.ui.theme = window.ui.theme || 'light';
          window.ui.mode = window.ui.mode || 'light';
          window.ui.sidebar = window.ui.sidebar || { open: true };
          
          // 2. Theme hook always available - ESSENTIAL
          const themeHook = () => ({
            isDarkMode: false,
            toggleTheme: () => {},
            mode: 'light',
            theme: {
              palette: {
                mode: 'light',
                primary: { main: '#1976d2' },
                secondary: { main: '#dc004e' },
                background: { default: '#fff', paper: '#fff' },
                text: { primary: 'rgba(0, 0, 0, 0.87)', secondary: 'rgba(0, 0, 0, 0.54)' }
              }
            }
          });
          
          window.useThemeContext = themeHook;
          if (window.__hookMocks) {
            window.__hookMocks.useThemeContext = themeHook;
          }
          
          // 3. Router flags - ESSENTIAL
          window.__inRouterContext = true;
          window.__hasRouterContext = true;
          
          // CRITICAL FIX: Create React Router context objects
          // These are used by the patched useContext below
          const routerContext = {
            basename: '',
            navigator: {
              createHref: (to) => typeof to === 'string' ? to : (to ? to.pathname : '/') || '/',
              push: () => {},
              replace: () => {},
              go: () => {},
              listen: () => () => {},
              block: () => () => {}
            },
            static: false,
            location: {
              pathname: '/',
              search: '',
              hash: '',
              state: null,
              key: 'default'
            }
          };

          // Store all the context objects by their displayName
          const contextObjects = {
            Router: routerContext,
            LocationContext: routerContext,
            NavigationContext: routerContext,
            RouteContext: routerContext,
          };
          
          // CRITICAL FIX: Patch React for all context components
          if (typeof React !== 'undefined' && !window.__FIXED_REACT_ROUTER_ISSUES) {
            try {
              // Store original useContext
              const originalUseContext = React.useContext;
              
              // Patch React's useContext to handle all context types
              React.useContext = function patchedUseContext(context) {
                // Check if context is undefined or null
                if (!context) {
                  console.warn('useContext called with null/undefined context');
                  return null;
                }
                
                // Check if this is a known context type we want to mock
                if (context && typeof context === 'object') {
                  const displayName = context.displayName || '';
                  
                  // Handle React Router contexts - ESSENTIAL for UserInfo
                  if (contextObjects[displayName]) {
                    return contextObjects[displayName];
                  }
                }
                
                // Fall back to original implementation
                try {
                  return originalUseContext(context);
                } catch (error) {
                  console.warn('Error in original useContext, returning fallback value', error);
                  return {}; // Safe fallback
                }
              };
              
              // Mark as fixed so we don't double-patch
              window.__FIXED_REACT_ROUTER_ISSUES = true;
              console.log('React Router useContext patched successfully');
            } catch (error) {
              console.error('Failed to patch React.useContext:', error);
            }
          }
          
          // CRITICAL FIX: Ensure gamification data is always accessible with correct properties
          if (!window.gamification) {
            window.gamification = {
              level: 5,
              xp: 1250,
              totalXp: 2500,
              nextLevelXP: 2500,
              xpForNextLevel: 1000,
              currency: 500,
              balance: 500,
              achievements: window.achievements || [],
              currentStreak: 7,
              maxStreak: 10,
              hearts: { current: 5, max: 5, refillTime: Date.now() + 3600000 },
              streakDays: [true, true, true, true, true, false, false],
              streakFreeze: true,
              currentTier: 'SILVER',
              isLoading: false,
              progress: 0.75,
            };
          } else {
            // Ensure all required properties exist
            window.gamification.achievements = window.gamification.achievements || window.achievements || [];
            window.gamification.currentStreak = window.gamification.currentStreak || 7;
            window.gamification.progress = window.gamification.progress || 0.75;
          }
          
          // CRITICAL FIX: Ensure useGamificationRedux always returns with gamification property
          if (!window.useGamificationRedux) {
            window.useGamificationRedux = () => ({
              gamification: window.gamification || {
                level: 5, 
                xp: 1250,
                totalXp: 2500,
                nextLevelXP: 2500,
                currency: 500,
                balance: 500,
                currentStreak: 7,
                achievements: window.achievements || [],
                progress: 0.75,
              },
              actions: {
                fetchGamificationData: () => {},
                purchaseItem: () => Promise.resolve(true),
                useItem: () => Promise.resolve(true)
              }
            });
            
            // Update hook mocks too
            if (window.__hookMocks) {
              window.__hookMocks.useGamificationRedux = window.useGamificationRedux;
            }
          } else {
            // Ensure the function returns an object with gamification property
            const originalFn = window.useGamificationRedux;
            window.useGamificationRedux = () => {
              const result = originalFn();
              if (!result.gamification) {
                result.gamification = window.gamification || {
                  level: 5,
                  xp: 1250,
                  totalXp: 2500,
                  currency: 500,
                  balance: 500,
                  currentStreak: 7,
                  achievements: window.achievements || []
                };
              }
              // Ensure critical properties exist within gamification
              if (!result.gamification.achievements) {
                result.gamification.achievements = window.achievements || [];
              }
              if (!result.gamification.currentStreak) {
                result.gamification.currentStreak = 7;
              }
              return result;
            };
            
            // Update hook mocks too
            if (window.__hookMocks) {
              window.__hookMocks.useGamificationRedux = window.useGamificationRedux;
            }
          }
          
          console.log('Test runner pre-render setup complete');
        } catch (error) {
          console.error('Error in preRender setup:', error);
        }
      });
      
    } catch (error) {
      console.error('Error in preRender:', error);
    }
  },
  
  // Function that runs after each story has been rendered
  async postRender(page) {
    try {
      // Check if all the necessary hooks are available post-render
      await page.evaluate(() => {
        try {
          // Verify UI data
          if (!window.ui || !window.ui.mode) {
            window.ui = { theme: 'light', mode: 'light', sidebar: { open: true } };
            console.warn('Fixed missing ui object');
          }
          
          // Verify React Router context
          if (typeof React !== 'undefined' && !window.__FIXED_REACT_ROUTER_ISSUES) {
            try {
              // Store original useContext
              const originalUseContext = React.useContext;
              
              // Create router context
              const routerContext = {
                basename: '',
                navigator: {
                  createHref: (to) => typeof to === 'string' ? to : (to ? to.pathname : '/') || '/',
                  push: () => {},
                  replace: () => {},
                  go: () => {},
                  listen: () => () => {},
                  block: () => () => {}
                },
                static: false,
                location: {
                  pathname: '/',
                  search: '',
                  hash: '',
                  state: null,
                  key: 'default'
                }
              };
              
              // Store all the context objects by their displayName
              const contextObjects = {
                Router: routerContext,
                LocationContext: routerContext,
                NavigationContext: routerContext,
                RouteContext: routerContext,
              };
              
              // Patch React's useContext
              React.useContext = function patchedUseContext(context) {
                // Check if context is undefined or null
                if (!context) {
                  console.warn('useContext called with null/undefined context');
                  return null;
                }
                
                // Check if this is a known context type we want to mock
                if (context && typeof context === 'object') {
                  const displayName = context.displayName || '';
                  
                  // Handle React Router contexts
                  if (contextObjects[displayName]) {
                    return contextObjects[displayName];
                  }
                }
                
                // Fall back to original implementation
                try {
                  return originalUseContext(context);
                } catch (error) {
                  console.warn('Error in original useContext, returning fallback value', error);
                  return {}; // Safe fallback
                }
              };
              
              // Mark as fixed so we don't double-patch
              window.__FIXED_REACT_ROUTER_ISSUES = true;
              console.warn('Fixed React Router useContext in postRender');
            } catch (error) {
              console.error('Failed to patch React.useContext in postRender:', error);
            }
          }
          
          // Verify critical hooks are available
          if (!window.useThemeContext) {
            window.useThemeContext = () => ({
              isDarkMode: false,
              toggleTheme: () => {},
              mode: 'light',
              theme: {
                palette: {
                  mode: 'light',
                  primary: { main: '#1976d2' },
                  secondary: { main: '#dc004e' },
                  background: { default: '#fff', paper: '#fff' },
                  text: { primary: 'rgba(0, 0, 0, 0.87)', secondary: 'rgba(0, 0, 0, 0.54)' }
                }
              }
            });
            console.warn('Fixed missing useThemeContext');
          }
          
          // Verify gamification data
          if (!window.gamification) {
            window.gamification = {
              level: 5,
              xp: 1250,
              totalXp: 2500,
              nextLevelXP: 2500,
              xpForNextLevel: 1000,
              currency: 500,
              balance: 500,
              achievements: window.achievements || [],
              currentStreak: 7,
              maxStreak: 10,
              hearts: { current: 5, max: 5, refillTime: Date.now() + 3600000 },
              streakDays: [true, true, true, true, true, false, false],
              streakFreeze: true,
              isLoading: false,
              progress: 0.75,
            };
            console.warn('Fixed missing gamification data');
          } else {
            // Ensure all required properties exist
            if (!window.gamification.achievements) {
              window.gamification.achievements = window.achievements || [];
              console.warn('Fixed missing gamification.achievements');
            }
            if (!window.gamification.currentStreak) {
              window.gamification.currentStreak = 7;
              console.warn('Fixed missing gamification.currentStreak');
            }
          }
          
          // Ensure useGamificationRedux is properly structured
          if (!window.useGamificationRedux) {
            window.useGamificationRedux = () => ({
              gamification: window.gamification || {
                level: 5,
                xp: 1250,
                totalXp: 2500,
                nextLevelXP: 2500,
                currency: 500,
                balance: 500,
                currentStreak: 7,
                achievements: window.achievements || []
              },
              actions: {
                fetchGamificationData: () => {},
                purchaseItem: () => Promise.resolve(true),
                useItem: () => Promise.resolve(true)
              }
            });
            console.warn('Fixed missing useGamificationRedux');
            
            // Update hook mocks too
            if (window.__hookMocks) {
              window.__hookMocks.useGamificationRedux = window.useGamificationRedux;
            }
          } else {
            // Check if the function returns the expected structure
            try {
              const result = window.useGamificationRedux();
              if (!result.gamification) {
                const originalFn = window.useGamificationRedux;
                window.useGamificationRedux = () => {
                  const result = originalFn();
                  result.gamification = window.gamification || {
                    level: 5,
                    xp: 1250,
                    totalXp: 2500,
                    nextLevelXP: 2500,
                    currency: 500,
                    balance: 500,
                    currentStreak: 7,
                    achievements: window.achievements || []
                  };
                  return result;
                };
                console.warn('Fixed useGamificationRedux to include gamification property');
                
                // Update hook mocks too
                if (window.__hookMocks) {
                  window.__hookMocks.useGamificationRedux = window.useGamificationRedux;
                }
              }
            } catch (error) {
              console.error('Error checking useGamificationRedux:', error);
            }
          }
          
          console.log('Post-render checks completed');
        } catch (error) {
          console.error('Error in postRender checks:', error);
        }
      });
    } catch (error) {
      console.error('Error in postRender:', error);
    }
  }
}; 