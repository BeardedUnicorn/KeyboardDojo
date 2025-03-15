# Keyboard Dojo - Implementation Checklist

I've created a comprehensive checklist for each milestone, including detailed database schema designs where tables are mentioned. This will help you track progress and ensure all components are properly implemented.

The folders have already been created for the backend and frontend. The frontend only has the bare vite react typescript setup. Everything else will need to be implemeneted.


## Milestone 1: Project Setup and Monorepo Configuration

### Frontend Setup
- [x] Initialize Yarn monorepo with workspaces configuration
- [x] Create frontend package in the monorepo
- [x] Set up Vite with React and TypeScript
- [x] Install and configure MUI v6
- [x] Set up Redux Toolkit (create store and sample slice)
- [x] Create basic App component and placeholder pages
- [x] Verify the app runs locally and builds without errors
- [x] Set up Git repository

### Backend Setup
- [x] Create backend package in the monorepo
- [x] Initialize Serverless Framework
- [x] Create `serverless.yml` with AWS region, runtime, and service name
- [x] Implement health check Lambda function
- [x] Define API Gateway endpoint for health check
- [x] Configure CloudFront and S3 deployment:
  - [x] Define S3 bucket for static files (private)
  - [x] Create CloudFront distribution with proper cache settings
  - [x] Configure default root object to `index.html`
  - [x] Set up routing for client-side paths
  - [x] Configure permissions with Origin Access Identity
- [x] Set up automated frontend build process with Serverless

### Database Schema Design
- [x] Define Users table in `serverless.yml`:
  ```yaml
  Resources:
    UsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:service}-${self:provider.stage}-users
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: userId
            AttributeType: S
        KeySchema:
          - AttributeName: userId
            KeyType: HASH
  ```

- [x] Define Lessons table in `serverless.yml`:
  ```yaml
  Resources:
    LessonsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:service}-${self:provider.stage}-lessons
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: lessonId
            AttributeType: S
        KeySchema:
          - AttributeName: lessonId
            KeyType: HASH
  ```

- [x] Define Progress table in `serverless.yml`:
  ```yaml
  Resources:
    ProgressTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:service}-${self:provider.stage}-progress
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: userId
            AttributeType: S
        KeySchema:
          - AttributeName: userId
            KeyType: HASH
  ```

### Testing and Deployment
- [ ] Write basic unit tests for placeholder React components
- [ ] Write unit tests for health check Lambda
- [ ] Configure IAM roles for Lambda functions
- [ ] Set up environment variables
- [ ] Deploy stack using Serverless
- [ ] Verify CloudFront URL serves the React app
- [ ] Verify API Gateway health check endpoint is working
- [ ] Confirm DynamoDB tables are created correctly

## Milestone 2: User Authentication (OAuth & Email Sign-Up)

### Frontend Authentication
- [x] Create login/register page with MUI components
- [x] Implement OAuth client flow for Google
- [x] Implement OAuth client flow for Apple
- [x] Implement OAuth client flow for GitHub
- [x] Build email/password sign-up form with validations
- [x] Create Redux auth slice for authentication state
- [x] Implement session persistence (cookies or local storage)
- [x] Add auth state checks to protected routes

### Backend Authentication
- [x] Expand Users table schema:
  ```yaml
  Resources:
    UsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:service}-${self:provider.stage}-users
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: userId
            AttributeType: S
          - AttributeName: email
            AttributeType: S
        KeySchema:
          - AttributeName: userId
            KeyType: HASH
        GlobalSecondaryIndexes:
          - IndexName: EmailIndex
            KeySchema:
              - AttributeName: email
                KeyType: HASH
            Projection:
              ProjectionType: ALL
        # Schema attributes (not part of CloudFormation but conceptual):
        # - userId: String (primary key)
        # - email: String (GSI key)
        # - name: String
        # - authProvider: String (google, apple, github, email)
        # - providerId: String (ID from provider if OAuth)
        # - hashedPassword: String (for email auth)
        # - createdAt: Number (timestamp)
        # - isAdmin: Boolean
        # - isPremium: Boolean (for future)
  ```

