# Deployment Guide for Donasi Live App

This guide will help you deploy the Donasi Live App to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Firebase Project**: Ensure your Firebase project is set up with:
   - Firestore Database
   - Authentication enabled
   - Proper security rules configured

## Step 1: Prepare Your Repository

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Ensure all files are committed, including:
   - `package.json`
   - `vercel.json`
   - `.env.example`
   - All source files

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a Next.js project
5. Configure environment variables (see Step 3)
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts
```

## Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Important**: 
- Get these values from your Firebase project settings
- Copy them from your local `.env.local` file
- Make sure to set the environment for "Production", "Preview", and "Development"

## Step 4: Configure Firebase Security Rules

Ensure your Firestore security rules allow the app to function:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for donations and groups
    match /donations/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /groups/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 5: Configure Firebase Authentication

1. In Firebase Console, go to **Authentication** → **Settings**
2. Add your Vercel domain to **Authorized domains**:
   - `your-app-name.vercel.app`
   - Any custom domains you plan to use

## Step 6: Test Your Deployment

1. Visit your deployed app URL
2. Test the main functionality:
   - View donations display
   - Admin login functionality
   - Adding new donations
   - Adding new groups

## Troubleshooting

### Build Errors
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript types are correct

### Firebase Connection Issues
- Verify environment variables are set correctly
- Check Firebase security rules
- Ensure domain is authorized in Firebase

### Authentication Issues
- Verify Firebase Auth domain in environment variables
- Check that your domain is added to Firebase authorized domains

## Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Update Firebase authorized domains

## Monitoring and Analytics

- Use Vercel Analytics for performance monitoring
- Firebase Console for database and authentication monitoring
- Set up error tracking if needed

## Security Considerations

- Environment variables are automatically secured by Vercel
- Firebase security rules should be properly configured
- Consider implementing rate limiting for production
- Regular security audits recommended

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review Firebase Console for errors
3. Verify all environment variables are set
4. Test locally first with `npm run build`