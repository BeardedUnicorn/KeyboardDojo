import React from 'react';

// Mock implementations for gamification components
export const MockLevelProgressBar = (props: any) => (
  <div data-testid="mock-level-progress-bar" style={{ width: '100%', height: '16px', backgroundColor: '#e0e0e0', borderRadius: '8px' }}>
    <div
      style={{
        width: '65%',
        height: '100%',
        backgroundColor: '#3f51b5',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '10px',
      }}
    >
      Level 5 • 65%
    </div>
  </div>
);

export const MockStreakDisplay = ({ compact, showFreeze }: { compact?: boolean, showFreeze?: boolean }) => (
  <div data-testid="mock-streak-display" style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ color: 'red', marginRight: '4px' }}>🔥</span>
    <span style={{ fontWeight: 'bold' }}>7 Days</span>
    {showFreeze && <span style={{ marginLeft: '4px', color: 'blue' }}>❄️</span>}
  </div>
);

export const MockXPDisplay = ({ compact }: { compact?: boolean }) => (
  <div data-testid="mock-xp-display" style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ color: '#ffc107', marginRight: '4px' }}>✨</span>
    <span style={{ fontWeight: 'bold' }}>1250 XP</span>
  </div>
);

export const MockCurrencyDisplay = ({ compact, amount, showLabel }: { compact?: boolean, amount?: number, showLabel?: boolean }) => (
  <div data-testid="mock-currency-display" style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ color: 'green', marginRight: '4px' }}>💰</span>
    <span style={{ fontWeight: 'bold' }}>{amount || 500} {showLabel !== false && 'Coins'}</span>
  </div>
);

export const MockHeartsDisplay = ({ current, max }: { current?: number, max?: number }) => (
  <div data-testid="mock-hearts-display" style={{ display: 'flex', alignItems: 'center' }}>
    {Array.from({ length: max || 5 }, (_, i) => (
      <span key={i} style={{ color: i < (current || 5) ? 'red' : 'gray', marginRight: '2px' }}>
        ❤️
      </span>
    ))}
  </div>
);

export const MockAchievementsList = (props: any) => (
  <div data-testid="mock-achievements-list" style={{ padding: '10px', border: '1px solid #eee', borderRadius: '8px' }}>
    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Achievements</div>
    <div>• Achievement 1</div>
    <div>• Achievement 2</div>
    <div>• Achievement 3</div>
  </div>
);

export const MockInventory = (props: any) => (
  <div data-testid="mock-inventory" style={{ padding: '10px', border: '1px solid #eee', borderRadius: '8px' }}>
    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Inventory</div>
    <div>• Streak Freeze (2)</div>
    <div>• Double XP (1)</div>
  </div>
);

export const MockStore = (props: any) => (
  <div data-testid="mock-store" style={{ padding: '10px', border: '1px solid #eee', borderRadius: '8px' }}>
    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Store</div>
    <div>• Streak Freeze - 100 Coins</div>
    <div>• Double XP - 200 Coins</div>
    <div>• Premium Avatar - 500 Coins</div>
  </div>
);

export const MockHeartRequirement = ({ hearts, required, lessonTitle }: { hearts?: number, required?: number, lessonTitle?: string }) => (
  <div data-testid="mock-heart-requirement" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
    {lessonTitle && <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{lessonTitle}</div>}
    <div style={{ display: 'flex', marginBottom: '8px' }}>
      {Array.from({ length: required || 3 }, (_, i) => (
        <span key={i} style={{ color: i < (hearts || 5) ? 'red' : 'gray', marginRight: '2px' }}>
          ❤️
        </span>
      ))}
    </div>
    <div style={{ fontSize: '12px', color: (hearts || 5) >= (required || 3) ? 'green' : 'red' }}>
      {(hearts || 5) >= (required || 3) ? 'You have enough hearts' : 'Not enough hearts'}
    </div>
  </div>
);

// Export a map of all mocked components
export const mockComponents = {
  LevelProgressBar: MockLevelProgressBar,
  StreakDisplay: MockStreakDisplay, 
  XPDisplay: MockXPDisplay,
  CurrencyDisplay: MockCurrencyDisplay,
  HeartsDisplay: MockHeartsDisplay,
  AchievementsList: MockAchievementsList,
  Inventory: MockInventory,
  Store: MockStore,
  HeartRequirement: MockHeartRequirement,
};

// Export a function to mock a module
export function mockModule(moduleName: string, factory: () => any) {
  // Just return an empty object if window is not defined
  if (typeof window === 'undefined') {
    return {};
  }
  
  // Create or access the mocks object on window
  const win = window as any;
  if (!win.__mocks) {
    win.__mocks = {};
  }
  
  // Store the module
  win.__mocks[moduleName] = typeof factory === 'function' ? factory() : factory;
  return win.__mocks[moduleName];
} 