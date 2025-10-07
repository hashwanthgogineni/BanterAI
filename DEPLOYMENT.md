# Firebase Hosting Deployment Guide

## Prerequisites
1. Firebase project created at [Firebase Console](https://console.firebase.google.com/)
2. Firebase project ID (you'll need this)

## Step 1: Firebase Authentication
Run this command in your terminal and follow the authentication process:
```bash
firebase login
```

## Step 2: Update Project Configuration
1. Open `.firebaserc` file
2. Replace `your-firebase-project-id` with your actual Firebase project ID
3. Save the file

## Step 3: Initialize Firebase Hosting (if not done already)
```bash
firebase init hosting
```
- Select your Firebase project
- Set public directory to `dist`
- Configure as single-page app: `Yes`
- Set up automatic builds: `No` (we'll build manually)

## Step 4: Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

## Step 5: Set Up Environment Variables
After deployment, you'll need to set up your environment variables in Firebase:

### Option A: Using Firebase Functions (Recommended)
1. Go to Firebase Console → Functions
2. Create a function to serve environment variables
3. Update your app to fetch config from the function

### Option B: Using Firebase Hosting Environment Variables
1. Go to Firebase Console → Hosting
2. Add environment variables in hosting settings
3. Rebuild and redeploy

## Step 6: Configure Firebase Authentication
1. Go to Firebase Console → Authentication
2. Enable Email/Password and Google sign-in methods
3. Add your domain to authorized domains

## Step 7: Set Up Firestore
1. Go to Firebase Console → Firestore Database
2. Create database in production mode
3. Set up security rules for your collections

## Environment Variables Needed
Create a `.env` file with:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_HF_API_KEY=your_hugging_face_api_key
```

## Security Rules for Firestore
Add these rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User prompts collection
    match /userPrompts/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Chat messages collection
    match /chatMessages/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Troubleshooting
- If build fails, check for TypeScript errors
- If deployment fails, ensure you're logged in with `firebase login`
- If environment variables aren't working, check the `.env` file is in the root directory
- If authentication fails, verify Firebase project configuration

## Your App is Ready! 🚀
Once deployed, your Banter AI app will be available at:
`https://your-project-id.web.app`
