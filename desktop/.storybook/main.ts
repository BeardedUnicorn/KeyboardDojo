import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'url';
import path from 'path';

// Manually define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: [
    '../public',
    // Serve setupWorkerMock.js as a static file
    { from: './setupWorkerMock.js', to: '/setupWorkerMock.js' },
  ],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      propFilter: (prop) => {
        return prop.parent
          ? !/node_modules\/(?!@mui)/.test(prop.parent.fileName)
          : true;
      },
    },
  },
  // Configure Vite for Storybook
  async viteFinal(config) {
    return {
      ...config,
      envPrefix: ['VITE_', 'TAURI_', 'STORYBOOK_'],
      build: {
        ...config.build,
        sourcemap: true,
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@': path.resolve(__dirname, '../src'),
          '@components': path.resolve(__dirname, '../src/components'),
          '@hooks': path.resolve(__dirname, '../src/hooks'),
          '@utils': path.resolve(__dirname, '../src/utils'),
          '@pages': path.resolve(__dirname, '../src/pages'),
          '@contexts': path.resolve(__dirname, '../src/contexts'),
          '@services': path.resolve(__dirname, '../src/services'),
          '@data': path.resolve(__dirname, '../src/data'),
          '@tests': path.resolve(__dirname, '../src/tests'),
          '@store': path.resolve(__dirname, '../src/store'),
          '@slices': path.resolve(__dirname, '../src/store/slices'),
        },
      },
      assetsInclude: [
        '**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif',
        '**/*.webp', '**/*.ttf', '**/*.woff', '**/*.woff2'
      ],
    };
  },
};

export default config;
