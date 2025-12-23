# Netlify Deployment Guide

This guide will help you deploy the DND Fleets application to Netlify.

## Prerequisites

- A Netlify account ([sign up here](https://app.netlify.com/signup))
- A Supabase project with your database set up
- Your Supabase API credentials

## Step 1: Set Up Environment Variables in Netlify

**This is the most important step!** Netlify doesn't read `.env` files - you must set environment variables in the Netlify dashboard.

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site (or create a new one)
3. Navigate to **Site settings** → **Environment variables**
4. Click **Add a variable** and add these two variables:

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://your-project-ref.supabase.co` (your actual Supabase URL)

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `your-anon-key-here` (your actual Supabase anon key)

5. Click **Save** after adding each variable

## Step 2: Deploy to Netlify

### Option A: Deploy via Git (Recommended)

1. In Netlify dashboard, click **Add new site** → **Import an existing project**
2. Connect to your GitHub repository: `dndfleets/dndfleetsmain`
3. Netlify will auto-detect the build settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy site**

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Option C: Drag and Drop

1. Build your project locally:
   ```bash
   npm run build
   ```
2. Go to Netlify dashboard → **Sites** → **Add new site** → **Deploy manually**
3. Drag and drop the `dist` folder

## Step 3: Verify Deployment

After deployment:

1. Visit your site URL (provided by Netlify)
2. Check the browser console (F12) for any errors
3. The site should connect to your Supabase database

## Troubleshooting

### "Database Connection Issue" Error

If you see this error, it means the environment variables are not set correctly:

1. **Verify environment variables are set:**
   - Go to Netlify dashboard → Your site → **Site settings** → **Environment variables**
   - Make sure both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present
   - Check that the values are correct (no extra spaces, correct URLs)

2. **Redeploy after adding variables:**
   - After adding/updating environment variables, you must trigger a new deployment
   - Go to **Deploys** tab → Click **Trigger deploy** → **Deploy site**

3. **Check build logs:**
   - Go to **Deploys** → Click on the latest deploy → View **Build log**
   - Look for any errors during the build process

### Build Fails

- Make sure Node.js version is 18 or higher
- Check that all dependencies are installed (`npm install`)
- Verify the build command is correct: `npm run build`

### Routing Issues (404 on refresh)

The `_redirects` file in the `public` folder should handle this automatically. If you still have issues:

1. Verify `public/_redirects` exists with: `/*    /index.html   200`
2. The `netlify.toml` file also includes redirect rules

## Environment Variables Reference

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abcdefgh.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

**Important Notes:**
- Variable names **must** start with `VITE_` for Vite to expose them to the client
- Never commit your actual `.env` file to Git (it's in `.gitignore`)
- Environment variables set in Netlify are only available during build and runtime

## Additional Resources

- [Netlify Environment Variables Documentation](https://docs.netlify.com/environment-variables/overview/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)

