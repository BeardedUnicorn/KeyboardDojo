#!/bin/bash

# Exit on error
set -e

# Check if SENTRY_DSN is provided
if [ -z "$SENTRY_DSN" ]; then
  echo "Error: SENTRY_DSN environment variable is required"
  echo "Usage: SENTRY_DSN=https://your-sentry-dsn serverless deploy --stage dev"
  exit 1
fi

# Display deployment information
echo "Deploying backend with Sentry enabled"
echo "Stage: ${STAGE:-dev}"
echo "Sentry DSN: $SENTRY_DSN"

# Verify the Sentry DSN format
if [[ ! "$SENTRY_DSN" =~ ^https://[a-zA-Z0-9]+@[a-zA-Z0-9.-]+/[0-9]+ ]]; then
  echo "Warning: Sentry DSN format looks unusual. Please verify it's correct."
  echo "Expected format: https://[key]@[host]/[project]"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Create a temporary .env.deploy file with the Sentry DSN
echo "Creating temporary deployment environment file..."
cp .env .env.deploy
echo "SENTRY_DSN=$SENTRY_DSN" >> .env.deploy

# Build the project
echo "Building project..."
SENTRY_DSN="$SENTRY_DSN" npm run build

# Verify that SENTRY_DSN is in the environment for serverless
echo "Verifying environment variables..."
export SENTRY_DSN="$SENTRY_DSN"
echo "SENTRY_DSN is set to: $SENTRY_DSN"

# Test Sentry connectivity
echo "Testing Sentry connectivity..."
node -e "
const Sentry = require('@sentry/node');
Sentry.init({ dsn: '$SENTRY_DSN' });
Sentry.captureMessage('Deployment test');
Sentry.flush(2000).then(() => {
  console.log('Successfully sent test event to Sentry');
  process.exit(0);
}).catch(err => {
  console.error('Failed to send test event to Sentry:', err);
  process.exit(1);
});"

# Deploy with Serverless
echo "Deploying with Serverless..."
npx serverless deploy --stage ${STAGE:-dev} --verbose

# Verify the deployment
echo "Verifying deployment..."
npx serverless info --stage ${STAGE:-dev}

# Test the deployed function
echo "Testing the deployed function..."
ENDPOINT=$(npx serverless info --stage ${STAGE:-dev} | grep -A 20 "endpoints:" | grep "/admin/users" | head -1 | awk '{print $2}')
if [ -n "$ENDPOINT" ]; then
  echo "Testing endpoint: $ENDPOINT"
  curl -v "$ENDPOINT" || true
  echo "Check Sentry for test events from this endpoint"
else
  echo "Could not find /admin/users endpoint in deployment info"
fi

# Clean up
echo "Cleaning up..."
if [ -f ".env.deploy" ]; then
  rm .env.deploy
fi

echo "Deployment complete!"
echo "Note: Check CloudWatch logs to verify Sentry is capturing errors correctly."
echo "Sentry dashboard: https://sentry.io" 