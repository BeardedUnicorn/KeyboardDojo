import * as Sentry from '@sentry/react';
import { useCallback, useRef } from 'react';

/**
 * Interface for transaction options
 */
interface TransactionOptions {
  name: string;
  op?: string;
  description?: string;
  tags?: Record<string, string>;
}

/**
 * Interface for the transaction object
 */
interface Transaction {
  finish: () => void;
  setTag: (key: string, value: string) => void;
  setData: (key: string, value: any) => void;
  setStatus: (status: 'ok' | 'cancelled' | 'unknown' | 'failed') => void;
}

/**
 * Custom hook for tracking user flows with Sentry transactions
 * This provides a simpler API for tracking important user interactions
 */
export const useSentryTransaction = () => {
  // Use a ref to store the current transaction
  const transactionRef = useRef<Transaction | null>(null);

  /**
   * Start a new transaction
   * @param options Transaction options
   * @returns The transaction object
   */
  const startTransaction = useCallback((options: TransactionOptions): Transaction => {
    try {
      // Add a breadcrumb for the transaction start
      Sentry.addBreadcrumb({
        category: 'transaction',
        message: `Starting transaction: ${options.name}`,
        level: 'info',
        data: {
          op: options.op || 'user-flow',
          description: options.description,
        },
      });

      // Create a timestamp for the transaction start
      const startTime = Date.now();

      // Create a transaction object
      const transaction: Transaction = {
        // Finish the transaction and record the duration
        finish: () => {
          const duration = Date.now() - startTime;
          Sentry.addBreadcrumb({
            category: 'transaction',
            message: `Finished transaction: ${options.name} (${duration}ms)`,
            level: 'info',
            data: {
              duration,
              op: options.op || 'user-flow',
              description: options.description,
            },
          });

          // Clear the transaction ref
          transactionRef.current = null;
        },

        // Set a tag on the transaction
        setTag: (key: string, value: string) => {
          Sentry.addBreadcrumb({
            category: 'transaction',
            message: `Transaction tag: ${options.name}`,
            level: 'info',
            data: {
              tag: key,
              value,
            },
          });
        },

        // Set data on the transaction
        setData: (key: string, value: any) => {
          Sentry.addBreadcrumb({
            category: 'transaction',
            message: `Transaction data: ${options.name}`,
            level: 'info',
            data: {
              [key]: typeof value === 'object' ? JSON.stringify(value) : value,
            },
          });
        },

        // Set the status of the transaction
        setStatus: (status: 'ok' | 'cancelled' | 'unknown' | 'failed') => {
          Sentry.addBreadcrumb({
            category: 'transaction',
            message: `Transaction status: ${options.name} (${status})`,
            level: status === 'failed' ? 'error' : 'info',
            data: {
              status,
            },
          });
        },
      };

      // StorePage the transaction in the ref
      transactionRef.current = transaction;

      // Set initial tags if provided
      if (options.tags) {
        Object.entries(options.tags).forEach(([key, value]) => {
          transaction.setTag(key, value);
        });
      }

      return transaction;
    } catch (error) {
      // Log any errors during transaction creation
      console.error('Error creating transaction:', error);

      // Return a dummy transaction that does nothing
      return {
        finish: () => {},
        setTag: () => {},
        setData: () => {},
        setStatus: () => {},
      };
    }
  }, []);

  /**
   * Get the current transaction
   * @returns The current transaction or null
   */
  const getCurrentTransaction = useCallback((): Transaction | null => {
    return transactionRef.current;
  }, []);

  /**
   * Finish the current transaction
   */
  const finishCurrentTransaction = useCallback(() => {
    if (transactionRef.current) {
      transactionRef.current.finish();
      transactionRef.current = null;
    }
  }, []);

  /**
   * Track a user flow with a transaction
   * This is a convenience method that starts a transaction, calls the callback, and finishes the transaction
   * @param options Transaction options
   * @param callback The callback to execute within the transaction
   * @returns The result of the callback
   */
  const trackUserFlow = useCallback(
    async <T>(options: TransactionOptions, callback: (transaction: Transaction) => Promise<T> | T): Promise<T> => {
      const transaction = startTransaction(options);

      try {
        // Execute the callback
        const result = await callback(transaction);

        // Set the status to ok
        transaction.setStatus('ok');

        // Finish the transaction
        transaction.finish();

        return result;
      } catch (error) {
        // Set the status to failed
        transaction.setStatus('failed');

        // Add the error to the transaction
        transaction.setData('error', error);

        // Finish the transaction
        transaction.finish();

        // Re-throw the error
        throw error;
      }
    },
    [startTransaction],
  );

  return {
    startTransaction,
    getCurrentTransaction,
    finishCurrentTransaction,
    trackUserFlow,
  };
};

export default useSentryTransaction;
