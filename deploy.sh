#!/bin/bash

echo "Starting Firebase deployment process..."
echo

echo "Step 1: Building the app..."
npm run build
if [ $? -ne 0 ]; then
    echo "Build failed! Please check for errors."
    exit 1
fi

echo
echo "Step 2: Please run 'firebase login' in a new terminal window"
echo "Then come back and press any key to continue..."
read -n 1 -s

echo
echo "Step 3: Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo
echo "Deployment complete! Check the URL provided above."
