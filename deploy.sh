#!/bin/bash
set -e

# Configuration
BASE_DIR="/home/lando/nzlr"
DOMAIN="netzerolandrights.com"
APP_BLUE_DIR="$BASE_DIR/app-blue"
APP_GREEN_DIR="$BASE_DIR/app-green"
PM2_PATH="/home/lando/.local/share/pnpm/pm2"
NODE_PATH="/home/lando/.nvm/versions/node/v22.12.0/bin/node"

# Set NODE_PATH for PM2
export PATH="/home/lando/.nvm/versions/node/v22.12.0/bin:$PATH"

# Check if PM2 is running
echo "Checking PM2 status..."
if ! $PM2_PATH list &>/dev/null; then
  echo "PM2 is not running. Starting PM2..."
  $PM2_PATH resurrect || true
fi

# List current PM2 processes for reference
echo "Current PM2 processes:"
$PM2_PATH list

# Determine current active environment by checking PM2 status
# Using a more robust approach to count online processes
BLUE_ONLINE=0
GREEN_ONLINE=0

if $PM2_PATH jlist | grep -q '"name":"blue".*"status":"online"'; then
  BLUE_ONLINE=1
fi

if $PM2_PATH jlist | grep -q '"name":"green".*"status":"online"'; then
  GREEN_ONLINE=1
fi

echo "Blue online: $BLUE_ONLINE, Green online: $GREEN_ONLINE"

if [ "$BLUE_ONLINE" -eq 1 ]; then
  CURRENT_ENV="blue"
  DEPLOY_ENV="green"
elif [ "$GREEN_ONLINE" -eq 1 ]; then
  CURRENT_ENV="green"
  DEPLOY_ENV="blue"
else
  # Default to blue if nothing is running
  echo "No environment detected as running. Defaulting to deploying to blue."
  CURRENT_ENV="none"
  DEPLOY_ENV="blue"
fi

echo "Current active environment: $CURRENT_ENV"
echo "Deploying to: $DEPLOY_ENV"

# Clean up any existing stopped processes
echo "Cleaning up stopped processes..."
$PM2_PATH delete blue 2>/dev/null || true
$PM2_PATH delete green 2>/dev/null || true

# Set directory paths based on deployment environment
if [ "$DEPLOY_ENV" = "blue" ]; then
  DEPLOY_DIR="$APP_BLUE_DIR"
  START_SCRIPT="serve"
else
  DEPLOY_DIR="$APP_GREEN_DIR"
  START_SCRIPT="serve-green"
fi

# Pull latest code from git
echo "Pulling latest code to $DEPLOY_DIR..."
cd "$DEPLOY_DIR"
git pull origin main

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Build the application
echo "Building application..."
pnpm build

# Start the application
echo "Starting $DEPLOY_ENV environment..."
$PM2_PATH start "pnpm $START_SCRIPT" --name "$DEPLOY_ENV" --cwd "$DEPLOY_DIR"

# Wait for application to start
echo "Waiting for application to start..."
sleep 10

# Perform health check
echo "Performing health check..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN")

if [ "$HEALTH_STATUS" -eq 200 ]; then
  echo "Health check passed. New deployment is running successfully."
  
  # Stop the old environment only if it exists
  if [ "$CURRENT_ENV" != "none" ]; then
    echo "Stopping $CURRENT_ENV environment..."
    $PM2_PATH stop "$CURRENT_ENV" 2>/dev/null || true
    $PM2_PATH delete "$CURRENT_ENV" 2>/dev/null || true
  fi
  
  echo "Deployment completed successfully!"
else
  echo "Health check failed with status $HEALTH_STATUS. Rolling back..."
  $PM2_PATH stop "$DEPLOY_ENV" 2>/dev/null || true
  $PM2_PATH delete "$DEPLOY_ENV" 2>/dev/null || true
  
  # Make sure the current environment is running if it exists
  if [ "$CURRENT_ENV" != "none" ] && ! $PM2_PATH describe "$CURRENT_ENV" &>/dev/null; then
    echo "Current environment is not running. Starting it..."
    if [ "$CURRENT_ENV" = "blue" ]; then
      cd "$APP_BLUE_DIR"
      $PM2_PATH start "pnpm serve" --name "$CURRENT_ENV" --cwd "$APP_BLUE_DIR"
    else
      cd "$APP_GREEN_DIR"
      $PM2_PATH start "pnpm serve-green" --name "$CURRENT_ENV" --cwd "$APP_GREEN_DIR"
    fi
  fi
  
  echo "Rollback completed. The $CURRENT_ENV environment is still active."
  exit 1
fi

# Save PM2 configuration
echo "Saving PM2 configuration..."
$PM2_PATH save

# List current PM2 processes after deployment
echo "PM2 processes after deployment:"
$PM2_PATH list

exit 0