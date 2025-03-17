import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createMockStore } from './mocks/mockStore';
import { LessonsState } from '../features/lessons/types';
import { mockInitialLessonsState } from './mocks/mockStore';

interface PreloadedState {
  lessons: LessonsState;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = { lessons: mockInitialLessonsState },
    store = createMockStore(preloadedState),
    ...renderOptions
  }: { preloadedState?: PreloadedState; store?: ReturnType<typeof createMockStore> } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
  };
} 