# Keyboard Dojo

A comprehensive application for learning and mastering keyboard shortcuts across various applications and platforms.

## Features

- **Interactive Learning**: Practice keyboard shortcuts in an interactive environment
- **Progress Tracking**: Track your learning progress and improvement over time
- **Customized Learning Paths**: Focus on shortcuts for specific applications
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

### Running Tests

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