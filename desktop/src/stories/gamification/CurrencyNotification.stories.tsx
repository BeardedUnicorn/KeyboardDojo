import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CurrencyNotification as OriginalCurrencyNotification } from '@/components/gamification/currency/CurrencyNotification';
import { Box, Button, Typography } from '@mui/material';

/**
 * This is a wrapper component that adds controls for triggering currency notifications
 * since the original component subscribes to events directly
 */
const CurrencyNotification = () => {
  const [lastEvent, setLastEvent] = React.useState<{
    change: number;
    source: string;
    newBalance: number;
  } | null>(null);

  // Use a mock currencyService for stories
  React.useEffect(() => {
    // @ts-expect-error - Mock for storybook
    if (typeof window !== 'undefined' && !window.__mocked) {
      // @ts-expect-error - Mock for storybook
      window.__mocked = true;
      // @ts-expect-error - Mock for storybook
      window.currencyService = {
        subscribe: (callback: (event: any) => void) => {
          // @ts-expect-error - Mock for storybook
          window.__currencyCallback = callback;
          return () => {};
        },
        unsubscribe: () => {},
      };
    }
  }, []);

  const triggerNotification = (change: number, source: string) => {
    const newBalance = (lastEvent?.newBalance || 1000) + change;
    const event = {
      change,
      source,
      newBalance,
      timestamp: new Date().toISOString(),
    };

    setLastEvent(event);

    // @ts-expect-error - Mock for storybook
    if (window.__currencyCallback) {
      // @ts-expect-error - Mock for storybook
      window.__currencyCallback(event);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Currency Notification Demo</Typography>
      <Typography variant="body2">
        Current balance: {lastEvent?.newBalance || 1000} gems
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => triggerNotification(100, 'completing a challenge')}
        >
          Earn 100 Gems
        </Button>
        <Button
          variant="contained"
          onClick={() => triggerNotification(25, 'daily login bonus')}
        >
          Earn 25 Gems
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => triggerNotification(-50, 'purchasing an item')}
        >
          Spend 50 Gems
        </Button>
      </Box>

      <OriginalCurrencyNotification />
    </Box>
  );
};

const meta = {
  title: 'Gamification/Currency/CurrencyNotification',
  component: CurrencyNotification,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CurrencyNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};
