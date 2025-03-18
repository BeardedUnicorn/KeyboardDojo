/**
 * This file tests that import aliases are working correctly.
 * It imports various modules using the configured aliases.
 */

// Test importing from @components

// import { useAuth } from '@hooks/useAuth';

// Test importing from @services (assuming there's a services file)
// import { someService } from '@services/someService';

// Test importing from @types (assuming there's a types file)
// import { SomeType } from '@types/someType';

// Test importing from @data (assuming there's a data file)
// import { someData } from '@data/someData';

// Test importing from @tests (assuming there's a tests file)
// import { testUtil } from '@tests/testUtil';

// This file doesn't need to do anything, it just tests that the imports work
// Use logger instead of console.log for consistent logging
import { loggerService } from '@/services';

// Log success message
loggerService.info('Import aliases test successful');
