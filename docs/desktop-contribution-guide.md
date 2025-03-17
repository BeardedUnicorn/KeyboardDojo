# Keyboard Dojo Desktop - Contribution Guide

Thank you for your interest in contributing to the Keyboard Dojo Desktop application! This guide will help you get started with contributing to the project.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Development Environment Setup](#development-environment-setup)
3. [Coding Standards](#coding-standards)
4. [Contribution Workflow](#contribution-workflow)
5. [Testing](#testing)
6. [Building and Packaging](#building-and-packaging)
7. [Documentation](#documentation)
8. [Community Guidelines](#community-guidelines)

## Project Structure

Keyboard Dojo is organized as a monorepo with the following main packages:

- **`/frontend`**: Web application with marketing and admin features
- **`/backend`**: Server-side API and business logic
- **`/desktop`**: Tauri-based desktop application
- **`/shared`**: Common components, hooks, utilities, and types

The desktop application structure:

```
/desktop
├── src/                  # Frontend React code
│   ├── components/       # UI components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # Service modules
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main App component
│   ├── main.tsx          # Entry point
│   └── routes.tsx        # Application routes
├── src-tauri/            # Tauri/Rust backend code
│   ├── src/              # Rust source code
│   │   └── main.rs       # Rust entry point
│   ├── Cargo.toml        # Rust dependencies
│   └── tauri.conf.json   # Tauri configuration
├── public/               # Static assets
├── package.json          # Node dependencies
└── tsconfig.json         # TypeScript configuration
```

## Development Environment Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Yarn](https://yarnpkg.com/) (v1.22 or later)
- [Rust](https://www.rust-lang.org/) (latest stable)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)

### Setup Steps

1. **Clone the repository**

```bash
git clone https://github.com/keyboard-dojo/keyboard-dojo.git
cd keyboard-dojo
```

2. **Install dependencies**

```bash
yarn install
```

3. **Build the shared package**

```bash
yarn workspace @keyboard-dojo/shared build
```

4. **Start the development server**

```bash
yarn workspace @keyboard-dojo/desktop dev
```

This will start the Tauri development server, which includes both the frontend React application and the Rust backend.

## Coding Standards

### TypeScript/JavaScript

- Follow the ESLint and Prettier configurations in the project
- Use TypeScript for all new code
- Prefer functional components with hooks for React components
- Use named exports instead of default exports
- Follow the existing naming conventions:
  - PascalCase for components, interfaces, and types
  - camelCase for variables, functions, and methods
  - kebab-case for file names

### Rust

- Follow the Rust style guide and use `rustfmt` for formatting
- Use meaningful error handling with proper error types
- Document public functions and modules with doc comments
- Follow the existing error handling patterns

### General

- Write self-documenting code with clear variable and function names
- Add comments for complex logic
- Keep functions small and focused on a single responsibility
- Write unit tests for new functionality

## Contribution Workflow

1. **Find or create an issue**

Before starting work, check if there's an existing issue for the change you want to make. If not, create a new issue to discuss the proposed changes.

2. **Fork and branch**

Fork the repository and create a branch for your changes:

```bash
git checkout -b feature/your-feature-name
```

Use prefixes like `feature/`, `bugfix/`, `docs/`, etc., to categorize your branch.

3. **Make your changes**

Implement your changes following the coding standards. Make sure to:
- Write tests for new functionality
- Update documentation as needed
- Keep commits focused and with clear messages

4. **Test your changes**

Run the tests to ensure your changes don't break existing functionality:

```bash
yarn workspace @keyboard-dojo/desktop test
```

5. **Submit a pull request**

Push your changes to your fork and submit a pull request to the main repository. In your PR description:
- Reference the issue your PR addresses
- Describe the changes you've made
- Mention any breaking changes
- Include screenshots for UI changes

6. **Code review**

The maintainers will review your PR and may request changes. Be responsive to feedback and make necessary adjustments.

7. **Merge**

Once approved, a maintainer will merge your PR. Congratulations on your contribution!

## Testing

### Types of Tests

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test interactions between components
- **End-to-End Tests**: Test complete user flows

### Running Tests

```bash
# Run all tests
yarn workspace @keyboard-dojo/desktop test

# Run tests in watch mode
yarn workspace @keyboard-dojo/desktop test:watch

# Run tests with coverage
yarn workspace @keyboard-dojo/desktop test:coverage
```

### Writing Tests

- Place test files next to the code they test with a `.test.ts` or `.test.tsx` extension
- Use descriptive test names that explain the expected behavior
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies and services

## Building and Packaging

### Development Build

```bash
yarn workspace @keyboard-dojo/desktop build
```

### Production Build

```bash
yarn workspace @keyboard-dojo/desktop build:production
```

### Platform-Specific Builds

```bash
# Build for Windows
yarn workspace @keyboard-dojo/desktop build:windows

# Build for macOS
yarn workspace @keyboard-dojo/desktop build:macos

# Build for Linux
yarn workspace @keyboard-dojo/desktop build:linux
```

### Creating Installers

```bash
yarn workspace @keyboard-dojo/desktop package
```

This will create platform-specific installers in the `desktop/src-tauri/target/release/bundle` directory.

## Documentation

### Code Documentation

- Document public APIs, components, and functions
- Use JSDoc comments for TypeScript/JavaScript
- Use doc comments for Rust
- Keep documentation up-to-date with code changes

### User Documentation

- Update the user guide when adding new features
- Create clear, concise explanations with examples
- Include screenshots for UI changes

### Architecture Documentation

- Update architecture diagrams when making significant changes
- Document design decisions and trade-offs
- Keep the component inventory up-to-date

## Community Guidelines

### Communication

- Be respectful and inclusive in all communications
- Use clear, concise language
- Ask questions if something is unclear
- Help others when you can

### Issue Reporting

When reporting issues, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment information (OS, browser, app version)

### Feature Requests

When requesting features, include:
- Clear description of the feature
- Use cases and benefits
- Any relevant examples or mockups

### Code of Conduct

All contributors are expected to adhere to the project's Code of Conduct. Please read it before participating.

## Getting Help

If you need help with contributing:
- Check the documentation
- Look for similar issues in the issue tracker
- Ask questions in the discussions section
- Reach out to the maintainers

Thank you for contributing to Keyboard Dojo Desktop! 