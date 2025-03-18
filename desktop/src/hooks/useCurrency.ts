import { useState, useEffect } from 'react';

import { currencyService, STORE_ITEMS } from '@/services';

import type { CurrencyChangeEvent } from '@/services';

/**
 * Hook to access currency data
 * @returns Currency data and functions
 */
export const useCurrency = () => {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial currency data
    const initialBalance = currencyService.getBalance();
    setBalance(initialBalance);
    setIsLoading(false);

    // Subscribe to currency changes
    const handleCurrencyChange = (event: CurrencyChangeEvent) => {
      setBalance(event.newBalance);
    };

    currencyService.subscribe(handleCurrencyChange);

    // Clean up subscription
    return () => {
      currencyService.unsubscribe(handleCurrencyChange);
    };
  }, []);

  return {
    balance,
    isLoading,
    addCurrency: (amount: number, source: string, description?: string) => {
      return currencyService.addCurrency(amount, source, description);
    },
    spendCurrency: (amount: number, source: string, description?: string) => {
      return currencyService.spendCurrency(amount, source, description);
    },
    getTransactionHistory: () => {
      return currencyService.getTransactionHistory();
    },
    purchaseItem: (itemId: string) => {
      return currencyService.purchaseItem(itemId);
    },
    hasItem: (itemId: string) => {
      return currencyService.hasItem(itemId);
    },
    getItemQuantity: (itemId: string) => {
      return currencyService.getItemQuantity(itemId);
    },
    getStoreItems: () => {
      return Object.values(STORE_ITEMS);
    },
  };
};
