# Supabase Setup Guide

This guide will help you set up your own Supabase database for the DND Fleets project.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in your project details:
   - **Name**: DND Fleets (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to your users
5. Click "Create new project" and wait for it to be set up (takes 1-2 minutes)

## Step 2: Get Your API Keys

1. Once your project is ready, go to **Settings** → **API**
2. You'll find:
   - **Project URL**: Copy this value
   - **anon/public key**: Copy this value (this is safe to expose in client-side code)

## Step 3: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and replace the placeholder values:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Replace `your-project-ref` and `your-anon-key-here` with the actual values from Step 2

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the migration files in order:
   - First, run `supabase/migrations/20250908122801_d42b48c9-784f-4e70-8b00-cafd15240f89.sql`
   - Then, run `supabase/migrations/20250915124646_5f52833b-f83e-42bd-a7dd-b7db8ca4fbb8.sql`
   - Continue with the remaining migration files in chronological order

   **OR** use the Supabase CLI (recommended):
   ```bash
   # Install Supabase CLI if you haven't already
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Push migrations
   supabase db push
   ```

## Step 5: Set Up Storage Bucket

The migrations should create the `car-images` storage bucket automatically. If not:

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket named `car-images`
3. Make it **Public** (so images can be accessed without authentication)
4. The storage policies should be set up by the migrations

## Step 6: Verify the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Check the browser console for any errors
3. Try accessing the backoffice at `/backoffice` to test database connectivity

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env` file exists in the project root
- Verify the variable names start with `VITE_` (required for Vite)
- Restart your dev server after creating/updating `.env`

### Database connection issues
- Verify your `VITE_SUPABASE_URL` is correct
- Check that your `VITE_SUPABASE_ANON_KEY` is the anon/public key (not the service_role key)
- Ensure your Supabase project is active and not paused

### Storage upload issues
- Verify the `car-images` bucket exists and is public
- Check that storage policies are set correctly (see migration files)
- Ensure RLS (Row Level Security) policies allow public access for reads

## Security Notes

- The `VITE_SUPABASE_ANON_KEY` is safe to expose in client-side code
- Never commit your `.env` file to version control (it's already in `.gitignore`)
- For production, set up proper RLS policies if you need authentication
- Consider using environment-specific configurations for different environments

## Next Steps

Once your database is set up:
1. Start adding cars through the backoffice interface
2. Upload images for your vehicles
3. Test the public-facing pages to ensure everything works correctly

For more information, visit the [Supabase Documentation](https://supabase.com/docs).