- [x] Register application with OAuth providers
- [x] Implement OAuth callback Lambda functions for each provider
- [x] Create JWT token generation function
- [x] Implement email registration Lambda
- [x] Implement password hashing function
- [x] Create email login Lambda
- [x] Set up token verification for protected routes
- [x] Configure authorizer in serverless.yml

### Testing
- [ ] Write unit tests for auth UI components
- [ ] Test form validations
- [ ] Write tests for OAuth handler Lambdas (mock provider responses)
- [ ] Test email sign-up and login Lambdas
- [ ] Validate password hashing and verification
- [ ] Test authorization flows and protected routes

## Milestone 3: Core Learning Module and Progress Tracking

### Frontend Learning Interface
- [ ] Design and implement interactive keyboard shortcut interface
- [ ] Create keyboard event handlers for detecting key combinations
- [ ] Implement real-time feedback system for user attempts
- [ ] Build lesson navigation (next/previous, progress bar)
- [ ] Add API integration to fetch lessons from backend
- [ ] Implement progress tracking after lesson completion
- [ ] Create user dashboard for displaying overall progress

### Backend Data Models & API
- [ ] Finalize Lessons table schema:
  ```yaml
  Resources:
    LessonsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:service}-${self:provider.stage}-lessons
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: lessonId
            AttributeType: S
          - AttributeName: category
            AttributeType: S
        KeySchema:
          - AttributeName: lessonId
            KeyType: HASH
        GlobalSecondaryIndexes:
          - IndexName: CategoryIndex
            KeySchema:
              - AttributeName: category
                KeyType: HASH
            Projection:
              ProjectionType: ALL
        # Schema attributes (conceptual):
        # - lessonId: String (primary key)
        # - title: String
        # - description: String
        # - content: Map (steps, instructions, expected keys)
        # - category: String (GSI key - e.g., "vscode", "photoshop")
        # - difficulty: String (beginner, intermediate, advanced)
        # - order: Number (sequence in curriculum)
        # - isPremium: Boolean (for future Stripe integration)
  ```

- [ ] Finalize Progress table schema:
  ```yaml
  Resources:
    ProgressTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:service}-${self:provider.stage}-progress
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: userId
            AttributeType: S
        KeySchema:
          - AttributeName: userId
            KeyType: HASH
        # Schema attributes (conceptual):
        # - userId: String (primary key)
        # - completedLessons: Map (lessonId -> completion details)
        #   - Each map entry has:
        #     - completedAt: Number (timestamp)
        #     - score: Number (optional performance metric)
        #     - attempts: Number (how many tries)
        # - totalLessonsCompleted: Number
        # - streakDays: Number (consecutive days practiced)
        # - lastActivityDate: Number (timestamp)
  ```

- [ ] Implement GET /lessons API endpoint
- [ ] Create GET /lessons/{id} API endpoint
- [ ] Build GET /progress endpoint for user progress
- [ ] Implement POST /progress endpoint to update progress
- [ ] Add authorization checks to progress endpoints
- [ ] Create seed data script for initial lessons

### Testing
- [ ] Write tests for lesson interface components
- [ ] Test keyboard event handling
- [ ] Test lesson progression and completion
- [ ] Write unit tests for lesson API endpoints
- [ ] Test progress tracking API endpoints
- [ ] Validate proper progress updates in the database
- [ ] Test authorization on progress endpoints

## Milestone 4: Marketing Website Integration

### Marketing Pages
- [ ] Design and build landing page with clear value proposition
- [ ] Create About Us/Team page
- [ ] Build Features page highlighting app capabilities
- [ ] Add Contact page with support information
- [ ] Create placeholder Pricing page for future premium features
- [ ] Implement React Router for navigation between pages
- [ ] Create navigation menu/header with links to all pages
- [ ] Ensure proper auth-state-aware navigation (show login/logout)

