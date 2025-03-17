# Keyboard Dojo Backend API

This document provides comprehensive documentation for the Keyboard Dojo backend API.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
  - [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [Authentication](#authentication)
  - [Lessons](#lessons)
  - [User Progress](#user-progress)
  - [Subscriptions](#subscriptions)
  - [Admin](#admin)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Testing](#testing)

## Overview

The Keyboard Dojo backend is built using Serverless Framework with AWS Lambda, API Gateway, and DynamoDB. It provides APIs for user authentication, lesson management, user progress tracking, and subscription handling.

## Getting Started

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn
- AWS CLI configured with appropriate credentials
- Serverless Framework CLI

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the backend directory with the following variables (see `.env.example` for reference):

```
# JWT Configuration
JWT_SECRET=your-jwt-secret-for-keyboard-dojo-dev

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
PRICE_MONTHLY=price_monthly_id
PRICE_ANNUAL=price_annual_id

# Frontend URL
CLIENT_URL=http://localhost:5173

# Sentry Configuration
SENTRY_DSN=your-sentry-dsn
```

### Running Locally

To run the backend locally:

```bash
npm run dev
```

This will start the Serverless Offline server, typically on port 3000.

### Deployment

To deploy to AWS:

```bash
npm run deploy
```

For deployment with Sentry integration:

```bash
./deploy-with-sentry.sh
```

## API Endpoints

### Health Check

- **GET /health**
  - Description: Check if the API is running
  - Authentication: None
  - Response: `{ status: "ok" }`

### Authentication

- **POST /auth/register**
  - Description: Register a new user
  - Authentication: None
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword",
      "name": "User Name"
    }
    ```
  - Response: User object with JWT token

- **POST /auth/login**
  - Description: Login an existing user
  - Authentication: None
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword"
    }
    ```
  - Response: User object with JWT token

- **GET /auth/verify**
  - Description: Verify a JWT token
  - Authentication: None
  - Query Parameters: `token`
  - Response: User object if token is valid

- **POST /auth/google/callback**
  - Description: Handle Google OAuth authentication
  - Authentication: None
  - Request Body: Google auth response
  - Response: User object with JWT token

- **GET /auth/test-authorizer**
  - Description: Test endpoint for JWT authorization
  - Authentication: JWT
  - Response: Success message if authorized

### Lessons

- **GET /lessons**
  - Description: Get all lessons
  - Authentication: None
  - Response: Array of lesson objects

- **GET /lessons/{id}**
  - Description: Get a specific lesson by ID
  - Authentication: None
  - Path Parameters: `id` (lesson ID)
  - Response: Lesson object

- **GET /lessons/category/{category}**
  - Description: Get lessons by category
  - Authentication: None
  - Path Parameters: `category` (lesson category)
  - Response: Array of lesson objects in the specified category

### User Progress

- **GET /progress**
  - Description: Get the current user's progress
  - Authentication: JWT
  - Response: User progress object

- **POST /progress**
  - Description: Update the current user's progress
  - Authentication: JWT
  - Request Body:
    ```json
    {
      "lessonId": "lesson-id",
      "completed": true,
      "score": 95,
      "shortcuts": {
        "shortcut-id": {
          "mastered": true,
          "attempts": 5,
          "correctAttempts": 4
        }
      }
    }
    ```
  - Response: Updated user progress object

### Subscriptions

- **POST /subscriptions/checkout**
  - Description: Create a Stripe checkout session
  - Authentication: JWT
  - Request Body:
    ```json
    {
      "plan": "monthly", // or "annual"
      "successUrl": "https://example.com/success",
      "cancelUrl": "https://example.com/cancel"
    }
    ```
  - Response: Stripe checkout session URL

- **GET /subscriptions**
  - Description: Get the current user's subscription
  - Authentication: JWT
  - Response: Subscription object

- **POST /subscriptions/cancel**
  - Description: Cancel the current user's subscription
  - Authentication: JWT
  - Response: Updated subscription object

- **POST /webhooks/stripe**
  - Description: Handle Stripe webhook events
  - Authentication: None (Stripe signature verification)
  - Request Body: Stripe event object
  - Response: Acknowledgement of receipt

### Admin

- **POST /admin/seed-lessons**
  - Description: Seed the database with initial lessons
  - Authentication: JWT (Admin only)
  - Response: Success message

- **GET /admin/users**
  - Description: Get all users
  - Authentication: JWT (Admin only)
  - Response: Array of user objects

- **GET /admin/lessons**
  - Description: Get all lessons (admin view)
  - Authentication: JWT (Admin only)
  - Response: Array of lesson objects

- **GET /admin/users/{userId}/progress**
  - Description: Get a specific user's progress
  - Authentication: JWT (Admin only)
  - Path Parameters: `userId` (user ID)
  - Response: User progress object

- **GET /admin/test**
  - Description: Test endpoint for admin authorization
  - Authentication: JWT (Admin only)
  - Response: Success message if authorized

## Database Schema

### Users Table

- **userId**: String (Primary Key)
- **email**: String (GSI Key)
- **name**: String
- **authProvider**: String (google, apple, github, email)
- **providerId**: String (ID from provider if OAuth)
- **hashedPassword**: String (for email auth)
- **createdAt**: Number (timestamp)
- **isAdmin**: Boolean
- **isPremium**: Boolean (for premium subscription)
- **stripeCustomerId**: String (Stripe customer ID)

### Lessons Table

- **lessonId**: String (Primary Key)
- **title**: String
- **description**: String
- **category**: String (GSI Key)
- **difficulty**: String (beginner, intermediate, advanced)
- **order**: Number
- **content**: Object
  - **introduction**: String
  - **shortcuts**: Array of Shortcut objects
    - **id**: String
    - **name**: String
    - **description**: String
    - **keyCombination**: Array of String
    - **operatingSystem**: String (optional)
    - **context**: String (optional)
  - **tips**: Array of String
- **isPremium**: Boolean
- **createdAt**: Number (timestamp)
- **updatedAt**: Number (timestamp)

### Progress Table

- **userId**: String (Primary Key)
- **completedLessons**: Map of LessonCompletion objects
  - **[lessonId]**: Object
    - **completedAt**: Number (timestamp)
    - **score**: Number
    - **attempts**: Number
    - **timeSpent**: Number (seconds)
    - **shortcuts**: Map of ShortcutProgress objects
      - **[shortcutId]**: Object
        - **mastered**: Boolean
        - **attempts**: Number
        - **correctAttempts**: Number
        - **lastAttemptAt**: Number (timestamp)
- **totalLessonsCompleted**: Number
- **streakDays**: Number
- **lastActivityDate**: Number (timestamp)
- **updatedAt**: Number (timestamp)

### Subscriptions Table

- **id**: String (Primary Key - unique subscription ID)
- **userId**: String (GSI Key - user who owns the subscription)
- **stripeCustomerId**: String (Stripe customer ID)
- **stripeSubscriptionId**: String (GSI Key - Stripe subscription ID)
- **plan**: String (monthly, annual)
- **status**: String (active, cancelled, past_due, etc.)
- **currentPeriodStart**: Number (timestamp)
- **currentPeriodEnd**: Number (timestamp)
- **cancelAtPeriodEnd**: Boolean

## Error Handling

The API uses standard HTTP status codes:

- **200**: Success
- **400**: Bad Request (invalid input)
- **401**: Unauthorized (invalid or missing authentication)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

Error responses follow this format:

```json
{
  "error": true,
  "message": "Error message description",
  "statusCode": 400
}
```

## Testing

Run tests using:

```bash
npm test
```

The project uses Jest for unit and integration testing. 