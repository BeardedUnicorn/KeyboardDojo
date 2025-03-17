# Keyboard Dojo

A comprehensive application for learning and mastering keyboard shortcuts across various applications and platforms.

## Features

- **Interactive Learning**: Practice keyboard shortcuts in an interactive environment
- **Progress Tracking**: Track your learning progress and improvement over time
- **Customized Learning Paths**: Focus on shortcuts for specific applications
- **Multiple Curriculums**: Choose from different learning paths including IDE shortcuts, programming languages, and more
- **Premium Content**: Access advanced lessons and features with a subscription
- **Cross-Platform**: Learn shortcuts for Windows, macOS, and popular applications

## Tech Stack

### Frontend
- React with TypeScript
- Material UI v6 for UI components
- Redux Toolkit for state management
- React Router for navigation

### Backend
- Serverless Framework with AWS Lambda
- DynamoDB for data storage
- API Gateway for RESTful endpoints
- Stripe integration for payments

## Getting Started

### Prerequisites
- Node.js (v16+)
- Yarn package manager
- AWS CLI configured with appropriate credentials

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/keyboard-dojo.git
   cd keyboard-dojo
   ```

2. Install dependencies
   ```bash
   yarn install
   ```

3. Set up environment variables
   ```bash
   # Create .env files in both frontend and backend directories
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

4. Start the development servers
   ```bash
   # Start frontend
   cd frontend
   yarn dev
   
   # In a separate terminal, start backend
   cd backend
   yarn dev
   ```

## Development

### Project Structure

```
/keyboard-dojo
├── /frontend                # React frontend
│   ├── /src
│   │   ├── /api             # API service functions
│   │   ├── /components      # Shared UI components
│   │   ├── /features        # Feature-based modules
│   │   ├── /hooks           # Custom React hooks
│   │   ├── /shared          # Shared utilities and types
│   │   ├── /store           # Redux store configuration
│   │   └── /utils           # Utility functions
│   └── ...
├── /backend                 # Serverless backend
│   ├── /src
│   │   ├── /functions       # Lambda function handlers
│   │   ├── /lib             # Shared libraries
│   │   └── /types           # TypeScript type definitions
│   └── ...
└── ...
```

## Curriculum Structure

Keyboard Dojo now supports multiple curriculum types:

- **IDE Shortcuts**: Learn keyboard shortcuts for popular IDEs like VS Code, IntelliJ, and Cursor
- **Programming Languages**: Master language-specific shortcuts and coding patterns
- **Productivity Tools**: Improve efficiency with shortcuts for common productivity applications

Each curriculum contains:
- Multiple tracks (e.g., Beginner, Intermediate, Advanced)
- Modules within each track
- Lessons within each module
- Various exercise types (code, shortcut practice, quizzes)

## Progression System

The application uses a simple progression system:
- Complete lessons to unlock new content
- Track your progress across different curriculums
- Earn achievements for completing lessons and mastering shortcuts

## Running Tests

```bash
# Run frontend tests
cd frontend
yarn test

# Run backend tests
cd backend
yarn test
```

## Deployment

### Frontend

```bash
cd frontend
yarn build
```

### Backend

```bash
cd backend
yarn deploy
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All the open-source libraries and tools that made this project possible
- The community for feedback and support 