### SEO & Integration
- [ ] Add metadata with React Helmet for each marketing page
- [ ] Include proper page titles and descriptions
- [ ] Add Open Graph tags for social sharing
- [ ] Test responsive design on various screen sizes
- [ ] Verify cross-browser compatibility
- [ ] Check CloudFront configuration for proper SPA routing
- [ ] Optionally integrate analytics service

### Testing
- [ ] Write tests for any interactive components on marketing pages
- [ ] Create snapshot tests for static page layouts
- [ ] Test navigation between marketing and app pages
- [ ] Verify unauthenticated access to marketing pages
- [ ] Test authenticated user view of marketing pages

## Milestone 5: Admin Dashboard for Content & User Management

### Admin Frontend
- [ ] Create admin route with access control
- [ ] Implement admin-check in router or higher-order component
- [ ] Build admin navigation sidebar or menu
- [ ] Create Lessons Management page:
  - [ ] Table/list view of all lessons
  - [ ] Form for adding new lessons
  - [ ] Edit interface for existing lessons
  - [ ] Delete functionality with confirmation
- [ ] Build User Progress page:
  - [ ] Table of all users with key metrics
  - [ ] Detailed view of individual user progress
  - [ ] Admin role management interface
- [ ] Add Content Management page (optional)
- [ ] Implement Redux data handling for admin functions

### Admin Backend
- [ ] Update Users table to include isAdmin flag
- [ ] Create admin authorization middleware
- [ ] Implement GET /admin/lessons endpoint
- [ ] Build POST /admin/lessons endpoint for creating lessons
- [ ] Create PUT /admin/lessons/{id} endpoint for updates
- [ ] Implement DELETE /admin/lessons/{id} endpoint
- [ ] Add GET /admin/users endpoint
- [ ] Create GET /admin/users/{id}/progress endpoint
- [ ] Implement PUT /admin/users/{id} endpoint (optional)

### Testing
- [ ] Test admin authorization checks
- [ ] Write unit tests for admin API endpoints
- [ ] Test frontend admin components
- [ ] Validate CRUD operations on lessons
- [ ] Test user management functions
- [ ] Verify non-admin users cannot access admin features

## Milestone 6: Future Enhancement – Stripe Payments Integration

### Premium Feature UI
- [ ] Mark premium features/lessons in the UI
- [ ] Create pricing page with subscription options
- [ ] Implement Stripe Checkout integration on frontend
- [ ] Add "Upgrade" buttons on appropriate pages
- [ ] Create payment success page
- [ ] Update UI to reflect premium user status
- [ ] Add subscription management in user profile

### Payment Backend
- [ ] Configure Stripe API keys in serverless.yml
- [ ] Implement POST /payments/session Lambda
- [ ] Create Stripe webhook endpoint
- [ ] Update Users table to track premium status
- [ ] Add Subscriptions table schema (if needed):
  ```yaml
  Resources:
    SubscriptionsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:service}-${self:provider.stage}-subscriptions
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: userId
            AttributeType: S
          - AttributeName: subscriptionId
            AttributeType: S
        KeySchema:
          - AttributeName: userId
            KeyType: HASH
        GlobalSecondaryIndexes:
          - IndexName: SubscriptionIndex
            KeySchema:
              - AttributeName: subscriptionId
                KeyType: HASH
            Projection:
              ProjectionType: ALL
        # Schema attributes (conceptual):
        # - userId: String (primary key)
        # - subscriptionId: String (from Stripe)
        # - planType: String (e.g., "pro", "basic")
        # - status: String (active, canceled, etc.)
        # - startDate: Number (timestamp)
        # - endDate: Number (timestamp)
        # - autoRenew: Boolean
        # - stripeCustomerId: String
  ```

- [ ] Update lesson retrieval to check premium status
- [ ] Modify API endpoints to protect premium content

### Testing & Deployment
- [ ] Test Stripe Checkout flow (using test keys)
- [ ] Write unit tests for payment processing Logic
- [ ] Test webhook handling for various Stripe events
- [ ] Validate premium content access control
- [ ] Update deployment configuration for Stripe integration
- [ ] Test entire user journey from sign-up through payment
